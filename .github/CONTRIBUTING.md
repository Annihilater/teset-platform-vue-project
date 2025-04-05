# 贡献指南

感谢您对测试平台工作流编辑器项目的关注！我们欢迎各种形式的贡献，包括但不限于提交 bug 报告、功能请求、文档改进和代码贡献。

## 开始贡献

以下是贡献此项目的基本步骤：

1. **Fork 仓库**：通过 GitHub 上的 Fork 按钮创建仓库的副本到您的账户。

2. **克隆仓库**：将您的 fork 克隆到本地。
   ```bash
   git clone https://github.com/您的用户名/teset-platform-vue-project.git
   cd teset-platform-vue-project
   ```

3. **创建新分支**：为您的贡献创建一个新分支。
   ```bash
   git checkout -b feature/amazing-feature
   # 或者
   git checkout -b fix/bug-fix
   ```

4. **进行更改**：进行您想要的更改。

5. **提交更改**：将您的更改提交到您的分支。
   ```bash
   git add .
   git commit -m "Fix: 修复某个问题" # 遵循提交消息约定
   ```

6. **推送更改**：将更改推送到您的 fork。
   ```bash
   git push origin feature/amazing-feature
   ```

7. **创建 Pull Request**：在 GitHub 上从您的 fork 创建一个 Pull Request 到主仓库。

## 提交消息约定

我们遵循以下提交消息格式：

```
类型: 简短描述（小于50个字符）

详细描述（可选，换行后写）
```

提交类型：
- **Fix**：修复代码中的错误、缺陷或漏洞
- **Feature**：添加新的功能、模块或文件
- **Refactor**：对现有代码进行重构，改善结构、性能或可读性
- **Optimize**：优化代码、算法或性能方面的改进
- **Documentation**：更新或添加文档内容

例如：
```
Fix: 修复登录页面的样式问题

修复在移动设备上登录按钮被遮挡的问题
```

## 开发规范

### 前提条件

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0 或 pnpm >= 7.0.0

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 代码风格

- 遵循 Vue 3 组件设计最佳实践
- 使用 TypeScript 编写代码
- 组件使用 SFC (Single File Component) 格式
- 复杂逻辑可拆分到独立文件
- 遵循项目现有的代码风格和目录结构

### 测试

在提交 PR 前，请确保您的代码通过所有测试：

```bash
npm run test
# 或
yarn test
# 或
pnpm test
```

## 问题和功能请求

- 使用 GitHub Issues 提交 bug 报告和功能请求
- 在创建新 issue 之前，请先搜索现有 issue 以避免重复
- 使用提供的 issue 模板填写必要信息

## 代码审查

所有提交将会经过代码审查过程：

1. 提交将由维护者审查
2. 可能会要求进行更改
3. 一旦批准，您的代码将被合并到主分支中

## 许可

通过向本项目贡献，您同意您的贡献将在项目的许可条款下发布。 