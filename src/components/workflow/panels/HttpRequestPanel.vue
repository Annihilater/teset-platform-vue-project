<template>
  <div class="http-request-panel">
    <div class="form-group">
      <label class="form-label">请求方法</label>
      <select v-model="config.method" class="form-select">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
        <option value="HEAD">HEAD</option>
        <option value="OPTIONS">OPTIONS</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">请求URL</label>
      <input
        type="text"
        v-model="config.url"
        placeholder="https://"
        class="form-input"
      />
      <div class="form-text">
        支持使用 <span v-pre>{{变量名}}</span> 引用上游节点变量
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">请求头</label>
      <div class="headers-list">
        <div v-for="(header, index) in headers" :key="index" class="header-item">
          <div class="header-fields">
            <input
              type="text"
              v-model="header.key"
              placeholder="名称"
              class="form-input header-key"
            />
            <input
              type="text"
              v-model="header.value"
              placeholder="值"
              class="form-input header-value"
            />
          </div>
          <button class="btn-delete" @click="removeHeader(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addHeader">
          <span class="i-carbon-add"></span>
          <span>添加请求头</span>
        </button>
      </div>
    </div>

    <div class="form-group" v-if="showBodyField">
      <label class="form-label">请求体</label>
      <div class="body-type-selector">
        <label class="body-type-option">
          <input
            type="radio"
            v-model="bodyType"
            value="json"
            name="bodyType"
          />
          <span>JSON</span>
        </label>
        <label class="body-type-option">
          <input
            type="radio"
            v-model="bodyType"
            value="form"
            name="bodyType"
          />
          <span>表单数据</span>
        </label>
        <label class="body-type-option">
          <input
            type="radio"
            v-model="bodyType"
            value="text"
            name="bodyType"
          />
          <span>文本</span>
        </label>
      </div>

      <div v-if="bodyType === 'json'">
        <textarea
          v-model="jsonBody"
          placeholder="{&#10;  &quot;key&quot;: &quot;value&quot;&#10;}"
          class="form-textarea code-textarea"
          rows="6"
        ></textarea>
      </div>

      <div v-else-if="bodyType === 'form'" class="form-data-list">
        <div v-for="(param, index) in formParams" :key="index" class="form-param-item">
          <div class="form-param-fields">
            <input
              type="text"
              v-model="param.key"
              placeholder="参数名"
              class="form-input param-key"
            />
            <input
              type="text"
              v-model="param.value"
              placeholder="参数值"
              class="form-input param-value"
            />
          </div>
          <button class="btn-delete" @click="removeFormParam(index)">
            <span class="i-carbon-trash-can"></span>
          </button>
        </div>

        <button class="btn-add" @click="addFormParam">
          <span class="i-carbon-add"></span>
          <span>添加表单参数</span>
        </button>
      </div>

      <div v-else-if="bodyType === 'text'">
        <textarea
          v-model="config.body"
          placeholder="输入请求体内容"
          class="form-textarea"
          rows="6"
        ></textarea>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">超时设置 (毫秒)</label>
      <input
        type="number"
        v-model.number="config.timeout"
        class="form-input"
        min="1000"
        step="1000"
      />
    </div>

    <div class="form-group">
      <div class="advanced-options">
        <label class="checkbox-option">
          <input type="checkbox" v-model="config.follow_redirects" />
          <span>跟随重定向</span>
        </label>
        <label class="checkbox-option">
          <input type="checkbox" v-model="config.verify_ssl" />
          <span>验证SSL证书</span>
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
  method: "GET",
  url: "https://",
  headers: {},
  body: "",
  timeout: 30000,
  follow_redirects: true,
  verify_ssl: true,
  content_type: "application/json",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 请求体类型
const bodyType = ref("json");

// 请求头数组形式
const headers = ref<Array<{ key: string; value: string }>>([]);

// 表单参数
const formParams = ref<Array<{ key: string; value: string }>>([]);

// JSON请求体
const jsonBody = ref("{}");

// 初始化请求头数组
const initHeaders = () => {
  headers.value = [];
  if (config.value.headers) {
    Object.entries(config.value.headers).forEach(([key, value]) => {
      headers.value.push({ key, value: value as string });
    });
  }
  if (headers.value.length === 0) {
    headers.value.push({ key: "", value: "" });
  }
};

// 初始化请求体类型和内容
const initBody = () => {
  // 检测内容类型
  const contentType = config.value.headers["Content-Type"] || config.value.content_type;
  
  if (contentType?.includes("application/json")) {
    bodyType.value = "json";
    try {
      jsonBody.value = typeof config.value.body === "string" 
        ? config.value.body 
        : JSON.stringify(config.value.body, null, 2);
    } catch (e) {
      jsonBody.value = "{}";
    }
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    bodyType.value = "form";
    initFormParams();
  } else {
    bodyType.value = "text";
  }
};

// 初始化表单参数
const initFormParams = () => {
  formParams.value = [];
  if (typeof config.value.body === "string") {
    try {
      // 尝试解析URL编码的表单数据
      const params = new URLSearchParams(config.value.body);
      params.forEach((value, key) => {
        formParams.value.push({ key, value });
      });
    } catch (e) {
      // 忽略解析错误
    }
  }
  
  if (formParams.value.length === 0) {
    formParams.value.push({ key: "", value: "" });
  }
};

// 是否显示请求体字段
const showBodyField = computed(() => {
  return ["POST", "PUT", "PATCH"].includes(config.value.method);
});

// 添加请求头
const addHeader = () => {
  headers.value.push({ key: "", value: "" });
};

// 删除请求头
const removeHeader = (index: number) => {
  headers.value.splice(index, 1);
  if (headers.value.length === 0) {
    headers.value.push({ key: "", value: "" });
  }
};

// 添加表单参数
const addFormParam = () => {
  formParams.value.push({ key: "", value: "" });
};

// 删除表单参数
const removeFormParam = (index: number) => {
  formParams.value.splice(index, 1);
  if (formParams.value.length === 0) {
    formParams.value.push({ key: "", value: "" });
  }
};

// 更新配置中的请求头
const updateHeaders = () => {
  const newHeaders: Record<string, string> = {};
  headers.value.forEach((header) => {
    if (header.key.trim()) {
      newHeaders[header.key.trim()] = header.value;
    }
  });
  config.value.headers = newHeaders;
};

// 更新配置中的请求体
const updateBody = () => {
  if (!showBodyField.value) {
    config.value.body = "";
    return;
  }

  if (bodyType.value === "json") {
    // 更新请求头中的 Content-Type
    if (!config.value.headers["Content-Type"]) {
      config.value.headers["Content-Type"] = "application/json";
    }
    config.value.content_type = "application/json";
    config.value.body = jsonBody.value;
  } else if (bodyType.value === "form") {
    // 更新请求头中的 Content-Type
    config.value.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.value.content_type = "application/x-www-form-urlencoded";
    
    // 构建表单字符串
    const params = new URLSearchParams();
    formParams.value.forEach((param) => {
      if (param.key.trim()) {
        params.append(param.key.trim(), param.value);
      }
    });
    config.value.body = params.toString();
  }
  // text 类型的直接使用 config.value.body
};

// 监听配置变化，更新节点
watch(
  [config, headers, formParams, jsonBody, bodyType],
  () => {
    updateHeaders();
    updateBody();
    emit("update", { config: { ...config.value } });
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
      initHeaders();
      initBody();
    }
  },
  { deep: true, immediate: true }
);

// 初始化
initHeaders();
initBody();
</script>

<style scoped>
.http-request-panel {
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

.code-textarea {
  font-family: monospace;
}

.form-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: 0.25rem;
}

.headers-list,
.form-data-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-item,
.form-param-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-fields,
.form-param-fields {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.header-key,
.param-key {
  flex: 1;
}

.header-value,
.param-value {
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

.body-type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.body-type-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.advanced-options {
  display: flex;
  gap: 1.5rem;
}
</style> 