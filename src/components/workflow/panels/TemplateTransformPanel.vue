<template>
  <div class="template-transform-panel">
    <div class="form-group">
      <label class="form-label">模板格式</label>
      <div class="template-format-selector">
        <label class="format-option">
          <input
            type="radio"
            v-model="config.format"
            value="jinja2"
            name="format"
          />
          <span>Jinja2</span>
        </label>
        <label class="format-option">
          <input
            type="radio"
            v-model="config.format"
            value="handlebars"
            name="format"
          />
          <span>Handlebars</span>
        </label>
        <label class="format-option">
          <input
            type="radio"
            v-model="config.format"
            value="markdown"
            name="format"
          />
          <span>Markdown</span>
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">模板内容</label>
      <div class="template-editor">
        <textarea
          v-model="config.template"
          placeholder="输入模板内容，例如: 你好，<span v-pre>{{name}}</span>！"
          class="template-textarea"
          rows="10"
        ></textarea>
      </div>
      <div class="form-text">
        使用 <span v-pre>{{变量名}}</span> 引用上游节点变量
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">默认值设置</label>
      <div class="default-values-list">
        <div v-for="(defaultValue, index) in defaultValues" :key="index" class="default-value-item">
          <div class="default-value-fields">
            <input
              type="text"
              v-model="defaultValue.key"
              placeholder="变量名"
              class="form-input default-value-key"
            />
            <input
              type="text"
              v-model="defaultValue.value"
              placeholder="默认值"
              class="form-input default-value-value"
            />
          </div>
          <button class="btn-delete" @click="removeDefaultValue(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addDefaultValue">
          <span class="i-carbon-add"></span>
          <span>添加默认值</span>
        </button>
      </div>
      <div class="form-text">
        设置模板变量的默认值，当上游节点没有提供对应变量时使用
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">输出设置</label>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="strip_whitespace"
          v-model="config.strip_whitespace"
          class="form-check-input"
        />
        <label for="strip_whitespace" class="form-check-label">
          去除多余空白字符
        </label>
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="escape_html"
          v-model="config.escape_html"
          class="form-check-input"
        />
        <label for="escape_html" class="form-check-label">
          转义 HTML 字符
        </label>
      </div>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="enable_autolink"
          v-model="config.enable_autolink"
          class="form-check-input"
        />
        <label for="enable_autolink" class="form-check-label">
          自动识别并链接 URL
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">高级选项</label>
      
      <div class="form-check">
        <input
          type="checkbox"
          id="enable_preview"
          v-model="enablePreview"
          class="form-check-input"
        />
        <label for="enable_preview" class="form-check-label">
          启用预览
        </label>
      </div>
      
      <div v-if="enablePreview" class="preview-section">
        <div class="preview-header">
          <span>预览结果</span>
          <div class="preview-actions">
            <button class="btn-refresh" @click="refreshPreview">
              <span class="i-carbon-refresh"></span>
              刷新
            </button>
          </div>
        </div>
        <div class="preview-content">
          <div v-if="previewLoading" class="preview-loading">
            正在生成预览...
          </div>
          <div v-else class="preview-result">
            {{ previewResult || '预览内容将显示在这里' }}
          </div>
        </div>
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
  format: "jinja2",
  template: "你好，世界！",
  default_values: {},
  strip_whitespace: true,
  escape_html: false,
  enable_autolink: true,
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 确保默认值对象存在
if (!config.value.default_values) {
  config.value.default_values = {};
}

// 默认值数组形式，用于UI显示
const defaultValues = ref<Array<{ key: string; value: string }>>([]);

// 初始化默认值数组
const initDefaultValues = () => {
  defaultValues.value = [];
  if (config.value.default_values) {
    Object.entries(config.value.default_values).forEach(([key, value]) => {
      defaultValues.value.push({ key, value: value as string });
    });
  }
};

// 添加默认值
const addDefaultValue = () => {
  defaultValues.value.push({
    key: "",
    value: "",
  });
  updateDefaultValuesConfig();
};

// 删除默认值
const removeDefaultValue = (index: number) => {
  defaultValues.value.splice(index, 1);
  updateDefaultValuesConfig();
};

// 更新配置中的默认值对象
const updateDefaultValuesConfig = () => {
  const newDefaultValues: Record<string, string> = {};
  defaultValues.value.forEach((item) => {
    if (item.key.trim()) {
      newDefaultValues[item.key.trim()] = item.value;
    }
  });
  config.value.default_values = newDefaultValues;
};

// 预览相关
const enablePreview = ref(false);
const previewLoading = ref(false);
const previewResult = ref("");

// 刷新预览
const refreshPreview = () => {
  // 实际项目中这里应该调用API获取预览结果
  previewLoading.value = true;
  
  // 模拟API调用延迟
  setTimeout(() => {
    try {
      // 简单的模板替换实现，仅作演示用
      let result = config.value.template;
      const sampleValues = {
        name: "用户",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        ...config.value.default_values,
      };
      
      Object.entries(sampleValues).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value as string);
      });
      
      previewResult.value = result;
    } catch (e) {
      previewResult.value = `预览错误: ${e}`;
    } finally {
      previewLoading.value = false;
    }
  }, 500);
};

// 监听默认值变化，更新配置
watch(
  defaultValues,
  () => {
    updateDefaultValuesConfig();
  },
  { deep: true }
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
      if (!config.value.default_values) {
        config.value.default_values = {};
      }
      initDefaultValues();
    }
  },
  { deep: true }
);

// 初始化
initDefaultValues();
</script>

<style scoped>
.template-transform-panel {
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
.template-textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-secondary);
  font-size: 0.875rem;
}

.template-textarea {
  font-family: monospace;
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

.template-format-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.template-editor {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.default-values-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.default-value-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.default-value-fields {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.default-value-key {
  flex: 1;
}

.default-value-value {
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

.preview-section {
  margin-top: 0.25rem;
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid var(--color-border-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: none;
  background-color: var(--color-primary-600);
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
}

.preview-content {
  padding: 0.5rem;
  min-height: 5rem;
  max-height: 10rem;
  overflow-y: auto;
  background-color: #FAFAFA;
}

.preview-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

.preview-result {
  white-space: pre-wrap;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style> 