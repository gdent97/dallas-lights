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
  // Recovery snapshots are full journal copies. Bound both count and bytes so
  // a save cannot fill localStorage with redundant versions of the same history.
  const RECOVERY_PREFIX = 'etfEdgeRecovery:';
  const MAX_RECOVERY_POINTS = 6;
  const RECOVERY_BYTES = 1000000; // UTF-16 byte estimate, leaves space for the live journal.
  const isQuotaError = e => e?.name==='QuotaExceededError' || e?.code===22 || e?.code===1014;
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
        // Recover browser quota immediately on page load, after validating the active journal.
        this.pruneRecoveries();
      } catch(e) {this.error=e;this.data=empty();this.revision=0;}
    }
    recoveryEntries() {
      const entries=[];
      for(let i=0;i<this.storage.length;i++){
        const key=this.storage.key(i);
        if(key?.startsWith(RECOVERY_PREFIX)) {
          const raw=this.storage.getItem(key);
          entries.push({key,bytes:2*(key.length+(raw?.length||0))});
        }
      }
      return entries.sort((a,b)=>a.key.localeCompare(b.key));
    }
    pruneRecoveries(maxCount=MAX_RECOVERY_POINTS,maxBytes=RECOVERY_BYTES) {
      const entries=this.recoveryEntries();
      let bytes=entries.reduce((sum,p)=>sum+p.bytes,0);
      while(entries.length && (entries.length>maxCount || bytes>maxBytes)) {
        const oldest=entries.shift();
        this.storage.removeItem(oldest.key);
        bytes-=oldest.bytes;
      }
    }
    writeWithReclaim(key,value,protectedKey=null) {
      for(;;) {
        try {this.storage.setItem(key,value);return;}
        catch(e) {
          if(!isQuotaError(e))throw e;
          // Never touch unrelated browser keys, the active journal, or the new recovery point.
          const oldest=this.recoveryEntries().find(p=>p.key!==protectedKey);
          if(!oldest)throw e;
          this.storage.removeItem(oldest.key);
        }
      }
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
        const raw=JSON.stringify({revision:this.revision+1,savedAt:Date.now(),data:next});
        const pointKey=RECOVERY_PREFIX+Date.now()+':'+crypto.randomUUID();
        const point=JSON.stringify({savedAt:Date.now(),label:'Before '+label,data:this.data});
        // IMPORTANT: reclaim BEFORE allocating the next full recovery copy.
        // The current validated journal remains untouched if either write fails.
        this.pruneRecoveries(MAX_RECOVERY_POINTS-1,RECOVERY_BYTES);
        let createdPoint=false;
        try {
          this.writeWithReclaim(pointKey,point);
          createdPoint=true;
          this.writeWithReclaim(KEY,raw,pointKey);
          assert(this.storage.getItem(KEY)===raw,'Could not verify the saved journal.');
        } catch(e) {
          if(createdPoint && this.storage.getItem(KEY)===this.raw)this.storage.removeItem(pointKey);
          if(isQuotaError(e))throw Error('Browser storage is still full. No new journal changes were saved. Download a JSON backup and check available browser storage.');
          throw e;
        }
        this.raw=raw;this.data=clone(next);this.revision++;
        this.pruneRecoveries(MAX_RECOVERY_POINTS,RECOVERY_BYTES);
        return clone(next);
      });
    }
    recoveryPoints() {
      const points=[];
      for(const {key} of this.recoveryEntries()){
        try {const p=JSON.parse(this.storage.getItem(key));points.push({key,...p});}catch{}
      }
      return points.sort((a,b)=>b.savedAt-a.savedAt);
    }
  }

  // IndexedDB stores the authoritative journal. Leave the original localStorage
  // journal untouched as a migration fallback; it must not consume more quota.
  const DB_NAME='ETFEdgePersistentJournal';
  const DB_STORE='records';
  const DB_KEY='active';
  function openDB(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(DB_STORE))req.result.createObjectStore(DB_STORE);};
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||Error('Database opening failed'));
      req.onblocked=()=>reject(Error('Another tab is blocking database initialization'));
    });
  }
  function readDB(db){
    return new Promise((resolve,reject)=>{
      const req=db.transaction(DB_STORE,'readonly').objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error||Error('Database read failed'));
    });
  }
  function writeDB(db,record){
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(DB_STORE,'readwrite');
      tx.objectStore(DB_STORE).put(record,DB_KEY);
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error||Error('Database write failed'));
      tx.onabort=()=>reject(tx.error||Error('Database transaction aborted'));
    });
  }
  function keepRecoveries(rows){
    const seen=new Set(),result=[];let bytes=0;
    for(const p of [...rows].sort((a,b)=>(+b.savedAt||0)-(+a.savedAt||0))){
      if(!object(p)||!object(p.data))continue;
      try{validate(p.data);}catch{continue;}
      const record={savedAt:+p.savedAt||Date.now(),label:String(p.label||'Recovery point').slice(0,300),data:p.data};
      const key=record.savedAt+':'+record.label,size=2*JSON.stringify(record).length;
      if(seen.has(key)||result.length>=6||bytes+size>8000000)continue;
      seen.add(key);result.push(record);bytes+=size;
    }
    return result;
  }
  class PersistentStore extends Store {
    constructor(storage,locks){
      super(storage,locks);
      this.mode='localStorage';this.db=null;this.dbRecoveries=[];
      this.persistenceWarning='';
      this.ready=this.initializeDB();
    }
    async initializeDB(){
      if(typeof indexedDB==='undefined'){
        this.persistenceWarning='IndexedDB unavailable. Using limited browser storage.';
        return;
      }
      let db;
      try{
        db=await openDB();
        const current=await readDB(db);
        const legacy=this.error?[]:super.recoveryPoints();
        const localDate=this.raw?Number(JSON.parse(this.raw).savedAt)||0:0;
        let candidate;
        if(current){
          const saved=validate(current.data);
          const revision=Number(current.revision)||0;
          if(!this.error&&this.raw&&localDate>(+current.savedAt||0)&&stable(this.data)!==stable(saved)){
            // Reconcile edits made by a pre-migration tab without dropping its trades.
            const merged=merge(this.data,saved);
            candidate={revision:Math.max(revision,this.revision)+1,savedAt:Date.now(),data:merged,
              recoveries:keepRecoveries([{savedAt:current.savedAt,label:'Before migration reconciliation',data:saved},...(current.recoveries||[]),...legacy])};
          }else{
            candidate={revision,savedAt:+current.savedAt||Date.now(),data:saved,
              recoveries:keepRecoveries([...(current.recoveries||[]),...legacy])};
          }
        }else{
          if(this.error)throw this.error;
          candidate={revision:this.revision,savedAt:localDate||Date.now(),data:validate(this.data),
            recoveries:keepRecoveries(legacy)};
        }
        await writeDB(db,candidate);
        const verified=await readDB(db);
        assert(verified&&verified.revision===candidate.revision&&stable(verified.data)===stable(candidate.data),'Migrated database failed verification');
        this.db=db;this.data=clone(verified.data);this.revision=verified.revision;
        this.dbRecoveries=clone(verified.recoveries||[]);this.mode='indexedDB';this.error=null;
        // Only duplicate recovery snapshots are removed AFTER verified migration.
        // Never delete etfEdgeJournalV6: the original local journal stays as backup.
        super.pruneRecoveries(0,0);
        if(typeof BroadcastChannel!=='undefined'){
          this.channel=new BroadcastChannel('ETFEdgeJournalChanges');
          this.channel.onmessage=evt=>{
            if(evt.data?.revision>this.revision)
              window.dispatchEvent(new CustomEvent('journal-changed-elsewhere'));
          };
        }
      }catch(e){
        if(db&&db!==this.db)db.close();
        this.persistenceWarning='IndexedDB migration unavailable ('+(e?.message||'unknown error')+'). Original browser journal retained.';
      }
    }
    async save(data,label='Saved changes'){
      await this.ready;
      if(this.mode!=='indexedDB')return super.save(data,label);
      assert(!this.error,'The journal could not be recovered safely. Export original browser storage before editing.');
      assert(this.locks?.request,'This browser cannot safely coordinate saves. Use current Chrome, Safari, Firefox or Edge.');
      const expected=this.revision;
      return this.locks.request('etf-edge-journal-save',async()=>{
        assert(this.revision===expected,'Another edit finished saving. Reload before continuing.');
        const current=await readDB(this.db);
        assert(current&&current.revision===expected,'A different tab saved newer data. Reload this page before editing.');
        const next=validate(data);
        next.activity.push({id:crypto.randomUUID(),ts:Date.now(),label});
        const record={revision:expected+1,savedAt:Date.now(),data:next,
          recoveries:keepRecoveries([{savedAt:Date.now(),label:'Before '+label,data:this.data},...(current.recoveries||[])])};
        try{
          await writeDB(this.db,record);
          const check=await readDB(this.db);
          assert(check&&check.revision===record.revision&&stable(check.data)===stable(next),'Could not verify saved journal');
        }catch(e){throw Error('IndexedDB save failed; previous journal was not intentionally deleted: '+e.message);}
        this.data=clone(next);this.revision=record.revision;this.dbRecoveries=clone(record.recoveries);
        this.channel?.postMessage({revision:this.revision});
        return clone(next);
      });
    }
    recoveryPoints(){
      return this.mode==='indexedDB'?clone(this.dbRecoveries):super.recoveryPoints();
    }
  }

  globalThis.ETFData={KEY,LEGACY,SETTINGS,DEFAULTS,empty,validate,replay,merge,Store:PersistentStore,clone,stable};
})();
