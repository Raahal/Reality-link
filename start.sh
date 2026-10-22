#!/data/data/com.termux/files/usr/bin/bash
# تشغيل Reality: السيرفر + اللينك الأونلاين + تحديث اللينك على GitHub
cd "$(dirname "$0")"
termux-wake-lock 2>/dev/null
[ -f ~/.reality-config ] && source ~/.reality-config
export GH_TOKEN GH_REPO

pkill -f "node server.js" 2>/dev/null
pkill cloudflared 2>/dev/null

node server.js &
sleep 2

: > tunnel.log
cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &

echo "بستنى اللينك..."
URL=""
for i in $(seq 1 60); do
  URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' tunnel.log | head -1)
  [ -n "$URL" ] && break
  sleep 1
done

if [ -z "$URL" ]; then
  echo "اللينك ماظهرش. شوف tunnel.log"
else
  echo ""
  echo "======================================"
  echo " اللينك الحالي: $URL"
  echo "======================================"
  node push.js "$URL"
fi

wait
