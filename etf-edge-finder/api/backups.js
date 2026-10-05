export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed'});}
  try{
    const target=new URL('https://etf-edge-finder-6qdrcfvq0-pilot-financial.vercel.app/api/backups');
    for(const [k,v] of Object.entries(req.query||{}))if(k!=='path'){if(Array.isArray(v))v.forEach(x=>target.searchParams.append(k,String(x)));else if(v!=null)target.searchParams.set(k,String(v));}
    const headers={};if(typeof req.headers['x-backup-auth']==='string')headers['x-backup-auth']=req.headers['x-backup-auth'];if(req.method==='POST')headers['content-type']='application/json';
    const upstream=await fetch(target,{method:req.method,headers,body:req.method==='POST'?JSON.stringify(req.body):undefined,signal:AbortSignal.timeout(25000)});
    const body=await upstream.text();res.status(upstream.status);res.setHeader('content-type',upstream.headers.get('content-type')||'application/json; charset=utf-8');return res.send(body);
  }catch(e){console.warn('backup_proxy_failed',{kind:e?.name||'Error'});return res.status(e?.name==='TimeoutError'?504:502).json({error:'Backup service temporarily unavailable'});}
}
