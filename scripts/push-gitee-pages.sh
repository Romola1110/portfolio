#!/usr/bin/env bash
# 构建 _site 并推送到码云 gh-pages 分支（供 Gitee Pages 使用）
# 用法：GITEE_USER=你的码云用户名 ./scripts/push-gitee-pages.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GITEE_USER="${GITEE_USER:-}"
REPO_NAME="${GITEE_REPO:-portfolio2}"

if [ -z "$GITEE_USER" ]; then
  echo "请先设置码云用户名，例如："
  echo "  GITEE_USER=你的用户名 ./scripts/push-gitee-pages.sh"
  exit 1
fi

echo "==> 构建站点包..."
bash "$ROOT/scripts/prepare-pages-bundle.sh"

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

cp -a "$ROOT/_site/." "$WORK/"
cd "$WORK"

git init -b gh-pages
git config user.email "pages@gitee.local"
git config user.name "Gitee Pages"
git add -A
git commit -m "Gitee Pages deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"

REMOTE="https://gitee.com/${GITEE_USER}/${REPO_NAME}.git"
echo "==> 推送到 ${REMOTE} （分支 gh-pages）..."
echo "    若提示登录，请使用码云账号 + 私人令牌（设置 -> 私人令牌）"
git push -f "$REMOTE" gh-pages

echo ""
echo "完成。请到码云网页操作："
echo "  仓库 ${REPO_NAME} -> 服务 -> Gitee Pages"
echo "  部署分支选 gh-pages，目录选 /（根目录）-> 启动"
echo "  访问地址一般为：https://${GITEE_USER}.gitee.io/${REPO_NAME}/"
