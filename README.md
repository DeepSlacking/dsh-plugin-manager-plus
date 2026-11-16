# dsh-plugin-manager-plus · 插件管理增强

直接改造 DSH Web 官方「插件」页里 **已安装** 标签页的渲染结果，不新增标签页、不替换官方页面逻辑：

1. **分开查看**：官方页原有的三个分组（内置插件配置 / 实验性插件 / 已安装插件）改为一次只显示一个，
   通过列表顶部注入的分段切换按钮切换；默认显示「已安装插件」，选择会记在 `localStorage`。
   - 分组标题右侧的数字是各分类的条目数。
   - 从插件详情页或「更多」页返回时，切换控件自动重新出现。
2. **中文用途摘要**：已安装插件的卡片在原始描述下方追加一条中文摘要，摘要左侧是彩色分类标签，
   整块摘要带同色系浅底与左侧色条。
3. **名称翻译**：英文名称在卡片标题位置替换为中文名称（不移动官方 DOM 文本节点，只隐藏原文并追加中文 span），
   原来的英文名/包名以椭圆标签显示在名称右侧；点击标题仍然打开官方插件详情页。

## 安装

让 Agent 调用 `plugin_manager` 的 `install_bundle`，target 指向本目录或打包后的 tarball：

```text
target: D:\DSH-workspace\dsh-plugin-manager-plus
target: D:\DSH-workspace\dsh-plugin-manager-plus\dist\dsh-plugin-manager-plus-0.2.0.tgz
```

安装/更新后如果页面已打开，刷新一次页面让浏览器加载新的客户端 bundle。

## 打包

```bash
npm run build                 # 重新生成 client.js
npm pack --pack-destination dist
# 产出 dist/dsh-plugin-manager-plus-0.2.0.tgz，可直接作为 install_bundle 的 target
```

`npm pack` 会先执行 `prepack` 自动重建 `client.js`；tarball 只包含运行时需要的
`package.json`、`index.js`、`client.js`、`cordis.patch.yml`、`locale/*.json`、`icon.svg`、
`README.md`、`LICENSE`。需要连源码一起交付时，可额外打一个 zip（含 `src/`、`scripts/`、
`tests/`、`content.zh.json`、`docs/`；见 `dist/` 下的 `*-source.zip`）。

## 开发

```bash
node scripts/build.mjs     # src/client.template.js + content.zh.json + locale/*.json → client.js
node --check client.js     # 语法检查
node tests/model.test.mjs  # 离线数据/翻译/摘要/清单检查
```

- `content.zh.json`：已安装插件的中文名称、摘要、分类标签与色系；新装插件没有条目时
  会退回按名称词表翻译 + 通用摘要。
- `locale/zh.json`、`locale/en.json`：插件展示元数据（`meta`）与注入控件的文案。
- `src/client.template.js`：浏览器半侧源码；`client.js` 是构建产物，不要直接编辑。

## 实现说明

- 官方插件页是 React 渲染的，本插件只做「追加型」DOM 装饰：添加自有节点、
  给宿主节点加 class/属性或 `display`，**从不移动或删除宿主节点**；
  用 `MutationObserver` 在宿主重渲染后幂等地重新应用，插件停用时清理干净。
- 选择器只使用官方页的自动化钩子：`[data-plugin-panel]`、`[data-plugin-body]`、
  `[data-plugin-group="basic|extensions|bundles"]`、`li[data-plugin-package]`。
- 不引入 Harness Client 包、不接管官方页的启用/安装/卸载逻辑；样式只用
  `--dsw-alias-*` 主题 token 与少量色相混合，跟随明暗主题。
- 名称与摘要不写入官方页的 React 状态，官方数据、排序、开关行为保持不变。
