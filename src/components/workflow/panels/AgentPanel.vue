<template>
  <div class="agent-panel">
    <div class="form-group">
      <label class="form-label">代理模型</label>
      <select v-model="config.model" class="form-select">
        <option value="DeepSeek V3">DeepSeek V3</option>
        <option value="GPT-4">GPT-4</option>
        <option value="Claude 3">Claude 3</option>
        <option value="Mixtral">Mixtral</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">最大步骤数</label>
      <input
        type="number"
        v-model.number="config.max_steps"
        class="form-input"
        min="1"
        max="20"
      />
      <div class="form-text">
        限制代理执行的最大步骤数，防止无限循环
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">目标描述</label>
      <textarea
        v-model="config.goal"
        placeholder="描述代理需要完成的任务目标"
        class="form-textarea"
        rows="4"
      ></textarea>
      <div class="form-text">
        清晰地描述代理需要实现的目标，支持使用 <span v-pre>{{变量名}}</span> 引用上游节点变量
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">工具列表</label>
      <div class="tools-list">
        <div v-for="(tool, index) in config.tools" :key="index" class="tool-item">
          <div class="tool-item-header">
            <div class="tool-name">
              <select v-model="tool.type" class="form-select">
                <option value="search">搜索</option>
                <option value="calculator">计算器</option>
                <option value="code_executor">代码执行</option>
                <option value="knowledge_base">知识库</option>
                <option value="http_request">HTTP请求</option>
              </select>
            </div>
            <button class="btn-delete" @click="removeTool(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
          <div class="tool-description">
            <input
              type="text"
              v-model="tool.description"
              placeholder="工具描述（可选）"
              class="form-input"
            />
          </div>
        </div>

        <button class="btn-add-tool" @click="addTool">
          <span class="i-carbon-add"></span>
          <span>添加工具</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input
          type="checkbox"
          id="allow_delegation"
          v-model="config.allow_delegation"
          class="form-check-input"
        />
        <label for="allow_delegation" class="form-check-label">
          允许任务委派
        </label>
      </div>
      <div class="form-text">
        允许代理根据需要委派子任务给其他代理节点
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">温度</label>
      <div class="flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="config.temperature"
          class="form-range"
        />
        <span class="ml-2">{{ config.temperature }}</span>
      </div>
      <div class="form-text">
        控制代理生成内容的创造性程度，较高值产生更多样的结果
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

// 默认配置
const defaultConfig = {
  model: "DeepSeek V3",
  max_steps: 5,
  goal: "",
  tools: [{ type: "search", description: "搜索互联网获取信息" }],
  allow_delegation: false,
  temperature: 0.7,
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保工具列表存在
if (!config.value.tools) {
  config.value.tools = [{ type: "search", description: "搜索互联网获取信息" }];
}

// 添加工具
const addTool = () => {
  config.value.tools.push({
    type: "search",
    description: "搜索互联网获取信息",
  });
};

// 删除工具
const removeTool = (index: number) => {
  config.value.tools.splice(index, 1);
  if (config.value.tools.length === 0) {
    config.value.tools.push({
      type: "search",
      description: "搜索互联网获取信息",
    });
  }
};

// 监听配置变化，更新节点
watch(
  config,
  (newValue) => {
    emit("update", { config: newValue });
  },
  { deep: true }
);

// 监听节点变化，更新配置
watch(
  () => props.node?.data?.config,
  (newValue) => {
    if (newValue) {
      config.value = {
        ...defaultConfig,
        ...newValue,
      };
      if (!config.value.tools) {
        config.value.tools = [{ type: "search", description: "搜索互联网获取信息" }];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.agent-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-secondary);
  font-size: 0.875rem;
}

.form-range {
  flex: 1;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: 1rem;
  height: 1rem;
}

.form-check-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.form-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: 0.25rem;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-item {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.tool-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
}

.tool-name {
  flex: 1;
}

.tool-description {
  padding: 0.5rem;
}

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.btn-add-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px dashed var(--color-border-secondary);
  background: none;
  color: var(--color-primary-600);
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-add-tool:hover {
  background-color: #f9fafb;
}
</style> 