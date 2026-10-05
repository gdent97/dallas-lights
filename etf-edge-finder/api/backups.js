import {createHash,timingSafeEqual,randomUUID,webcrypto} from 'node:crypto';
import {put,get,list} from '@vercel/blob';

const CONFIG='etf-edge-system/auth-v2.json';
const BACKUP_PREFIX='etf-edge-backups/';
const token=()=>process.env.BLOB_READ_WRITE_TOKEN;
const digest=x=>createHash('sha256').update(x).digest('hex');
const jsonHeaders=res=>{res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');};

async function readBlob(pathname){
  const r=await get(pathname,{access:'private',token:token(),useCache:false});
  if(!r||r.statusCode!==200)return null;
  return JSON.parse(await new Response(r.stream).text());
}
async function allBlobs(){
  let cursor,items=[];
  do{const page=await list({token:token(),cursor,limit:1000});items.push(...(page.blobs||[]));cursor=page.cursor||undefined;}while(cursor);
  return items;
}
function candidateBlobs(items){
  return items.filter(b=>b.pathname!==CONFIG&&/\.json$/i.test(b.pathname||''));
}
async function expectedHash(){
  try{const c=await readBlob(CONFIG);return typeof c?.expected==='string'&&/^[a-f0-9]{64}$/.test(c.expected)?c.expected:null;}catch{return null;}
}
async function proofMatches(proof,items){
  if(typeof proof!=='string'||!/^[A-Za-z0-9+/]{43}=$/.test(proof))return false;
  const key=Buffer.from(proof,'base64');if(key.length!==32)return false;
  for(const b of candidateBlobs(items).slice(0,100)){
    try{
      const envelope=await readBlob(b.pathname);
      if(!envelope||envelope.version!==1||typeof envelope.iv!=='string'||typeof envelope.ciphertext!=='string')continue;
      const k=await webcrypto.subtle.importKey('raw',key,'AES-GCM',false,['decrypt']);
      const plain=await webcrypto.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(envelope.iv,'base64')},k,Buffer.from(envelope.ciphertext,'base64'));
      const d=JSON.parse(Buffer.from(plain).toString('utf8'));
      if(d&&[4,5,6].includes(d.version)&&Array.isArray(d.trades)&&Array.isArray(d.adjustments))return true;
    }catch{}
  }
  return false;
}
async function authenticate(req){
  const supplied=req.headers['x-backup-auth'];
  if(typeof supplied!=='string'||!/^[a-f0-9]{64}$/.test(supplied))return false;
  let expected=await expectedHash();
  if(!expected){
    const items=await allBlobs(),candidates=candidateBlobs(items);
    const canEnroll=!candidates.length||await proofMatches(req.headers['x-backup-proof'],items);
    if(!canEnroll)return false;
    expected=digest(supplied);
    await put(CONFIG,JSON.stringify({version:2,expected,enrolledAt:Date.now()}),{access:'private',token:token(),addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});
  }
  const actual=digest(supplied);
  return timingSafeEqual(Buffer.from(actual),Buffer.from(expected));
}
function publicId(pathname){return Buffer.from(pathname).toString('base64url');}
function pathnameFromId(id){try{return Buffer.from(String(id),'base64url').toString('utf8')}catch{return''}}

export default async function handler(req,res){
  jsonHeaders(res);
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed'});}
  if(!token())return res.status(503).json({error:'Private backup storage is not configured'});
  try{
    if(!await authenticate(req))return res.status(401).json({error:'Recovery key is not recognized'});
    if(req.method==='POST'){
      if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required'});
      const body=req.body;
      if(!body||body.version!==1||typeof body.iv!=='string'||typeof body.ciphertext!=='string'||body.iv.length>100||body.ciphertext.length>2500000)return res.status(400).json({error:'Invalid encrypted backup'});
      const savedAt=Date.now(),pathname=BACKUP_PREFIX+savedAt+'-'+randomUUID()+'.json';
      await put(pathname,JSON.stringify(body),{access:'private',token:token(),addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});
      return res.status(200).json({id:publicId(pathname),savedAt});
    }
    if(req.query?.id){
      const pathname=pathnameFromId(req.query.id);
      if(!pathname||pathname===CONFIG||!pathname.endsWith('.json'))return res.status(400).json({error:'Invalid backup id'});
      const body=await readBlob(pathname);if(!body)return res.status(404).json({error:'Backup not found'});return res.status(200).json(body);
    }
    const items=candidateBlobs(await allBlobs()).sort((a,b)=>String(b.uploadedAt||'').localeCompare(String(a.uploadedAt||'')));
    const backups=items.slice(0,1000).map(b=>({id:publicId(b.pathname),savedAt:Date.parse(b.uploadedAt)||Date.now()}));
    return res.status(200).json({backups,cursor:null});
  }catch(e){console.warn('backup_request_failed',{kind:e?.name||'Error'});return res.status(502).json({error:'Private backup service temporarily unavailable'});}
}
