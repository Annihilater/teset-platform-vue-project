<template>
  <div
    :class="['custom-handle', `custom-handle-${type}`, { connecting: isConnecting }]"
    :data-type="type"
    :data-handleid="id"
    :data-handlepos="position"
    @mousedown="handleMouseDown"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'source',
    validator: (value: string) => ['source', 'target'].includes(value)
  },
  position: {
    type: String,
    default: 'right',
    validator: (value: string) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  className: {
    type: String,
    default: ''
  }
});

const isConnecting = ref(false);

const handleMouseDown = (event: MouseEvent) => {
  event.stopPropagation();
  isConnecting.value = true;
  console.log(`连接开始 - Handle ${props.id} (${props.type})`);
};

const handleGlobalMouseUp = () => {
  if (isConnecting.value) {
    isConnecting.value = false;
    console.log(`连接结束 - Handle ${props.id} (${props.type})`);
  }
};

onMounted(() => {
  window.addEventListener('mouseup', handleGlobalMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mouseup', handleGlobalMouseUp);
});
</script>

<style scoped>
.custom-handle {
  width: 12px;
  height: 12px;
  background-color: #64748b;
  border: 2px solid #f8fafc;
  border-radius: 50%;
  cursor: crosshair;
  transition: all 0.2s ease;
  position: absolute;
  z-index: 1;
}

.custom-handle:hover {
  transform: scale(1.2);
  background-color: #3b82f6;
}

.custom-handle.connecting {
  background-color: #3b82f6;
  transform: scale(1.3);
}

.custom-handle-source {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.custom-handle-source:hover,
.custom-handle-source.connecting {
  right: -6px;
  top: 50%;
  transform: translateY(-50%) scale(1.2);
}

.custom-handle-target {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.custom-handle-target:hover,
.custom-handle-target.connecting {
  left: -6px;
  top: 50%;
  transform: translateY(-50%) scale(1.2);
}
</style> 