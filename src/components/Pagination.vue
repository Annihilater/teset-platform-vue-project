<template>
  <!-- 分页控件 -->
  <div class="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
    <!-- 移动端分页控件 -->
    <div class="flex justify-center sm:hidden">
      <button
        @click="onPrevPage"
        :disabled="currentPage === 1"
        :class="[
          'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
        ]"
      >
        上一页
      </button>
      <div class="mx-4 flex items-center">
        <span class="text-sm text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
      </div>
      <button
        @click="onNextPage"
        :disabled="currentPage >= totalPages"
        :class="[
          'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
          currentPage >= totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-50',
        ]"
      >
        下一页
      </button>
    </div>

    <!-- 桌面端分页控件 -->
    <div class="hidden sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          显示第 <span class="font-medium">{{ startItem }}</span> 到
          <span class="font-medium">{{ endItem }}</span> 条， 共
          <span class="font-medium">{{ totalItems }}</span> 条结果
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            @click="onPrevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span class="sr-only">上一页</span>
            <ChevronLeft class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="onGoToPage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
              page === currentPage
                ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                : 'text-gray-900 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="onNextPage"
            :disabled="currentPage >= totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            :class="currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''"
          >
            <span class="sr-only">下一页</span>
            <ChevronRight class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:currentPage", "prev", "next", "goTo"]);

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize) || 1; // 至少显示1页
});

const startItem = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems);
});

const displayedPages = computed(() => {
  const range: number[] = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  return range;
});

function onPrevPage() {
  if (props.currentPage > 1) {
    emit("update:currentPage", props.currentPage - 1);
    emit("prev");
  }
}

function onNextPage() {
  if (props.currentPage < totalPages.value) {
    emit("update:currentPage", props.currentPage + 1);
    emit("next");
  }
}

function onGoToPage(page: number) {
  emit("update:currentPage", page);
  emit("goTo", page);
}
</script>
