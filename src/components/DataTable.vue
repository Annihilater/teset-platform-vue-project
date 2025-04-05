<template>
  <div class="space-y-4">
    <!-- 批量操作栏 -->
    <div
      v-if="selectedItems.length > 0"
      class="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <span class="text-sm text-blue-700"
          >已选择 {{ selectedItems.length }} 个{{ itemName }}</span
        >
        <button @click="clearSelection" class="text-sm text-blue-600 hover:text-blue-800">
          取消选择
        </button>
      </div>
      <div class="flex space-x-2">
        <slot name="batch-actions" :selected-items="selectedItems"></slot>
      </div>
    </div>

    <!-- 表格主体 -->
    <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <thead class="sticky top-0 bg-gray-50">
          <!-- 分页信息行 -->
          <tr>
            <th :colspan="columns.length + 1" class="px-6 py-3">
              <div class="flex items-center justify-between">
                <!-- 分页按钮 -->
                <nav
                  class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150"
                    :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                  >
                    <span class="sr-only">上一页</span>
                    <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 transition-colors duration-150',
                      page === currentPage
                        ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150"
                    :class="
                      currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    "
                  >
                    <span class="sr-only">下一页</span>
                    <ChevronRight class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>

                <!-- 显示条数信息 -->
                <div class="text-sm text-gray-700 text-right">
                  显示第
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  到
                  <span class="font-medium">
                    {{ Math.min(currentPage * pageSize, totalItems) }}
                  </span>
                  条， 共
                  <span class="font-medium">{{ totalItems }}</span> 条结果
                </div>
              </div>
            </th>
          </tr>

          <!-- 表头行 -->
          <tr class="border-b border-gray-200">
            <!-- 选择框列 -->
            <th scope="col" class="relative w-[4%] min-w-[40px]">
              <div class="absolute inset-0 flex items-center justify-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="onSelectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </th>
            <!-- 动态列 -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.width || '',
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap',
                column.align === 'right' ? 'text-right' : 'text-left',
                column.sortable ? 'cursor-pointer select-none' : '',
              ]"
              @click="column.sortable && toggleSort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <component
                  v-if="column.sortable"
                  :is="getSortIconComponent(column)"
                  class="w-4 h-4"
                  :class="{
                    'text-gray-400': getSortIcon(column.key) === 'none',
                    'text-blue-600': getSortIcon(column.key) !== 'none',
                  }"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="sortedItems.length > 0">
            <tr
              v-for="item in paginatedItems"
              :key="getItemKey(item)"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- 选择框 -->
              <td class="relative w-[4%] min-w-[40px]">
                <div class="absolute inset-0 flex items-center justify-center">
                  <input
                    type="checkbox"
                    v-model="selectedItems"
                    :value="getItemKey(item)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </td>
              <!-- 动态单元格 -->
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  column.width || '',
                  'px-6 py-4',
                  column.align === 'right' ? 'text-right' : 'text-left',
                ]"
              >
                <slot :name="column.key" :item="item">
                  {{ item[column.key] }}
                </slot>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td
              :colspan="columns.length + 1"
              class="px-6 py-10 text-center text-gray-500"
            >
              <slot name="empty">
                <div class="flex flex-col items-center">
                  <component :is="emptyIcon" class="w-12 h-12 text-gray-300 mb-2" />
                  <p class="text-gray-500">{{ emptyText }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-vue-next";
import { useTablePagination } from "@/composables/useTablePagination";
import { useTableSelection } from "@/composables/useTableSelection";
import { useTableSorting } from "@/composables/useTableSorting";

export interface Column {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "right";
  sortable?: boolean;
}

interface Props {
  items: any[];
  columns: Column[];
  pageSize?: number;
  currentPage?: number;
  itemKey?: string | ((item: any) => string | number);
  itemName?: string;
  emptyText?: string;
  emptyIcon?: any;
  sortable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  currentPage: 1,
  itemKey: "id",
  itemName: "项",
  emptyText: "暂无数据",
  sortable: false,
});

const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
  (e: "update:selectedItems", items: any[]): void;
  (e: "pageChange", page: number): void;
  (e: "sortChange", key: string, direction: "asc" | "desc" | null): void;
}>();

// 使用分页组合式函数
const {
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  paginatedItems,
  displayedPages,
  prevPage,
  nextPage,
  goToPage,
} = useTablePagination(props.items, {
  pageSize: props.pageSize,
  initialPage: props.currentPage,
});

// 获取项目的唯一标识
const getItemKey = (item: any) => {
  if (typeof props.itemKey === "function") {
    return props.itemKey(item);
  }
  return item[props.itemKey];
};

// 使用选择组合式函数
const {
  selectedItems,
  isAllSelected,
  handleSelectAll,
  clearSelection,
} = useTableSelection(paginatedItems.value, {
  getItemKey,
});

// 使用排序组合式函数
const { sortKey, sortDirection, sortedItems, toggleSort, getSortIcon } = useTableSorting(
  props.items
);

// 监听选中项变化
watch(selectedItems, (newValue) => {
  emit("update:selectedItems", newValue);
});

// 监听页码变化
watch(currentPage, (newValue) => {
  emit("update:currentPage", newValue);
  emit("pageChange", newValue);
});

// 监听排序变化
watch([sortKey, sortDirection], ([key, direction]) => {
  if (key) {
    emit("sortChange", key as string, direction);
  }
});

// 获取排序图标
const getSortIconComponent = (column: Column) => {
  if (!column.sortable) return null;

  const icon = getSortIcon(column.key);
  switch (icon) {
    case "asc":
      return ArrowUp;
    case "desc":
      return ArrowDown;
    default:
      return ArrowUpDown;
  }
};

// 处理全选事件
const onSelectAll = (event: Event) => {
  handleSelectAll((event.target as HTMLInputElement).checked);
};
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
