<template>
  <div class="workflow-builder-view">
    <div class="page-header">
      <h1>工作流构建器</h1>
      <div class="page-actions">
        <button class="action-btn" @click="exportWorkflow">
          <span class="i-carbon-download"></span>
          导出
        </button>
        <button class="action-btn" @click="openImportDialog">
          <span class="i-carbon-upload"></span>
          导入
        </button>
      </div>
    </div>

    <div class="workflow-editor-wrapper">
      <WorkflowEditor />
    </div>

    <!-- 导入对话框 -->
    <div v-if="showImportDialog" class="import-dialog-overlay">
      <div class="import-dialog">
        <div class="dialog-header">
          <h2>导入工作流</h2>
          <button class="close-btn" @click="closeImportDialog">
            <span class="i-carbon-close"></span>
          </button>
        </div>
        <div class="dialog-body">
          <textarea
            v-model="importJson"
            class="import-textarea"
            placeholder="粘贴DSL JSON..."
          ></textarea>
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="closeImportDialog">取消</button>
          <button class="import-btn" @click="importWorkflow">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import WorkflowEditor from "@/components/workflow/WorkflowEditor.vue";
import useWorkflowStore from "@/stores/workflowStore";

const workflowStore = useWorkflowStore();

// 导入对话框
const showImportDialog = ref(false);
const importJson = ref("");

// 打开导入对话框
const openImportDialog = () => {
  showImportDialog.value = true;
};

// 关闭导入对话框
const closeImportDialog = () => {
  showImportDialog.value = false;
  importJson.value = "";
};

// 导出工作流
const exportWorkflow = () => {
  try {
    const dsl = workflowStore.exportDsl();
    const json = JSON.stringify(dsl, null, 2);

    // 创建Blob对象
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();

    // 清理
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error("导出工作流出错:", error);
    alert("导出失败，请检查控制台错误信息");
  }
};

// 导入工作流
const importWorkflow = () => {
  try {
    if (!importJson.value.trim()) {
      alert("请粘贴有效的DSL JSON");
      return;
    }

    const dsl = JSON.parse(importJson.value);
    const success = workflowStore.importDSL(dsl);

    if (success) {
      alert("导入成功!");
      closeImportDialog();
    } else {
      alert("导入失败，请检查DSL格式");
    }
  } catch (error) {
    console.error("导入工作流出错:", error);
    alert("导入失败，请检查JSON格式");
  }
};
</script>

<style scoped>
.workflow-builder-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.page-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
}

.page-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.workflow-editor-wrapper {
  flex: 1;
  overflow: hidden;
}

/* 导入对话框 */
.import-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.import-dialog {
  width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #9ca3af;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.dialog-body {
  padding: 16px;
}

.import-textarea {
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  resize: none;
}

.import-textarea:focus {
  outline: none;
  border-color: #93c5fd;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  gap: 8px;
}

.cancel-btn,
.import-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.import-btn {
  background-color: #2563eb;
  border: 1px solid #2563eb;
  color: white;
}

.import-btn:hover {
  background-color: #1d4ed8;
}
</style>
