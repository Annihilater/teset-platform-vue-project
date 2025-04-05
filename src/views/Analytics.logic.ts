import { ref, onMounted, watch, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import PageLayout from "@/components/layout/PageLayout.vue";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import { AnalyticsService } from "@/mock/services/analytics";
import type {
  TestTrendData,
  TestDurationData,
  TestTypeData,
  FailedTestData,
  AnalyticsOverview,
} from "@/mock/types/analytics";

export const dateRange = ref("7d");
export const overview = ref<AnalyticsOverview | null>(null);
export const testTrendData = ref<TestTrendData[]>([]);
export const testDurationData = ref<TestDurationData[]>([]);
export const testTypeData = ref<TestTypeData[]>([]);
export const topFailedTests = ref<FailedTestData[]>([]);

// 加载数据
export const loadData = async () => {
  try {
    // 并行加载所有数据
    const [
      overviewData,
      trendData,
      durationData,
      typeData,
      failedData,
    ] = await Promise.all([
      AnalyticsService.getOverview(),
      AnalyticsService.getTrendData(dateRange.value as "7d" | "30d" | "90d"),
      AnalyticsService.getDurationData(),
      AnalyticsService.getTypeData(),
      AnalyticsService.getTopFailedTests(),
    ]);

    overview.value = overviewData;
    testTrendData.value = trendData;
    testDurationData.value = durationData;
    testTypeData.value = typeData;
    topFailedTests.value = failedData;
  } catch (error) {
    console.error("加载分析数据失败:", error);
  }
};

// 监听日期范围变化
watch(dateRange, async (newRange) => {
  const trendData = await AnalyticsService.getTrendData(newRange as "7d" | "30d" | "90d");
  testTrendData.value = trendData;
});

// 初始加载数据
onMounted(() => {
  loadData();
});

// 区域图配置
export const areaChartOptions = computed(() => ({
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    categories: testTrendData.value.map((item) => item.date),
  },
  colors: ["#10B981", "#EF4444"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  tooltip: {
    shared: true,
  },
}));

export const areaSeries = computed(() => [
  {
    name: "通过",
    data: testTrendData.value.map((item) => item.passed),
  },
  {
    name: "失败",
    data: testTrendData.value.map((item) => item.failed),
  },
]);

// 柱状图配置
export const barChartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: testDurationData.value.map((item) => item.name),
  },
  colors: ["#3B82F6"],
}));

export const barSeries = computed(() => [
  {
    name: "耗时（分钟）",
    data: testDurationData.value.map((item) => item.duration),
  },
]);

// 饼图配置
export const pieChartOptions = computed(() => ({
  chart: {
    type: "donut",
  },
  labels: testTypeData.value.map((item) => item.name),
  colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
  legend: {
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "50%",
      },
    },
  },
}));

export const pieSeries = computed(() => testTypeData.value.map((item) => item.value));

// 导出组件，以便在 .vue 文件中导入
export { PageLayout, PageHeader, DashboardCard, VueApexCharts };
