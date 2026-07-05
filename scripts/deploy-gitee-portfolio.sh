#!/usr/bin/env bash
# 一键部署 Romola portfolio 静态站到 Gitee Pages（master 分支）
# 按 WorkBuddy 流程：校验 → 构建 → 创建仓库 → 推送 → 触发 Pages
#
# 用法：
#   GITEE_USER=romola1110 GITEE_TOKEN=你的令牌 ./scripts/deploy-gitee-portfolio.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GITEE_USER="${GITEE_USER:-}"
GITEE_TOKEN="${GITEE_TOKEN:-}"
GITEE_REPO="${GITEE_REPO:-portfolio2}"
GITEE_BRANCH="${GITEE_BRANCH:-master}"
SITE_DIR="${SITE_DIR:-}"
API="https://gitee.com/api/v5"

log()  { printf '[步骤] %s\n' "$*"; }
ok()   { printf '[完成] %s\n' "$*"; }
fail() { printf '[错误] %s\n' "$*" >&2; printf '\n修复建议：%s\n' "${2:-请检查上方日志后重试}" >&2; exit 1; }

api() {
  curl -sS -X "$1" -H "Authorization: token ${GITEE_TOKEN}" -H "Content-Type: application/json" "${@:2}"
}

# ── 0. 校验参数 ──────────────────────────────────────────────
log "0/6 校验账号参数"
[[ -n "$GITEE_USER" ]] || fail "未设置 GITEE_USER" "执行：GITEE_USER=romola1110 GITEE_TOKEN=令牌 ./scripts/deploy-gitee-portfolio.sh"
[[ -n "$GITEE_TOKEN" ]] || fail "未设置 GITEE_TOKEN" "去 https://gitee.com/profile/personal_access_tokens 生成，勾选 projects"
ok "用户 ${GITEE_USER}，仓库 ${GITEE_REPO}，分支 ${GITEE_BRANCH}"

# ── 1. 构建并校验 index.html ─────────────────────────────────
log "1/6 校验本地目录并构建静态包"
if [[ -z "$SITE_DIR" ]]; then
  if [[ "${SKIP_BUILD:-}" == "1" && -d "$ROOT/_site" ]]; then
    SITE_DIR="$ROOT/_site"
    ok "使用已有 _site"
  else
    log "构建站点包（约 240MB，含摄影/物有灵犀等全部素材）..."
    bash "$ROOT/scripts/prepare-pages-bundle.sh"
    SITE_DIR="$ROOT/_site"
    ok "构建完成"
  fi
fi

[[ -d "$SITE_DIR" ]] || fail "站点目录不存在：${SITE_DIR}"
[[ -f "$SITE_DIR/index.html" ]] || fail "根目录缺少 index.html" "确认在项目根目录执行，或检查 prepare-pages-bundle.sh"
ok "index.html 存在"

# ── 2. 扫描绝对路径 ──────────────────────────────────────────
log "2/6 扫描资源绝对路径（不改业务内容）"
ABS_FOUND=0
while IFS= read -r -d '' f; do
  if grep -qE '(href|src|url)\s*[=(]\s*["'\''](file://|[A-Za-z]:\\|/Users/)' "$f" 2>/dev/null; then
    ABS_FOUND=1
    log "  发现绝对路径 → $f"
  fi
done < <(find "$SITE_DIR" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -print0)

[[ "$ABS_FOUND" == "0" ]] || fail "存在绝对路径引用" "将 href/src 改为相对路径后重试"
ok "路径均为相对路径"

# ── 3. 查询或创建码云仓库 ────────────────────────────────────
log "3/6 查询/创建码云开源仓库"
REPO_JSON="$(api GET "${API}/repos/${GITEE_USER}/${GITEE_REPO}" || true)"
if echo "$REPO_JSON" | grep -q '"id"'; then
  ok "仓库 ${GITEE_USER}/${GITEE_REPO} 已存在"
  echo "$REPO_JSON" | grep -q '"private":true' && \
    fail "仓库为私有" "免费 Pages 需公开仓库 → 码云仓库设置 → 开源"
else
  log "自动创建公开仓库..."
  CREATE_JSON="$(api POST "${API}/user/repos" \
    -d "{\"name\":\"${GITEE_REPO}\",\"description\":\"Romola Creative Portfolio\",\"private\":false,\"has_issues\":false,\"has_wiki\":false}")"
  echo "$CREATE_JSON" | grep -q '"id"' || fail "创建仓库失败" "$(echo "$CREATE_JSON" | head -c 200)"
  ok "仓库创建成功"
fi

# ── 4. 初始化 Git 并推送 master ──────────────────────────────
log "4/6 打包并推送到 master（约 240MB，请耐心等待）"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cp -a "$SITE_DIR/." "$WORK/"
cd "$WORK"

git init -b "$GITEE_BRANCH" >/dev/null
git config user.email "${GITEE_USER}@users.noreply.gitee.com"
git config user.name "$GITEE_USER"
git config http.postBuffer 524288000
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 600
git add -A
git commit -m "Deploy portfolio $(date -u +%Y-%m-%dT%H:%M:%SZ)" >/dev/null

REMOTE="https://${GITEE_USER}:${GITEE_TOKEN}@gitee.com/${GITEE_USER}/${GITEE_REPO}.git"
log "上传中...（令牌已写入链接，不会再问密码）"
git push --progress -f "$REMOTE" "$GITEE_BRANCH" || \
  fail "推送失败" "检查令牌是否有效、是否勾选 projects 权限、网络是否稳定"
ok "代码已推送到 master"

# ── 5. 尝试触发 Gitee Pages ──────────────────────────────────
log "5/6 尝试开启/更新 Gitee Pages"
BUILD_RESP="$(api POST "${API}/repos/${GITEE_USER}/${GITEE_REPO}/pages/builds" \
  -d "{\"branch\":\"${GITEE_BRANCH}\",\"build_directory\":\"/\",\"force_https\":true}" 2>/dev/null || true)"

if echo "$BUILD_RESP" | grep -qE '"status"|"message":"OK"'; then
  ok "Pages 部署已触发"
else
  log "API 无法自动启动（码云免费版限制），请网页手动操作一次："
  log "  → https://gitee.com/${GITEE_USER}/${GITEE_REPO}/pages"
  log "  → 分支 ${GITEE_BRANCH}，目录 /，HTTPS 开启，点「启动」"
fi

# ── 6. 输出链接 ──────────────────────────────────────────────
log "6/6 部署流程结束"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  公开访问链接：https://${GITEE_USER}.gitee.io/${GITEE_REPO}/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "后续更新："
echo "  GITEE_USER=${GITEE_USER} GITEE_TOKEN=令牌 ./scripts/update-gitee-pages.sh"
echo ""
