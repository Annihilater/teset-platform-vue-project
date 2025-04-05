<template>
  <div class="question-classifier-panel">
    <div class="form-group">
      <label class="form-label">分类方法</label>
      <div class="classification-method-selector">
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="llm"
            name="method"
          />
          <span>LLM分类</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="keywords"
            name="method"
          />
          <span>关键词匹配</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="embeddings"
            name="method"
          />
          <span>语义匹配</span>
        </label>
      </div>
    </div>

    <div class="form-group" v-if="config.method === 'llm'">
      <label class="form-label">LLM模型</label>
      <select v-model="config.model" class="form-select">
        <option value="DeepSeek V3">DeepSeek V3</option>
        <option value="GPT-4">GPT-4</option>
        <option value="Claude 3">Claude 3</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">输入文本</label>
      <div class="input-source-selector">
        <label class="source-option">
          <input
            type="radio"
            v-model="config.input_source"
            value="direct"
            name="input_source"
          />
          <span>直接输入</span>
        </label>
        <label class="source-option">
          <input
            type="radio"
            v-model="config.input_source"
            value="variable"
            name="input_source"
          />
          <span>变量引用</span>
        </label>
      </div>
      
      <div v-if="config.input_source === 'direct'">
        <textarea
          v-model="config.input_text"
          placeholder="请输入要分类的文本"
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
      
      <div v-else>
        <input
          type="text"
          v-model="config.input_variable"
          placeholder="输入变量名，例如：{{query}}"
          class="form-input"
        />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">类别设置</label>
      <div class="classes-list">
        <div v-for="(classItem, index) in config.classes" :key="index" class="class-item">
          <div class="class-item-header">
            <div class="class-name">
              <input
                type="text"
                v-model="classItem.name"
                placeholder="类别名称"
                class="form-input"
              />
            </div>
            <button class="btn-delete" @click="removeClass(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
          
          <div v-if="config.method === 'keywords'" class="class-keywords">
            <textarea
              v-model="classItem.keywords"
              placeholder="输入关键词，用逗号分隔"
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>
          
          <div v-else-if="config.method === 'embeddings'" class="class-examples">
            <textarea
              v-model="classItem.examples"
              placeholder="输入示例问题，每行一个"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div v-else-if="config.method === 'llm'" class="class-description">
            <textarea
              v-model="classItem.description"
              placeholder="描述这个类别的特征"
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>
        </div>

        <div v-if="config.classes.length === 0" class="no-classes">
          暂无类别，请点击下方按钮添加类别
        </div>

        <button class="btn-add-class" @click="addClass">
          <span class="i-carbon-add"></span>
          <span>添加类别</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">分类设置</label>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="include_confidence"
          v-model="config.include_confidence"
          class="form-check-input"
        />
        <label for="include_confidence" class="form-check-label">
          包含置信度
        </label>
      </div>
      
      <div v-if="config.method !== 'keywords'" class="sub-form-group">
        <label class="form-label">最小置信度阈值</label>
        <div class="flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="config.confidence_threshold"
            class="form-range"
          />
          <span class="ml-2">{{ config.confidence_threshold }}</span>
        </div>
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="allow_multiple"
          v-model="config.allow_multiple"
          class="form-check-input"
        />
        <label for="allow_multiple" class="form-check-label">
          允许多分类
        </label>
      </div>
      
      <div v-if="config.allow_multiple" class="sub-form-group">
        <label class="form-label">最大分类数量</label>
        <input
          type="number"
          v-model.number="config.max_classes"
          class="form-input"
          min="1"
          max="10"
        />
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
  method: "llm",
  model: "DeepSeek V3",
  input_source: "variable",
  input_text: "",
  input_variable: "{{query}}",
  classes: [{ name: "类别1", keywords: "", examples: "", description: "" }],
  include_confidence: true,
  confidence_threshold: 0.7,
  allow_multiple: false,
  max_classes: 3,
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保类别列表存在
if (!config.value.classes) {
  config.value.classes = [{ name: "类别1", keywords: "", examples: "", description: "" }];
}

// 添加类别
const addClass = () => {
  config.value.classes.push({
    name: `类别${config.value.classes.length + 1}`,
    keywords: "",
    examples: "",
    description: "",
  });
};

// 删除类别
const removeClass = (index: number) => {
  config.value.classes.splice(index, 1);
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
      if (!config.value.classes) {
        config.value.classes = [{ name: "类别1", keywords: "", examples: "", description: "" }];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.question-classifier-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group,
.sub-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sub-form-group {
  margin-left: 1.5rem;
  margin-top: 0.25rem;
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

.classification-method-selector,
.input-source-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.method-option,
.source-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.classes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.class-item {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.class-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
}

.class-name {
  flex: 1;
}

.class-keywords,
.class-examples,
.class-description {
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

.btn-add-class {
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

.btn-add-class:hover {
  background-color: #f9fafb;
}

.no-classes {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px dashed var(--color-border-secondary);
}
</style> 