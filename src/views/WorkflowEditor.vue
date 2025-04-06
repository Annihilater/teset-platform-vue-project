import '@vue-flow/core/dist/style.css'; import '@vue-flow/core/dist/theme-default.css';

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { computed } from "vue";

const { t } = useI18n();
const router = useRouter();

const nodeTitles = computed(() => ({
  [BlockEnum.START]: t("workflow.nodes.start"),
  [BlockEnum.END]: t("workflow.nodes.end"),
  [BlockEnum.ANSWER]: t("workflow.nodes.answer"),
  [BlockEnum.LLM]: t("workflow.nodes.llm"),
  [BlockEnum.CONDITION]: t("workflow.nodes.condition"),
}));

import {
  BlockEnum,
  flowState,
  loading,
  searchQuery,
  selectedNode,
  contextMenu,
  contextMenuItems,
  showImportDialog,
  importDslText,
  onConnect,
  onNodeClick,
  onPaneReady,
  getNodeIcon,
  getNodeTitle,
  getNodePanel,
  initializeWorkflow,
  addNode,
  getDefaultNodeConfig,
  closeNodePanel,
  updateNodeData,
  undo,
  redo,
  zoomInView,
  zoomOutView,
  resetView,
  finishWorkflow,
  closeContextMenu,
  onPaneClick,
  onContextMenu,
  handleContextMenuAction,
  addNodeAtPosition,
  exportDsl,
  importDsl as importDslFn,
  deleteNode,
  duplicateNode,
  availableBlocks,
  canUndo,
  canRedo,
} from "./WorkflowEditor.logic.ts";
import "./WorkflowEditor.styles.css";
</script>
