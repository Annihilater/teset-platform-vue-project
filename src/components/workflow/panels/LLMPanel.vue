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
      <label class="block text-sm font-medium text-gray-700 mb-1">选择模型</label>
      <select
        v-model="model"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="claude-3-opus">Claude 3 Opus</option>
        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
        <option value="llama-3-70b">Llama 3 70B</option>
      </select>
    </div>

    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">提示词模板</label>
      <textarea
        v-model="prompt"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        rows="6"
        placeholder="输入提示词模板，使用 {{变量名}} 插入变量"
      ></textarea>
    </div>

    <div class="panel-section">
      <div class="flex items-center justify-between mb-1">
        <label class="block text-sm font-medium text-gray-700">高级参数</label>
        <button
          @click="showAdvanced = !showAdvanced"
          class="text-xs text-blue-600 hover:text-blue-800"
        >
          {{ showAdvanced ? "隐藏" : "显示" }}
        </button>
      </div>

      <div v-if="showAdvanced" class="space-y-3 border border-gray-200 rounded-md p-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1"
              >Temperature</label
            >
            <input
              type="number"
              v-model="temperature"
              min="0"
              max="2"
              step="0.1"
              class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Max Tokens</label>
            <input
              type="number"
              v-model="maxTokens"
              min="1"
              class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1"
            >System Message</label
          >
          <textarea
            v-model="systemMessage"
            class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            rows="2"
          ></textarea>
        </div>
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
const model = ref("gpt-3.5-turbo");
const prompt = ref("");
const showAdvanced = ref(false);
const temperature = ref(0.7);
const maxTokens = ref(1024);
const systemMessage = ref("");

onMounted(() => {
  title.value = props.node.data?.title || "LLM 调用";
  description.value = props.node.data?.description || "";
  model.value = props.node.data?.model || "gpt-3.5-turbo";
  prompt.value = props.node.data?.prompt || "";
  temperature.value = props.node.data?.temperature || 0.7;
  maxTokens.value = props.node.data?.maxTokens || 1024;
  systemMessage.value = props.node.data?.systemMessage || "";
});

// 监听节点变化，更新表单
watch(
  () => props.node,
  (newNode) => {
    title.value = newNode.data?.title || "LLM 调用";
    description.value = newNode.data?.description || "";
    model.value = newNode.data?.model || "gpt-3.5-turbo";
    prompt.value = newNode.data?.prompt || "";
    temperature.value = newNode.data?.temperature || 0.7;
    maxTokens.value = newNode.data?.maxTokens || 1024;
    systemMessage.value = newNode.data?.systemMessage || "";
  },
  { deep: true }
);

const saveChanges = () => {
  emit("update", props.node.id, {
    title: title.value,
    description: description.value,
    model: model.value,
    prompt: prompt.value,
    temperature: temperature.value,
    maxTokens: maxTokens.value,
    systemMessage: systemMessage.value,
  });
};
</script>
