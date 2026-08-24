#!/usr/bin/env bash
# 一键上传 portfolio 静态站到腾讯云 COS 静态网站
#
# 前置：已在腾讯云 COS 创建存储桶并开启「静态网站」
# 用法：
#   TENCENT_SECRET_ID=xxx \
#   TENCENT_SECRET_KEY=xxx \
#   TENCENT_BUCKET=romola-portfolio-1250000000 \
#   TENCENT_REGION=ap-guangzhou \
#   ./scripts/deploy-tencent-cos.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SECRET_ID="${TENCENT_SECRET_ID:-}"
SECRET_KEY="${TENCENT_SECRET_KEY:-}"
BUCKET="${TENCENT_BUCKET:-}"
REGION="${TENCENT_REGION:-ap-guangzhou}"

log()  { printf '[步骤] %s\n' "$*"; }
ok()   { printf '[完成] %s\n' "$*"; }
fail() { printf '[错误] %s\n' "$*" >&2; printf '修复：%s\n' "${2:-}" >&2; exit 1; }

log "0/4 校验参数"
[[ -n "$SECRET_ID" ]]  || fail "未设置 TENCENT_SECRET_ID" "腾讯云控制台 → 访问管理 → API密钥管理"
[[ -n "$SECRET_KEY" ]] || fail "未设置 TENCENT_SECRET_KEY" "同上"
[[ -n "$BUCKET" ]]     || fail "未设置 TENCENT_BUCKET" "存储桶名称，如 romola-portfolio-1250000000"
ok "存储桶 ${BUCKET}，地域 ${REGION}"

log "1/4 构建静态站包"
bash "$ROOT/scripts/prepare-pages-bundle.sh"
[[ -f "$ROOT/_site/index.html" ]] || fail "缺少 index.html"
ok "构建完成（约 240MB）"

log "2/4 安装/检查 coscmd"
if ! command -v coscmd &>/dev/null; then
  if command -v pip3 &>/dev/null; then
    pip3 install -q coscmd
  elif command -v pip &>/dev/null; then
    pip install -q coscmd
  else
    fail "未找到 pip" "Mac 终端执行：pip3 install coscmd"
  fi
fi
ok "coscmd 就绪"

log "3/4 上传到 COS（约 240MB，请耐心等待）"
COS_CONF="$(mktemp)"
trap 'rm -f "$COS_CONF"' EXIT
coscmd -c "$COS_CONF" config -a "$SECRET_ID" -s "$SECRET_KEY" -b "$BUCKET" -r "$REGION" >/dev/null
coscmd -c "$COS_CONF" sync "$ROOT/_site/" / -f
ok "上传完成"

log "4/4 访问地址"
# 从 bucket 名解析 APPID（末尾数字段）
APPID="${BUCKET##*-}"
SHORT="${BUCKET%-${APPID}}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  默认访问地址（内地可访问）："
echo "  http://${BUCKET}.cos-website.${REGION}.myqcloud.com"
echo ""
echo "  若已绑定自定义域名，用你的域名访问"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "后续更新：改完网站后重新执行本脚本即可"
echo ""
