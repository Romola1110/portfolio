#!/usr/bin/env bash
# 一键部署 Romola portfolio 静态站到 Gitee Pages（master 分支）
#
# 用法：
#   GITEE_USER=romola1110 GITEE_TOKEN=你的令牌 ./scripts/deploy-gitee-portfolio.sh
#
# 可选环境变量：
#   GITEE_REPO=portfolio          码云仓库名（默认 portfolio）
#   GITEE_BRANCH=master           Pages 部署分支（默认 master）
#   SITE_DIR=/path/to/site        静态站目录（默认自动构建 _site）
#   SKIP_BUILD=1                  跳过构建，直接使用已有 _site
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GITEE_USER="${GITEE_USER:-}"
GITEE_TOKEN="${GITEE_TOKEN:-}"
GITEE_REPO="${GITEE_REPO:-portfolio}"
GITEE_BRANCH="${GITEE_BRANCH:-master}"
SITE_DIR="${SITE_DIR:-}"
API="https://gitee.com/api/v5"

log() { printf '==> %s\n' "$*"; }
fail() { printf '❌ %s\n' "$*" >&2; exit 1; }

api() {
  local method="$1"; shift
  local url="$1"; shift
  curl -sS -X "$method" \
    -H "Authorization: token ${GITEE_TOKEN}" \
    -H "Content-Type: application/json" \
    "$url" "$@"
}

# ── 0. 校验参数 ──────────────────────────────────────────────
[[ -n "$GITEE_USER" ]] || fail "请设置 GITEE_USER，例如：GITEE_USER=romola1110"
[[ -n "$GITEE_TOKEN" ]] || fail "请设置 GITEE_TOKEN（码云私人令牌，勾选 projects 权限）"

log "项目：Romola portfolio 静态作品集"
log "码云用户：${GITEE_USER}  仓库：${GITEE_REPO}  分支：${GITEE_BRANCH}"

# ── 1. 构建 / 校验本地目录 ─────────────────────────────────
if [[ -z "$SITE_DIR" ]]; then
  if [[ "${SKIP_BUILD:-}" == "1" && -d "$ROOT/_site" ]]; then
    SITE_DIR="$ROOT/_site"
    log "跳过构建，使用已有 _site"
  else
    log "构建站点包（约 240MB）..."
    bash "$ROOT/scripts/prepare-pages-bundle.sh"
    SITE_DIR="$ROOT/_site"
  fi
fi

[[ -d "$SITE_DIR" ]] || fail "站点目录不存在：${SITE_DIR}"
[[ -f "$SITE_DIR/index.html" ]] || fail "根目录缺少 index.html，请检查 SITE_DIR"

log "校验通过：${SITE_DIR}/index.html 存在"

# ── 2. 修正绝对路径（仅资源引用，不改业务内容）──────────────
log "扫描绝对路径..."
ABS_FOUND=0
while IFS= read -r -d '' f; do
  if grep -qE '(file://|[A-Za-z]:\\|/Users/|/home/[^/]+/[^"'\'' ]+)' "$f" 2>/dev/null; then
  if grep -qE '(href|src|url)\s*[=(]\s*["'\''](file://|[A-Za-z]:\\|/Users/)' "$f" 2>/dev/null; then
    ABS_FOUND=1
    log "  警告：发现绝对路径引用 → $f"
  fi
  fi
done < <(find "$SITE_DIR" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -print0)

if [[ "$ABS_FOUND" == "1" ]]; then
  log "请手动将上述文件中的绝对路径改为相对路径后重试"
  fail "存在绝对路径，终止部署"
else
  log "路径检查通过（均为相对路径）"
fi

# ── 3. 远程仓库：查询或创建 ────────────────────────────────
log "查询码云仓库 ${GITEE_USER}/${GITEE_REPO} ..."
REPO_JSON="$(api GET "${API}/repos/${GITEE_USER}/${GITEE_REPO}" || true)"
if echo "$REPO_JSON" | grep -q '"id"'; then
  log "仓库已存在"
  if echo "$REPO_JSON" | grep -q '"private":true'; then
    fail "仓库为私有，免费 Gitee Pages 仅支持开源公开仓库。请到码云将仓库设为公开。"
  fi
else
  log "仓库不存在，自动创建开源公开仓库..."
  CREATE_JSON="$(api POST "${API}/user/repos" \
    -d "{\"name\":\"${GITEE_REPO}\",\"description\":\"Romola Creative Portfolio\",\"private\":false,\"has_issues\":false,\"has_wiki\":false}")"
  echo "$CREATE_JSON" | grep -q '"id"' || fail "创建仓库失败：${CREATE_JSON}"
  log "仓库创建成功"
fi

# ── 4. 初始化 Git 并推送 ───────────────────────────────────
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cp -a "$SITE_DIR/." "$WORK/"
cd "$WORK"

git init -b "$GITEE_BRANCH"
git config user.email "${GITEE_USER}@users.noreply.gitee.com"
git config user.name "$GITEE_USER"
git config http.postBuffer 524288000
git add -A
git commit -m "Deploy portfolio $(date -u +%Y-%m-%dT%H:%M:%SZ)"

REMOTE="https://${GITEE_USER}:${GITEE_TOKEN}@gitee.com/${GITEE_USER}/${GITEE_REPO}.git"
log "推送到 ${GITEE_USER}/${GITEE_REPO} （分支 ${GITEE_BRANCH}）..."
git push -f "$REMOTE" "$GITEE_BRANCH"
log "代码推送完成"

# ── 5. 尝试开启 / 更新 Gitee Pages ─────────────────────────
PAGES_URL="https://${GITEE_USER}.gitee.io/${GITEE_REPO}/"
log "尝试通过 API 触发 Pages 部署..."

BUILD_RESP="$(api POST "${API}/repos/${GITEE_USER}/${GITEE_REPO}/pages/builds" \
  -d "{\"branch\":\"${GITEE_BRANCH}\",\"build_directory\":\"/\",\"force_https\":true}" 2>/dev/null || true)"

if echo "$BUILD_RESP" | grep -qE '"status"|"message":"OK"|部署'; then
  log "Pages 部署已触发"
else
  log "API 未能自动开启 Pages（码云免费版通常需首次在网页手动启动）"
  log "请打开：https://gitee.com/${GITEE_USER}/${GITEE_REPO}/pages"
  log "  部署分支：${GITEE_BRANCH}"
  log "  部署目录：/（根目录）"
  log "  强制 HTTPS：开启"
  log "  点击「启动」或「更新」"
fi

# ── 6. 输出访问链接 ────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  部署完成！"
echo "  公开访问链接：https://${GITEE_USER}.gitee.io/${GITEE_REPO}/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "后续更新：修改网站后执行"
echo "  GITEE_USER=${GITEE_USER} GITEE_TOKEN=你的令牌 ./scripts/deploy-gitee-portfolio.sh"
echo ""
