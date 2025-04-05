# 测试平台工作流编辑器

## 项目概述

测试平台工作流编辑器是一个基于Vue 3和Vue Flow开发的可视化工作流编排系统。该系统允许用户通过直观的图形界面创建、编辑和管理复杂的工作流，支持工作流的设计、调试、执行和版本管理。

## 功能特性

- **可视化工作流编辑**：拖拽式节点创建和连接，直观设计工作流
- **多种节点类型**：支持控制流节点、AI模型节点、数据处理节点、工具节点和集成节点
- **实时预览与调试**：在设计过程中实时预览和调试工作流
- **版本管理**：支持工作流的版本控制和历史记录查看
- **DSL导入导出**：支持将工作流导出为DSL格式，方便迁移和共享
- **响应式设计**：适配不同屏幕尺寸的设备
- **主题切换**：支持明暗主题切换
- **丰富的交互功能**：支持撤销/重做、节点调整、右键菜单等

## 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0 或 pnpm >= 7.0.0

### 安装依赖

```bash
# 使用npm
npm install

# 使用yarn
yarn install

# 使用pnpm
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
# 构建生产版本
npm run build
```

### 预览生产版本

```bash
# 预览构建后的应用
npm run preview
```

## 项目结构

```
src/
├── assets/               # 静态资源
├── components/           # 全局通用组件
│   ├── common/           # 基础通用组件
│   └── workflow/         # 工作流相关组件
│       ├── nodes/        # 节点组件
│       │   ├── ai_models/      # AI模型节点
│       │   ├── control_flow/   # 控制流节点
│       │   ├── data_processing/ # 数据处理节点
│       │   ├── integrations/   # 集成节点
│       │   └── tools/          # 工具节点
│       ├── panels/       # 面板组件
│       └── utils/        # 工作流工具函数
├── composables/          # 可复用的组合式函数
├── config/               # 配置文件
├── constants/            # 常量定义
├── layouts/              # 布局组件
├── router/               # 路由配置
├── stores/               # 状态管理
├── styles/               # 全局样式
├── types/                # TypeScript类型定义
├── utils/                # 通用工具函数
└── views/                # 页面组件
```

## 技术栈

- **核心框架**：Vue 3 (Composition API)
- **状态管理**：Pinia
- **流程图**：Vue Flow (@vue-flow/core)
- **UI组件**：自定义组件 + 图标库
- **样式**：SCSS + TailwindCSS
- **构建工具**：Vite
- **语言**：TypeScript
- **工具库**：
  - uuid：生成唯一ID
  - date-fns：日期处理
  - vue-i18n：国际化
  - vue-router：路由管理
  - vue-toastification：通知提示

  

## 主要组件

- **WorkflowEditor.vue**：工作流编辑器主组件
- **BaseNode.vue**：基础节点组件
- **NodeHandle.vue**：节点连接点组件
- **ConnectionLine.vue**：连接线组件
- **AnimatedEdge.vue**：动画边缘组件

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 代码规范

- 遵循Vue 3组件设计最佳实践
- 使用TypeScript强类型
- 组件使用SFC格式，复杂逻辑可拆分到独立文件
- 使用ESLint和Prettier进行代码格式化

## 许可证

MIT
