/* Load the UI only after the persistent journal has been migrated/verified. */
(() => {
  globalThis.__etfBuild='2026-11-20e';
  const journal=globalThis.__etfBootStore=new ETFData.Store(localStorage,navigator.locks);
  function load(src){return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src+'?v='+encodeURIComponent(globalThis.__etfBuild);script.async=false;
    script.onload=resolve;script.onerror=()=>reject(Error('Failed loading '+src));
    document.body.appendChild(script);
  });}
  journal.ready.then(async()=>{
    for(const src of ['/app.js','/workspace.js','/cloud.js','/enhancements.js'])await load(src);
  }).catch(error=>{
    const el=document.getElementById('storageWarning');
    if(el){el.hidden=false;el.textContent='Tracker could not initialize safely: '+error.message;}
    console.error('ETF tracker failed to initialize',error);
  });
})();
