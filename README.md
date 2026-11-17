# react-debugger

学习用的 React 源码调试工程。页面本身只是一个很小的示例，用来在浏览器里对着 **React 18.2.0 development 构建**下断点；工程骨架来自已经 eject 的 Create React App。

[![React development](https://img.shields.io/badge/React_development-18.2.0-149ECA)](https://github.com/facebook/react/releases/tag/v18.2.0)
[![Yarn](https://img.shields.io/badge/Yarn-1.22-2C8EBB)](https://classic.yarnpkg.com/)

背景说明见 [掘金：React 源码调试](https://juejin.cn/post/7126501202866470949)。

## 示例页面在做什么

`yarn start` 后打开页面，实际会看到两段文字：

1. `index.js` 里写死的 `test`
2. 请求结束后的标题 `Account:`（冒号后面是空的）

请求地址是 `https://jsonplaceholder.typicode.com/posts`。接口返回的是帖子列表，字段是 `title`、`body` 等，没有 `name`。`App.js` 渲染的是 `data[0].name`，所以标题里名字为空。需要能访问该公网地址，否则会走到错误分支，显示 `Error: ...`。

加载过程中，`ThemeContext` 固定为 `"dark"`，页面先显示黑色的 `Loading...`。

`index.js` 在约 1 秒后 `console.log` 出 `ReactDOM.createRoot()` 的返回值。在当前这套脚本下，控制台打印的是 `ReactDOMRoot`，并带有安装 React DevTools 的提示。文件里留有一段已注释的旧写法（React 17 的 `_reactRootContainer`），当前入口没有执行它。

`reportWebVitals()` 被调用时没有传入回调，因此不会上报 Web Vitals。

`src/App.css` 和 `src/logo.svg` 仍是脚手架文件，当前入口没有引用它们。`public/logo192.png`、`public/logo512.png` 只出现在默认的 `manifest.json` 里。

## 源码是怎么挂到页面上的

调试用的是仓库里提交的官方 development 构建，不是 `node_modules` 里那份 React：

| 文件 | 作用 |
| --- | --- |
| `public/react.development.js` | 浏览器全局 `React`，文件内版本号 `18.2.0`，带 `react.development.js.map` |
| `public/react-dom.development.js` | 浏览器全局 `ReactDOM`，文件内版本号 `18.2.0`，带 `react-dom.development.js.map` |
| `public/index.html` | 用 `<script>` 先加载上面两个文件 |

`config/webpack.config.js` 把这两个包标成外部依赖：

```js
externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
}
```

因此业务代码里的 `import ... from "react"` 和 `import ... from "react-dom"` 会使用页面上的 18.2.0 脚本。在 Sources 面板打开这两个文件（或它们的 source map）即可下断点。

另外两处仍然来自锁文件里的 **18.3.1**：

- 新 JSX 转换打进 bundle 的是 `react/jsx-dev-runtime`（`node_modules/react` 18.3.1）
- `react-dom/client` 的薄封装来自 `node_modules/react-dom` 18.3.1，里面再调用全局 `ReactDOM.createRoot`

`yarn.lock` 锁定的 `react` / `react-dom` 版本是 18.3.1。Jest 不走 webpack externals，测试用的也是这份依赖。

`.env` 里 `GENERATE_SOURCEMAP=false` 只作用于 webpack 配置里的 `shouldUseSourceMap`。开发服务器的 `devtool` 仍是 `cheap-module-source-map`。React 自带的 `.map` 不受这个开关影响。

## 技术栈

`package.json` 没有声明 `engines`。下面的依赖版本来自 `yarn.lock`。

| 依赖 | 锁定版本 |
| --- | --- |
| react / react-dom（npm 包） | 18.3.1 |
| 页面实际加载的 development 构建 | 18.2.0 |
| webpack | 5.93.0 |
| webpack-dev-server | 4.15.2 |
| jest | 27.5.1 |
| @testing-library/react | 13.4.0 |
| web-vitals | ^2.1.4（区间，仅 `reportWebVitals.js` 引用） |

脚本只有三个：

| 命令 | 实际行为 |
| --- | --- |
| `yarn start` | `node scripts/start.js`。开发服务器，默认 `HOST=0.0.0.0`、`PORT=3000` |
| `yarn build-dev` | `NODE_ENV=development` 下执行 `scripts/build.js`，webpack 却按 `'production'` 配置输出到 `build/` |
| `yarn test` | `node scripts/test.js`（Jest）。非 CI 环境会进入 watch |

仓库里没有 `build`、`serve`、`eject` 脚本，也没有 `.vscode` 调试配置。

## 目录

```text
.
├── config/                 # webpack、Jest、环境变量（CRA eject 后的配置）
│   └── webpack.config.js   # 含 react / react-dom externals
├── public/
│   ├── index.html          # 引入 React / ReactDOM development 脚本
│   ├── react.development.js
│   ├── react.development.js.map
│   ├── react-dom.development.js
│   └── react-dom.development.js.map
├── scripts/
│   ├── start.js
│   ├── build.js
│   └── test.js
├── src/
│   ├── index.js            # createRoot、打印 root
│   ├── App.js              # useFetch、ThemeContext、示例页面
│   ├── App.test.js         # 仍断言脚手架文案 “learn react”
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .env                    # GENERATE_SOURCEMAP=false
├── package.json
└── yarn.lock
```

`node_modules/`、`build/`、`coverage/` 已在 `.gitignore` 中。

## 环境要求

- Node.js。本仓库在 **Node.js 22.23.4** 上安装并跑通了下面的命令。
- Yarn 1（Classic）。仓库只有 `yarn.lock`，验证时使用的是 **Yarn 1.22.22**。
- 看示例数据时，机器需要能访问 `jsonplaceholder.typicode.com`。

## 安装与运行

```bash
yarn install --frozen-lockfile
yarn start
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。编译会带上 `src/App.js` 的 `react-hooks/exhaustive-deps` 警告（`useEffect` 依赖了展开的 `deps`，且没有把 `fetchData` 列入依赖），开发服务器仍然可以打开。

在浏览器开发者工具中：

1. 打开 `react.development.js` 或 `react-dom.development.js`（source map 已随文件提供）。
2. 在 `createRoot`、`beginWork` 等函数里下断点，刷新页面。
3. 控制台里可以看到约 1 秒后打印的 `ReactDOMRoot`。

打包：

```bash
yarn build-dev
```

产物在 `build/`。该命令可以完成，同时会打印 `DefinePlugin` 对 `process.env.NODE_ENV` 取值冲突的警告：`scripts/build.js` 把 `NODE_ENV` 设成 `development`，webpack 配置参数却是 `'production'`。仓库没有附带静态服务器脚本；CRA 结束时提示的 `serve -s build` 不是本仓库的依赖。

测试：

```bash
CI=true yarn test --watchAll=false
```

当前这条测试会失败。`src/App.test.js` 仍在查找文案 `/learn react/i`，页面初始渲染的是 `Loading...`。这是脚手架留下的用例，和现在的 `App.js` 不一致。

## 验证记录

以下命令在本仓库、Node.js 22.23.4、Yarn 1.22.22 上实际跑过：

| 步骤 | 结果 |
| --- | --- |
| `yarn install --frozen-lockfile` | 成功（有若干 peer dependency 警告） |
| `yarn start` | 编译成功并监听 3000 端口；有 hooks 与 `babel-preset-react-app` 的警告 |
| 打开首页 | 先出现 `test` 与 `Loading...`，请求返回后正文为 `test` 和 `Account:` |
| `yarn build-dev` | 成功写出 `build/`，并出现 `process.env.NODE_ENV` 冲突警告 |
| `CI=true yarn test --watchAll=false` | 失败，原因见上一节 |

## 备注

- 直接双击打开 `public/index.html` 看不到应用，脚本要由开发服务器或构建结果注入。
- `public/favicon copy.ico` 是多出来的图标副本，`index.html` 引用的是 `favicon.ico`。
- 开发服务器启动时还会提示：`babel-preset-react-app` 使用了未声明的 `@babel/plugin-proposal-private-property-in-object`。这是 Create React App 依赖自身的提示，当前安装下编译仍能完成。
