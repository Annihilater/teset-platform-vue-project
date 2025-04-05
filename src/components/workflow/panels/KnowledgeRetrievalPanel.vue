<template>
  <div class="knowledge-retrieval-panel">
    <div class="form-group">
      <label class="form-label">知识库</label>
      <select v-model="config.database" class="form-select">
        <option value="默认知识库">默认知识库</option>
        <option value="文档库">文档库</option>
        <option value="QA库">QA库</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">检索阈值</label>
      <div class="flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="config.similarity_threshold"
          class="form-range"
        />
        <span class="ml-2">{{ config.similarity_threshold }}</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">检索数量</label>
      <input
        type="number"
        v-model.number="config.top_k"
        class="form-input"
        min="1"
        max="10"
      />
    </div>

    <div class="form-group">
      <label class="form-label">模式</label>
      <div class="mode-options">
        <label class="mode-option">
          <input 
            type="radio" 
            v-model="config.mode" 
            value="semantic" 
            name="mode"
          />
          <span>语义检索</span>
        </label>
        <label class="mode-option">
          <input 
            type="radio" 
            v-model="config.mode" 
            value="keyword" 
            name="mode"
          />
          <span>关键词检索</span>
        </label>
        <label class="mode-option">
          <input 
            type="radio" 
            v-model="config.mode" 
            value="hybrid" 
            name="mode"
          />
          <span>混合检索</span>
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">检索查询</label>
      <textarea
        v-model="config.query"
        placeholder="输入检索查询或变量引用"
        class="form-textarea"
        rows="3"
      ></textarea>
      <div class="form-text">
        支持使用 <span v-pre>{{变量名}}</span> 引用上游节点变量
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
  database: "默认知识库",
  similarity_threshold: 0.7,
  top_k: 3,
  mode: "semantic",
  query: "",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

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
    }
  },
  { deep: true }
);
</script>

<style scoped>
.knowledge-retrieval-panel {
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

.form-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: 0.25rem;
}

.mode-options {
  display: flex;
  gap: 1rem;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}
</style> 