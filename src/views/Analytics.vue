<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="数据分析" description="测试指标的详细洞察">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <button
              :class="[
                'px-3 py-1 rounded-md',
                dateRange === '7d'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
              @click="dateRange = '7d'"
            >
              7天
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md',
                dateRange === '30d'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
              @click="dateRange = '30d'"
            >
              30天
            </button>
            <button
              :class="[
                'px-3 py-1 rounded-md',
                dateRange === '90d'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
              @click="dateRange = '90d'"
            >
              90天
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <Calendar class="w-5 h-5 text-gray-400" />
            <span class="text-sm text-gray-600">2024年3月1日 - 2024年3月7日</span>
          </div>
        </div>
      </PageHeader>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-600">测试总数</p>
              <h3 class="text-2xl font-bold mt-1">{{ overview?.totalTests || 0 }}</h3>
            </div>
            <div class="p-2 rounded-lg bg-green-50">
              <TrendingUp class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="flex items-center mt-4">
            <ArrowUpRight class="w-4 h-4 text-green-500" />
            <span class="text-sm font-medium text-green-600"
              >+{{ overview?.totalIncrease || 0 }}%</span
            >
            <span class="text-sm text-gray-500 ml-1">与上期相比</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-600">通过率</p>
              <h3 class="text-2xl font-bold mt-1">{{ overview?.passRate || 0 }}%</h3>
            </div>
            <div class="p-2 rounded-lg bg-green-50">
              <CheckCircle2 class="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div class="flex items-center mt-4">
            <ArrowUpRight class="w-4 h-4 text-green-500" />
            <span class="text-sm font-medium text-green-600"
              >+{{ overview?.passRateIncrease || 0 }}%</span
            >
            <span class="text-sm text-gray-500 ml-1">与上期相比</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-600">平均耗时</p>
              <h3 class="text-2xl font-bold mt-1">
                {{ overview?.avgDuration || 0 }}分钟
              </h3>
            </div>
            <div class="p-2 rounded-lg bg-red-50">
              <Clock class="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div class="flex items-center mt-4">
            <ArrowDownRight class="w-4 h-4 text-red-500" />
            <span class="text-sm font-medium text-red-600"
              >{{ overview?.durationChange || 0 }}%</span
            >
            <span class="text-sm text-gray-500 ml-1">与上期相比</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-gray-600">失败测试</p>
              <h3 class="text-2xl font-bold mt-1">{{ overview?.failedTests || 0 }}</h3>
            </div>
            <div class="p-2 rounded-lg bg-red-50">
              <XCircle class="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div class="flex items-center mt-4">
            <ArrowDownRight class="w-4 h-4 text-red-500" />
            <span class="text-sm font-medium text-red-600"
              >{{ overview?.failedTestsChange || 0 }}%</span
            >
            <span class="text-sm text-gray-500 ml-1">与上期相比</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <DashboardCard title="测试执行趋势">
          <div class="h-[400px]">
            <VueApexCharts
              type="area"
              height="100%"
              :options="areaChartOptions"
              :series="areaSeries"
            />
          </div>
        </DashboardCard>

        <DashboardCard title="各功能测试耗时">
          <div class="h-[400px]">
            <VueApexCharts
              type="bar"
              height="100%"
              :options="barChartOptions"
              :series="barSeries"
            />
          </div>
        </DashboardCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardCard title="测试类型分布" class="lg:col-span-1">
          <div class="h-[300px]">
            <VueApexCharts
              type="donut"
              height="100%"
              :options="pieChartOptions"
              :series="pieSeries"
            />
          </div>
        </DashboardCard>

        <DashboardCard title="最常失败的测试" class="lg:col-span-2">
          <div class="space-y-4">
            <div
              v-for="(test, index) in topFailedTests"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ test.name }}</h4>
                <p class="text-sm text-gray-500">失败 {{ test.count }} 次</p>
              </div>
              <ArrowUpRight v-if="test.increase" class="w-5 h-5 text-red-500" />
              <ArrowDownRight v-else class="w-5 h-5 text-green-500" />
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
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

const dateRange = ref("7d");
const overview = ref<AnalyticsOverview | null>(null);
const testTrendData = ref<TestTrendData[]>([]);
const testDurationData = ref<TestDurationData[]>([]);
const testTypeData = ref<TestTypeData[]>([]);
const topFailedTests = ref<FailedTestData[]>([]);

// 加载数据
const loadData = async () => {
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
const areaChartOptions = computed(() => ({
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

const areaSeries = computed(() => [
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
const barChartOptions = computed(() => ({
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

const barSeries = computed(() => [
  {
    name: "耗时（分钟）",
    data: testDurationData.value.map((item) => item.duration),
  },
]);

// 饼图配置
const pieChartOptions = computed(() => ({
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

const pieSeries = computed(() => testTypeData.value.map((item) => item.value));
</script>
