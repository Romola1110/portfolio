# WorkBuddy 专属部署指令（Romola portfolio）

把下面**整段**复制到 WorkBuddy，它会自动执行部署。

---

## 复制这段给 WorkBuddy

```
你的任务：把我本地静态作品集网页部署到 Gitee Pages，生成公开可分享的访问链接，全程自动执行。

前置信息：
1. 项目类型：纯静态网页（html/css/js/图片，无后端）
   本地文件夹路径：【若不知道路径，先在终端执行：
     cd ~/Desktop && git clone https://github.com/Romola1110/portfolio.git portfolio
     则路径为 ~/Desktop/portfolio 】
2. Gitee 账号信息：
   - 用户名：romola1110
   - 仓库名：portfolio（不存在则自动新建开源仓库，分支 master）
   - Gitee 私人令牌：【去 https://gitee.com/profile/personal_access_tokens 生成，勾选 projects 权限】

执行步骤：
1. 校验本地目录：检查根目录是否存在 index.html，不存在则报错终止；扫描 html/css/js 中的绝对路径（file://、C:\、/Users/），发现则提示修复
2. 进入项目根目录，执行 git pull origin main 拉最新代码
3. 运行部署脚本：
   chmod +x scripts/deploy-gitee-portfolio.sh
   GITEE_USER=romola1110 GITEE_TOKEN=【令牌】 ./scripts/deploy-gitee-portfolio.sh
4. 脚本会自动：构建 _site 静态包 → 查询/创建码云仓库 → 推送到 master → 尝试触发 Pages
5. 若 API 无法自动启动 Pages，提示用户打开 https://gitee.com/romola1110/portfolio/pages
   部署分支 master，目录 /，强制 HTTPS，点击「启动」
6. 输出公开链接：https://romola1110.gitee.io/portfolio/
7. 告知后续更新命令：GITEE_USER=romola1110 GITEE_TOKEN=令牌 ./scripts/update-gitee-pages.sh

约束：
- 全程输出每一步执行日志，报错立刻停止并给出修复方案
- 不修改网页业务内容，仅修复路径导致的线上白屏/图片丢失问题
- 仓库必须开源，私有仓库无法启用免费 Pages
```

---

## 你自己在终端跑（不用 WorkBuddy）

### 第一次（不知道路径时）

```bash
cd ~/Desktop
git clone https://github.com/Romola1110/portfolio.git portfolio
cd portfolio
git pull origin main
chmod +x scripts/deploy-gitee-portfolio.sh scripts/update-gitee-pages.sh
GITEE_USER=romola1110 GITEE_TOKEN=你的新令牌 ./scripts/deploy-gitee-portfolio.sh
```

### 以后每次更新

```bash
cd ~/Desktop/portfolio
git pull origin main
GITEE_USER=romola1110 GITEE_TOKEN=你的新令牌 ./scripts/update-gitee-pages.sh
```

### 开启 Pages（仅第一次，网页点一下）

https://gitee.com/romola1110/portfolio/pages → 分支 `master` → 目录 `/` → **启动**

### 简历链接

https://romola1110.gitee.io/portfolio/
