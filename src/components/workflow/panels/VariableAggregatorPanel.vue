<template>
  <div class="variable-aggregator-panel">
    <div class="form-group">
      <label class="form-label">聚合变量</label>
      <div class="form-text">
        将多个变量聚合到一个对象中，可以方便地传递给下游节点使用
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">聚合模式</label>
      <div class="aggregation-mode-selector">
        <label class="mode-option">
          <input
            type="radio"
            v-model="config.mode"
            value="object"
            name="mode"
          />
          <span>对象模式</span>
        </label>
        <label class="mode-option">
          <input
            type="radio"
            v-model="config.mode"
            value="array"
            name="mode"
          />
          <span>数组模式</span>
        </label>
      </div>
    </div>
    
    <div v-if="config.mode === 'object'" class="form-group">
      <label class="form-label">键值对</label>
      <div class="variables-list">
        <div v-for="(item, index) in config.items" :key="index" class="variable-item">
          <div class="variable-fields">
            <input
              type="text"
              v-model="item.key"
              placeholder="键名"
              class="form-input variable-key"
            />
            <input
              type="text"
              v-model="item.value"
              placeholder="变量引用，如: {{var1}}"
              class="form-input variable-value"
            />
          </div>
          <button class="btn-delete" @click="removeItem(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addItem">
          <span class="i-carbon-add"></span>
          <span>添加变量</span>
        </button>
      </div>
    </div>

    <div v-else class="form-group">
      <label class="form-label">数组元素</label>
      <div class="array-items-list">
        <div v-for="(item, index) in config.items" :key="index" class="array-item">
          <div class="array-item-fields">
            <input
              type="text"
              v-model="item.value"
              placeholder="变量引用，如: {{var1}}"
              class="form-input array-item-value"
            />
            <button class="btn-delete" @click="removeItem(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
        </div>

        <button class="btn-add" @click="addItem">
          <span class="i-carbon-add"></span>
          <span>添加元素</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">结果变量名</label>
      <input
        type="text"
        v-model="config.output_var"
        placeholder="aggregated_data"
        class="form-input"
      />
      <div class="form-text">
        聚合后的结果将以此变量名存储，供下游节点使用
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input
          type="checkbox"
          id="deep_copy"
          v-model="config.deep_copy"
          class="form-check-input"
        />
        <label for="deep_copy" class="form-check-label">
          深拷贝变量
        </label>
      </div>
      <div class="form-text">
        开启后对原始变量的修改不会影响聚合结果，建议开启
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input
          type="checkbox"
          id="include_metadata"
          v-model="config.include_metadata"
          class="form-check-input"
        />
        <label for="include_metadata" class="form-check-label">
          包含元数据
        </label>
      </div>
      <div class="form-text">
        包含变量的类型、来源节点等信息
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
  mode: "object",
  items: [{ key: "item1", value: "{{variable1}}" }],
  output_var: "aggregated_data",
  deep_copy: true,
  include_metadata: false,
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保items数组存在
if (!config.value.items) {
  config.value.items = [{ key: "item1", value: "{{variable1}}" }];
}

// 添加变量项
const addItem = () => {
  if (config.value.mode === "object") {
    config.value.items.push({
      key: `item${config.value.items.length + 1}`,
      value: "",
    });
  } else {
    config.value.items.push({
      value: "",
    });
  }
};

// 删除变量项
const removeItem = (index: number) => {
  config.value.items.splice(index, 1);
  
  // 确保至少有一个项
  if (config.value.items.length === 0) {
    if (config.value.mode === "object") {
      config.value.items.push({
        key: "item1",
        value: "",
      });
    } else {
      config.value.items.push({
        value: "",
      });
    }
  }
};

// 监听模式变化，更新items结构
watch(
  () => config.value.mode,
  (newMode) => {
    // 如果模式变更，需要调整items结构
    if (newMode === "object") {
      // 确保对象模式下每项都有key
      config.value.items = config.value.items.map((item: {key?: string; value: string}, index: number) => {
        if (!item.key) {
          return { key: `item${index + 1}`, value: item.value || "" };
        }
        return item;
      });
    } else {
      // 数组模式下可以不关心key
      config.value.items = config.value.items.map((item: {key?: string; value: string}) => {
        return { value: item.value || "" };
      });
    }
  }
);

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
      if (!config.value.items) {
        config.value.items = [{ key: "item1", value: "{{variable1}}" }];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.variable-aggregator-panel {
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
.form-input {
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

.aggregation-mode-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.variables-list,
.array-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.variable-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.variable-fields {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.variable-key {
  flex: 1;
}

.variable-value {
  flex: 2;
}

.array-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.array-item-fields {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.array-item-value {
  flex: 1;
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

.btn-add {
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

.btn-add:hover {
  background-color: #f9fafb;
}
</style> 