<template>
  <div class="list-operator-panel">
    <div class="form-group">
      <label class="form-label">列表来源</label>
      <select v-model="config.input_source" class="form-select">
        <option value="variable">变量引用</option>
        <option value="direct">直接输入</option>
      </select>
    </div>
    
    <div v-if="config.input_source === 'variable'" class="form-group">
      <label class="form-label">输入变量</label>
      <input
        type="text"
        v-model="config.input_variable"
        placeholder="输入变量名，例如: {{items}}"
        class="form-input"
      />
      <div class="form-text">
        引用包含列表数据的变量，确保变量值是一个数组
      </div>
    </div>
    
    <div v-else class="form-group">
      <label class="form-label">直接输入列表项</label>
      <div class="direct-items-list">
        <div v-for="(item, index) in config.direct_items" :key="index" class="direct-item">
          <input
            type="text"
            v-model="config.direct_items[index]"
            placeholder="列表项值"
            class="form-input"
          />
          <button class="btn-delete" @click="removeDirectItem(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addDirectItem">
          <span class="i-carbon-add"></span>
          <span>添加列表项</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">操作类型</label>
      <select v-model="config.operation" class="form-select">
        <option value="filter">筛选 (Filter)</option>
        <option value="map">映射 (Map)</option>
        <option value="sort">排序 (Sort)</option>
        <option value="limit">限制 (Limit)</option>
        <option value="aggregate">聚合 (Aggregate)</option>
        <option value="transform">转换 (Transform)</option>
      </select>
    </div>

    <div v-if="config.operation === 'filter'" class="form-group">
      <label class="form-label">筛选条件</label>
      <div class="filter-method-selector">
        <label class="method-option">
          <input
            type="radio"
            v-model="config.filter_method"
            value="condition"
            name="filter_method"
          />
          <span>条件表达式</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.filter_method"
            value="llm"
            name="filter_method"
          />
          <span>LLM筛选</span>
        </label>
      </div>
      
      <div v-if="config.filter_method === 'condition'" class="condition-editor">
        <textarea
          v-model="config.filter_condition"
          placeholder="输入筛选条件，例如：item.price > 100 && item.category === 'electronics'"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用JavaScript条件表达式，当前列表项可通过'item'变量引用
        </div>
      </div>
      
      <div v-else class="llm-filter">
        <textarea
          v-model="config.filter_prompt"
          placeholder="描述筛选条件，例如：保留所有电子产品类别且价格高于100元的商品"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用自然语言描述筛选条件，LLM将根据描述筛选出符合条件的项
        </div>
      </div>
    </div>

    <div v-else-if="config.operation === 'map'" class="form-group">
      <label class="form-label">映射表达式</label>
      <textarea
        v-model="config.map_expression"
        placeholder="输入映射表达式，例如：{ ...item, price: item.price * 0.9 }"
        class="form-textarea"
        rows="3"
      ></textarea>
      <div class="form-text">
        使用JavaScript表达式，当前列表项可通过'item'变量引用，表达式的返回值将作为新的列表项
      </div>
    </div>

    <div v-else-if="config.operation === 'sort'" class="form-group">
      <label class="form-label">排序方式</label>
      <div class="sort-method-selector">
        <label class="method-option">
          <input
            type="radio"
            v-model="config.sort_method"
            value="field"
            name="sort_method"
          />
          <span>按字段排序</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.sort_method"
            value="custom"
            name="sort_method"
          />
          <span>自定义排序</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.sort_method"
            value="llm"
            name="sort_method"
          />
          <span>LLM排序</span>
        </label>
      </div>
      
      <div v-if="config.sort_method === 'field'" class="field-sort">
        <div class="sort-field-selector">
          <input
            type="text"
            v-model="config.sort_field"
            placeholder="排序字段，例如：price"
            class="form-input"
          />
          <select v-model="config.sort_order" class="form-select">
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </select>
        </div>
      </div>
      
      <div v-else-if="config.sort_method === 'custom'" class="custom-sort">
        <textarea
          v-model="config.sort_expression"
          placeholder="输入排序表达式，例如：(a, b) => a.price - b.price"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用JavaScript比较函数，返回负数表示a在b前面，正数表示a在b后面，0表示相等
        </div>
      </div>
      
      <div v-else class="llm-sort">
        <textarea
          v-model="config.sort_prompt"
          placeholder="描述排序规则，例如：按照商品价格从低到高排序"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用自然语言描述排序规则，LLM将根据描述为列表项排序
        </div>
      </div>
    </div>

    <div v-else-if="config.operation === 'limit'" class="form-group">
      <div class="limit-options">
        <div class="limit-option">
          <label class="form-label">起始索引</label>
          <input
            type="number"
            v-model.number="config.limit_start"
            min="0"
            class="form-input"
          />
        </div>
        <div class="limit-option">
          <label class="form-label">结束索引</label>
          <input
            type="number"
            v-model.number="config.limit_end"
            min="0"
            class="form-input"
          />
        </div>
      </div>
      <div class="form-text">
        索引从0开始，结束索引为-1表示到列表末尾
      </div>
    </div>

    <div v-else-if="config.operation === 'aggregate'" class="form-group">
      <label class="form-label">聚合方式</label>
      <select v-model="config.aggregate_method" class="form-select">
        <option value="sum">求和 (Sum)</option>
        <option value="avg">平均值 (Average)</option>
        <option value="min">最小值 (Minimum)</option>
        <option value="max">最大值 (Maximum)</option>
        <option value="count">计数 (Count)</option>
        <option value="custom">自定义聚合</option>
      </select>
      
      <div v-if="config.aggregate_method !== 'count' && config.aggregate_method !== 'custom'" class="form-group">
        <label class="form-label">聚合字段</label>
        <input
          type="text"
          v-model="config.aggregate_field"
          placeholder="要聚合的字段，例如：price"
          class="form-input"
        />
      </div>
      
      <div v-if="config.aggregate_method === 'custom'" class="custom-aggregate">
        <textarea
          v-model="config.aggregate_expression"
          placeholder="输入自定义聚合表达式，例如：items.reduce((sum, item) => sum + item.price * item.quantity, 0)"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用JavaScript表达式，整个列表可通过'items'变量引用
        </div>
      </div>
    </div>

    <div v-else-if="config.operation === 'transform'" class="form-group">
      <label class="form-label">转换类型</label>
      <select v-model="config.transform_type" class="form-select">
        <option value="to_string">转换为字符串</option>
        <option value="to_object">转换为对象</option>
        <option value="flatten">扁平化嵌套列表</option>
        <option value="custom">自定义转换</option>
      </select>
      
      <div v-if="config.transform_type === 'to_string'" class="string-transform">
        <div class="form-group">
          <label class="form-label">分隔符</label>
          <input
            type="text"
            v-model="config.separator"
            placeholder="项之间的分隔符，例如：, "
            class="form-input"
          />
        </div>
      </div>
      
      <div v-else-if="config.transform_type === 'to_object'" class="object-transform">
        <div class="form-group">
          <label class="form-label">键字段</label>
          <input
            type="text"
            v-model="config.key_field"
            placeholder="作为对象键的字段，例如：id"
            class="form-input"
          />
        </div>
      </div>
      
      <div v-else-if="config.transform_type === 'custom'" class="custom-transform">
        <textarea
          v-model="config.transform_expression"
          placeholder="输入自定义转换表达式，例如：items.map(item => item.name).join(', ')"
          class="form-textarea"
          rows="3"
        ></textarea>
        <div class="form-text">
          使用JavaScript表达式，整个列表可通过'items'变量引用
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">输出变量名</label>
      <input
        type="text"
        v-model="config.output_variable"
        placeholder="result"
        class="form-input"
      />
      <div class="form-text">
        操作结果将以此变量名存储，供下游节点使用
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

// 默认配置
const defaultConfig = {
  input_source: "variable",
  input_variable: "{{items}}",
  direct_items: ["项目1", "项目2", "项目3"],
  operation: "filter",
  
  // 筛选相关
  filter_method: "condition",
  filter_condition: "item.price > 100",
  filter_prompt: "保留所有价格高于100元的商品",
  
  // 映射相关
  map_expression: "{ ...item, price: item.price * 0.9 }",
  
  // 排序相关
  sort_method: "field",
  sort_field: "price",
  sort_order: "asc",
  sort_expression: "(a, b) => a.price - b.price",
  sort_prompt: "按照商品价格从低到高排序",
  
  // 限制相关
  limit_start: 0,
  limit_end: 10,
  
  // 聚合相关
  aggregate_method: "sum",
  aggregate_field: "price",
  aggregate_expression: "items.reduce((sum, item) => sum + item.price, 0)",
  
  // 转换相关
  transform_type: "to_string",
  separator: ", ",
  key_field: "id",
  transform_expression: "items.map(item => item.name).join(', ')",
  
  // 输出相关
  output_variable: "result",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保直接输入列表项存在
if (!config.value.direct_items) {
  config.value.direct_items = ["项目1", "项目2", "项目3"];
}

// 添加直接输入的列表项
const addDirectItem = () => {
  config.value.direct_items.push("");
};

// 删除直接输入的列表项
const removeDirectItem = (index: number) => {
  config.value.direct_items.splice(index, 1);
  
  // 确保至少有一个列表项
  if (config.value.direct_items.length === 0) {
    config.value.direct_items.push("");
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
      
      // 确保直接输入列表项存在
      if (!config.value.direct_items) {
        config.value.direct_items = ["项目1", "项目2", "项目3"];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.list-operator-panel {
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

.direct-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.direct-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-method-selector,
.sort-method-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.condition-editor,
.llm-filter,
.custom-sort,
.llm-sort,
.custom-transform,
.custom-aggregate {
  margin-top: 0.5rem;
}

.sort-field-selector {
  display: flex;
  gap: 0.5rem;
}

.sort-field-selector .form-select {
  width: auto;
  min-width: 5rem;
}

.limit-options {
  display: flex;
  gap: 1rem;
}

.limit-option {
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