/* ETF Edge portfolio management enhancements. Additive, advisory-only: never submits broker orders. */
(() => {
  'use strict';
  const el=id=>document.getElementById(id);
  const fmt=(n,d=0)=>Number.isFinite(n)?n.toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  const usd=(n,d=0)=>Number.isFinite(n)?(n<0?'−':'')+'$'+fmt(Math.abs(n),d):'—';
  const percent=(n,d=1)=>Number.isFinite(n)?fmt(n,d)+'%':'—';
  const num=v=>v==null||v===''?NaN:Number(v);
  const labelSafe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const settings=()=>journal.data.settings||{};
  const cfg=k=>num(settings()[k]);
  const open=()=>allLedgers().filter(x=>x.longQty>0||x.shortQty>0);
  const quoteOK=p=>p?.prices?.ep>0&&p?.prices?.up>0&&!p.prices.failed;
  const openPriced=()=>open().filter(quoteOK);
  const latestQuote=a=>a.prices&&Date.now()-a.prices.ts<=86400000&&!a.prices.failed;
  const readInput=(id)=>el(id)?.value.trim()||'';
  const make=(id,html)=>{const d=document.createElement('section');d.id=id;d.className='card';d.innerHTML=html;return d;};
  const overview=document.querySelector('[data-page="overview"]'),positionsPage=document.querySelector('[data-page="positions"]');
  if(!overview||!positionsPage){console.warn('ETF Edge enhancements: workspace missing');return;}
  const watch=el('decisionCenter')?.closest('.card');
  const capitalCard=el('capitalSummary')?.closest('.card');
  const borrowCard=make('borrowOperations',
    '<div class="decisionHead"><div><h2>Daily borrow check</h2><p class="small muted">Only ETFs you currently short. Copy executable borrow and availability from your brokerage; the tracker cannot verify it automatically.</p></div><span class="pill" id="borrowCheckSummary">No positions yet</span></div>'+
    '<div class="wrap"><table class="ops-table"><thead><tr><th>ETF / short</th><th>Borrow % annually</th><th>Shares available</th><th>Last confirmed</th></tr></thead><tbody id="heldBorrowRows"></tbody></table></div>'+
    '<div class="toolbar" style="margin-top:12px"><button type="button" id="saveBorrowChecks">Save entered checks</button><button type="button" class="secondary" id="verifyBorrowChecks">Checked unchanged</button></div>'+
    '<p id="borrowCheckNotice" class="small muted">Saving updates timestamps in one journal transaction. An unchanged rate does not create a new rate-history observation.</p>');
  const carryCard=make('capitalAndCarry',
    '<h2>Capital, leverage & carrying costs</h2><p class="small muted">Separate account equity, market notional, actual financing debit, and broker margin requirements. Enter actual account-level figures below; blank means unknown, not zero.</p>'+
    '<div id="exposureStats" class="ops-stats"></div>'+
    '<details><summary>Broker financing inputs (manual)</summary><div class="ops-input-grid">'+
    '<label>Actual margin debit $<input type="number" min="0" step=".01" id="marginDebitInput" placeholder="From broker statement"></label>'+
    '<label>Margin borrowing APR %<input type="number" min="0" step=".01" id="marginAPRInput" placeholder="Broker rate"></label>'+
    '<label>Cash rebate on short proceeds %<input type="number" min="0" step=".01" id="shortRebateAPRInput" placeholder="Only if broker pays"></label>'+
    '<label>Illustrative long requirement %<input type="number" min="0" step="1" id="longMarginPctInput" placeholder="Broker requirement"></label>'+
    '<label>Illustrative short requirement %<input type="number" min="0" step="1" id="shortMarginPctInput" placeholder="Broker requirement"></label>'+
    '</div><button type="button" id="saveMarginAssumptions">Save broker inputs</button><p class="small muted">Requirement percentages are scenario inputs, not a broker-computed house or portfolio margin requirement. Short-sale proceeds are not assumed available to pay down debit.</p></details>'+
    '<div id="carryStats" class="ops-stats"></div><p class="small muted" id="carryCoverage"></p>');
  const rebalanceCard=make('rebalanceWorkbench',
    '<h2>Rebalance workbench</h2><p class="small muted">Compare no trade, adjusting short shares, and adjusting long shares. Uses the full recorded hedge book rather than treating a lot in isolation. This is a hypothetical calculation, never an order.</p>'+
    '<div class="ops-input-grid">'+
    '<label>Current pair<select id="rebalanceActivePair"></select></label>'+
    '<label>Pair target hedge %<input id="rebalanceTarget" type="number" min="25" max="200" step=".5" value="95"></label>'+ 
    '<label>Whole-book target hedge %<input id="rebalanceBookTarget" type="number" min="25" max="200" step=".5" value="100"></label>'+
    '<label>Holding horizon, days<input id="rebalanceHorizon" type="number" min="1" max="365" step="1" value="30"></label>'+
    '<label>Estimated one-way execution friction, bps<input id="rebalanceSpread" type="number" min="0" max="1000" step="1" value="10"></label>'+
    '<label>Specific long tax-lot basis, $/share<input id="rebalanceTaxBasis" type="number" min="0" step=".01" placeholder="Optional; not average basis"></label>'+
    '<label>Assumed realized gain tax rate %<input id="rebalanceTaxRate" type="number" min="0" max="65" step=".5" placeholder="Optional"></label>'+
    '</div>'+
    '<div id="rebalanceOutput"></div>'+
    '<p class="small muted">Tax outcomes depend on actual lots, holding period, straddle/loss-deferral and wash-sale rules, and short-sale treatment. Estimated costs exclude unknown commissions, changing borrow terms and broker financing mechanics. No-trade is a valid alternative.</p>');
  const perfCard=make('riskAdjustedPerformance',
    '<h2>Strategy risk & performance quality</h2><p class="small muted">Calculated from historical daily P&amp;L observations where consecutive dates and historical strategy capital are available. Not audited NAV returns.</p>'+
    '<div class="ops-input-grid" style="max-width:420px"><label>Annual risk-free / downside hurdle %<input id="riskFreeAPRInput" type="number" min="-5" max="40" step=".1" placeholder="Optional; 0% if blank"></label><button type="button" id="saveRiskFree" style="align-self:end">Save benchmark</button></div>'+
    '<div id="riskStats" class="ops-stats"></div><p id="riskDataNote" class="small muted"></p>'+
    '<h3>Observed pair contributions</h3><div class="wrap"><table><thead><tr><th>ETF / underlying</th><th>Tracked P&amp;L change</th><th>Snapshots</th></tr></thead><tbody id="riskPairRows"></tbody></table></div>');
  if(watch)overview.insertBefore(borrowCard,watch);
  if(capitalCard)capitalCard.after(carryCard);
  positionsPage.append(rebalanceCard);
  overview.append(perfCard);
  const fields=['marginDebit','marginAPR','shortRebateAPR','longMarginPct','shortMarginPct'];
  const setConfigInputs=()=>{for(const key of fields){const x=el(key+'Input');if(x)x.value=settings()[key]??'';}el('riskFreeAPRInput').value=settings().riskFreeAPR??'';};
  setConfigInputs();
  let borrowSignature='',borrowDirty=false,rebalSignature='';
  function borrowingRows(force=false){
    const held=open().filter(a=>a.shortQty>0).sort((a,b)=>a.e.localeCompare(b.e));
    const signature=held.map(x=>x.e).join('|');
    if(force||signature!==borrowSignature){
      borrowSignature=signature;borrowDirty=false;
      el('heldBorrowRows').innerHTML=held.length?held.map(a=>
        '<tr data-held="'+labelSafe(a.e)+'"><td><strong>'+labelSafe(a.e)+'</strong><div class="small muted">Short '+fmt(a.shortQty,0)+' · '+labelSafe(a.u)+'</div></td>'+
        '<td><input data-borrow-rate="'+labelSafe(a.e)+'" type="number" min="0" step=".01" value="'+labelSafe(journal.data.borrow[a.e]??'')+'" aria-label="'+labelSafe(a.e)+' borrow rate percent"></td>'+
        '<td><input data-borrow-avail="'+labelSafe(a.e)+'" type="number" min="0" step="1" value="'+labelSafe(journal.data.avail[a.e]??'')+'" aria-label="'+labelSafe(a.e)+' short shares available"></td>'+
        '<td><span data-last-check="'+labelSafe(a.e)+'"></span></td></tr>').join(''):
        '<tr><td colspan="4" class="muted">No open ETF short positions. Record paired entry fills first.</td></tr>';
    }
    let stale=0;
    for(const a of held){
      const rateTS=Number(journal.data.borrowTs[a.e]||0),availTS=Number(journal.data.availTs[a.e]||0);
      const rateOk=rateTS>0&&Date.now()-rateTS<=86400000,availOk=availTS>0&&Date.now()-availTS<=86400000;
      if(!rateOk||!availOk)stale++;
      const status=el('heldBorrowRows').querySelector('[data-last-check="'+a.e+'"]');
      if(status)status.innerHTML='<span class="'+(rateOk&&availOk?'good':'warn')+'">'+(rateOk&&availOk?'Checked within 24h':'Recheck needed')+'</span><div class="tiny muted">Rate '+(rateTS?fmtET(rateTS):'never')+'<br>Available '+(availTS?fmtET(availTS):'never')+'</div>';
      if(!borrowDirty&&document.activeElement?.getAttribute('data-borrow-rate')!==a.e){
        const rate=el('heldBorrowRows').querySelector('[data-borrow-rate="'+a.e+'"]');
        if(rate)rate.value=journal.data.borrow[a.e]??'';
      }
      if(!borrowDirty&&document.activeElement?.getAttribute('data-borrow-avail')!==a.e){
        const av=el('heldBorrowRows').querySelector('[data-borrow-avail="'+a.e+'"]');
        if(av)av.value=journal.data.avail[a.e]??'';
      }
    }
    el('borrowCheckSummary').textContent=held.length?(stale?stale+' of '+held.length+' need a check':'All '+held.length+' checked within 24h'):'No held shorts';
    el('saveBorrowChecks').disabled=!held.length;
    el('verifyBorrowChecks').disabled=!held.length;
  }
  el('heldBorrowRows').addEventListener('input',()=>{borrowDirty=true;});
  async function bulkBorrow(unchanged){
    if(unchanged&&borrowDirty)return alert('You have unsaved edits. Use Save entered checks, or revert the edits before confirming unchanged values.');
    const held=open().filter(a=>a.shortQty>0);
    const d=draft(),ts=Date.now();let n=0,changed=0,missing=0;
    for(const a of held){
      const e=a.e;
      if(unchanged){
        if(d.borrow[e]!=null&&d.borrow[e]!==''){d.borrowTs[e]=ts;changed++;}
        if(d.avail[e]!=null&&d.avail[e]!==''){d.availTs[e]=ts;changed++;}
        if(d.borrow[e]==null||d.avail[e]==null)missing++;
        n++;
        continue;
      }
      const rate=el('heldBorrowRows').querySelector('[data-borrow-rate="'+e+'"]')?.value.trim()||'';
      const avail=el('heldBorrowRows').querySelector('[data-borrow-avail="'+e+'"]')?.value.trim()||'';
      if(rate!==''){
        const v=Number(rate);if(!Number.isFinite(v)||v<0||v>1000)return alert('Invalid borrow rate for '+e+'.');
        if(num(d.borrow[e])!==v){d.borrowHistory.push({id:id(),e,rate:v,ts});changed++;}
        d.borrow[e]=rate;d.borrowTs[e]=ts;
      } else missing++;
      if(avail!==''){
        const v=Number(avail);if(!Number.isInteger(v)||v<0)return alert('Available shares must be a nonnegative whole number for '+e+'.');
        if(num(d.avail[e])!==v)changed++;
        d.avail[e]=avail;d.availTs[e]=ts;
      }else missing++;
      n++;
    }
    if(!n)return;
    if(unchanged&&!changed)return alert('No previously recorded rates or availability values to reconfirm.');
    const saved=await saveState(d,(unchanged?'Verified unchanged borrow inputs for ':'Checked borrow and availability for ')+n+' held ETFs');
    if(saved){
      borrowDirty=false;borrowingRows(true);
      el('borrowCheckNotice').textContent='Saved '+fmtET(ts)+'. '+(missing?'Some fields remain missing and need broker confirmation.':'All entered rates and availability timestamps updated.')+(unchanged?' Previously entered values were not altered.':'');
    }
  }
  el('saveBorrowChecks').onclick=()=>bulkBorrow(false);
  el('verifyBorrowChecks').onclick=()=>bulkBorrow(true);
  async function saveMargin(){
    const d=draft();
    for(const key of fields){
      const raw=readInput(key+'Input');
      if(raw===''){delete d.settings[key];continue;}
      const v=Number(raw);if(!Number.isFinite(v)||v<0||v>(key==='marginDebit'?1e12:1000))return alert('Check the value for '+key+'.');
      d.settings[key]=String(v);
    }
    if(await saveState(d,'Updated broker financing assumptions'))setConfigInputs();
  }
  el('saveMarginAssumptions').onclick=saveMargin;
  el('saveRiskFree').onclick=async()=>{
    const v=readInput('riskFreeAPRInput'),d=draft(),n=Number(v);
    if(v!==''&&(!Number.isFinite(n)||n< -5||n>40))return alert('Enter a risk-free benchmark between -5% and 40%.');
    if(v==='')delete d.settings.riskFreeAPR;else d.settings.riskFreeAPR=String(n);
    if(await saveState(d,'Updated performance benchmark'))el('riskFreeAPRInput').value=d.settings.riskFreeAPR??'';
  };
  const stat=(name,value,sub='')=>'<div class="ops-stat"><span>'+name+'</span><strong>'+value+'</strong>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
  function carry(){
    const listed=open(),priced=openPriced(),complete=listed.length&&priced.length===listed.length;
    const longMV=priced.reduce((s,a)=>s+a.longQty*a.prices.up,0),shortMV=priced.reduce((s,a)=>s+a.shortQty*a.prices.ep,0);
    const gross=longMV+shortMV,net=longMV-shortMV,equity=strategyCapitalValue();
    const exposed=priced.filter(a=>a.shortQty>0),missingRate=exposed.filter(a=>!Number.isFinite(num(journal.data.borrow[a.e])));
    const borrow=exposed.filter(a=>Number.isFinite(num(journal.data.borrow[a.e]))).reduce((s,a)=>s+a.shortQty*a.prices.ep*num(journal.data.borrow[a.e])/100,0);
    const debit=cfg('marginDebit'),apr=cfg('marginAPR'),rebate=cfg('shortRebateAPR');
    const debitCost=Number.isFinite(debit)&&Number.isFinite(apr)?debit*apr/100:NaN;
    const rebateCredit=Number.isFinite(rebate)?shortMV*rebate/100:NaN;
    const total=complete&&!missingRate.length&&Number.isFinite(debitCost)&&Number.isFinite(rebateCredit)?borrow+debitCost-rebateCredit:NaN;
    const hedgeNumerator=priced.reduce((s,a)=>s+a.L*a.shortQty*a.prices.ep,0);
    const portfolioHedge=longMV>0?hedgeNumerator/longMV*100:NaN;
    const maintenance=Number.isFinite(cfg('longMarginPct'))&&Number.isFinite(cfg('shortMarginPct'))?
      longMV*cfg('longMarginPct')/100+shortMV*cfg('shortMarginPct')/100:NaN;
    el('exposureStats').innerHTML=[
      stat('User-entered strategy equity',usd(equity),'Equity is not gross notional'),
      stat('Long / short market value',usd(longMV)+' / '+usd(shortMV),complete?'Prices for all held pairs':'Partial quotes; not a full-book figure'),
      stat('Gross / net long exposure',usd(gross)+' / '+usd(net),'Net = longs less short market value'),
      stat('Gross / strategy equity',Number.isFinite(equity)&&equity>0?percent(gross/equity*100):'—','Not margin debit or margin requirement'),
      stat('Aggregate hedge balance',percent(portfolioHedge),'Sum of leverage-adjusted shorts / longs'),
      stat('Actual debit entered',usd(debit),'Broker statement input; not inferred from short proceeds'),
      stat('Indicative margin requirement',usd(maintenance),Number.isFinite(maintenance)?'Based only on entered house percentages':'Enter long and short percentages to estimate')
    ].join('');
    el('carryStats').innerHTML=[
      stat('Short borrow expense / year',missingRate.length||!complete?'Incomplete · '+usd(borrow):usd(borrow),'Using currently entered broker rates'),
      stat('Debit financing / year',usd(debitCost),'Actual debit × entered APR'),
      stat('Short rebate / year',usd(rebateCredit),'Credit only if entered / earned'),
      stat('Estimated net carry / year',usd(total),'Borrow + debit interest − eligible rebate'),
      stat('Estimated net carry / calendar day',usd(Number.isFinite(total)?total/365:NaN,2),'Not actual posted broker charges')
    ].join('');
    const stale=priced.filter(a=>!latestQuote(a)).length;
    el('carryCoverage').textContent='Coverage: '+priced.length+'/'+listed.length+' held pairs priced; '+missingRate.length+' short borrow rate(s) missing; '+stale+' quote(s) older than 24h. Estimates exclude unknown broker credits, fees, swap funding, taxes, and changes to borrow terms. Use actual posted charges for performance attribution.';
    return {listed,priced,longMV,shortMV,portfolioHedge,complete};
  }
  function rebalanceOptions(){
    const list=open().filter(a=>a.longQty>0&&a.shortQty>0),signature=list.map(a=>a.e).join('|'),select=el('rebalanceActivePair'),old=select.value;
    if(signature!==rebalSignature){
      rebalSignature=signature;
      select.innerHTML=list.map(a=>'<option value="'+labelSafe(a.e)+'">'+labelSafe(a.e)+' / '+labelSafe(a.u)+'</option>').join('');
      if(list.some(a=>a.e===old))select.value=old;
    }
    return list;
  }
  const addIf=(x,y)=>Number.isFinite(x)&&Number.isFinite(y)?x+y:NaN;
  function rebalance(){
    const active=rebalanceOptions(),pair=active.find(a=>a.e===el('rebalanceActivePair').value)||active[0];
    if(!pair){el('rebalanceOutput').innerHTML='<p class="muted">Record an active paired position to compare adjustments.</p>';return;}
    if(!quoteOK(pair)){el('rebalanceOutput').innerHTML='<p class="warn">Both prices are required for this comparison. Verify your broker quotes.</p>';return;}
    const target=num(readInput('rebalanceTarget')),bookTarget=num(readInput('rebalanceBookTarget')),days=num(readInput('rebalanceHorizon')),bps=num(readInput('rebalanceSpread'));
    if(!(target>=25&&target<=200&&bookTarget>=25&&bookTarget<=200&&days>=1&&days<=365&&bps>=0&&bps<=1000)){el('rebalanceOutput').innerHTML='<p class="warn">Enter valid pair/book targets, horizon and execution friction assumptions.</p>';return;}
    const book=openPriced(),fullBook=book.length===open().length,up=pair.prices.up,ep=pair.prices.ep,L=pair.L;
    const mLong=pair.longQty*up,mShort=pair.shortQty*ep,currentRatio=mLong>0?L*mShort/mLong*100:NaN;
    const currentAggregateDen=book.reduce((s,a)=>s+a.longQty*a.prices.up,0),currentAggregateNum=book.reduce((s,a)=>s+a.L*a.shortQty*a.prices.ep,0);
    const currentAggregate=currentAggregateDen>0?currentAggregateNum/currentAggregateDen*100:NaN;
    const shortDelta=Math.round(target/100*mLong/L/ep-pair.shortQty);
    const longDelta=Math.round(mShort*L/(target/100)/up-pair.longQty);
    const b=num(journal.data.borrow[pair.e]),avail=num(journal.data.avail[pair.e]),debit=cfg('marginDebit'),apr=cfg('marginAPR');
    const taxBasis=num(readInput('rebalanceTaxBasis')),taxRate=num(readInput('rebalanceTaxRate'));
    const scenarios=[
      {name:'No trade',shortDelta:0,longDelta:0},
      {name:'Short ETF · pair target',shortDelta,longDelta:0},
      {name:'Underlying stock · pair target',shortDelta:0,longDelta}
    ];
    // A book-target adjustment must not force the selected pair beyond its configured band.
    // If quotes are missing for other held pairs, do not pretend to know the book target.
    const band=num(journal.data.settings.band),safeBand=Number.isFinite(band)&&band>0&&band<100?band:10;
    const shortMin=Math.max(0,Math.ceil((100-safeBand)/100*mLong/(L*ep)));
    const shortMax=Math.max(shortMin,Math.floor((100+safeBand)/100*mLong/(L*ep)));
    if(fullBook&&currentAggregateDen>0){
      const desired=Math.round(pair.shortQty+(bookTarget/100*currentAggregateDen-currentAggregateNum)/(L*ep));
      const feasible=Math.min(shortMax,Math.max(shortMin,desired));
      scenarios.push({name:'Short ETF · book target (band-limited)',shortDelta:feasible-pair.shortQty,longDelta:0});
    }
    const rows=scenarios.map((sc,i)=>{
      const sd=sc.shortDelta,ld=sc.longDelta,nS=pair.shortQty+sd,nL=pair.longQty+ld;
      const pairRatio=nL>0?L*nS*ep/(nL*up)*100:NaN;
      const agDen=currentAggregateDen+ld*up,agNum=currentAggregateNum+sd*ep*L;
      const agg=agDen>0?agNum/agDen*100:NaN;
      const turnover=Math.abs(sd)*ep+Math.abs(ld)*up;
      const execution=turnover*bps/10000;
      const borrowCarry=sd===0?0:Number.isFinite(b)?sd*ep*b/100*days/365:NaN;
      // Broker credit from additional shorts is NOT assumed to reduce the margin debit.
      const debitDelta=Number.isFinite(debit)?Math.max(0,debit+ld*up)-debit:NaN;
      const finance=ld===0?0:Number.isFinite(apr)&&Number.isFinite(debitDelta)?debitDelta*apr/100*days/365:NaN;
      const gain=ld<0&&Number.isFinite(taxBasis)?-ld*(up-taxBasis):NaN;
      const tax=ld<0&&Number.isFinite(gain)&&Number.isFinite(taxRate)?Math.max(0,gain)*taxRate/100:NaN;
      const total=Number.isFinite(borrowCarry)&&Number.isFinite(finance)?execution+borrowCarry+finance:NaN;
      let flags=[];
      if(!latestQuote(pair))flags.push('Quotes older than 24h or failed');
      if(sd>0&&(!Number.isFinite(avail)||Date.now()-Number(journal.data.availTs[pair.e]||0)>86400000))flags.push('Short availability not verified within 24h');
      if(sd>0&&Number.isFinite(avail)&&sd>avail)flags.push('Exceeds shares currently shown available');
      if(sd!==0&&!Number.isFinite(b))flags.push('Borrow rate missing');
      if(ld<0&&!Number.isFinite(tax))flags.push('Specific-lot tax estimate missing');
      if(sd<0)flags.push('Short-cover gain/loss taxes are not estimated');
      if(sc.shortDelta===0&&sc.longDelta===0&&i!==0)flags.push('Target already near existing share count');
      const action=sd>0?'Short '+fmt(sd)+' additional '+pair.e:sd<0?'Cover '+fmt(-sd)+' '+pair.e:ld>0?'Buy '+fmt(ld)+' '+pair.u:ld<0?'Sell '+fmt(-ld)+' '+pair.u:'Hold positions';
      const costText='Execution '+usd(execution,2)+'; incremental '+fmt(days)+'-day borrow '+usd(borrowCarry,2)+'; financing '+usd(finance,2);
      const taxText=ld<0?'; separate illustrative long-sale tax '+usd(tax,2):'';
      const record=(sd||ld)?'<button class="secondary ops-prefill" type="button" data-sd="'+sd+'" data-ld="'+ld+'" data-e="'+labelSafe(pair.e)+'">Prefill journal (no execution)</button>':'';
      return '<article class="ops-scenario"><h3>'+sc.name+'</h3><strong>'+action+'</strong>'+
        '<div class="small">Pair hedge: '+percent(pairRatio)+' · Full-book hedge: '+percent(agg)+'</div>'+
        '<div class="small">Turnover '+usd(turnover)+' · '+costText+taxText+'</div>'+
        '<div class="small"><b>Incremental pre-tax execution & carry:</b> '+usd(total,2)+' <span class="muted">(missing assumptions shown as —; realized gains taxed separately)</span></div>'+
        (flags.length?'<p class="warn small">'+flags.map(labelSafe).join(' · ')+'</p>':'')+record+'</article>';
    });
    el('rebalanceOutput').innerHTML='<p class="small"><strong>Current pair:</strong> '+percent(currentRatio)+' hedge · <strong>Aggregate:</strong> '+percent(currentAggregate)+
      ' · <strong>Pair target:</strong> '+percent(target)+' · <strong>Book target:</strong> '+percent(bookTarget)+' (constrained to '+percent(100-safeBand)+'–'+percent(100+safeBand)+' for the selected pair). '+(fullBook?'All held pairs priced.':'Only '+book.length+'/'+open().length+' pairs priced; aggregate ratio is partial.')+
      ' '+(!latestQuote(pair)?'Current pair quotes are stale; do not execute from this preview.':'Verify your execution quotes and borrow before trading.')+'</p>'+
      '<div class="ops-scenarios">'+rows.join('')+'</div>';
  }
  el('rebalanceActivePair').onchange=rebalance;
  for(const key of ['rebalanceTarget','rebalanceBookTarget','rebalanceHorizon','rebalanceSpread','rebalanceTaxBasis','rebalanceTaxRate'])el(key).oninput=rebalance;
  el('rebalanceOutput').addEventListener('click',evt=>{
    const button=evt.target.closest('.ops-prefill');if(!button)return;
    const sd=Number(button.dataset.sd),ld=Number(button.dataset.ld),e=button.dataset.e;
    const action=sd>0?'short_add':sd<0?'short_cover':ld>0?'long_buy':'long_sell';
    const qty=Math.abs(sd||ld);
    if(!qty)return;
    el('recordRebalance')?.click();
    el('adjAction').value=action;
    adjActionChanged();
    el('adjPair').value=e;el('adjShares').value=qty;el('adjPrice').value='';
    el('adjNote').value='Workbench scenario only; verify actual shares, broker fill, financing, tax lot and borrow before recording.';
    el('adjPrice').focus();
  });
  function weekdaysBetween(a,b){
    const start=new Date(a+'T00:00:00Z').getTime(),end=new Date(b+'T00:00:00Z').getTime();
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return Infinity;
    let n=0;for(let d=start+86400000;d<=end;d+=86400000){const wd=new Date(d).getUTCDay();if(wd!==0&&wd!==6)n++;}return n;
  }
  function sampleStd(values){if(values.length<2)return NaN;const mean=values.reduce((s,x)=>s+x,0)/values.length;return Math.sqrt(values.reduce((s,x)=>s+(x-mean)**2,0)/(values.length-1));}
  function performance(){
    const all=journal.data.performance.filter(p=>p&&typeof p.day==='string'&&Number.isFinite(num(p.net))).sort((a,b)=>a.day.localeCompare(b.day)||(+a.ts||0)-(+b.ts||0));
    const unique=new Map();for(const p of all)unique.set(p.day,p);
    const obs=[...unique.values()].sort((a,b)=>a.day.localeCompare(b.day));
    const daily=[];let gaps=0,missing=0,flows=0;
    for(let i=1;i<obs.length;i++){
      const a=obs[i-1],b=obs[i],days=weekdaysBetween(a.day,b.day);
      if(days!==1){gaps++;continue;}
      const base=capitalAt(+a.ts||Date.parse(a.day),a.capital),end=capitalAt(+b.ts||Date.parse(b.day),b.capital);
      if(!(base>0&&end>0)){missing++;continue;}
      if(Math.abs(end-base)/base>.01){flows++;continue;}
      const r=(+b.net-(+a.net))/base;
      if(!Number.isFinite(r)||r<=-1){missing++;continue;}
      daily.push(r);
    }
    const n=daily.length,mean=n?daily.reduce((s,x)=>s+x,0)/n:NaN,sd=sampleStd(daily);
    const hurdle=Number.isFinite(cfg('riskFreeAPR'))?cfg('riskFreeAPR')/100:0,dailyHurdle=hurdle/252;
    const sharpe=n>=30&&sd>0?(mean-dailyHurdle)/sd*Math.sqrt(252):NaN;
    const down=n?Math.sqrt(daily.reduce((s,x)=>s+Math.pow(Math.min(0,x-dailyHurdle),2),0)/n):NaN;
    const sortino=n>=30&&down>0?(mean-dailyHurdle)/down*Math.sqrt(252):NaN;
    let equity=1,peak=1,maxDD=0;
    for(const v of daily){equity*=1+v;peak=Math.max(peak,equity);maxDD=Math.min(maxDD,equity/peak-1);}
    const cagr=n>=60&&equity>0?Math.pow(equity,252/n)-1:NaN;
    const annualVol=n>=30?sd*Math.sqrt(252):NaN;
    el('riskStats').innerHTML=[
      stat('Usable daily return intervals',fmt(n),obs.length+' unique snapshots'),
      stat('Annualized volatility',Number.isFinite(annualVol)?percent(annualVol*100):'—','At least 30 valid returns required'),
      stat('Sharpe ratio',Number.isFinite(sharpe)?fmt(sharpe,2):'—','Benchmark '+percent(hurdle*100,1)+' annual'),
      stat('Sortino ratio',Number.isFinite(sortino)?fmt(sortino,2):'—','Downside hurdle '+percent(hurdle*100,1)+' annual'),
      stat('Observed maximum drawdown',n?percent(maxDD*100,2):'—','Observed intervals only; gaps may hide losses'),
      stat('Geometrically annualized return',Number.isFinite(cagr)?percent(cagr*100,2):'—','At least 60 valid returns required; indicative')
    ].join('');
    el('riskDataNote').textContent=gaps+' intervals excluded for missing trading days; '+missing+' for missing capital / invalid returns; '+flows+' for material capital changes. These are unverified journal-derived daily returns, not broker NAV or net returns after unrecorded borrow, margin costs and taxes. '+(n<30?'Insufficient continuous history for meaningful annualized risk statistics.':'Annualization remains sensitive to limited observation history.');
    const keys=new Set(obs.flatMap(p=>Object.keys(p.positions||{})));
    const contributions=[];
    for(const e of keys){
      const rows=obs.map(o=>({day:o.day,entry:o.positions?.[e]})).filter(o=>Number.isFinite(num(o.entry?.net)));
      if(rows.length<2)continue;
      const diff=num(rows.at(-1).entry.net)-num(rows[0].entry.net);
      const pair=PAIRS.find(p=>p.e===e);
      contributions.push({e,u:pair?.u||'',net:diff,samples:rows.length});
    }
    contributions.sort((a,b)=>b.net-a.net);
    el('riskPairRows').innerHTML=contributions.length?contributions.map(p=>
      '<tr><td><strong>'+labelSafe(p.e)+' / '+labelSafe(p.u)+'</strong></td><td>'+usd(p.net,2)+'</td><td>'+p.samples+'</td></tr>').join(''):
      '<tr><td colspan="3" class="muted">Pair-level performance appears after at least two per-pair observations. Older aggregate-only records are not retroactively invented.</td></tr>';
  }
  function renderEnhancements(){
    try{borrowingRows();carry();rebalance();performance();}
    catch(e){console.warn('ETF Edge enhancement rendering failed',e);}
  }
  globalThis.etfRenderEnhancements=renderEnhancements;
  renderEnhancements();
})();