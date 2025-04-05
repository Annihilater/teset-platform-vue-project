<template>
  <div class="panel-container space-y-4">
    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">{{
        $t("workflow.labels.name", "名称")
      }}</label>
      <input
        type="text"
        v-model="title"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        :placeholder="$t('workflow.namePlaceholder', '请输入节点名称')"
      />
    </div>

    <div class="panel-section">
      <label class="block text-sm font-medium text-gray-700 mb-1">{{
        $t("workflow.labels.description", "描述")
      }}</label>
      <textarea
        v-model="description"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        rows="3"
        :placeholder="$t('workflow.descriptionPlaceholder', '请输入节点描述')"
      ></textarea>
    </div>

    <div class="panel-section bg-blue-50 p-3 rounded-md">
      <div class="text-sm text-blue-700 mb-2 font-medium">
        {{ $t("workflow.labels.tip", "提示") }}
      </div>
      <div class="text-xs text-blue-600">
        {{
          $t(
            "workflow.startNodeTip",
            "开始节点是工作流的入口点，用户输入将从这里开始处理。"
          )
        }}
      </div>
    </div>

    <div class="panel-actions flex justify-end space-x-2">
      <button
        @click="saveChanges"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {{ $t("common.save") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  node: any;
}>();

const emit = defineEmits<{
  (e: "update", nodeId: string, data: any): void;
}>();

const title = ref("");
const description = ref("");

onMounted(() => {
  title.value = props.node.data?.title || t("workflow.nodes.start");
  description.value = props.node.data?.description || "";
});

// 监听节点变化，更新表单
watch(
  () => props.node,
  (newNode) => {
    title.value = newNode.data?.title || t("workflow.nodes.start");
    description.value = newNode.data?.description || "";
  },
  { deep: true }
);

const saveChanges = () => {
  emit("update", props.node.id, {
    title: title.value,
    description: description.value,
  });
};
</script>
