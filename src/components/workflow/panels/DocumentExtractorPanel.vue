<template>
  <div class="document-extractor-panel">
    <div class="form-group">
      <label class="form-label">文档来源</label>
      <div class="document-source-selector">
        <label class="source-option">
          <input
            type="radio"
            v-model="config.source_type"
            value="variable"
            name="source_type"
          />
          <span>变量引用</span>
        </label>
        <label class="source-option">
          <input
            type="radio"
            v-model="config.source_type"
            value="url"
            name="source_type"
          />
          <span>URL地址</span>
        </label>
        <label class="source-option">
          <input
            type="radio"
            v-model="config.source_type"
            value="upload"
            name="source_type"
          />
          <span>文件上传</span>
        </label>
      </div>
      
      <div v-if="config.source_type === 'variable'" class="source-input">
        <input
          type="text"
          v-model="config.variable_name"
          placeholder="输入变量名，例如: {{document}}"
          class="form-input"
        />
      </div>
      
      <div v-else-if="config.source_type === 'url'" class="source-input">
        <input
          type="text"
          v-model="config.url"
          placeholder="输入文档URL地址"
          class="form-input"
        />
      </div>
      
      <div v-else class="source-input">
        <div class="upload-placeholder">
          <span>当前仅支持运行时上传文件，请在执行时选择</span>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">文档类型</label>
      <select v-model="config.document_type" class="form-select">
        <option value="auto">自动检测</option>
        <option value="pdf">PDF文档</option>
        <option value="docx">Word文档</option>
        <option value="txt">文本文件</option>
        <option value="html">HTML页面</option>
        <option value="markdown">Markdown文档</option>
        <option value="json">JSON数据</option>
        <option value="csv">CSV数据</option>
        <option value="image">图片</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">提取方法</label>
      <select v-model="config.extraction_method" class="form-select">
        <option value="full_text">完整文本</option>
        <option value="summary">内容摘要</option>
        <option value="structured">结构化数据</option>
        <option value="custom">自定义提取</option>
      </select>
    </div>

    <div v-if="config.extraction_method === 'structured'" class="form-group">
      <label class="form-label">数据结构描述</label>
      <textarea
        v-model="config.structure_description"
        placeholder="请描述要提取的数据结构，例如：提取文档中的表格数据，包含标题、日期和金额字段"
        class="form-textarea"
        rows="4"
      ></textarea>
    </div>

    <div v-if="config.extraction_method === 'custom'" class="form-group">
      <label class="form-label">自定义提取指令</label>
      <textarea
        v-model="config.custom_instruction"
        placeholder="请输入提取指令，例如：提取文档中的所有电子邮件地址和电话号码"
        class="form-textarea"
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">高级选项</label>
      
      <div class="accordion">
        <div class="accordion-item">
          <div 
            class="accordion-header" 
            :class="{ 'active': showAdvancedOptions }"
            @click="showAdvancedOptions = !showAdvancedOptions"
          >
            <span>高级设置</span>
            <span class="accordion-icon">
              {{ showAdvancedOptions ? '↑' : '↓' }}
            </span>
          </div>
          
          <div class="accordion-content" v-if="showAdvancedOptions">
            <div class="sub-form-group">
              <label class="form-label">页面范围</label>
              <div class="page-range">
                <input
                  type="number"
                  v-model.number="config.page_start"
                  placeholder="起始页"
                  class="form-input page-input"
                  min="1"
                />
                <span class="page-separator">-</span>
                <input
                  type="number"
                  v-model.number="config.page_end"
                  placeholder="结束页"
                  class="form-input page-input"
                  min="1"
                />
              </div>
              <div class="form-text">
                仅对分页文档有效，留空表示所有页面
              </div>
            </div>
            
            <div class="sub-form-group">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="extract_images"
                  v-model="config.extract_images"
                  class="form-check-input"
                />
                <label for="extract_images" class="form-check-label">
                  提取文档内图片
                </label>
              </div>
            </div>
            
            <div class="sub-form-group">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="extract_tables"
                  v-model="config.extract_tables"
                  class="form-check-input"
                />
                <label for="extract_tables" class="form-check-label">
                  提取文档内表格
                </label>
              </div>
            </div>
            
            <div class="sub-form-group">
              <div class="form-check">
                <input
                  type="checkbox"
                  id="preserve_formatting"
                  v-model="config.preserve_formatting"
                  class="form-check-input"
                />
                <label for="preserve_formatting" class="form-check-label">
                  保留原始格式
                </label>
              </div>
            </div>
            
            <div class="sub-form-group">
              <label class="form-label">OCR语言（图片/扫描文档）</label>
              <select v-model="config.ocr_language" class="form-select">
                <option value="auto">自动检测</option>
                <option value="chi_sim">简体中文</option>
                <option value="chi_tra">繁体中文</option>
                <option value="eng">英语</option>
                <option value="jpn">日语</option>
                <option value="kor">韩语</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">输出变量名</label>
      <input
        type="text"
        v-model="config.output_variable"
        placeholder="extracted_content"
        class="form-input"
      />
      <div class="form-text">
        提取结果将以此变量名存储，供下游节点使用
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
  source_type: "variable",
  variable_name: "{{document}}",
  url: "",
  document_type: "auto",
  extraction_method: "full_text",
  structure_description: "",
  custom_instruction: "",
  page_start: null,
  page_end: null,
  extract_images: false,
  extract_tables: true,
  preserve_formatting: false,
  ocr_language: "auto",
  output_variable: "extracted_content",
};

// 节点配置
const config = ref({
  ...defaultConfig,
  ...props.node?.data?.config,
});

// 高级选项显示控制
const showAdvancedOptions = ref(false);

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
.document-extractor-panel {
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
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
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

.document-source-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.source-option {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.source-input {
  margin-top: 0.5rem;
}

.upload-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px dashed var(--color-border-secondary);
  border-radius: 0.375rem;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

.page-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-input {
  width: 5rem;
}

.page-separator {
  color: var(--color-text-tertiary);
}

.accordion {
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  overflow: hidden;
}

.accordion-item {
  display: flex;
  flex-direction: column;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #f9fafb;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.accordion-header.active {
  border-bottom: 1px solid var(--color-border-secondary);
}

.accordion-icon {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--color-text-tertiary);
}

.accordion-content {
  padding: 0.75rem;
  background-color: #fff;
}
</style> 