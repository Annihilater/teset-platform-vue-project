<template>
  <div class="code-execution-panel">
    <div class="form-group">
      <label class="form-label">编程语言</label>
      <select v-model="config.language" class="form-select">
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="shell">Shell</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">代码</label>
      <div class="code-editor">
        <div class="code-editor-header">
          <div class="language-badge" :class="'language-' + config.language">
            {{ getLanguageLabel() }}
          </div>
          <div class="editor-actions">
            <button class="btn-action" title="格式化代码">
              <span class="i-carbon-text-align-justify"></span>
            </button>
            <button class="btn-action" title="全屏编辑">
              <span class="i-carbon-maximize"></span>
            </button>
          </div>
        </div>
        <textarea
          v-model="config.code"
          :placeholder="getCodePlaceholder()"
          class="code-textarea"
          rows="12"
        ></textarea>
      </div>
      <div class="form-text">
        支持使用 <span v-pre>{{变量名}}</span> 引用上游节点变量，代码结果将自动作为输出
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">环境变量</label>
      <div class="env-vars-list">
        <div v-for="(envVar, index) in config.env_vars" :key="index" class="env-var-item">
          <div class="env-var-fields">
            <input
              type="text"
              v-model="envVar.key"
              placeholder="变量名"
              class="form-input env-var-key"
            />
            <input
              type="text"
              v-model="envVar.value"
              placeholder="变量值"
              class="form-input env-var-value"
            />
          </div>
          <button class="btn-delete" @click="removeEnvVar(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addEnvVar">
          <span class="i-carbon-add"></span>
          <span>添加环境变量</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">执行设置</label>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="timeout_enabled"
          v-model="config.timeout_enabled"
          class="form-check-input"
        />
        <label for="timeout_enabled" class="form-check-label">
          启用超时限制
        </label>
      </div>
      
      <div v-if="config.timeout_enabled" class="sub-form-group">
        <label class="form-label">超时时间（秒）</label>
        <input
          type="number"
          v-model.number="config.timeout"
          class="form-input"
          min="1"
          max="300"
        />
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="memory_limit_enabled"
          v-model="config.memory_limit_enabled"
          class="form-check-input"
        />
        <label for="memory_limit_enabled" class="form-check-label">
          启用内存限制
        </label>
      </div>
      
      <div v-if="config.memory_limit_enabled" class="sub-form-group">
        <label class="form-label">内存限制（MB）</label>
        <input
          type="number"
          v-model.number="config.memory_limit"
          class="form-input"
          min="32"
          max="1024"
        />
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="include_stdout"
          v-model="config.include_stdout"
          class="form-check-input"
        />
        <label for="include_stdout" class="form-check-label">
          包含标准输出在结果中
        </label>
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="include_stderr"
          v-model="config.include_stderr"
          class="form-check-input"
        />
        <label for="include_stderr" class="form-check-label">
          包含标准错误在结果中
        </label>
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
  language: "python",
  code: "# 在此编写Python代码\n# 可以使用变量: <变量名>\n\n# 示例: 处理输入并返回结果\nresult = input_value\n\n# 返回处理后的结果\nreturn result",
  env_vars: [],
  timeout_enabled: true,
  timeout: 30,
  memory_limit_enabled: true,
  memory_limit: 128,
  include_stdout: true,
  include_stderr: true,
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保环境变量列表存在
if (!config.value.env_vars) {
  config.value.env_vars = [];
}

// 添加环境变量
const addEnvVar = () => {
  config.value.env_vars.push({
    key: "",
    value: "",
  });
};

// 删除环境变量
const removeEnvVar = (index: number) => {
  config.value.env_vars.splice(index, 1);
};

// 获取语言显示标签
const getLanguageLabel = () => {
  switch (config.value.language) {
    case "python":
      return "Python";
    case "javascript":
      return "JavaScript";
    case "shell":
      return "Shell";
    default:
      return config.value.language;
  }
};

// 获取代码示例
const getCodePlaceholder = () => {
  switch (config.value.language) {
    case "python":
      return "# 在此编写Python代码\n# 可以使用变量: <变量名>\n\n# 示例: 处理输入并返回结果\nresult = input_value\n\n# 返回处理后的结果\nreturn result";
    case "javascript":
      return "// 在此编写JavaScript代码\n// 可以使用变量: <变量名>\n\n// 示例: 处理输入并返回结果\nconst result = input_value;\n\n// 返回处理后的结果\nreturn result;";
    case "shell":
      return "#!/bin/bash\n# 在此编写Shell代码\n# 可以使用变量: $INPUT\n\n# 示例: 处理输入\necho $INPUT";
    default:
      return "";
  }
};

// 语言变更时更新默认代码
watch(
  () => config.value.language,
  (newLanguage) => {
    // 只有当代码为空或是默认代码时才自动更新
    if (!config.value.code || config.value.code === defaultConfig.code) {
      config.value.code = getCodePlaceholder();
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
      if (!config.value.env_vars) {
        config.value.env_vars = [];
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.code-execution-panel {
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

.code-editor {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.code-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
}

.language-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.language-python {
  background-color: #3572A5;
  color: white;
}

.language-javascript {
  background-color: #F7DF1E;
  color: black;
}

.language-shell {
  background-color: #4EAA25;
  color: white;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.btn-action:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-text-secondary);
}

.code-textarea {
  width: 100%;
  padding: 0.5rem;
  border: none;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: none;
  background-color: #FAFAFA;
}

.env-vars-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.env-var-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.env-var-fields {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.env-var-key {
  flex: 1;
}

.env-var-value {
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