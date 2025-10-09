// secure3d-server/server.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import crypto from 'crypto';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

/* =========================
   CẤU HÌNH CHUNG
========================= */
const PORT = parseInt(process.env.PORT || '3000', 10);
const SESSION_TTL_SECONDS = parseInt(process.env.SESSION_TTL_SECONDS || '3600', 10);

// Khóa ký token phiên (base64). Nếu không set sẽ phát sinh tạm (chỉ phù hợp dev).
const SIGN_KEY =
  process.env.SESSION_SIGN_KEY
    ? Buffer.from(process.env.SESSION_SIGN_KEY, 'base64')
    : crypto.randomBytes(32);

if (!process.env.SESSION_SIGN_KEY) {
  console.warn('[WARN] SESSION_SIGN_KEY is not set — using ephemeral key (dev only).');
}

// Thư mục chứa model đã mã hoá
const MODELS_DIR = path.join(__dirname, 'public', 'models');

// Bộ nhớ phiên demo: token -> { exp }
const sessions = new Map();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// CSP cho phép tailwind CDN, Google Fonts, unpkg (three), blob, data, ws
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'", // cho tailwind CDN
          "'unsafe-eval'",   // cho module loader khi cần
          "https://cdn.tailwindcss.com",
          "https://unpkg.com"
        ],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://cdn.tailwindcss.com"],
      "style-src-elem": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://cdn.tailwindcss.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:", "https://cdnjs.cloudflare.com"],
        "img-src": ["'self'", "data:", "blob:"],
        "connect-src": ["'self'", "blob:", "data:"],
        "worker-src": ["'self'", "blob:"],
        "frame-ancestors": ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Serve website tĩnh (gốc dự án của bạn)
const PROJECT_ROOT = path.join(__dirname, '..'); // chứa /showroom, /logo, /styles.css ...
app.use(express.static(PROJECT_ROOT));

// Đảm bảo viewer.html lấy đúng file nằm cạnh server.js
app.get('/viewer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

/* =========================
   TIỆN ÍCH TOKEN (demo)
========================= */
function b64url(buf){
  return buf.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function signToken(payloadObj){
  const header = b64url(Buffer.from(JSON.stringify({alg:"HS256",typ:"DEMO"})));
  const payload = b64url(Buffer.from(JSON.stringify(payloadObj)));
  const mac = crypto.createHmac('sha256', SIGN_KEY);
  mac.update(header + '.' + payload);
  const sig = b64url(mac.digest());
  return `${header}.${payload}.${sig}`;
}
function verifyToken(tok){
  try{
    const [h,p,sig] = tok.split('.');
    const mac = crypto.createHmac('sha256', SIGN_KEY);
    mac.update(h + '.' + p);
    if (b64url(mac.digest()) !== sig) return null;
    const payload = JSON.parse(Buffer.from(p.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8'));
    if (!payload || !payload.exp || payload.exp < Math.floor(Date.now()/1000)) return null;
    return payload;
  }catch(_){ return null; }
}
function requireSession(req,res,next){
  const auth = req.headers.authorization || '';
  const tok = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!tok) return res.status(401).json({error:'No token'});
  const payload = verifyToken(tok);
  if (!payload) return res.status(401).json({error:'Invalid/expired token'});
  const sess = sessions.get(tok);
  if (!sess || sess.exp < Math.floor(Date.now()/1000)) return res.status(401).json({error:'Session expired'});
  next();
}

/* =========================
   API: PHIÊN + MODELS
========================= */

// Tạo session (demo)
// Viewer sẽ gọi POST /api/session, nhận {token, exp}
app.post('/api/session', (req,res)=>{
  const exp = Math.floor(Date.now()/1000) + SESSION_TTL_SECONDS;
  const token = signToken({exp});
  sessions.set(token, { exp });
  // For demo convenience include the demo key (base64) so client can decrypt
  // WARNING: this is insecure for production. Remove or replace with ECDH/secure key exchange.
  let demoKeyB64 = null;
  try{
    const demoKeyPath = path.join(__dirname, 'keys', 'demo_key.bin');
    if (fs.existsSync(demoKeyPath)) {
      demoKeyB64 = fs.readFileSync(demoKeyPath).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    }
  }catch(_){ demoKeyB64 = null; }

  const resp = { token, exp };
  if (demoKeyB64) resp.keyB64 = demoKeyB64;
  res.json(resp);
});

// Liệt kê model đã mã hoá (đọc *.glb.json trong /public/models)
// Trả về mảng tên logic: ["Dau_du.glb", "voi_1.glb", ...]
app.get('/api/models', requireSession, (req,res)=>{
  if (!fs.existsSync(MODELS_DIR)) return res.json([]);
  const out = [];
  for (const f of fs.readdirSync(MODELS_DIR)) {
    if (f.endsWith('.glb.json')) {
      try {
        const j = JSON.parse(fs.readFileSync(path.join(MODELS_DIR,f),'utf8'));
        const name = j.encName || f.replace(/\.json$/,'').replace(/\.enc$/,'');
        out.push(name);
      } catch (_) {}
    }
  }
  res.json([...new Set(out)].sort());
});

// Lấy manifest cho 1 model: /api/model/enc/:name
// Trả nguyên nội dung file "<name>.glb.json" (đúng format encrypt.js tạo ra)
app.get('/api/model/enc/:name', requireSession, (req,res)=>{
  const { name } = req.params;
  const manPath = path.join(MODELS_DIR, `${name}.json`); // ví dụ Dau_du.glb.json
  if (!fs.existsSync(manPath)) return res.status(404).json({error:'Not found'});
  try {
    const manifest = JSON.parse(fs.readFileSync(manPath,'utf8'));
    res.json(manifest);
  } catch(err){
    res.status(500).json({error:'Manifest parse error'});
  }
});

// Trả chunk ciphertext+tag: /api/model/enc/:name/chunk/:idx
app.get('/api/model/enc/:name/chunk/:idx', requireSession, (req,res)=>{
  const { name, idx } = req.params;
  const encPath = path.join(MODELS_DIR, `${name}.enc`); // Dau_du.glb.enc
  const manPath = path.join(MODELS_DIR, `${name}.json`);
  if (!fs.existsSync(encPath) || !fs.existsSync(manPath)) return res.status(404).end();

  const i = parseInt(idx,10);
  if (isNaN(i) || i < 0) return res.status(400).end();

  const manifest = JSON.parse(fs.readFileSync(manPath,'utf8'));
  if (!Array.isArray(manifest.ivs) || i >= manifest.ivs.length) return res.status(400).end();

  const tag = (manifest.tagPerChunk ?? 16);
  const perChunkOnDisk = manifest.chunkSize + tag; // ciphertext + tag
  const start = i * perChunkOnDisk;
  const endExclusive = Math.min(start + perChunkOnDisk, fs.statSync(encPath).size);

  res.setHeader('Content-Type','application/octet-stream');
  fs.createReadStream(encPath, { start, end: endExclusive - 1 }).pipe(res);
});

// (tùy chọn) Trả model thô cho test: /api/model/raw/:name
// BỎ qua trong production nếu bạn chỉ dùng bản mã hoá
app.get('/api/model/raw/:name', requireSession, (req,res)=>{
  const rawPath = path.join(MODELS_DIR, req.params.name);
  if (!fs.existsSync(rawPath)) return res.status(404).json({error:'Not found'});
  res.setHeader('Content-Type','application/octet-stream');
  fs.createReadStream(rawPath).pipe(res);
});

/* =========================
   START
========================= */
app.listen(PORT, ()=>{
  console.log(`Website + Secure3D API đang chạy: http://localhost:${PORT}`);
});
