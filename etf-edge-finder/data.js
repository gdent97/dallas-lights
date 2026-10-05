/* Shared data validation and atomic journal storage. No network or seeded trades. */
(() => {
  const KEY = 'etfEdgeJournalV6';
  const LEGACY = {borrow:'etfEdgeBorrow',avail:'etfEdgeAvailability',planned:'etfEdgePlannedShort',borrowTs:'etfEdgeBorrowUpdatedAt',availTs:'etfEdgeAvailabilityUpdatedAt',trades:'etfEdgeOpenTradesV2',adjustments:'etfEdgeAdjustmentsV1',snapshots:'etfEdgeBrokerSnapshotsV1',corpState:'etfEdgeCorpActionStateV1'};
  const SETTINGS = {target:'etfEdgeTargetLong',base:'etfEdgeBaseFunding',spread:'etfEdgeFundingSpread',fee:'etfEdgeFeeAllowance',buffer:'etfEdgeCostBuffer',band:'etfEdgeRebalanceThreshold',closeWindow:'etfEdgeCloseWindow',emergencyBand:'etfEdgeEmergencyBand'};
  const DEFAULTS = {target:'10000',base:'3.75',spread:'1',fee:'1',buffer:'1',band:'10',closeWindow:'15',emergencyBand:'20'};
  const clone = x => JSON.parse(JSON.stringify(x));
  const stable = x => JSON.stringify(x, function(k,v) { return v && !Array.isArray(v) && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])) : v; });
  const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const number = (x,min=0) => x!=='' && x!==null && typeof x!=='boolean' && Number.isFinite(Number(x)) && Number(x)>=min;
  const symbol = x => typeof x==='string' && /^[A-Z0-9.^-]{1,15}$/.test(x);
  const assert = (ok,message) => { if(!ok) throw Error(message); };
  const timestamp = x => number(x,1) && Number(x)<=Date.now()+86400000;
  function empty() { return {version:6,borrow:{},avail:{},planned:{},borrowTs:{},availTs:{},trades:[],adjustments:[],snapshots:{},corpState:{},settings:{...DEFAULTS},archive:[],activity:[],performance:[],borrowHistory:[],capitalHistory:[]}; }
  function rejectUnsafeKeys(x) {
    if(!x || typeof x!=='object') return;
    for(const [k,v] of Object.entries(x)) { assert(!['__proto__','constructor','prototype'].includes(k),'Unsafe backup field.'); rejectUnsafeKeys(v); }
  }
  function validate(input) {
    assert(object(input),'This is not a tracker backup.'); rejectUnsafeKeys(input);
    assert([4,5,6].includes(input.version),'Unsupported backup version.');
    for(const k of ['trades','adjustments']) assert(Array.isArray(input[k]),'Backup is missing '+k+'. No records were changed.');
    for(const k of ['borrow','avail','planned','borrowTs','availTs','snapshots','settings']) assert(object(input[k]),'Backup is missing '+k+'. No records were changed.');
    if(input.version>=5) assert(object(input.corpState),'Backup is missing corporate-action history.');
    const d = {...empty(),...clone(input),version:6};
    const ids=new Set();
    for(const t of d.trades) {
      assert(object(t)&&typeof t.id==='string'&&/^[\w-]{1,120}$/.test(t.id)&&!ids.has(t.id),'Invalid or duplicate trade ID.'); ids.add(t.id);
      assert(symbol(t.e)&&symbol(t.u)&&number(t.L,0.01),'Invalid trade pair.');
      for(const k of ['longShares','shortShares','longFill','shortFill']) assert(number(t[k],0.000000001),'Invalid '+k+' in trade '+t.id+'.');
      assert(typeof t.openedAt==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(t.openedAt)&&Number.isFinite(Date.parse(t.openedAt)),'Invalid entry date.');
      if(t.openedTs!=null) assert(timestamp(t.openedTs),'Invalid trade timestamp.');
    }
    for(const a of d.adjustments) {
      assert(object(a)&&typeof a.id==='string'&&/^[\w-]{1,120}$/.test(a.id)&&!ids.has(a.id),'Invalid or duplicate adjustment ID.'); ids.add(a.id);
      assert(symbol(a.e)&&timestamp(a.ts),'Invalid adjustment pair or date.');
      assert(['long_buy','long_sell','short_add','short_cover','cost','income'].includes(a.action),'Unknown adjustment action.');
      if(['cost','income'].includes(a.action)) assert(number(a.cost,0.000000001),'Invalid cash amount.');
      else for(const k of ['shares','price']) assert(number(a[k],0.000000001),'Invalid adjustment '+k+'.');
      assert(a.note==null||typeof a.note==='string'&&a.note.length<=2000,'Invalid note.');
    }
    for(const k of ['borrow','avail','planned','borrowTs','availTs']) for(const [e,v] of Object.entries(d[k])) assert(symbol(e)&&number(v),'Invalid '+k+' input.');
    for(const [e,s] of Object.entries(d.snapshots)) assert(symbol(e)&&object(s)&&number(s.ep,0.000000001)&&number(s.up,0.000000001)&&timestamp(s.ts),'Invalid broker snapshot.');
    assert(object(d.corpState),'Invalid corporate-action state.');
    for(const k of Object.keys(SETTINGS)) if(k in d.settings) assert(number(d.settings[k]),'Invalid setting '+k+'.');
    assert(Number(d.settings.target)>0 && Number(d.settings.band)<100 && Number(d.settings.closeWindow)>0 && Number(d.settings.closeWindow)<=390 && Number(d.settings.emergencyBand)>0,'Settings are outside valid ranges.');
    for(const k of ['archive','activity','performance','borrowHistory','capitalHistory']) assert(Array.isArray(d[k]),'Invalid '+k+' history.');
    assert(d.capitalHistory.every(x=>object(x)&&typeof x.id==='string'&&timestamp(x.ts)&&number(x.amount,0.000000001)),'Invalid capital history.');
    assert(d.archive.every(x=>object(x)&&['trade','adjustment'].includes(x.kind)&&object(x.record)&&typeof x.id==='string'),'Invalid recovery archive.');
    replay(d); // Reject inconsistent histories instead of silently clipping exits.
    return d;
  }
  function replay(d) {
    const result={},events=[];
    for(const t of d.trades) {
      const p=result[t.e]??={e:t.e,u:t.u,L:Number(t.L),longQty:0,longAvg:0,shortQty:0,shortAvg:0,realized:0,costs:0,income:0};
      assert(p.u===t.u && p.L===Number(t.L),'Conflicting pair definitions.');
      const ts=t.openedTs??Date.parse(t.openedAt+'T00:00:00-04:00');
      events.push({ts,e:t.e,action:'long_buy',shares:+t.longShares,price:+t.longFill},{ts:ts+0.001,e:t.e,action:'short_add',shares:+t.shortShares,price:+t.shortFill});
    }
    for(const a of d.adjustments) { assert(result[a.e],'Journal item has no entry lot for '+a.e+'.'); events.push(a); }
    // Existing app's explicit corporate action; historical fills remain untouched.
    const split=Date.parse('2026-08-24T00:00:00-04:00');
    if(events.some(x=>x.e==='MSTU'&&x.ts<split)&&Date.now()>=split) events.push({e:'MSTU',ts:split,action:'split',factor:0.1});
    events.sort((a,b)=>a.ts-b.ts);
    for(const x of events) {
      const p=result[x.e],q=Number(x.shares),price=Number(x.price);
      if(x.action==='cost') { p.costs+=Number(x.cost); continue; }
      if(x.action==='income') { p.income+=Number(x.cost); continue; }
      if(x.action==='split') { p.shortQty*=x.factor; p.shortAvg/=x.factor; continue; }
      const leg=x.action.startsWith('long')?'long':'short',qty=leg+'Qty',avg=leg+'Avg';
      if(['long_buy','short_add'].includes(x.action)) { p[avg]=(p[qty]*p[avg]+q*price)/(p[qty]+q);p[qty]+=q; }
      else { assert(q<=p[qty]+1e-8,'An exit exceeds the recorded '+leg+' position in '+x.e+'. Review the history first.');p.realized+=q*(leg==='long'?price-p[avg]:p[avg]-price);p[qty]-=q;if(p[qty]<1e-8){p[qty]=0;p[avg]=0;} }
    }
    return result;
  }
  function merge(current,incoming) {
    const a=validate(current),b=validate(incoming),out=clone(a);
    for(const k of ['trades','adjustments']) {
      const existing=new Map(a[k].map(x=>[x.id,x]));
      const archived=new Set(a.archive.filter(x=>x.kind===(k==='trades'?'trade':'adjustment')).map(x=>x.record.id));
      for(const record of b[k]) {
        if(archived.has(record.id)) continue;
        if(existing.has(record.id)) assert(stable(existing.get(record.id))===stable(record),'Conflicting versions of '+record.id+'. Import cancelled; existing data preserved.');
        else out[k].push(record);
      }
    }
    // Preserve current inputs; importing an old export must not reset fresher broker data.
    for(const k of ['borrow','avail','planned','borrowTs','availTs','snapshots','corpState']) out[k]={...b[k],...a[k]};
    for(const k of ['archive','activity','performance','borrowHistory','capitalHistory']) {
      const have=new Set(out[k].map(x=>x.id??stable(x)));
      for(const x of b[k]) if(!have.has(x.id??stable(x))) {out[k].push(x);have.add(x.id??stable(x));}
    }
    return validate(out);
  }
  class Store {
    constructor(storage,locks) {
      this.storage=storage;this.locks=locks;this.raw=storage.getItem(KEY);this.error=null;
      try {
        if(this.raw) { const envelope=JSON.parse(this.raw);this.data=validate(envelope.data);this.revision=envelope.revision; }
        else {
          const d=empty();
          for(const [k,key] of Object.entries(LEGACY)) {const raw=storage.getItem(key);if(raw!=null)d[k]=JSON.parse(raw);}
          if(!Array.isArray(d.trades) && object(d.trades)) d.trades=Object.values(d.trades);
          if(storage.getItem(LEGACY.trades)==null && storage.getItem('etfEdgeOpenTradesV1')) d.trades=Object.values(JSON.parse(storage.getItem('etfEdgeOpenTradesV1')));
          for(const [k,key] of Object.entries(SETTINGS)) if(storage.getItem(key)!=null)d.settings[k]=storage.getItem(key);
          this.data=validate(d);this.revision=0;
        }
      } catch(e) {this.error=e;this.data=empty();this.revision=0;}
    }
    async save(data,label='Saved changes') {
      assert(!this.error,'Saving is paused because existing data could not be read. Export the original storage and recover it first.');
      assert(this.locks?.request,'This browser cannot safely coordinate saves. Use a current Safari, Chrome, Edge or Firefox browser.');
      const expectedRevision=this.revision;
      return this.locks.request('etf-edge-journal-save',async()=>{
        assert(this.revision===expectedRevision,'Another change just finished saving. Please repeat this edit; the newer save has been preserved.');
        assert(this.storage.getItem(KEY)===this.raw,'Another tab saved newer changes. Reload this tab before editing; its changes have been preserved.');
        const next=validate(data);
        next.activity.push({id:crypto.randomUUID(),ts:Date.now(),label});
        // Preserve all journal events. Only the redundant recovery snapshots are bounded.
        const pointKey='etfEdgeRecovery:'+Date.now()+':'+crypto.randomUUID();
        this.storage.setItem(pointKey,JSON.stringify({savedAt:Date.now(),label:'Before '+label,data:this.data}));
        const raw=JSON.stringify({revision:this.revision+1,savedAt:Date.now(),data:next});
        this.storage.setItem(KEY,raw); // One atomic write; failure leaves the old journal intact.
        assert(this.storage.getItem(KEY)===raw,'Could not verify the saved journal.');
        this.raw=raw;this.data=clone(next);this.revision++;
        const points=[];for(let i=0;i<this.storage.length;i++){const k=this.storage.key(i);if(k?.startsWith('etfEdgeRecovery:'))points.push(k);}
        points.sort();for(const k of points.slice(0,-40))this.storage.removeItem(k);
        return clone(next);
      });
    }
    recoveryPoints() {
      const points=[];for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(key?.startsWith('etfEdgeRecovery:')){try{const p=JSON.parse(this.storage.getItem(key));points.push({key,...p});}catch{}}}
      return points.sort((a,b)=>b.savedAt-a.savedAt);
    }
  }
  globalThis.ETFData={KEY,LEGACY,SETTINGS,DEFAULTS,empty,validate,replay,merge,Store,clone,stable};
})();
