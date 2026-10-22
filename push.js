// بيكتب اللينك الحالي في ملف link.json على GitHub
// الاستخدام: node push.js https://xxxx.trycloudflare.com
const { GH_TOKEN, GH_REPO } = process.env; // GH_REPO مثال: ahmed/reality-link
const url = process.argv[2];

if (!GH_TOKEN || !GH_REPO || !url) {
  console.log('ناقص إعدادات GitHub (GH_TOKEN / GH_REPO) أو اللينك');
  process.exit(1);
}

const api = `https://api.github.com/repos/${GH_REPO}/contents/link.json`;
const headers = {
  Authorization: 'Bearer ' + GH_TOKEN,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'reality-tablet',
};

(async () => {
  let sha;
  const cur = await fetch(api, { headers });
  if (cur.ok) sha = (await cur.json()).sha;

  const content = Buffer.from(JSON.stringify({ url, updated: new Date().toISOString() })).toString('base64');
  const res = await fetch(api, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: 'update link', content, sha, branch: 'main' }),
  });
  console.log(res.ok ? 'تم تحديث اللينك على GitHub ✅' : 'فشل التحديث: ' + res.status + ' ' + (await res.text()));
})().catch((e) => console.log('خطأ:', e.message));
