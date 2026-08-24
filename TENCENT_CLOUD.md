# 腾讯云 COS 静态网站部署（portfolio 作品集）

内地访问比 GitHub 快。用 **对象存储 COS + 静态网站**，不用买服务器。

---

## 第一步：腾讯云控制台（约 10 分钟，只做一次）

### 1. 登录
打开 https://console.cloud.tencent.com/cos

### 2. 创建存储桶
- 点 **创建存储桶**
- **名称**：`romola-portfolio`（或自定，记住全名）
- **所属地域**：选 **广州** 或离你近的内地节点
- **访问权限**：**公有读私有写**（网站才能被公开访问）
- 其他默认 → 创建

记下完整桶名，形如：`romola-portfolio-1251234567`（后面那串数字是 APPID）

### 3. 开启静态网站
- 进入刚创建的存储桶
- 左侧 **基础配置** → **静态网站**
- 状态：**开启**
- **索引文档**：`index.html`
- **错误文档**：可留空
- 保存

页面会显示 **静态网站访问节点**，形如：
```
http://romola-portfolio-1251234567.cos-website.ap-guangzhou.myqcloud.com
```
这就是你的作品集链接。

### 4. 获取 API 密钥（用于自动上传）
- 打开 https://console.cloud.tencent.com/cam/capi
- **新建密钥** → 复制 **SecretId** 和 **SecretKey**（只显示一次，存到备忘录）

---

## 第二步：Mac 上一键上传

### 1. 下载项目（若还没有）
```bash
cd ~/Desktop
git clone https://github.com/Romola1110/portfolio.git portfolio
cd portfolio
git pull origin main
```

### 2. 安装上传工具（只需一次）
```bash
pip3 install coscmd
```

### 3. 执行部署（把下面换成你的真实信息）
```bash
chmod +x scripts/deploy-tencent-cos.sh

TENCENT_SECRET_ID=你的SecretId \
TENCENT_SECRET_KEY=你的SecretKey \
TENCENT_BUCKET=romola-portfolio-1251234567 \
TENCENT_REGION=ap-guangzhou \
./scripts/deploy-tencent-cos.sh
```

> `TENCENT_BUCKET` = 第二步记下的**完整桶名**（含数字）  
> `TENCENT_REGION` = 创建桶时选的地域，广州是 `ap-guangzhou`

上传约 240MB，**别关终端**，等出现「上传完成」。

### 4. 浏览器打开静态网站地址
控制台 → 存储桶 → 静态网站 → 复制访问节点，或脚本结束时打印的链接。

---

## 以后更新网站

```bash
cd ~/Desktop/portfolio
git pull origin main
TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=xxx TENCENT_BUCKET=xxx TENCENT_REGION=ap-guangzhou ./scripts/deploy-tencent-cos.sh
```

---

## 简历里写什么

```
作品集：https://你的桶名.cos-website.ap-guangzhou.myqcloud.com
```

也可绑定自己的域名（控制台 → 存储桶 → 域名管理），需备案。

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 打开是 403 | 存储桶权限改为「公有读私有写」 |
| 打开是空白/404 | 确认静态网站已开启，索引文档是 `index.html` |
| 上传报错 AccessDenied | 检查 SecretId/SecretKey 和桶名是否正确 |
| 很慢 | 正常，240MB 第一次约 10～30 分钟，别中断 |
| 费用 | 新用户有免费额度，个人作品集一般几块钱/月以内 |

---

## 和码云/GitHub 对比

| | GitHub | 码云 | **腾讯云 COS** |
|--|--------|------|----------------|
| 内地速度 | 慢/不稳定 | 快 | **快** |
| 你目前状态 | ✅ 已能用 | ❌ 没传完 | 按本文做 |
| 难度 | 最简单 | 上传易卡 | **中等，但稳** |

**建议**：简历主链接可继续用 GitHub；腾讯云配好后换成 COS 链接给内地 HR。
