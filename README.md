# C++ Linked List Tutor

C++ 单链表交互教学软件。项目通过可视化动画、指针标签、代码行高亮和逐步解释，帮助学习常见单链表算法。

本项目由 AI 辅助开发，用于学习和教学。

## 功能

- 反转链表动画
- 插入节点
- 删除节点
- 快慢指针
- 代码高亮
- 指针标签
- 下一步 / 上一步 / 自动播放 / 重置
- 支持 C++ / C / Python 代码切换展示

## 技术栈

- React
- TypeScript
- Vite

## 启动方式

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

如果在 Windows PowerShell 中遇到 `npm.ps1` 执行策略限制，可以使用：

```bash
cmd /c npm run dev
```

启动后打开终端提示的本地地址，通常是：

```text
http://localhost:5173
```

## 构建方式

```bash
npm run build
```

Windows PowerShell 中也可以使用：

```bash
cmd /c npm run build
```

构建产物会输出到 `dist/`。

## 输入链表

在左侧“初始链表”输入框中输入数字，使用空格或逗号分隔：

```text
1 2 3 4 5
```

或：

```text
1,2,3,4,5
```

点击“应用”后，当前算法会使用新的链表重新生成动画步骤。
