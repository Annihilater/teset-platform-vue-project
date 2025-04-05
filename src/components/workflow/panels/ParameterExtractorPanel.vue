<template>
  <div class="parameter-extractor-panel">
    <div class="form-group">
      <label class="form-label">输入来源</label>
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
        placeholder="输入变量名，例如: {{query}}"
        class="form-input"
      />
    </div>
    
    <div v-else class="form-group">
      <label class="form-label">输入文本</label>
      <textarea
        v-model="config.input_text"
        placeholder="请输入要提取参数的文本内容"
        class="form-textarea"
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">提取方法</label>
      <div class="extraction-method-selector">
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="regex"
            name="method"
          />
          <span>正则表达式</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="llm"
            name="method"
          />
          <span>LLM提取</span>
        </label>
        <label class="method-option">
          <input
            type="radio"
            v-model="config.method"
            value="json"
            name="method"
          />
          <span>JSON解析</span>
        </label>
      </div>
    </div>

    <div v-if="config.method === 'regex'" class="form-group">
      <label class="form-label">参数定义</label>
      <div class="parameters-list">
        <div v-for="(param, index) in config.parameters" :key="index" class="parameter-item">
          <div class="parameter-item-header">
            <div class="parameter-name">
              <input
                type="text"
                v-model="param.name"
                placeholder="参数名称"
                class="form-input"
              />
            </div>
            <button class="btn-delete" @click="removeParameter(index)">
              <span class="i-carbon-trash-can"></span>
            </button>
          </div>
          
          <div class="parameter-pattern">
            <input
              type="text"
              v-model="param.pattern"
              placeholder="正则表达式，例如: \b\d{4}-\d{2}-\d{2}\b"
              class="form-input"
            />
          </div>
          
          <div class="parameter-default">
            <div class="parameter-default-header">
              <span>默认值（可选）</span>
              <div class="parameter-default-toggle">
                <input
                  type="checkbox"
                  :id="`use_default_${index}`"
                  v-model="param.use_default"
                  class="form-check-input"
                />
                <label :for="`use_default_${index}`" class="form-check-label">
                  启用
                </label>
              </div>
            </div>
            <input
              v-if="param.use_default"
              type="text"
              v-model="param.default_value"
              placeholder="未提取到时使用的默认值"
              class="form-input"
            />
          </div>
        </div>

        <button class="btn-add" @click="addParameter">
          <span class="i-carbon-add"></span>
          <span>添加参数</span>
        </button>
      </div>
    </div>

    <div v-else-if="config.method === 'llm'" class="form-group">
      <label class="form-label">LLM模型</label>
      <select v-model="config.llm_model" class="form-select">
        <option value="DeepSeek V3">DeepSeek V3</option>
        <option value="GPT-4">GPT-4</option>
        <option value="Claude 3">Claude 3</option>
      </select>
      
      <div class="form-group">
        <label class="form-label">参数描述</label>
        <textarea
          v-model="config.llm_instruction"
          placeholder="描述需要从文本中提取的参数，例如：从文本中提取客户姓名、电话号码和电子邮件地址"
          class="form-textarea"
          rows="4"
        ></textarea>
        <div class="form-text">
          详细描述需要提取的参数，LLM将根据描述从文本中提取对应信息
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label">输出格式</label>
        <select v-model="config.llm_output_format" class="form-select">
          <option value="json">JSON对象</option>
          <option value="key_value">键值对</option>
        </select>
      </div>
    </div>

    <div v-else-if="config.method === 'json'" class="form-group">
      <label class="form-label">JSON路径</label>
      <div class="parameters-list">
        <div v-for="(param, index) in config.json_paths" :key="index" class="json-path-item">
          <div class="json-path-fields">
            <input
              type="text"
              v-model="param.name"
              placeholder="参数名称"
              class="form-input json-path-name"
            />
            <input
              type="text"
              v-model="param.path"
              placeholder="JSON路径，例如: $.user.name"
              class="form-input json-path-value"
            />
          </div>
          <button class="btn-delete" @click="removeJsonPath(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addJsonPath">
          <span class="i-carbon-add"></span>
          <span>添加JSON路径</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <div class="form-check">
        <input
          type="checkbox"
          id="combine_results"
          v-model="config.combine_results"
          class="form-check-input"
        />
        <label for="combine_results" class="form-check-label">
          合并输出结果
        </label>
      </div>
      <div class="form-text">
        开启后将所有提取的参数合并为一个对象输出，否则每个参数作为单独的变量输出
      </div>
    </div>

    <div v-if="config.combine_results" class="form-group">
      <label class="form-label">输出变量名</label>
      <input
        type="text"
        v-model="config.output_variable"
        placeholder="parameters"
        class="form-input"
      />
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
  input_variable: "{{input}}",
  input_text: "",
  method: "regex",
  parameters: [
    {
      name: "date",
      pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
      use_default: false,
      default_value: "",
    },
  ],
  llm_model: "DeepSeek V3",
  llm_instruction: "从文本中提取以下信息：姓名、电话号码、电子邮件",
  llm_output_format: "json",
  json_paths: [
    { name: "username", path: "$.user.name" },
  ],
  combine_results: true,
  output_variable: "parameters",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保参数列表存在
if (!config.value.parameters) {
  config.value.parameters = [
    {
      name: "date",
      pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
      use_default: false,
      default_value: "",
    },
  ];
}

// 确保JSON路径列表存在
if (!config.value.json_paths) {
  config.value.json_paths = [
    { name: "username", path: "$.user.name" },
  ];
}

// 添加参数
const addParameter = () => {
  config.value.parameters.push({
    name: "",
    pattern: "",
    use_default: false,
    default_value: "",
  });
};

// 删除参数
const removeParameter = (index: number) => {
  config.value.parameters.splice(index, 1);
  
  // 确保至少有一个参数
  if (config.value.parameters.length === 0) {
    config.value.parameters.push({
      name: "",
      pattern: "",
      use_default: false,
      default_value: "",
    });
  }
};

// 添加JSON路径
const addJsonPath = () => {
  config.value.json_paths.push({
    name: "",
    path: "",
  });
};

// 删除JSON路径
const removeJsonPath = (index: number) => {
  config.value.json_paths.splice(index, 1);
  
  // 确保至少有一个JSON路径
  if (config.value.json_paths.length === 0) {
    config.value.json_paths.push({
      name: "",
      path: "",
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
      
      // 确保参数列表存在
      if (!config.value.parameters) {
        config.value.parameters = [
          {
            name: "date",
            pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b",
            use_default: false,
            default_value: "",
          },
        ];
      }
      
      // 确保JSON路径列表存在
      if (!config.value.json_paths) {
        config.value.json_paths = [
          { name: "username", path: "$.user.name" },
        ];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.parameter-extractor-panel {
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

.extraction-method-selector {
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

.parameters-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.parameter-item {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.parameter-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
}

.parameter-name {
  flex: 1;
}

.parameter-pattern,
.parameter-default {
  padding: 0.5rem;
}

.parameter-pattern {
  border-bottom: 1px solid var(--color-border-secondary);
}

.parameter-default-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}

.parameter-default-toggle {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.json-path-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.json-path-fields {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.json-path-name {
  flex: 1;
}

.json-path-value {
  flex: 2;
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