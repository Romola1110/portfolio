# 免费 + 内地稳定：码云自动部署

**不用本机传 240MB。** GitHub 改完代码后，云端自动同步到码云。

---

## 一次性设置（约 5 分钟）

### 1. 码云生成新令牌
https://gitee.com/profile/personal_access_tokens  
→ 生成 → 勾选 **projects** → 复制保存

### 2. 把令牌放进 GitHub（只存一次）
打开 https://github.com/Romola1110/portfolio/settings/secrets/actions  
→ **New repository secret**  
→ Name 填：`GITEE_TOKEN`  
→ Value 粘贴码云令牌 → 保存

### 3. 码云网页开启 Pages（只点一次）
https://gitee.com/romola1110/portfolio/pages  
→ 部署分支 **`master`**，目录 **`/`**，HTTPS 开启  
→ 点 **「启动」**

### 4. 手动触发一次同步
打开 https://github.com/Romola1110/portfolio/actions/workflows/deploy-gitee-pages.yml  
→ **Run workflow** → Run

等 30～60 分钟（自动上传 240MB），完成后访问：

## https://romola1110.gitee.io/portfolio/

---

## 以后怎么用

改完网站合并到 `main` 后，**什么都不用做**，GitHub Actions 会自动同步到码云。

也可手动点 Actions → Deploy to Gitee Pages → Run workflow。

---

## 简历链接

| 给谁 | 链接 |
|------|------|
| 内地 HR（稳定） | https://romola1110.gitee.io/portfolio/ |
| 海外 / 备用 | https://romola1110.github.io/portfolio/ |

**费用：0 元**（码云公开仓库 Pages 免费）

---

## 若 Actions 失败

1. 检查 `GITEE_TOKEN` 是否过期 → 重新生成并更新 GitHub Secret  
2. 码云 Pages 是否已手动「启动」过一次  
3. 打开 Actions 日志看红色报错，截图发我
