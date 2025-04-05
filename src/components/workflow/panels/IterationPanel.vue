<template>
  <div class="iteration-panel">
    <div class="panel-section">
      <div class="section-title">迭代设置</div>
      
      <div class="form-item">
        <div class="form-label">输入来源</div>
        <a-select v-model:value="config.inputType" style="width: 100%">
          <a-select-option value="variable">变量引用</a-select-option>
          <a-select-option value="range">数值范围</a-select-option>
          <a-select-option value="direct">直接输入</a-select-option>
        </a-select>
      </div>

      <!-- 变量引用输入 -->
      <div v-if="config.inputType === 'variable'" class="form-item">
        <div class="form-label">变量名称</div>
        <a-input v-model:value="config.variableName" placeholder="输入变量名" />
        <div class="form-description">该变量应包含一个数组</div>
      </div>

      <!-- 数值范围输入 -->
      <div v-if="config.inputType === 'range'" class="form-item range-inputs">
        <div class="form-label">范围设置</div>
        <div class="range-container">
          <a-input-number v-model:value="config.rangeStart" placeholder="起始值" />
          <span>至</span>
          <a-input-number v-model:value="config.rangeEnd" placeholder="结束值" />
          <span>步长</span>
          <a-input-number v-model:value="config.rangeStep" placeholder="步长" :min="1" />
        </div>
        <div class="form-description">
          将生成从 {{ config.rangeStart || '?' }} 到 {{ config.rangeEnd || '?' }} 
          步长为 {{ config.rangeStep || '1' }} 的数字列表
        </div>
      </div>

      <!-- 直接输入列表 -->
      <div v-if="config.inputType === 'direct'" class="form-item">
        <div class="form-label">列表项</div>
        <div class="input-list">
          <div v-for="(item, index) in config.items" :key="index" class="list-item">
            <a-input v-model:value="config.items[index]" placeholder="列表项值" />
            <a-button type="text" danger @click="removeItem(index)">
              删除
            </a-button>
          </div>
          <a-button type="dashed" block @click="addItem">
            添加列表项
          </a-button>
        </div>
      </div>

      <div class="form-item">
        <div class="form-label">迭代变量名</div>
        <a-input v-model:value="config.iterationVarName" placeholder="如：item" />
        <div class="form-description">在后续节点中可通过该变量名引用当前迭代的项</div>
      </div>

      <div class="form-item">
        <div class="form-label">索引变量名</div>
        <a-input v-model:value="config.indexVarName" placeholder="如：index" />
        <div class="form-description">在后续节点中可通过该变量名引用当前迭代的索引</div>
      </div>

      <div class="form-item">
        <a-checkbox v-model:checked="config.collectResults">收集迭代结果</a-checkbox>
        <div v-if="config.collectResults" class="result-var-input">
          <div class="form-label">结果变量名</div>
          <a-input v-model:value="config.resultVarName" placeholder="如：results" />
          <div class="form-description">
            每次迭代的返回值将被收集到该数组中
          </div>
        </div>
      </div>
    </div>

    <a-collapse class="advanced-options">
      <a-collapse-panel key="1" header="高级选项">
        <div class="form-item">
          <a-checkbox v-model:checked="config.parallelExecution">启用并行执行</a-checkbox>
          <div v-if="config.parallelExecution" class="indented-option">
            <div class="form-label">最大并行数</div>
            <a-input-number v-model:value="config.maxParallel" :min="1" :max="20" />
          </div>
        </div>

        <div class="form-item">
          <a-checkbox v-model:checked="config.breakOnError">遇错中断</a-checkbox>
          <div class="form-description">
            如果选中，任何迭代出错将中断整个循环；否则将继续执行其余迭代
          </div>
        </div>

        <div class="form-item">
          <a-checkbox v-model:checked="config.enableFilter">启用条件过滤</a-checkbox>
          <div v-if="config.enableFilter" class="indented-option">
            <div class="form-label">过滤条件（JavaScript表达式）</div>
            <a-input v-model:value="config.filterCondition" placeholder="如：item > 10" />
            <div class="form-description">
              可使用 item 和 index 变量来构建过滤条件
            </div>
          </div>
        </div>

        <div class="form-item">
          <a-checkbox v-model:checked="config.enableTimeout">启用超时控制</a-checkbox>
          <div v-if="config.enableTimeout" class="indented-option">
            <div class="form-label">超时时间（毫秒）</div>
            <a-input-number v-model:value="config.timeout" :min="1000" :step="1000" />
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';

interface Props {
  nodeConfig: {
    inputType?: string;
    variableName?: string;
    rangeStart?: number;
    rangeEnd?: number;
    rangeStep?: number;
    items?: string[];
    iterationVarName?: string;
    indexVarName?: string;
    collectResults?: boolean;
    resultVarName?: string;
    parallelExecution?: boolean;
    maxParallel?: number;
    breakOnError?: boolean;
    enableFilter?: boolean;
    filterCondition?: string;
    enableTimeout?: boolean;
    timeout?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  nodeConfig: () => ({})
});

const emit = defineEmits(['update:nodeConfig']);

// 初始化配置
const config = ref({
  inputType: props.nodeConfig.inputType || 'variable',
  variableName: props.nodeConfig.variableName || '',
  rangeStart: props.nodeConfig.rangeStart || 0,
  rangeEnd: props.nodeConfig.rangeEnd || 10,
  rangeStep: props.nodeConfig.rangeStep || 1,
  items: props.nodeConfig.items || [''],
  iterationVarName: props.nodeConfig.iterationVarName || 'item',
  indexVarName: props.nodeConfig.indexVarName || 'index',
  collectResults: props.nodeConfig.collectResults !== undefined ? props.nodeConfig.collectResults : true,
  resultVarName: props.nodeConfig.resultVarName || 'results',
  parallelExecution: props.nodeConfig.parallelExecution || false,
  maxParallel: props.nodeConfig.maxParallel || 4,
  breakOnError: props.nodeConfig.breakOnError !== undefined ? props.nodeConfig.breakOnError : true,
  enableFilter: props.nodeConfig.enableFilter || false,
  filterCondition: props.nodeConfig.filterCondition || '',
  enableTimeout: props.nodeConfig.enableTimeout || false,
  timeout: props.nodeConfig.timeout || 30000,
});

// 监听配置变更并更新
watch(config, (newValue) => {
  emit('update:nodeConfig', newValue);
}, { deep: true });

// 添加列表项
const addItem = () => {
  config.value.items.push('');
};

// 删除列表项
const removeItem = (index: number) => {
  config.value.items.splice(index, 1);
  if (config.value.items.length === 0) {
    config.value.items.push('');
  }
};

// 监听父组件传入的配置变更
watchEffect(() => {
  // 确保配置同步
  if (props.nodeConfig && Object.keys(props.nodeConfig).length > 0) {
    if (props.nodeConfig.inputType) config.value.inputType = props.nodeConfig.inputType;
    if (props.nodeConfig.variableName) config.value.variableName = props.nodeConfig.variableName;
    if (props.nodeConfig.rangeStart !== undefined) config.value.rangeStart = props.nodeConfig.rangeStart;
    if (props.nodeConfig.rangeEnd !== undefined) config.value.rangeEnd = props.nodeConfig.rangeEnd;
    if (props.nodeConfig.rangeStep !== undefined) config.value.rangeStep = props.nodeConfig.rangeStep;
    if (props.nodeConfig.items) config.value.items = [...props.nodeConfig.items];
    if (props.nodeConfig.iterationVarName) config.value.iterationVarName = props.nodeConfig.iterationVarName;
    if (props.nodeConfig.indexVarName) config.value.indexVarName = props.nodeConfig.indexVarName;
    if (props.nodeConfig.collectResults !== undefined) config.value.collectResults = props.nodeConfig.collectResults;
    if (props.nodeConfig.resultVarName) config.value.resultVarName = props.nodeConfig.resultVarName;
    if (props.nodeConfig.parallelExecution !== undefined) config.value.parallelExecution = props.nodeConfig.parallelExecution;
    if (props.nodeConfig.maxParallel !== undefined) config.value.maxParallel = props.nodeConfig.maxParallel;
    if (props.nodeConfig.breakOnError !== undefined) config.value.breakOnError = props.nodeConfig.breakOnError;
    if (props.nodeConfig.enableFilter !== undefined) config.value.enableFilter = props.nodeConfig.enableFilter;
    if (props.nodeConfig.filterCondition) config.value.filterCondition = props.nodeConfig.filterCondition;
    if (props.nodeConfig.enableTimeout !== undefined) config.value.enableTimeout = props.nodeConfig.enableTimeout;
    if (props.nodeConfig.timeout !== undefined) config.value.timeout = props.nodeConfig.timeout;
  }
});
</script>

<style scoped>
.iteration-panel {
  padding: 16px;
}

.panel-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 16px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 500;
}

.form-description {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

.input-list .list-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.input-list .list-item .ant-input {
  flex: 1;
  margin-right: 8px;
}

.result-var-input {
  margin-top: 12px;
  padding-left: 24px;
}

.range-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indented-option {
  margin-top: 8px;
  padding-left: 24px;
}

.advanced-options {
  margin-top: 16px;
}
</style> 