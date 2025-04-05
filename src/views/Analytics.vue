<script setup lang="ts">
import { onMounted } from "vue";
import {
  dateRange,
  overview,
  testTrendData,
  testDurationData,
  testTypeData,
  topFailedTests,
  loadData,
  areaChartOptions,
  areaSeries,
  barChartOptions,
  barSeries,
  pieChartOptions,
  pieSeries,
  PageLayout,
  PageHeader,
  DashboardCard,
  VueApexCharts,
} from "./Analytics.logic.ts";
// import './Analytics.styles.css' // 无样式，注释掉

onMounted(() => {
  loadData();
});
</script>

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
