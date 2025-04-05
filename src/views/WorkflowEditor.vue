<script setup lang="ts">
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
  importDsl,
  deleteNode,
  duplicateNode,
  availableBlocks,
  canUndo,
  canRedo,
} from "./WorkflowEditor.logic.ts";
import "./WorkflowEditor.styles.css";
</script>

<template>
  <PageLayout>
    <div class="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHeader
        :title="$t('workflow.configuration')"
        :description="$t('workflow.createAndManage')"
      >
        <template #actions>
          <div class="flex items-center space-x-4 flex-wrap gap-y-2">
            <!-- 搜索栏 -->
            <div class="relative flex-shrink-0">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('workflow.searchPlaceholder')"
                class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <SearchIcon class="w-5 h-5" />
              </span>
            </div>

            <!-- 保存按钮 -->
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 flex-shrink-0"
              @click="finishWorkflow"
            >
              <SaveIcon class="w-5 h-5" />
              <span>{{ $t("workflow.save") }}</span>
            </button>
          </div>
        </template>
      </PageHeader>

      <DashboardCard class="w-full" :title="$t('workflow.editor')">
        <LoadingSpinner v-if="loading" :message="$t('workflow.loading')" />

        <div v-else class="flex flex-col">
          <!-- 状态栏 -->
          <div
            class="p-3 bg-blue-50 text-blue-700 text-sm flex items-center gap-2 rounded-t-lg border border-blue-100"
          >
            <span class="flex-1"
              >{{ flowState.nodes.length }} 个节点 |
              {{ flowState.edges.length }} 个连接</span
            >
            <div class="flex items-center gap-2">
              <button
                class="px-2 py-1 bg-white text-blue-600 rounded border border-blue-200 text-xs hover:bg-blue-50 transition-colors"
                @click="exportDsl"
              >
                导出工作流
              </button>
              <button
                class="px-2 py-1 bg-white text-blue-600 rounded border border-blue-200 text-xs hover:bg-blue-50 transition-colors"
                @click="showImportDialog = true"
              >
                导入工作流
              </button>
            </div>
          </div>

          <div
            class="workflow-editor w-full h-[calc(100vh-16rem)] min-h-[400px] border border-gray-200 rounded-b-lg overflow-hidden"
          >
            <VueFlow
              :nodes="flowState.nodes"
              :edges="flowState.edges"
              :default-viewport="{ x: 0, y: 0, zoom: 1.5 }"
              :min-zoom="0.2"
              :max-zoom="4"
              :nodes-focusable="true"
              :edges-focusable="true"
              class="bg-slate-50 w-full h-full"
              @pane-ready="onPaneReady"
              @connect="onConnect"
              @node-click="onNodeClick"
              @pane-click="onPaneClick"
              @contextmenu="onContextMenu"
            >
              <template #node-special="props">
                <BaseNode v-bind="props" />
              </template>
              <!-- 节点类型渲染 -->
              <template #node-start="nodeProps">
                <StartNode v-bind="nodeProps" />
              </template>
              <template #node-end="nodeProps">
                <EndNode v-bind="nodeProps" />
              </template>
              <template #node-answer="nodeProps">
                <AnswerNode v-bind="nodeProps" />
              </template>
              <template #node-llm="nodeProps">
                <LLMNode v-bind="nodeProps" />
              </template>
              <template #node-condition="nodeProps">
                <ConditionNode v-bind="nodeProps" />
              </template>

              <!-- 节点操作悬浮按钮 -->
              <template #node-button="{ nodeId }">
                <div
                  class="flex items-center space-x-1 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md p-1"
                >
                  <button
                    class="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="复制节点"
                    @click.stop="duplicateNode(nodeId)"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="删除节点"
                    @click.stop="deleteNode(nodeId)"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </template>

              <!-- 工具栏 -->
              <template #panel>
                <div class="workflow-toolbar">
                  <div class="flex items-center space-x-2">
                    <div class="flex items-center space-x-2">
                      <button
                        v-for="(blockType, index) in availableBlocks"
                        :key="index"
                        @click="addNode(blockType)"
                        class="node-button flex items-center text-sm px-3 py-1.5"
                      >
                        <component :is="getNodeIcon(blockType)" class="w-4 h-4 mr-1.5" />
                        <span>{{ getNodeTitle(blockType) }}</span>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <button
                      @click="undo"
                      :disabled="!canUndo"
                      class="action-button p-1.5 rounded"
                      :title="$t('workflow.actions.undo')"
                    >
                      <Undo2 class="w-4 h-4" />
                    </button>
                    <button
                      @click="redo"
                      :disabled="!canRedo"
                      class="action-button p-1.5 rounded"
                      :title="$t('workflow.actions.redo')"
                    >
                      <Redo2 class="w-4 h-4" />
                    </button>
                    <div class="h-4 mx-1 border-r border-gray-200"></div>
                    <button
                      @click="zoomInView"
                      class="action-button p-1.5 rounded"
                      :title="$t('workflow.actions.zoomIn')"
                    >
                      <ZoomIn class="w-4 h-4" />
                    </button>
                    <button
                      @click="zoomOutView"
                      class="action-button p-1.5 rounded"
                      :title="$t('workflow.actions.zoomOut')"
                    >
                      <ZoomOut class="w-4 h-4" />
                    </button>
                    <button
                      @click="resetView"
                      class="action-button p-1.5 rounded"
                      :title="$t('workflow.actions.reset')"
                    >
                      <Maximize2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </template>

              <!-- 迷你图 -->
              <MiniMap
                position="bottom-right"
                nodeStrokeWidth="{3}"
                nodeBorderRadius="{2}"
              />

              <!-- 背景 -->
              <Background pattern="dots" gap="20" size="1" color="#e2e8f0" />

              <!-- 控制 -->
              <Controls showInteractive="{false}" fitViewOnInit position="top-right" />

              <!-- 连接线 -->
              <template #connection-line="connectionProps">
                <ConnectionLine
                  :source-x="connectionProps.sourceX"
                  :source-y="connectionProps.sourceY"
                  :target-x="connectionProps.targetX"
                  :target-y="connectionProps.targetY"
                  type="smoothstep"
                  animated
                />
              </template>
            </VueFlow>
          </div>
        </div>
      </DashboardCard>

      <!-- 节点配置面板 -->
      <div
        v-if="selectedNode"
        class="fixed right-0 top-0 bottom-0 w-[360px] bg-white shadow-lg border-l border-gray-200 z-20 overflow-y-auto"
      >
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10"
        >
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center mr-3"
            >
              <component
                :is="getNodeIcon(selectedNode.type as BlockEnum)"
                class="w-5 h-5 text-slate-600"
              />
            </div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ getNodeTitle(selectedNode.type as BlockEnum) }}
            </h3>
          </div>
          <button
            @click="closeNodePanel"
            class="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5">
          <component
            :is="getNodePanel(selectedNode.type as BlockEnum)"
            :node="selectedNode"
            @update="updateNodeData"
          />
        </div>
      </div>

      <!-- 右键菜单 -->
      <div
        v-show="contextMenu.visible"
        class="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      >
        <div class="py-1">
          <button
            v-for="(item, index) in contextMenuItems"
            :key="index"
            @click="handleContextMenuAction(item.action)"
            class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center"
          >
            <component :is="item.icon" class="w-4 h-4 text-gray-500 mr-2.5" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </div>

      <!-- 导入DSL对话框 -->
      <div
        v-if="showImportDialog"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">导入工作流</h3>
            <button
              @click="showImportDialog = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <textarea
            v-model="importDslText"
            class="w-full h-48 p-3 border border-gray-300 rounded-lg mb-5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请粘贴工作流DSL内容..."
          ></textarea>

          <div class="flex justify-end space-x-3">
            <button
              @click="showImportDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
            >
              取消
            </button>
            <button
              @click="importDsl"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              导入
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
