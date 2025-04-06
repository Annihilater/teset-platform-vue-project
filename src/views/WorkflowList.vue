<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader
        :title="$t('workflow.list.title')"
        :description="$t('workflow.list.description')"
        :icon="WorkflowIcon"
      >
        <template #actions>
          <div class="flex items-center space-x-4 flex-wrap gap-y-2">
            <div class="flex-1 min-w-[300px]">
              <div class="relative">
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="$t('workflow.list.searchPlaceholder')"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <router-link
              to="/workflow-builder"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 flex-shrink-0"
            >
              <PlusIcon class="w-5 h-5" />
              <span>{{ $t("workflow.list.create") }}</span>
            </router-link>
          </div>
        </template>

        <div class="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg mt-6">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">创建时间：</span>
            <input
              type="date"
              v-model="filterParams.startDate"
              class="border-gray-300 rounded-md text-sm"
            />
            <span class="text-sm text-gray-500">至</span>
            <input
              type="date"
              v-model="filterParams.endDate"
              class="border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </PageHeader>

      <DashboardCard :title="$t('workflow.list.workflows')">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <LoadingSpinner :message="$t('workflow.list.loading')" />
        </div>

        <DataTable
          v-else
          v-model:currentPage="currentPage"
          v-model:selectedItems="selectedWorkflows"
          :items="workflows"
          :columns="columns"
          :page-size="pageSize"
          item-name="工作流"
          :empty-icon="WorkflowIcon"
          :empty-text="$t('workflow.list.empty.description')"
          @page-change="handlePageChange"
        >
          <template #name="{ item }">
            <div class="flex items-center">
              <WorkflowIcon class="w-5 h-5 text-gray-400 mr-2" />
              <div class="text-sm font-medium text-gray-900">
                <span
                  class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                  @click="copyToClipboard(item.name)"
                  title="点击复制"
                  >{{ item.name }}</span
                >
              </div>
            </div>
          </template>

          <template #description="{ item }">
            <div class="text-sm text-gray-500 line-clamp-2">
              <span
                class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                @click="copyToClipboard(item.description)"
                title="点击复制"
                >{{ item.description }}</span
              >
            </div>
          </template>

          <template #createdAt="{ item }">
            <div class="text-sm text-gray-500">{{ formatDate(item.createdAt) }}</div>
          </template>

          <template #updatedAt="{ item }">
            <div class="text-sm text-gray-500">{{ formatDate(item.updatedAt) }}</div>
          </template>

          <template #actions="{ item }">
            <div class="flex justify-end space-x-2">
              <router-link
                :to="`/workflow/${item.id}/edit`"
                class="text-blue-600 hover:text-blue-900"
              >
                {{ $t("workflow.list.actions.edit") }}
              </router-link>
              <button
                @click="deleteWorkflow(item.id)"
                class="text-red-600 hover:text-red-900"
              >
                {{ $t("workflow.list.actions.delete") }}
              </button>
            </div>
          </template>

          <template #batch-actions>
            <button
              @click="handleBatchAction('export')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              导出选中
            </button>
            <button
              @click="handleBatchAction('delete')"
              class="px-3 py-1 text-sm text-red-600 bg-white border border-gray-300 rounded-md hover:bg-red-50"
            >
              批量删除
            </button>
          </template>
        </DataTable>
      </DashboardCard>

      <div
        v-if="copyStatus"
        class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50"
      >
        <component :is="copyStatus.success ? Check : AlertTriangle" class="w-4 h-4" />
        <span>
          {{ copyStatus.success ? "已复制" : "复制失败" }}:
          {{
            copyStatus.text.length > 20
              ? copyStatus.text.substring(0, 20) + "..."
              : copyStatus.text
          }}
        </span>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Workflow as WorkflowIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Filter,
  ChevronDown,
} from "lucide-vue-next";
import {
  fetchWorkflows,
  deleteWorkflow as deleteWorkflowFn,
  formatDate,
  copyToClipboard as copyFn,
  showCopyStatus as showCopyStatusFn,
  handleSelectAll as handleSelectAllFn,
  handleBatchAction as handleBatchActionFn,
} from "./WorkflowList.logic.ts";
import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usePagination } from "@/composables/usePagination";
import DataTable from "@/components/DataTable.vue";
import type { Workflow } from "@/mock/types/workflow";
import type { Column } from "@/components/DataTable.vue";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const loading = ref(false);
const searchQuery = ref("");
const workflows = ref<Workflow[]>([]);
const filterParams = ref({
  startDate: "",
  endDate: "",
});
const selectedWorkflows = ref<string[]>([]);
const copyStatus = ref<{ text: string; success: boolean; timestamp: number } | null>(
  null
);

const {
  currentPage,
  pageSize,
  paginatedItems: paginatedWorkflows,
  totalPages,
  prevPage,
  nextPage,
  displayedPages,
  goToPage,
} = usePagination(workflows, { pageSize: 10 });

const loadData = async () => {
  loading.value = true;
  try {
    workflows.value = await fetchWorkflows();
  } catch (error) {
    toast.error(t("workflow.list.error.fetch"));
  } finally {
    loading.value = false;
  }
};

const deleteWorkflow = async (id: string) => {
  try {
    const success = await deleteWorkflowFn(id);
    if (success) {
      workflows.value = workflows.value.filter((w) => w.id !== id);
      toast.success(t("workflow.list.success.delete"));
    }
  } catch {
    toast.error(t("workflow.list.error.delete"));
  }
};

const copyToClipboard = async (text: string) => {
  const success = await copyFn(text);
  copyStatus.value = showCopyStatusFn(text, success);
  setTimeout(() => {
    if (copyStatus.value?.timestamp === Date.now()) {
      copyStatus.value = null;
    }
  }, 2000);
};

const handleSelectAll = (event: Event) => {
  handleSelectAllFn(event, workflows.value, selectedWorkflows);
};

const handleBatchAction = async (action: "delete" | "export") => {
  try {
    workflows.value = await handleBatchActionFn(
      action,
      selectedWorkflows.value,
      workflows.value
    );
    if (action === "delete") {
      selectedWorkflows.value = [];
      toast.success("批量删除成功");
    } else if (action === "export") {
      toast.success("导出成功");
    }
  } catch {
    toast.error(`批量${action}失败`);
  }
};

const columns: Column[] = [
  { key: "name", title: t("workflow.list.table.name"), width: "w-[20%]" },
  { key: "description", title: t("workflow.list.table.description"), width: "w-[30%]" },
  { key: "createdAt", title: t("workflow.list.table.createdAt"), width: "w-[15%]" },
  { key: "updatedAt", title: t("workflow.list.table.updatedAt"), width: "w-[15%]" },
  {
    key: "actions",
    title: t("workflow.list.table.actions"),
    width: "w-[16%]",
    align: "right",
  },
];

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

onMounted(() => {
  loadData();
});
</script>

<style scoped></style>
