# 工作流节点组件

本目录包含工作流编辑器中所有节点相关的组件和工具。节点组件遵循组合式设计，通过基础组件和逻辑分离实现高度复用。

## 文件结构与依赖关系

整个节点系统采用三层架构设计：

```
├── 基础组件层（BaseNode + NodeHandle + useNodeFactory）
│
└── 节点类型层（分类目录下的各种节点类型组件）
    ├── control_flow/    # 控制流节点
    │   ├── StartNode/           # 节点组件子目录 
    │   │   ├── StartNode.vue    # 组件主文件
    │   │   ├── StartNode.logic.ts    # 业务逻辑
    │   │   └── StartNode.styles.scss # 样式文件
    │   ├── EndNode/             # 节点组件子目录
    │   └── ...                  # 其他控制流节点
    ├── ai_models/       # AI模型节点
    ├── data_processing/ # 数据处理节点
    ├── tools/           # 工具节点
    └── integrations/    # 集成节点
```

### 节点分类

节点按照功能和用途被分为以下几类：

1. **控制流节点** (control_flow)
   - 控制工作流执行路径和逻辑的节点
   - 包括：StartNode, EndNode, ConditionNode, LoopNode

2. **AI模型节点** (ai_models)
   - 涉及AI模型调用和处理的节点
   - 包括：LLMNode, AgentNode, QuestionClassifierNode

3. **数据处理节点** (data_processing)
   - 处理、转换和管理数据的节点
   - 包括：AnswerNode, TemplateTransformNode, VariableAggregatorNode等

4. **工具节点** (tools)
   - 提供特定功能工具的节点
   - 包括：CodeExecutionNode

5. **集成节点** (integrations)
   - 与外部系统集成的节点
   - 包括：KnowledgeRetrievalNode, HttpRequestNode

### 核心依赖关系

- 所有节点类型组件 → 依赖 → BaseNode.vue (UI容器)
- 所有节点类型组件 → 依赖 → NodeHandle.vue (连接点)
- 所有节点类型组件 → 依赖 → useNodeFactory.ts (通用逻辑)

## 节点组件拆分模式

所有节点组件现在均采用三文件拆分模式，以实现关注点分离和更好的代码组织：

```
└── 节点名称/
    ├── 节点名称.vue         # 主组件文件（模板和组件定义）
    ├── 节点名称.logic.ts    # 业务逻辑文件（状态和方法）
    └── 节点名称.styles.scss # 样式文件（组件样式定义）
```

### 文件职责划分

1. **节点名称.vue**:
   - 定义组件模板
   - 导入和组装逻辑与样式
   - 定义组件接口(props/events)
   - 不直接包含复杂逻辑和样式

2. **节点名称.logic.ts**:
   - 包含所有业务逻辑
   - 定义和管理组件状态
   - 使用useNodeFactory桥接UI和业务逻辑
   - 处理与父组件和全局状态的交互

3. **节点名称.styles.scss**:
   - 包含所有组件样式
   - 定义组件主题样式和变体
   - 处理不同状态的视觉效果

## 基础组件

### BaseNode.vue
- **用途**：节点的通用UI容器组件
- **特点**：
  - 提供统一的节点布局结构（标题栏、内容区、操作按钮）
  - 处理基础节点交互（点击、拖拽等UI事件）
  - 通过事件向上传递用户交互（@click、@delete等）
  - 提供插槽系统，便于扩展节点内容和操作
  - 定义通用样式，保证UI一致性
- **依赖关系**：
  - 不直接依赖业务逻辑，纯UI组件
  - 通过事件机制与业务逻辑通信
- **最新更新**：
  - 移除了直接的workflowStore依赖
  - 增加了自定义事件机制，实现UI和业务逻辑解耦

### NodeHandle.vue
- **用途**：节点连接点组件
- **特点**：
  - 符合Vue Flow的连接点规范
  - 提供连接状态视觉反馈
  - 处理连接相关的交互逻辑
  - 支持自定义位置（左、右、上、下）
- **依赖关系**：不依赖其他组件，被所有需要连接点的节点类型组件引用
- **实现细节**：
  - 使用HTML元素模拟Vue Flow的连接点
  - 通过data属性提供连接点信息
  - 全局监听鼠标事件处理连接状态

### useNodeFactory.ts
- **用途**：节点逻辑复用Hook
- **特点**：
  - 使用Vue Composition API
  - 提供节点通用逻辑方法和UI事件处理器
  - 封装与工作流状态管理的交互
  - 作为UI组件和业务逻辑的桥接层
- **依赖关系**：
  - 依赖全局状态管理器workflowStore
  - 被所有节点类型组件引用
- **导出函数**：
  - 业务逻辑方法：
    - selectNode：选中节点
    - deleteNode：删除节点
    - duplicateNode：复制节点
  - UI事件处理桥接方法：
    - handleNodeClick：处理节点点击事件
    - handleDeleteClick：处理节点删除事件
- **最新更新**：
  - 增加了事件处理桥接方法，实现UI和业务逻辑解耦
  - 集中管理与workflowStore的交互逻辑

### NodeWrapper.vue
- **用途**：旧版本的节点容器组件（已废弃）
- **特点**：
  - 提供基础节点结构和样式
  - 已被BaseNode完全替代
- **依赖关系**：不依赖其他组件，已不推荐使用
- **迁移状态**：
  - 所有节点组件已完成从NodeWrapper到BaseNode的迁移
  - 该组件将在下一版本移除

## 节点类型组件

### 控制流节点 (control_flow/)

#### StartNode
- **用途**：工作流起始节点
- **特点**：
  - 只有输出连接点，无输入
  - 紫色主题样式
  - 定义工作流的全局变量和参数
- **文件结构**：
  - `StartNode.vue` - 主组件文件
  - `StartNode.logic.ts` - 业务逻辑文件
  - `StartNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个source类型连接点（右侧）

#### EndNode
- **用途**：工作流结束节点
- **特点**：
  - 只有输入连接点，无输出
  - 红色主题样式
  - 标志工作流的结束
- **文件结构**：
  - `EndNode.vue` - 主组件文件
  - `EndNode.logic.ts` - 业务逻辑文件
  - `EndNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）

#### ConditionNode
- **用途**：条件分支节点
- **特点**：
  - 支持多分支条件判断
  - 黄色主题样式
  - 通过条件动态决定执行路径
- **文件结构**：
  - `ConditionNode.vue` - 主组件文件
  - `ConditionNode.logic.ts` - 业务逻辑文件
  - `ConditionNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 多个source类型连接点（右侧，数量由条件分支决定）
- **业务逻辑**：
  - 动态计算多个输出连接点位置

#### LoopNode
- **用途**：循环/迭代节点
- **特点**：
  - 配置循环条件和迭代逻辑
  - 红色主题样式
  - 循环执行特定工作流部分
- **文件结构**：
  - `LoopNode.vue` - 主组件文件
  - `LoopNode.logic.ts` - 业务逻辑文件
  - `LoopNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

### AI模型节点 (ai_models/)

#### LLMNode
- **用途**：大语言模型节点
- **特点**：
  - 配置LLM提示词和参数
  - 蓝色主题样式
  - 支持输入和输出连接
- **文件结构**：
  - `LLMNode.vue` - 主组件文件
  - `LLMNode.logic.ts` - 业务逻辑文件
  - `LLMNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

#### AgentNode
- **用途**：智能代理节点
- **特点**：
  - 配置不同类型的Agent
  - 蓝色主题样式
  - 支持复杂的工具调用和决策逻辑
- **文件结构**：
  - `AgentNode.vue` - 主组件文件
  - `AgentNode.logic.ts` - 业务逻辑文件
  - `AgentNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

### 数据处理节点 (data_processing/)

#### AnswerNode
- **用途**：回答/流转节点
- **特点**：
  - 定义系统回复内容
  - 绿色主题样式
  - 支持多个输出连接点
- **文件结构**：
  - `AnswerNode.vue` - 主组件文件
  - `AnswerNode.logic.ts` - 业务逻辑文件
  - `AnswerNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 多个source类型连接点（右侧，数量由回复选项决定）
- **业务逻辑**：
  - 支持添加多个回复选项
  - 每个回复选项对应一个输出连接点

### 工具节点 (tools/)

#### CodeExecutionNode
- **用途**：代码执行节点
- **特点**：
  - 支持多种编程语言
  - 执行自定义代码逻辑
  - 处理代码执行结果
- **文件结构**：
  - `CodeExecutionNode.vue` - 主组件文件
  - `CodeExecutionNode.logic.ts` - 业务逻辑文件
  - `CodeExecutionNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

### 集成节点 (integrations/)

#### KnowledgeRetrievalNode
- **用途**：知识库检索节点
- **特点**：
  - 配置检索参数和知识库
  - 绿色主题样式
  - 提供检索结果作为上下文
- **文件结构**：
  - `KnowledgeRetrievalNode.vue` - 主组件文件
  - `KnowledgeRetrievalNode.logic.ts` - 业务逻辑文件
  - `KnowledgeRetrievalNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

#### HttpRequestNode
- **用途**：HTTP请求节点
- **特点**：
  - 配置API调用参数
  - 支持多种HTTP方法
  - 处理请求响应数据
  - 粉色主题样式
- **文件结构**：
  - `HttpRequestNode.vue` - 主组件文件
  - `HttpRequestNode.logic.ts` - 业务逻辑文件
  - `HttpRequestNode.styles.scss` - 样式文件
- **连接点配置**：
  - 1个target类型连接点（左侧）
  - 1个source类型连接点（右侧）

## 组件架构设计优势

1. **分离关注点**
   - UI展示 (.vue) → 负责节点外观和模板
   - 业务逻辑 (.logic.ts) → 负责节点状态和行为
   - 样式 (.styles.scss) → 负责节点外观样式

2. **代码复用**
   - 避免重复UI模板和样式代码
   - 逻辑代码可以被复用和单独测试
   - 开发者可以专注于特定部分

3. **一致性保证**
   - 所有节点遵循相同的结构模式
   - 统一的逻辑处理和样式应用方式
   - 便于理解和维护

4. **可扩展性**
   - 新增节点类型只需按照统一模式创建三个文件
   - 变更一个方面不影响其他方面
   - 更容易进行局部更新和优化
   
5. **团队协作**
   - UI设计师可以专注于样式文件
   - 前端逻辑开发者可以专注于逻辑文件
   - 减少代码冲突和依赖问题

## 最新架构设计要点

### 三文件拆分模式
每个节点组件拆分为三个独立文件：主组件文件(.vue)、逻辑文件(.logic.ts)和样式文件(.styles.scss)，实现关注点分离。

### 事件驱动设计
BaseNode组件通过触发事件（@click、@delete等）将用户交互传递给父组件，而不是直接调用业务逻辑。

### 业务逻辑桥接
useNodeFactory提供桥接方法，连接UI事件和实际业务逻辑，在逻辑文件中使用。

### 依赖反转
全局状态管理依赖被集中到逻辑文件中，使得组件文件不再直接依赖全局状态。

### 统一导入/导出
所有目录都有index.ts文件，负责统一导出组件，简化外部引用。

## 使用示例

### 新版使用模式（推荐）

```vue
<!-- YourComponent.vue -->
<template>
  <div>
    <StartNode
      :id="nodeId"
      :data="nodeData"
      :selected="isSelected"
    />
  </div>
</template>

<script setup>
// 推荐从统一导出文件导入
import { StartNode } from '@/components/workflow/nodes/control_flow';

// 也可以直接导入特定节点(但路径更长)
// import StartNode from '@/components/workflow/nodes/control_flow/StartNode/StartNode.vue';
</script>
```

### 创建新节点的步骤

1. 创建节点目录结构:
```
my_nodes/
└── MyCustomNode/
    ├── MyCustomNode.vue
    ├── MyCustomNode.logic.ts
    └── MyCustomNode.styles.scss
```

2. 实现逻辑文件 (MyCustomNode.logic.ts):
```typescript
import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export function useMyCustomNodeLogic(props) {
  // 获取通用方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);
  
  // 实现节点特有逻辑
  const mySpecialValue = computed(() => props.data.config?.value || "默认值");
  
  return {
    handleNodeClick,
    handleDeleteClick,
    mySpecialValue
  };
}
```

3. 实现样式文件 (MyCustomNode.styles.scss):
```scss
.my-custom-node-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.base-node) {
  background-color: #f0f9ff;
  border-color: #bae6fd;
}

:deep(.node-title) {
  color: #0369a1;
}
```

4. 实现主组件文件 (MyCustomNode.vue):
```vue
<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="my-custom-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="my-custom-node-content">
      {{ mySpecialValue }}
    </div>

    <template #handles>
      <NodeHandle :handleId="`target-${id}`" type="target" position="left" />
      <NodeHandle :handleId="`source-${id}`" type="source" position="right" />
    </template>
  </BaseNode>
</template>

<script setup>
import BaseNode from "@/components/workflow/nodes/BaseNode.vue";
import NodeHandle from "@/components/workflow/nodes/NodeHandle.vue";
import { useMyCustomNodeLogic } from "./MyCustomNode.logic";
import "./MyCustomNode.styles.scss";

const props = defineProps({
  id: String,
  data: Object,
  selected: Boolean 
});

// 使用节点特有逻辑
const { handleNodeClick, handleDeleteClick, mySpecialValue } = useMyCustomNodeLogic(props);
</script>
```

5. 更新导出文件 (my_nodes/index.ts):
```typescript
import MyCustomNode from './MyCustomNode/MyCustomNode.vue';

export {
  MyCustomNode
};

export default {
  MyCustomNode
};
```

## 导入路径说明

**旧导入方式:**
```typescript
import StartNode from "@/components/workflow/nodes/control_flow/StartNode.vue";
```

**新导入方式:**
```typescript
// 方式1: 通过index.ts统一导入(推荐)
import { StartNode } from "@/components/workflow/nodes/control_flow";

// 方式2: 直接导入组件文件(完整路径)
import StartNode from "@/components/workflow/nodes/control_flow/StartNode/StartNode.vue";
```

**注意:** 推荐优先使用方式1通过index.ts导入，这样在组件位置变更时，只需要更新index.ts文件，不会影响使用方的代码。
