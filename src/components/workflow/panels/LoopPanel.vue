<template>
  <div class="loop-panel">
    <div class="form-group">
      <label class="form-label">循环条件</label>
      <textarea
        v-model="config.condition"
        placeholder="输入循环执行的条件表达式，例如：counter < 5"
        class="form-textarea"
        rows="3"
      ></textarea>
      <div class="form-text">
        支持使用 <span v-pre>{{变量名}}</span> 引用上游节点变量
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">最大迭代次数</label>
      <input
        type="number"
        v-model.number="config.max_iterations"
        class="form-input"
        min="1"
        max="100"
      />
      <div class="form-text">
        防止无限循环，设置最大执行次数
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">循环计数变量</label>
      <input
        type="text"
        v-model="config.counter_variable"
        placeholder="counter"
        class="form-input"
      />
      <div class="form-text">
        此变量会记录当前的循环次数，从0开始计数
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input
          type="checkbox"
          id="exit_early"
          v-model="config.exit_early"
          class="form-check-input"
        />
        <label for="exit_early" class="form-check-label">
          允许提前退出
        </label>
      </div>
      <div class="form-text">
        如果循环体内设置了退出条件，允许提前结束循环
      </div>
    </div>

    <div class="form-group" v-if="config.exit_early">
      <label class="form-label">提前退出条件</label>
      <textarea
        v-model="config.exit_condition"
        placeholder="输入提前退出循环的条件表达式，例如：result > 10"
        class="form-textarea"
        rows="3"
      ></textarea>
      <div class="form-text">
        满足此条件时，即使未达最大迭代次数也会退出循环
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">循环前初始化</label>
      <div class="variables-list">
        <div v-for="(variable, index) in config.init_variables" :key="index" class="variable-item">
          <div class="variable-item-header">
            <div class="variable-name">
              <input
                type="text"
                v-model="variable.name"
                placeholder="变量名"
                class="form-input"
              />
            </div>
            <button class="btn-delete" @click="removeInitVariable(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
          <div class="variable-value">
            <textarea
              v-model="variable.value"
              placeholder="初始值"
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>
        </div>

        <button class="btn-add-variable" @click="addInitVariable">
          <span class="i-carbon-add"></span>
          <span>添加初始化变量</span>
        </button>
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
  condition: "",
  max_iterations: 10,
  counter_variable: "counter",
  exit_early: false,
  exit_condition: "",
  init_variables: [],
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保初始变量数组存在
if (!config.value.init_variables) {
  config.value.init_variables = [];
}

// 添加初始化变量
const addInitVariable = () => {
  config.value.init_variables.push({
    name: `var${config.value.init_variables.length + 1}`,
    value: "",
  });
};

// 删除初始化变量
const removeInitVariable = (index: number) => {
  config.value.init_variables.splice(index, 1);
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
      if (!config.value.init_variables) {
        config.value.init_variables = [];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.loop-panel {
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
</style> 