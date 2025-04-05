<template>
  <span
    class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
    @click="onCopy"
    :title="title || '点击复制'"
    :class="customClass"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  title?: string;
  customClass?: string;
}>();

const emit = defineEmits<{
  (e: "copy", text: string): void;
}>();

const onCopy = () => {
  emit("copy", props.text);
};
</script>
