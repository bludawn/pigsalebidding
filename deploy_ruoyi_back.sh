#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/Users/baack/Desktop/CodeBuddy/pigsalebidding/erpweb/RuoYi-Vue-v3.9.1"
REMOTE_TARGET="${1:-root@47.107.66.81}"
REMOTE_DIR="${2:-/usr/share/nginx/html}"
SERVICE_NAME="${SERVICE_NAME:-ruoyi-admin}"
RESTART_SERVICE="${RESTART_SERVICE:-1}"

if ! command -v mvn >/dev/null 2>&1; then
  echo "未找到 mvn 命令，请先安装 Maven。"
  exit 1
fi

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

echo "[1/4] 进入后端项目目录: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "[2/4] 执行打包: mvn clean package -Dmaven.test.skip=true"
mvn clean package -Dmaven.test.skip=true

JAR_PATH="/Users/baack/Desktop/CodeBuddy/pigsalebidding/erpweb/RuoYi-Vue-v3.9.1/ruoyi-admin/target/ruoyi-admin.jar"
if [ ! -f "$JAR_PATH" ]; then
  JAR_PATH=$(find "/Users/baack/Desktop/CodeBuddy/pigsalebidding/erpweb/RuoYi-Vue-v3.9.1/ruoyi-admin/target" -maxdepth 1 -type f -name "*.jar" ! -name "*original*" ! -name "*sources*" ! -name "*javadoc*" | head -n 1 || true)
fi

if [ -z "${JAR_PATH:-}" ] || [ ! -f "$JAR_PATH" ]; then
  echo "打包失败：未找到可上传的 jar 包（期望路径：ruoyi-admin/target/ruoyi-admin.jar）"
  exit 1
fi

JAR_NAME=$(basename "$JAR_PATH")

echo "[3/4] 上传 jar 包到服务器: $JAR_NAME -> $REMOTE_TARGET:$REMOTE_DIR"
scp "$JAR_PATH" "$REMOTE_TARGET:/tmp/$JAR_NAME"

echo "[4/5] 发布到目标目录: $REMOTE_DIR"
ssh "$REMOTE_TARGET" "mkdir -p '$REMOTE_DIR' && cp -f '/tmp/$JAR_NAME' '$REMOTE_DIR/$JAR_NAME' && rm -f '/tmp/$JAR_NAME'"

if [ "$RESTART_SERVICE" = "1" ]; then
  echo "[5/5] 重启服务: $SERVICE_NAME"
  ssh "$REMOTE_TARGET" "if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q '^${SERVICE_NAME}\\.service'; then systemctl restart '${SERVICE_NAME}' && systemctl status '${SERVICE_NAME}' --no-pager -l | head -n 20; else echo '未找到 systemd 服务 ${SERVICE_NAME}.service，已跳过重启'; fi"
else
  echo "[5/5] 已跳过服务重启 (RESTART_SERVICE=$RESTART_SERVICE)"
fi

echo "部署完成：$REMOTE_DIR/$JAR_NAME"
