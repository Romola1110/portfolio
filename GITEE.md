# 码云 Gitee Pages 部署指南（portfolio 作品集）

内地访问比 GitHub Pages 更稳定。本项目是纯静态网页（html/css/js/图片），一键部署到码云。

## 一键部署（推荐）

在项目根目录执行（把令牌换成你的）：

```bash
chmod +x scripts/deploy-gitee-portfolio.sh
GITEE_USER=romola1110 GITEE_TOKEN=你的私人令牌 ./scripts/deploy-gitee-portfolio.sh
```

脚本会自动：
1. 构建约 240MB 静态站包（`_site`）
2. 校验 `index.html` 与资源相对路径
3. 查询/创建码云开源仓库 `portfolio`
4. 推送到 **`master`** 分支
5. 尝试触发 Pages 部署

**公开访问链接：** https://romola1110.gitee.io/portfolio/

## 首次需手动开启 Pages（仅一次）

码云免费版 API 通常无法自动「启动」Pages，第一次请：

1. 打开 https://gitee.com/romola1110/portfolio/pages
2. **部署分支**：`master`
3. **部署目录**：`/`（根目录）
4. **强制 HTTPS**：开启
5. 点击 **启动**

之后每次跑部署脚本，再在 Pages 页点 **更新** 即可（或等自动刷新）。

## 以后更新网站

GitHub 改完并合并到 `main` 后：

```bash
git pull origin main
GITEE_USER=romola1110 GITEE_TOKEN=你的令牌 ./scripts/deploy-gitee-portfolio.sh
```

## 备用脚本（gh-pages 分支）

若你更习惯用 `gh-pages` 分支：

```bash
GITEE_USER=romola1110 ./scripts/push-gitee-pages.sh
```

Pages 设置里分支改选 `gh-pages` 即可。

## 简历里用码云链接

- **内地 HR / 朋友**：`https://romola1110.gitee.io/portfolio/`
- **GitHub** 继续保留，海外访问用 `github.io`

## 常见问题

| 问题 | 处理 |
|------|------|
| push 失败 403 | 用私人令牌，不要用登录密码 |
| Pages 打不开 | 确认分支是 `gh-pages`，且已点「启动」 |
| 仓库太大 | 本脚本只推 `_site` 静态包（约 240MB），不要推整个开发仓库 |
| 实名认证 | 绑定自定义域名才需要；默认 `gitee.io` 子域名一般不用 |
