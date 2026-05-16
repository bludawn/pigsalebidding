#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/Users/baack/Desktop/CodeBuddy/pigsalebidding/customer"
REMOTE_TARGET="${1:-root@47.107.66.81}"
REMOTE_DIR="${2:-/usr/share/nginx/html/customer}"
BUILD_BASE="${BUILD_BASE:-/customer/}"
FILE_BASE_URL="${FILE_BASE_URL:-}"

if ! command -v ssh >/dev/null 2>&1; then
  echo "未找到 ssh 命令，请先安装 OpenSSH 客户端。"
  exit 1
fi

if ! command -v scp >/dev/null 2>&1; then
  echo "未找到 scp 命令，请先安装 OpenSSH 客户端。"
  exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "项目目录不存在: $PROJECT_DIR"
  exit 1
fi

echo "[1/4] 进入项目目录: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "[2/4] 安装依赖并构建静态资源 (base=$BUILD_BASE, fileBase=${FILE_BASE_URL:-<empty>})"
if [ -f "pnpm-lock.yaml" ]; then
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "检测到 pnpm-lock.yaml，但未安装 pnpm。请先执行: npm i -g pnpm"
    exit 1
  fi
  pnpm install --frozen-lockfile
else
  npm install
fi

VITE_FILE_BASE_URL="$FILE_BASE_URL" npx vite build --base="$BUILD_BASE"

if [ ! -d "dist" ]; then
  echo "构建失败：未找到 dist 目录"
  exit 1
fi

ARCHIVE_NAME="customer_dist_$(date +%Y%m%d%H%M%S).tar.gz"
LOCAL_ARCHIVE="/tmp/$ARCHIVE_NAME"

echo "[3/4] 打包构建产物: $LOCAL_ARCHIVE"
tar -C dist -czf "$LOCAL_ARCHIVE" .

echo "[4/4] 上传并发布到 $REMOTE_TARGET:$REMOTE_DIR"
scp "$LOCAL_ARCHIVE" "$REMOTE_TARGET:/tmp/$ARCHIVE_NAME"
ssh "$REMOTE_TARGET" "mkdir -p '$REMOTE_DIR' && rm -rf '$REMOTE_DIR'/* && tar -xzf '/tmp/$ARCHIVE_NAME' -C '$REMOTE_DIR' && rm -f '/tmp/$ARCHIVE_NAME'"

rm -f "$LOCAL_ARCHIVE"

echo "部署完成。访问地址: http://47.107.66.81/customer"
