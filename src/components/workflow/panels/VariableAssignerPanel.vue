<template>
  <div class="variable-assigner-panel">
    <div class="form-group">
      <label class="form-label">变量列表</label>
      <div class="variables-list">
        <div v-for="(variable, index) in config.variables" :key="index" class="variable-item">
          <div class="variable-item-header">
            <div class="variable-name">
              <input
                type="text"
                v-model="variable.name"
                placeholder="变量名"
                class="form-input"
              />
            </div>
            <button class="btn-delete" @click="removeVariable(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
          <div class="variable-value">
            <textarea
              v-model="variable.value"
              placeholder="变量值或表达式"
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>
        </div>

        <div v-if="config.variables.length === 0" class="no-variables">
          暂无变量，请点击下方按钮添加变量
        </div>

        <button class="btn-add-variable" @click="addVariable">
          <span class="i-carbon-add"></span>
          <span>添加变量</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">变量作用域</label>
      <div class="scope-options">
        <label class="scope-option">
          <input
            type="radio"
            v-model="config.scope"
            value="local"
            name="scope"
          />
          <span>本地作用域</span>
        </label>
        <label class="scope-option">
          <input
            type="radio"
            v-model="config.scope"
            value="global"
            name="scope"
          />
          <span>全局作用域</span>
        </label>
      </div>
      <div class="form-text">
        全局作用域的变量可在整个工作流中访问，本地作用域的变量仅在下游节点可用
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
  variables: [{ name: "变量1", value: "" }],
  scope: "local",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 添加变量
const addVariable = () => {
  config.value.variables.push({
    name: `变量${config.value.variables.length + 1}`,
    value: "",
  });
};

// 删除变量
const removeVariable = (index: number) => {
  config.value.variables.splice(index, 1);
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
    }
  },
  { deep: true }
);
</script>

<style scoped>
.variable-assigner-panel {
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-secondary);
  font-size: 0.875rem;
}

.form-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: 0.25rem;
}

.variables-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.variable-item {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.variable-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
}

.variable-name {
  flex: 1;
}

.variable-value {
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

.btn-add-variable {
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

.btn-add-variable:hover {
  background-color: #f9fafb;
}

.no-variables {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px dashed var(--color-border-secondary);
}

.scope-options {
  display: flex;
  gap: 1rem;
}

.scope-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}
</style> 