<template>
  <div class="panel-container space-y-4">
    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
      <input
        type="text"
        v-model="title"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="请输入节点名称"
      />
    </div>

    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
      <textarea
        v-model="description"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows="2"
        placeholder="请输入节点描述"
      ></textarea>
    </div>

    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">回答内容</label>
      <div class="mb-2 text-xs text-gray-500">支持使用 {"{"{变量名}"}"} 插入变量</div>
      <textarea
        v-model="content"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows="6"
        placeholder="请输入回答内容"
      ></textarea>
    </div>

    <div class="panel-section">
      <div class="flex items-center">
        <input
          id="use-markdown"
          type="checkbox"
          v-model="useMarkdown"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="use-markdown" class="ml-2 block text-sm font-medium text-gray-700">
          启用 Markdown 渲染
        </label>
      </div>
    </div>

    <div class="panel-actions flex justify-end space-x-2">
      <button
        @click="saveChanges"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        保存
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  node: any;
}>();

const emit = defineEmits<{
  (e: "update", nodeId: string, data: any): void;
}>();

const title = ref("");
const description = ref("");
const content = ref("");
const useMarkdown = ref(false);

onMounted(() => {
  title.value = props.node.data?.title || "直接回答";
  description.value = props.node.data?.description || "";
  content.value = props.node.data?.content || "";
  useMarkdown.value = props.node.data?.useMarkdown || false;
});

// 监听节点变化，更新表单
watch(
  () => props.node,
  (newNode) => {
    title.value = newNode.data?.title || "直接回答";
    description.value = newNode.data?.description || "";
    content.value = newNode.data?.content || "";
    useMarkdown.value = newNode.data?.useMarkdown || false;
  },
  { deep: true }
);

const saveChanges = () => {
  emit("update", props.node.id, {
    title: title.value,
    description: description.value,
    content: content.value,
    useMarkdown: useMarkdown.value,
  });
};
</script>
