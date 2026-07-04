#!/usr/bin/env bash
# 更新线上 Gitee Pages（portfolio 改完后一键同步）
# 用法：GITEE_USER=romola1110 GITEE_TOKEN=令牌 ./scripts/update-gitee-pages.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
echo "==> 拉取 GitHub 最新代码..."
git pull origin main
echo "==> 部署到码云..."
exec bash "$ROOT/scripts/deploy-gitee-portfolio.sh"
