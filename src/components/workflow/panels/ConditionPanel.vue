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
      <label class="block text-sm font-medium text-gray-700 mb-1">条件表达式</label>
      <div class="mb-2 text-xs text-gray-500">
        使用JavaScript表达式定义条件，返回true或false
      </div>
      <textarea
        v-model="condition"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        rows="4"
        placeholder="例如: data.score > 80"
      ></textarea>
    </div>

    <div class="panel-section">
      <div class="flex items-center mb-2">
        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <label class="text-sm font-medium text-gray-700">满足条件时</label>
      </div>
      <input
        type="text"
        v-model="trueLabel"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="满足条件的分支标签"
      />
    </div>

    <div class="panel-section">
      <div class="flex items-center mb-2">
        <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
        <label class="text-sm font-medium text-gray-700">不满足条件时</label>
      </div>
      <input
        type="text"
        v-model="falseLabel"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="不满足条件的分支标签"
      />
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
const condition = ref("");
const trueLabel = ref("满足条件");
const falseLabel = ref("不满足条件");

onMounted(() => {
  title.value = props.node.data?.title || "条件判断";
  description.value = props.node.data?.description || "";
  condition.value = props.node.data?.condition || "";
  trueLabel.value = props.node.data?.trueLabel || "满足条件";
  falseLabel.value = props.node.data?.falseLabel || "不满足条件";
});

// 监听节点变化，更新表单
watch(
  () => props.node,
  (newNode) => {
    title.value = newNode.data?.title || "条件判断";
    description.value = newNode.data?.description || "";
    condition.value = newNode.data?.condition || "";
    trueLabel.value = newNode.data?.trueLabel || "满足条件";
    falseLabel.value = newNode.data?.falseLabel || "不满足条件";
  },
  { deep: true }
);

const saveChanges = () => {
  emit("update", props.node.id, {
    title: title.value,
    description: description.value,
    condition: condition.value,
    trueLabel: trueLabel.value,
    falseLabel: falseLabel.value,
  });
};
</script>
