(() => {
  const keyName='etfEdgeCloudKeyV1';let key=localStorage.getItem(keyName),busy=false,pending=false,timer;
  const el=id=>document.getElementById(id),utf8=new TextEncoder();
  const b64=bytes=>btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(''));
  const from64=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
  const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  async function hash(text){return new Uint8Array(await crypto.subtle.digest('SHA-256',utf8.encode(text)));}
  async function credentials(){if(!key||!/^[A-Za-z0-9_-]{43}$/.test(key))throw Error('Connect your recovery-key file first.');const encryptionBytes=await hash('encryption:'+key);return{auth:hex(await hash('auth:'+key)),proof:b64(encryptionBytes),encryption:await crypto.subtle.importKey('raw',encryptionBytes,'AES-GCM',false,['encrypt','decrypt'])};}
  async function request(path='',options={}){const c=await credentials(),r=await fetch('/api/backups'+path,{...options,headers:{'x-backup-auth':c.auth,'x-backup-proof':c.proof,...options.headers},signal:AbortSignal.timeout(25000)});const body=await r.json();if(!r.ok)throw Error(body.error||'Backup request failed.');return body;}
  function enabled(value){el('cloudSave').disabled=!value;el('cloudList').disabled=!value;}
  async function encrypt(data){const c=await credentials(),iv=crypto.getRandomValues(new Uint8Array(12)),ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},c.encryption,utf8.encode(JSON.stringify(data)));return{version:1,iv:b64(iv),ciphertext:b64(new Uint8Array(ciphertext))};}
  async function decrypt(envelope){const c=await credentials(),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(envelope.iv)},c.encryption,from64(envelope.ciphertext));return ETFData.validate(JSON.parse(new TextDecoder().decode(plain)));}
  async function backup(){
    if(busy){pending=true;return;}if(!key||journal.error)return;
    if(!journal.data.trades.length&&!journal.data.adjustments.length){el('cloudStatus').textContent='Connected. No local journal to back up; use Recover from cloud to import saved records.';return;}
    busy=true;enabled(false);el('cloudStatus').textContent='Saving an encrypted cloud backup…';
    try{const snapshot=ETFData.validate({...draft(),exportedAt:new Date().toISOString()}),body=await encrypt(snapshot),result=await request('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const recovered=await decrypt(await request('?id='+encodeURIComponent(result.id)));if(ETFData.stable(recovered)!==ETFData.stable(snapshot))throw Error('Read-back verification failed.');
      el('cloudStatus').textContent='Cloud backup saved and read back successfully at '+new Date(result.savedAt).toLocaleString()+'. Recovery key required on another device.';
    }catch(e){el('cloudStatus').textContent='Cloud backup failed: '+e.message+' Local saves remain. Download a backup now.';}
    finally{busy=false;enabled(!!key);if(pending){pending=false;setTimeout(backup,1000);}}
  }
  async function showBackups(){enabled(false);el('cloudVersions').replaceChildren();try{let cursor=null,all=[];do{const page=await request(cursor?'?cursor='+encodeURIComponent(cursor):'');all.push(...page.backups);cursor=page.cursor;}while(cursor);all.sort((a,b)=>b.id.localeCompare(a.id));if(!all.length)el('cloudVersions').textContent='No cloud backups yet.';for(const item of all.slice(0,100)){const button=document.createElement('button');button.className='secondary';button.textContent='Recover '+new Date(item.savedAt).toLocaleString();button.onclick=async()=>{button.disabled=true;try{const data=await decrypt(await request('?id='+encodeURIComponent(item.id)));if(!confirm('Import this cloud backup with '+data.trades.length+' entries and '+data.adjustments.length+' adjustments? Existing records are preserved; conflicting edits stop the import.'))return;await saveState(ETFData.merge(draft(),data),'Recovered cloud backup');}catch(e){el('cloudStatus').textContent='Recovery stopped: '+e.message;}finally{button.disabled=false;}};el('cloudVersions').append(button);} }catch(e){el('cloudStatus').textContent='Could not list backups: '+e.message;}finally{enabled(!!key);}}
  el('cloudKeyFile').onchange=async event=>{const previous=key;try{const file=event.target.files[0];if(!file)return;if(file.size>4000)throw Error('This is not a recovery-key file.');const data=JSON.parse(await file.text());if(data.type!=='etf-edge-cloud-recovery'||data.site!=='https://etf-edge-finder.vercel.app'||!/^[A-Za-z0-9_-]{43}$/.test(data.key))throw Error('Invalid recovery-key file.');key=data.key;await request();localStorage.setItem(keyName,key);enabled(true);el('cloudStatus').textContent='Connected to private cloud backup.';await backup();}catch(e){key=previous;el('cloudStatus').textContent='Connection failed: '+e.message;}finally{event.target.value='';}};
  el('cloudSave').onclick=backup;el('cloudList').onclick=showBackups;
  window.addEventListener('journal-saved',()=>{clearTimeout(timer);timer=setTimeout(backup,1500);});
  enabled(!!key);if(key){el('cloudStatus').textContent='Recovery key found. Verifying cloud access…';request().then(()=>backup()).catch(e=>{el('cloudStatus').textContent='Cloud connection needs attention: '+e.message;});}
})();
