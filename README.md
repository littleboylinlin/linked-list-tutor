# Linked List Tutor

单链表交互教学软件。项目通过可视化动画、指针标签、代码行高亮和逐步解释，帮助学习常见单链表算法。

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

需要 Node.js 20.19+ 或 22.12+。

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

也可以按 Enter 应用。输入最多保留 9 个有效数字；没有有效数字时使用默认示例。

## 代码组织

- `src/algorithms/`：生成独立的节点、指针、箭头和说明快照；`parameters.ts` 集中保存参数默认值和整数归一化。
- `src/hooks/useTutorInputs.ts`：管理输入草稿、已应用链表和算法参数。
- `src/hooks/useStepPlayback.ts`：管理时间轴、自动播放计时与清理。
- `src/playback/`：纯播放状态转换和速度设置。
- `src/components/`：侧栏、参数、速度、画布、代码与步骤控制。

切换算法、应用链表或修改参数时，动画立即回到第一步并暂停。手动切步暂停自动播放；K 大于链表长度时保持原样，K=1 时顺序不变。

## 回归检查

```bash
npm ci
npm test
npm run build
```

测试覆盖八种算法的节点和指针有效性、几何坐标、三种语言的代码高亮映射、空链表与单节点、删除后的节点清理、不同 K 值以及环入口。播放状态测试覆盖手动暂停、结尾停止和空时间轴。
