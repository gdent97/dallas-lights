export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const t=String(req.query?.t||'').toUpperCase().trim();
  if(!/^[A-Z0-9.^-]{1,15}$/.test(t))return res.status(400).json({error:'Invalid ticker'});
  try{
    const url='https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(t)+'?range=2y&interval=1d&includePrePost=false&events=div%2Csplits';
    const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(12000)});
    if(!r.ok)return res.status(r.status===429?429:502).json({error:'Price provider unavailable. Treat last valid prices as stale.'});
    const data=await r.json();if(!data?.chart?.result?.[0]||data.chart.error)return res.status(502).json({error:'No valid price history returned'});
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=60');return res.status(200).json(data);
  }catch(e){console.warn('history_request_failed',{ticker:t,kind:e?.name||'Error'});return res.status(e?.name==='TimeoutError'?504:502).json({error:'History temporarily unavailable'});}
}
