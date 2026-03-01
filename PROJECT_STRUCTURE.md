# LexiNote 项目结构报告（Next.js）

> 目标：帮助你快速理解这个 Next.js（App Router）项目每个目录和文件的作用。

## 1. 项目结构总览

```text
LexiNote/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .gitignore
├── eslint.config.mjs
├── LICENSE
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

另外你本地还有两个常见目录：

- `.next/`：Next.js 构建与开发缓存产物目录（自动生成，不提交）
- `node_modules/`：依赖安装目录（自动生成，不提交）

---

## 2. 根目录文件说明

### `package.json`

项目清单与脚本入口：

- `scripts.dev`: `next dev`，本地开发服务器
- `scripts.build`: `next build`，生产构建
- `scripts.start`: `next start`，运行生产构建产物
- `scripts.lint`: `eslint`，代码检查
- `dependencies`: 运行时依赖（`next`、`react`、`react-dom`）
- `devDependencies`: 开发依赖（TypeScript、ESLint、Tailwind/PostCSS 等）

### `package-lock.json`

NPM 的锁定文件，固定依赖版本树，确保不同机器安装结果一致。

### `next.config.ts`

Next.js 主配置文件。目前是默认空配置对象：

- 你未来可在这里配置图片域名、重写/重定向、实验特性等

### `tsconfig.json`

TypeScript 编译配置：

- `strict: true`：启用严格类型检查
- `noEmit: true`：不由 TypeScript 输出 JS，交给 Next.js 构建链路
- `paths` 中 `@/* -> ./*`：支持 `@/` 别名导入
- `plugins: [{ name: "next" }]`：Next.js TypeScript 插件支持

### `next-env.d.ts`

Next.js 自动生成的类型声明入口，给 TS 注入 Next 相关类型；通常不手动编辑。

### `eslint.config.mjs`

ESLint 配置：

- 引入 `eslint-config-next/core-web-vitals`（包含性能与最佳实践规则）
- 引入 `eslint-config-next/typescript`
- 配置忽略目录（`.next`、`out`、`build` 等）

### `postcss.config.mjs`

PostCSS 配置，注册 `@tailwindcss/postcss` 插件，支撑 Tailwind v4 的样式处理。

### `.gitignore`

Git 忽略规则：

- 依赖目录：`node_modules/`
- Next 产物：`.next/`, `out/`
- 环境变量：`.env*`
- 日志与系统文件：`*.log`, `.DS_Store` 等

### `README.md`

项目说明文档（当前是 create-next-app 默认内容）：

- 本地运行方式
- Next.js 学习资源
- 部署入口说明

### `LICENSE`

开源许可证文本（当前为 MIT 许可证）。

---

## 3. `app/` 目录（核心业务入口，App Router）

`app/` 是 Next.js App Router 的核心目录。路由由文件系统决定。

### `app/layout.tsx`

全局根布局（Root Layout）：

- 包裹所有页面
- 定义 `<html>` 与 `<body>` 结构
- 引入全局样式 `globals.css`
- 配置全站字体（`next/font/google` 的 Geist / Geist Mono）
- 导出 `metadata`（页面标题、描述）

可理解为：每个页面都会先经过这个“外层壳”。

### `app/page.tsx`

根路由 `/` 对应页面组件：

- 默认首页内容
- 使用 `next/image` 渲染图片（自动优化）
- 使用 Tailwind 类名实现布局和样式

在 App Router 中：

- `app/page.tsx` => `/`
- 如果将来新增 `app/about/page.tsx` => `/about`

### `app/globals.css`

全局样式文件：

- `@import "tailwindcss"` 启用 Tailwind
- 定义全局 CSS 变量（前景/背景色）
- 定义深色模式变量（`prefers-color-scheme: dark`）
- 设置 `body` 的基础样式

### `app/favicon.ico`

网站标签页图标（浏览器 tab icon）。

---

## 4. `public/` 目录（静态资源）

`public/` 中的文件会被原样静态托管，可通过根路径直接访问。

- `public/next.svg` -> `/next.svg`
- `public/vercel.svg` -> `/vercel.svg`

当前文件多为模板自带示例图标：

- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

它们通常用于页面展示、按钮图标或占位资源。

---

## 5. 这个项目的运行链路（你可以这样理解）

1. 执行 `npm run dev` 启动 Next.js 开发服务器。
2. Next.js 读取 `app/layout.tsx` 作为全局布局。
3. 访问 `/` 时渲染 `app/page.tsx`。
4. 页面样式来自 `app/globals.css` + Tailwind。
5. 静态资源从 `public/` 直接提供。
6. 类型检查由 `tsconfig.json` + `next-env.d.ts` 提供支持。
7. 代码规范由 `eslint.config.mjs` 约束。

---

## 6. 你后续最常改的地方（建议）

- 业务页面：`app/**/page.tsx`
- 公共布局：`app/layout.tsx`
- 全局样式与主题：`app/globals.css`
- 项目配置：`next.config.ts`、`tsconfig.json`
- 依赖与脚本：`package.json`

如果你愿意，我可以下一步给你补一份“从这个初始模板扩展到真实产品”的推荐目录结构（如 `components/`, `lib/`, `features/`, `types/` 等）。
