import { useState, useEffect, useRef, useContext, createContext } from 'react';

const ADMIN_CSS = `
  :root { --bg:#0b0f1a;--surface:#121a2d;--surface-2:#16223c;--text:#e8eef8;--muted:#9cb1d1;--primary:#c88f2a;--danger:#f87171;--border:rgba(255,255,255,0.08); }
  .site-header{background:rgba(255,255,255,0.96)!important;backdrop-filter:blur(22px);}
  .site-header .site-title{color:#111827!important;}
  .site-header .eyebrow{color:#1f4b8d!important;}
  .site-header .nav-menu a{color:#111827!important;}
  .site-header .lang-btn{color:#111827!important;border-color:rgba(15,23,42,0.08)!important;}
  .site-header .burger-btn{color:#111827!important;border-color:rgba(15,23,42,0.12)!important;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
  input,select,button,textarea{font:inherit;}
  img{max-width:100%;display:block;}
  .app{max-width:960px;margin:0 auto;padding:32px 20px 60px;}
  .app-header{display:flex;align-items:center;justify-content:flex-end;margin-bottom:24px;gap:10px;}
  .app-title{display:none;}
  .app-title span{display:none;}
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
  .login-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px;width:100%;max-width:400px;}
  .login-card h2{color:var(--primary);font-size:1.4rem;margin-bottom:4px;}
  .login-card p{color:var(--muted);font-size:0.85rem;margin-bottom:24px;}
  .form-col{display:flex;flex-direction:column;gap:12px;}
  .tabs{display:flex;gap:8px;flex-wrap:wrap;}
  .tab-btn{padding:8px 20px;background:var(--surface);color:var(--muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:500;transition:all 0.15s;}
  .tab-btn.active{background:var(--primary);color:#fff;border-color:var(--primary);}
  .tab-content{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;margin-top:20px;}
  .tab-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;}
  .tab-head h3{font-size:1.05rem;}
  .inp{display:block;width:100%;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem;outline:none;}
  .inp:focus{border-color:var(--primary);}
  .label{display:flex;flex-direction:column;gap:4px;font-size:0.82rem;color:var(--muted);}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .btn{padding:10px 22px;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;}
  .btn-primary{background:var(--primary);color:#fff;}
  .btn-outline{background:transparent;color:var(--text);border:1px solid var(--border);}
  .btn-sm{padding:6px 14px;background:var(--surface-2);color:var(--text);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:0.82rem;font-weight:500;}
  .btn-danger{background:rgba(220,38,38,0.15);color:var(--danger);border-color:rgba(220,38,38,0.3);}
  button:disabled{opacity:0.55;cursor:not-allowed;}
  .item-list{display:flex;flex-direction:column;gap:10px;}
  .item-card{display:flex;align-items:center;gap:16px;padding:14px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;}
  .card-photo{width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;background:var(--bg);}
  .card-info{flex:1;display:flex;flex-direction:column;gap:2px;}
  .card-name{font-size:0.95rem;font-weight:600;}
  .card-sub{font-size:0.78rem;color:var(--muted);}
  .card-actions{display:flex;gap:8px;flex-shrink:0;}
  .gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;}
  .gallery-item{position:relative;border-radius:10px;overflow:hidden;border:1px solid var(--border);}
  .gallery-img{width:100%;height:110px;object-fit:cover;display:block;}
  .gallery-del{position:absolute;top:6px;right:6px;background:rgba(220,38,38,0.85);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:12px;line-height:1;}
  .result-row{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;flex-wrap:wrap;}
  .result-date{font-size:0.8rem;color:var(--muted);min-width:88px;}
  .result-info{flex:1;font-size:0.9rem;}
  .result-score{color:var(--primary);font-weight:700;}
  .result-meta{font-size:0.78rem;color:var(--muted);}
  table{width:100%;border-collapse:collapse;font-size:0.9rem;margin-top:24px;}
  th{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);color:var(--muted);font-size:0.78rem;text-transform:uppercase;}
  td{padding:10px 14px;border-bottom:1px solid var(--border);}
  tr.hl td{background:rgba(200,143,42,0.08);}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;}
  .modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
  .modal-head h3{font-size:1.05rem;}
  .modal-foot{display:flex;gap:12px;justify-content:flex-end;margin-top:24px;}
  .close-btn{background:transparent;border:none;color:var(--muted);font-size:1.2rem;cursor:pointer;}
  .photo-row{display:flex;align-items:center;gap:12px;margin-top:4px;}
  .photo-thumb{width:52px;height:52px;border-radius:8px;object-fit:cover;border:1px solid var(--border);}
  .err{color:var(--danger);font-size:0.82rem;}
  .section-gap{margin-top:32px;}
  h4{color:var(--primary);margin-bottom:12px;}
  .lang-btn{padding:5px 12px;border:1px solid rgba(15,23,42,0.12);border-radius:999px;background:transparent;color:#111827;font-size:0.82rem;font-weight:600;cursor:pointer;}
  .lang-btn:hover{border-color:#1f4b8d;color:#1f4b8d;}
  input[type="date"].inp{width:100%;max-width:100%;min-width:0;box-sizing:border-box;-webkit-appearance:none;appearance:none;}
  .staff-card-actions{align-self:flex-start;margin-top:2px;}
  @media(max-width:640px){
    .app{padding:20px 12px 40px;}
    .tab-content{padding:16px 12px;}
    .tabs{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;}
    .tab-btn{white-space:nowrap;padding:6px 12px;font-size:0.8rem;}
    .result-row{flex-direction:column;align-items:stretch;gap:6px;}
    .result-date{min-width:0;font-size:0.75rem;}
    .result-info{font-size:0.82rem;word-break:break-word;}
    .result-actions{flex-direction:column!important;gap:6px!important;}
    .result-actions .btn-sm{width:100%;padding:9px 14px;text-align:center;font-size:0.85rem;}
    .card-actions{flex-direction:column;}
    .card-actions .btn-sm{width:100%;padding:9px 14px;text-align:center;font-size:0.85rem;}
    .item-card{flex-wrap:wrap;}
    .card-info{min-width:0;flex:1;}
    .form-grid{grid-template-columns:1fr!important;}
    .modal{padding:20px 16px;max-height:95vh;}
    input[type="date"].inp{width:100%;max-width:100%;min-width:0;font-size:0.9rem;box-sizing:border-box;}
    .label{font-size:0.8rem;}
  }
`;

const TRANSLATIONS = {
  sq: {
    title:'FC Malisheva - Paneli i Administratorit', logout:'Dil',
    tabs:['Lojtarët','Stafi','Galeria','Rezultatet','Njoftime','Ndeshja','Sponzorët'],
    login:{title:'Paneli i Administratorit',sub:'FC Malisheva — Hyrja e Zyrtarit',user:'Emri i përdoruesit',pass:'Fjalëkalimi',btn:'Hyr',loading:'Duke hyrë...',err:'Kredencialet janë të gabuara'},
    players:{title:'Lojtarët',add:'+ Shto Lojtar',editTitle:'Ndrysho Lojtar',addTitle:'Shto Lojtar',edit:'Ndrysho',del:'Fshi',save:'Ruaj',saving:'Duke ruajtur...',cancel:'Anulo',confirmDel:'Fshi lojtarin?',
      f:{name:'Emri',pos:'Pozita',num:'Numri',nat:'Kombësia',birth:'Data e lindjes',height:'Gjatësia',weight:'Pesha',photo:'Foto'},
      positions:['Portier','Mbrojtës i Majtë','Mbrojtës i Djathtë','Qendërmbrojtës','Mesfushor Mbrojtës','Mesfushor Qendror','Krahësor i Majtë','Krahësor i Djathtë','Sulmues Qendror'],
      placeholderHeight:'182 cm',placeholderWeight:'76 kg',choosePos:'Zgjidh...'},
    staff:{title:'Stafi Teknik',add:'+ Shto Anëtar',editTitle:'Ndrysho Anëtar Stafi',addTitle:'Shto Anëtar Stafi',edit:'Ndrysho',del:'Fshi',save:'Ruaj',saving:'Duke ruajtur...',cancel:'Anulo',confirmDel:'Fshi anëtarin?',
      f:{name:'Emri',role:'Roli',email:'Email',photo:'Foto'}},
    gallery:{title:'Galeria',upload:'+ Ngarko Foto',uploading:'Duke ngarkuar...',confirmDel:'Fshi foton nga galeria?'},
    announcements:{title:'Njoftime',add:'+ Shto Njoftim',addTitle:'Shto Njoftim',editTitle:'Ndrysho Njoftimin',edit:'Ndrysho',del:'Fshi',save:'Ruaj',saving:'Duke ruajtur...',cancel:'Anulo',confirmDel:'Fshi njoftimin?',
      f:{title:'Titulli (SQ)',title_en:'Titulli (EN)',content:'Përmbajtja (SQ)',content_en:'Përmbajtja (EN)',category:'Kategoria (SQ)',category_en:'Kategoria (EN)',date:'Data e shfaqjes'}},
    match:{title:'Ndeshja e Ardhshme',save:'Ruaj Ndeshjen',saving:'Duke ruajtur...',ticketSaved:'U ruajt!',
      f:{comp:'Gara',matchday:'Java / Dita',stadium:'Stadiumi',home:'Ekipi vendas',homeLogo:'Logo vendas',away:'Ekipi mysafir',awayLogo:'Logo mysafir',date:'Data',time:'Ora',ticketUrl:'Linku i biletave'}},
    sponsors:{title:'Sponzorët',add:'+ Shto Sponzor',addTitle:'Shto Sponzor',editTitle:'Ndrysho Sponzorin',edit:'Ndrysho',del:'Fshi',save:'Ruaj',saving:'Duke ruajtur...',cancel:'Anulo',confirmDel:'Fshi sponzorin?',
      f:{name:'Emri',logo:'Logo (ngarko ose rrugë)',website:'Website URL',order:'Rendi'}},
    results:{title:'Rezultatet',add:'+ Shto Ndeshje',addTitle:'Shto Ndeshje',editTitle:'Ndrysho Ndeshjen',del:'Fshi',edit:'Ndrysho',save:'Ruaj',saving:'Duke ruajtur...',cancel:'Anulo',confirmDel:'Fshi ndeshjen?',
      tableTitle:'Tabela e Ligës',
      f:{date:'Data',matchday:'Java / Dita',opp:'Kundërshtari',score:'Rezultati',comp:'Gara',venue:'Fusha',compPH:'p.sh. Albi Mall Superliga',venuePH:'Fushë e Jashtme'},
      th:{pos:'#',team:'Ekipi',played:'Nd',pts:'Pikë'}}
  },
  en: {
    title:'FC Malisheva - Admin Panel', logout:'Logout',
    tabs:['Players','Staff','Gallery','Results','Announcements','Match','Sponsors'],
    login:{title:'Admin Panel',sub:'FC Malisheva — Staff Login',user:'Username',pass:'Password',btn:'Login',loading:'Logging in...',err:'Invalid credentials'},
    players:{title:'Players',add:'+ Add Player',editTitle:'Edit Player',addTitle:'Add Player',edit:'Edit',del:'Delete',save:'Save',saving:'Saving...',cancel:'Cancel',confirmDel:'Delete this player?',
      f:{name:'Name',pos:'Position',num:'Number',nat:'Nationality',birth:'Date of birth',height:'Height',weight:'Weight',photo:'Photo'},
      positions:['Goalkeeper','Left Back','Right Back','Centre Back','Defensive Mid','Central Mid','Left Winger','Right Winger','Centre Forward'],
      placeholderHeight:'e.g. 182 cm',placeholderWeight:'e.g. 76 kg',choosePos:'Choose...'},
    staff:{title:'Technical Staff',add:'+ Add Member',editTitle:'Edit Staff Member',addTitle:'Add Staff Member',edit:'Edit',del:'Delete',save:'Save',saving:'Saving...',cancel:'Cancel',confirmDel:'Delete this member?',
      f:{name:'Name',role:'Role',email:'Email',photo:'Photo'}},
    gallery:{title:'Gallery',upload:'+ Upload Photo',uploading:'Uploading...',confirmDel:'Remove photo from gallery?'},
    announcements:{title:'Announcements',add:'+ Add Announcement',addTitle:'Add Announcement',editTitle:'Edit Announcement',edit:'Edit',del:'Delete',save:'Save',saving:'Saving...',cancel:'Cancel',confirmDel:'Delete this announcement?',
      f:{title:'Title (SQ)',title_en:'Title (EN)',content:'Content (SQ)',content_en:'Content (EN)',category:'Category (SQ)',category_en:'Category (EN)',date:'Display date'}},
    match:{title:'Upcoming Match',save:'Save Match',saving:'Saving...',ticketSaved:'Saved!',
      f:{comp:'Competition',matchday:'Matchday',stadium:'Stadium',home:'Home team',homeLogo:'Home logo',away:'Away team',awayLogo:'Away logo',date:'Date',time:'Time',ticketUrl:'Ticket link'}},
    sponsors:{title:'Sponsors',add:'+ Add Sponsor',addTitle:'Add Sponsor',editTitle:'Edit Sponsor',edit:'Edit',del:'Delete',save:'Save',saving:'Saving...',cancel:'Cancel',confirmDel:'Delete this sponsor?',
      f:{name:'Name',logo:'Logo (upload or path)',website:'Website URL',order:'Order'}},
    results:{title:'Results',add:'+ Add Match',addTitle:'Add Match',editTitle:'Edit Match',del:'Delete',edit:'Edit',save:'Save',saving:'Saving...',cancel:'Cancel',confirmDel:'Delete this match?',
      tableTitle:'League Table',
      f:{date:'Date',matchday:'Matchday',opp:'Opponent',score:'Score',comp:'Competition',venue:'Venue',compPH:'e.g. Albi Mall Superliga',venuePH:'e.g. Away'},
      th:{pos:'#',team:'Club',played:'MP',pts:'Pts'}}
  }
};

const LangCtx = createContext({ t: k => k, lang: 'sq' });
const useLang = () => useContext(LangCtx);
let _forceLogout = null;

function isTokenValid(t) {
  if (!t) return false;
  try { const p = JSON.parse(atob(t.split('.')[1])); return p.exp * 1000 > Date.now(); }
  catch { return false; }
}

function req(method, url, body, token) {
  const headers = {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  return fetch(url, {
    method, headers,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
  }).then(async r => {
    const data = await r.json();
    if (r.status === 401) { localStorage.removeItem('admin_token'); if (_forceLogout) _forceLogout(); throw new Error(data.error || 'Sesioni skadoi'); }
    if (!r.ok) throw new Error(data.error || 'Gabim');
    return data;
  });
}

function PhotoUpload({ current, onChange }) {
  const ref = useRef();
  const [preview, setPreview] = useState(current || '');
  function pick(e) { const f = e.target.files[0]; if (!f) return; onChange(f); setPreview(URL.createObjectURL(f)); }
  return (
    <div className="photo-row">
      {preview && <img src={preview} className="photo-thumb" onError={e => e.target.style.display='none'} alt="" />}
      <button type="button" className="btn btn-outline" style={{padding:'6px 14px',fontSize:'0.82rem'}} onClick={() => ref.current.click()}>
        {preview ? 'Ndrysho foton' : 'Ngarko foto'}
      </button>
      <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={pick} />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button className="close-btn" onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

function Login({ onLogin, lang, setLang }) {
  const tr = TRANSLATIONS[lang].login;
  const [f, setF] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try { const data = await req('POST', '/api/login', f); localStorage.setItem('admin_token', data.token); onLogin(data.token); }
    catch { setErr(TRANSLATIONS[lang].login.err); }
    finally { setLoading(false); }
  }
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
          <h2 style={{margin:0}}>{tr.title}</h2>
          <button className="lang-btn" onClick={() => setLang(lang==='sq'?'en':'sq')} style={{display:'flex',alignItems:'center',gap:'6px'}}>
            {lang==='sq'?<><img src="/assets/logos/Gb.jpg" alt="EN" style={{width:'22px',height:'15px',objectFit:'cover',borderRadius:'2px'}}/><span>EN</span></>
                       :<><img src="/assets/logos/Al.jpg" alt="SQ" style={{width:'22px',height:'15px',objectFit:'cover',borderRadius:'2px'}}/><span>SQ</span></>}
          </button>
        </div>
        <p>{tr.sub}</p>
        <form className="form-col" onSubmit={submit}>
          <input className="inp" placeholder={tr.user} value={f.username} onChange={e=>setF({...f,username:e.target.value})} required />
          <input className="inp" type="password" placeholder={tr.pass} value={f.password} onChange={e=>setF({...f,password:e.target.value})} required />
          {err && <p className="err">{err}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading?tr.loading:tr.btn}</button>
        </form>
      </div>
    </div>
  );
}

function PlayersTab({ token }) {
  const { t } = useLang();
  const tr = key => t(`players.${key}`);
  const [players, setPlayers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const load = () => req('GET', '/api/players', null, token).then(setPlayers);
  useEffect(() => { load(); }, []);
  function openAdd() { setForm({name:'',position:'',number:'',nationality:'Kosovar',birthDate:'',height:'',weight:'',photo:''}); setPhotoFile(null); setModal({mode:'add'}); }
  function openEdit(p) { setForm({...p}); setPhotoFile(null); setModal({mode:'edit',id:p.id}); }
  async function save() {
    setSaving(true);
    try {
      const fd = new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v??''));
      if (photoFile) fd.append('photo',photoFile);
      if (modal.mode==='add') await req('POST','/api/players',fd,token);
      else await req('PUT',`/api/players/${modal.id}`,fd,token);
      await load(); setModal(null);
    } catch(e){alert(e.message);} finally{setSaving(false);}
  }
  async function del(id) { if(!confirm(tr('confirmDel')))return; await req('DELETE',`/api/players/${id}`,null,token); load(); }
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({players.length})</h3><button className="btn btn-primary" onClick={openAdd}>{tr('add')}</button></div>
      <div className="item-list">
        {players.map(p=>(
          <div className="item-card" key={p.id}>
            <img className="card-photo" src={p.photo||''} onError={e=>e.target.src='https://placehold.co/56x56/121a2d/9cb1d1?text=FC'} alt="" />
            <div className="card-info"><span className="card-name">{p.name}</span><span className="card-sub">#{p.number} · {p.position}</span><span className="card-sub">{p.nationality}</span></div>
            <div className="card-actions"><button className="btn-sm" onClick={()=>openEdit(p)}>{tr('edit')}</button><button className="btn-sm btn-danger" onClick={()=>del(p.id)}>{tr('del')}</button></div>
          </div>
        ))}
      </div>
      {modal&&(
        <Modal title={modal.mode==='add'?tr('addTitle'):tr('editTitle')} onClose={()=>setModal(null)}>
          <div className="form-grid">
            <label className="label">{tr('f.name')}<input className="inp" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/></label>
            <label className="label">{tr('f.pos')}<select className="inp" value={form.position||''} onChange={e=>setForm({...form,position:e.target.value})}><option value="">{tr('choosePos')}</option>{t('players.positions').map(p=><option key={p}>{p}</option>)}</select></label>
            <label className="label">{tr('f.num')}<input className="inp" type="number" value={form.number||''} onChange={e=>setForm({...form,number:e.target.value})}/></label>
            <label className="label">{tr('f.nat')}<input className="inp" value={form.nationality||''} onChange={e=>setForm({...form,nationality:e.target.value})}/></label>
            <label className="label">{tr('f.birth')}<input className="inp" type="date" value={form.birthDate||''} onChange={e=>setForm({...form,birthDate:e.target.value})}/></label>
            <label className="label">{tr('f.height')}<input className="inp" placeholder={tr('placeholderHeight')} value={form.height||''} onChange={e=>setForm({...form,height:e.target.value})}/></label>
            <label className="label">{tr('f.weight')}<input className="inp" placeholder={tr('placeholderWeight')} value={form.weight||''} onChange={e=>setForm({...form,weight:e.target.value})}/></label>
            <label className="label">{tr('f.photo')}<PhotoUpload current={form.photo||''} onChange={setPhotoFile}/></label>
          </div>
          <div className="modal-foot"><button className="btn btn-outline" onClick={()=>setModal(null)}>{tr('cancel')}</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div>
        </Modal>
      )}
    </div>
  );
}

function StaffTab({ token }) {
  const { t } = useLang(); const tr = key=>t(`staff.${key}`);
  const [staff,setStaff]=useState([]); const [modal,setModal]=useState(null); const [form,setForm]=useState({}); const [photoFile,setPhotoFile]=useState(null); const [saving,setSaving]=useState(false);
  const load=()=>req('GET','/api/staff',null,token).then(setStaff);
  useEffect(()=>{load();},[]);
  function openAdd(){setForm({name:'',role:'',email:'',photo:''});setPhotoFile(null);setModal({mode:'add'});}
  function openEdit(s){setForm({...s});setPhotoFile(null);setModal({mode:'edit',id:s.id});}
  async function save(){setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v??''));if(photoFile)fd.append('photo',photoFile);if(modal.mode==='add')await req('POST','/api/staff',fd,token);else await req('PUT',`/api/staff/${modal.id}`,fd,token);await load();setModal(null);}catch(e){alert(e.message);}finally{setSaving(false);}}
  async function del(id){if(!confirm(tr('confirmDel')))return;await req('DELETE',`/api/staff/${id}`,null,token);load();}
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({staff.length})</h3><button className="btn btn-primary" onClick={openAdd}>{tr('add')}</button></div>
      <div className="item-list">{staff.map(s=>(<div className="item-card" key={s.id}><img className="card-photo" src={s.photo||''} onError={e=>e.target.src='https://placehold.co/56x56/121a2d/9cb1d1?text=FC'} alt=""/><div className="card-info"><span className="card-name">{s.name}</span><span className="card-sub">{s.role}</span><span className="card-sub">{s.email}</span></div><div className="card-actions staff-card-actions"><button className="btn-sm" onClick={()=>openEdit(s)}>{tr('edit')}</button></div></div>))}</div>
      {modal&&(<Modal title={modal.mode==='add'?tr('addTitle'):tr('editTitle')} onClose={()=>setModal(null)}><div className="form-grid"><label className="label">{tr('f.name')}<input className="inp" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/></label><label className="label">{tr('f.role')}<input className="inp" value={form.role||''} onChange={e=>setForm({...form,role:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>{tr('f.email')}<input className="inp" type="email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>{tr('f.photo')}<PhotoUpload current={form.photo||''} onChange={setPhotoFile}/></label></div><div className="modal-foot"><button className="btn btn-outline" onClick={()=>setModal(null)}>{tr('cancel')}</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div></Modal>)}
    </div>
  );
}

function GalleryTab({ token }) {
  const { t } = useLang(); const tr=key=>t(`gallery.${key}`);
  const [images,setImages]=useState([]); const [uploading,setUploading]=useState(false); const fileRef=useRef();
  const load=()=>req('GET','/api/gallery',null,token).then(setImages);
  useEffect(()=>{load();},[]);
  async function upload(e){const f=e.target.files[0];if(!f)return;setUploading(true);try{const fd=new FormData();fd.append('photo',f);await req('POST','/api/gallery',fd,token);await load();}finally{setUploading(false);e.target.value='';}}
  async function del(url){if(!confirm(tr('confirmDel')))return;await req('DELETE','/api/gallery',{url},token);load();}
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({images.length})</h3><button className="btn btn-primary" onClick={()=>fileRef.current.click()} disabled={uploading}>{uploading?tr('uploading'):tr('upload')}</button><input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={upload}/></div>
      <div className="gallery-grid">{images.map((url,i)=>(<div className="gallery-item" key={i}><img className="gallery-img" src={url} onError={e=>e.target.src='https://placehold.co/150x110/121a2d/9cb1d1?text=foto'} alt=""/><button className="gallery-del" onClick={()=>del(url)}>✕</button></div>))}</div>
    </div>
  );
}

const EMPTY_RESULT={date:'',opponent:'',score:'',competition:'Albi Mall Superliga',venue:'',matchday:'',isHome:true};
function ResultsTab({ token }) {
  const { t } = useLang(); const tr=key=>t(`results.${key}`);
  const [matches,setMatches]=useState([]); const [table,setTable]=useState([]); const [modal,setModal]=useState(null); const [form,setForm]=useState(EMPTY_RESULT); const [saving,setSaving]=useState(false);
  const load=()=>req('GET','/api/results',null,token).then(d=>{setMatches(d.matches);setTable(d.table);});
  useEffect(()=>{load();},[]);
  function openAdd(){setForm(EMPTY_RESULT);setModal({mode:'add'});}
  function openEdit(m){setForm({date:m.date||'',opponent:m.opponent||'',score:m.score||'',competition:m.competition||'Albi Mall Superliga',venue:m.venue||'',matchday:m.matchday||'',isHome:m.isHome!==false});setModal({mode:'edit',id:m.id});}
  async function save(){setSaving(true);try{if(modal.mode==='add')await req('POST','/api/results',form,token);else await req('PUT',`/api/results/${modal.id}`,form,token);await load();setModal(null);setForm(EMPTY_RESULT);}catch(e){alert(e.message);}finally{setSaving(false);}}
  async function del(id){if(!confirm(tr('confirmDel')))return;await req('DELETE',`/api/results/${id}`,null,token);load();}
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({matches.length})</h3><button className="btn btn-primary" onClick={openAdd}>{tr('add')}</button></div>
      <div className="item-list">{matches.map(m=>(<div className="result-row" key={m.id}><span className="result-date">{m.date}</span><span className="result-info">{m.isHome!==false?<><b>FC Malisheva</b> vs <b>{m.opponent}</b></>:<><b>{m.opponent}</b> vs <b>FC Malisheva</b></>} <span className="result-score">{m.score}</span></span><span className="result-meta">{m.matchday?`${m.matchday} · `:''}{m.competition}</span><div className="result-actions" style={{display:'flex',gap:'6px',flexShrink:0}}><button className="btn-sm" onClick={()=>openEdit(m)}>{tr('edit')}</button><button className="btn-sm btn-danger" onClick={()=>del(m.id)}>{tr('del')}</button></div></div>))}</div>
      <div className="section-gap"><h4>{tr('tableTitle')}</h4><table><thead><tr><th>{tr('th.pos')}</th><th>{tr('th.team')}</th><th>{tr('th.played')}</th><th>{tr('th.pts')}</th></tr></thead><tbody>{table.map((r,i)=>(<tr key={i} className={r.team==='FC Malisheva'?'hl':''}><td>{r.position}</td><td>{r.team}</td><td>{r.played}</td><td><b>{r.points}</b></td></tr>))}</tbody></table></div>
      {modal&&(<Modal title={modal.mode==='add'?tr('addTitle'):t('results.editTitle')} onClose={()=>setModal(null)}><div className="form-grid"><label className="label">{tr('f.date')}<input className="inp" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label className="label">{tr('f.matchday')}<input className="inp" placeholder="p.sh. Java 36" value={form.matchday} onChange={e=>setForm({...form,matchday:e.target.value})}/></label><label className="label">{tr('f.opp')}<input className="inp" placeholder="p.sh. Drita" value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})}/></label><label className="label">{tr('f.score')}<input className="inp" placeholder="2-1" value={form.score} onChange={e=>setForm({...form,score:e.target.value})}/></label><label className="label">{tr('f.comp')}<input className="inp" placeholder={tr('f.compPH')} value={form.competition} onChange={e=>setForm({...form,competition:e.target.value})}/></label><label className="label">{tr('f.venue')}<input className="inp" placeholder={tr('f.venuePH')} value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>Pozicioni i FC Malishevës<div style={{display:'flex',gap:'20px',marginTop:'8px'}}><label style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',fontWeight:form.isHome!==false?700:400}}><input type="radio" name="isHome" checked={form.isHome!==false} onChange={()=>setForm({...form,isHome:true})}/>🏠 Vendas</label><label style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',fontWeight:form.isHome===false?700:400}}><input type="radio" name="isHome" checked={form.isHome===false} onChange={()=>setForm({...form,isHome:false})}/>✈️ Mysafir</label></div></label></div><div className="modal-foot"><button className="btn btn-outline" onClick={()=>setModal(null)}>{tr('cancel')}</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div></Modal>)}
    </div>
  );
}

function AnnouncementsTab({ token }) {
  const { t } = useLang(); const tr=key=>t(`announcements.${key}`);
  const [items,setItems]=useState([]); const [modal,setModal]=useState(null); const [form,setForm]=useState({}); const [saving,setSaving]=useState(false);
  const load=()=>req('GET','/api/announcements',null,token).then(setItems);
  useEffect(()=>{load();},[]);
  const emptyForm={title:'',title_en:'',content:'',content_en:'',category:'',category_en:'',date_display:''};
  function openAdd(){setForm(emptyForm);setModal({mode:'add'});}
  function openEdit(a){setForm({...a});setModal({mode:'edit',id:a.id});}
  async function save(){setSaving(true);try{if(modal.mode==='add')await req('POST','/api/announcements',form,token);else await req('PUT',`/api/announcements/${modal.id}`,form,token);await load();setModal(null);}catch(e){alert(e.message);}finally{setSaving(false);}}
  async function del(id){if(!confirm(tr('confirmDel')))return;await req('DELETE',`/api/announcements/${id}`,null,token);load();}
  const f=t('announcements.f');
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({items.length})</h3><button className="btn btn-primary" onClick={openAdd}>{tr('add')}</button></div>
      <div className="item-list">{items.map(a=>(<div className="item-card" key={a.id} style={{flexDirection:'column',alignItems:'flex-start',gap:'6px'}}><div style={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}><div><span className="card-name">{a.title}</span><span className="card-sub" style={{marginLeft:'8px'}}>{a.category} · {a.date_display}</span></div><div className="card-actions"><button className="btn-sm" onClick={()=>openEdit(a)}>{tr('edit')}</button><button className="btn-sm btn-danger" onClick={()=>del(a.id)}>{tr('del')}</button></div></div><p style={{fontSize:'0.8rem',color:'var(--muted)',margin:0}}>{a.content}</p></div>))}</div>
      {modal&&(<Modal title={modal.mode==='add'?tr('addTitle'):tr('editTitle')} onClose={()=>setModal(null)}><div className="form-grid"><label className="label">{f.title}<input className="inp" value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})}/></label><label className="label">{f.title_en}<input className="inp" value={form.title_en||''} onChange={e=>setForm({...form,title_en:e.target.value})}/></label><label className="label">{f.category}<input className="inp" value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})}/></label><label className="label">{f.category_en}<input className="inp" value={form.category_en||''} onChange={e=>setForm({...form,category_en:e.target.value})}/></label><label className="label">{f.date}<input className="inp" value={form.date_display||''} placeholder="p.sh. 5 qershor 2026" onChange={e=>setForm({...form,date_display:e.target.value})}/></label><div/><label className="label" style={{gridColumn:'1/-1'}}>{f.content}<textarea className="inp" rows="3" value={form.content||''} onChange={e=>setForm({...form,content:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>{f.content_en}<textarea className="inp" rows="3" value={form.content_en||''} onChange={e=>setForm({...form,content_en:e.target.value})}/></label></div><div className="modal-foot"><button className="btn btn-outline" onClick={()=>setModal(null)}>{tr('cancel')}</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div></Modal>)}
    </div>
  );
}

function MatchTab({ token }) {
  const { t } = useLang(); const tr=key=>t(`match.${key}`); const f=t('match.f');
  const [form,setForm]=useState({competition:'',matchday:'',stadium:'',home_team:'',home_logo:'',away_team:'',away_logo:'',match_date:'',match_time:'',ticket_url:''});
  const [homeFile,setHomeFile]=useState(null); const [awayFile,setAwayFile]=useState(null); const [saving,setSaving]=useState(false);
  const homeRef=useRef(); const awayRef=useRef();
  useEffect(()=>{req('GET','/api/upcoming-match',null,token).then(d=>{if(d)setForm(d);}).catch(()=>{});},[]);
  async function save(){setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v??''));if(homeFile)fd.append('home_logo_file',homeFile);if(awayFile)fd.append('away_logo_file',awayFile);const updated=await req('PUT','/api/upcoming-match',fd,token);setForm(updated);alert(tr('ticketSaved'));}catch(e){alert(e.message);}finally{setSaving(false);}}
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')}</h3></div>
      <div className="form-grid" style={{maxWidth:'600px'}}>
        <label className="label">{f.comp}<input className="inp" value={form.competition||''} onChange={e=>setForm({...form,competition:e.target.value})}/></label>
        <label className="label">{f.matchday}<input className="inp" value={form.matchday||''} onChange={e=>setForm({...form,matchday:e.target.value})}/></label>
        <label className="label" style={{gridColumn:'1/-1'}}>{f.stadium}<input className="inp" value={form.stadium||''} onChange={e=>setForm({...form,stadium:e.target.value})}/></label>
        <label className="label">{f.home}<input className="inp" value={form.home_team||''} onChange={e=>setForm({...form,home_team:e.target.value})}/><div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'6px'}}>{form.home_logo&&<img src={form.home_logo} style={{width:'36px',height:'36px',objectFit:'contain'}} alt=""/>}<button type="button" className="btn-sm" onClick={()=>homeRef.current.click()}>{f.homeLogo}</button><input ref={homeRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>setHomeFile(e.target.files[0])}/>{homeFile&&<span style={{fontSize:'0.75rem',color:'var(--muted)'}}>{homeFile.name}</span>}</div></label>
        <label className="label">{f.away}<input className="inp" value={form.away_team||''} onChange={e=>setForm({...form,away_team:e.target.value})}/><div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'6px'}}>{form.away_logo&&<img src={form.away_logo} style={{width:'36px',height:'36px',objectFit:'contain'}} alt=""/>}<button type="button" className="btn-sm" onClick={()=>awayRef.current.click()}>{f.awayLogo}</button><input ref={awayRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>setAwayFile(e.target.files[0])}/>{awayFile&&<span style={{fontSize:'0.75rem',color:'var(--muted)'}}>{awayFile.name}</span>}</div></label>
        <label className="label">{f.date}<input className="inp" value={form.match_date||''} placeholder="5 qershor 2026" onChange={e=>setForm({...form,match_date:e.target.value})}/></label>
        <label className="label">{f.time}<input className="inp" value={form.match_time||''} placeholder="19:00" onChange={e=>setForm({...form,match_time:e.target.value})}/></label>
        <label className="label" style={{gridColumn:'1/-1'}}>{f.ticketUrl}<input className="inp" value={form.ticket_url||''} placeholder="https://..." onChange={e=>setForm({...form,ticket_url:e.target.value})}/></label>
      </div>
      <div style={{marginTop:'24px'}}><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div>
    </div>
  );
}

function SponsorsTab({ token }) {
  const { t } = useLang(); const tr=key=>t(`sponsors.${key}`); const f=t('sponsors.f');
  const [items,setItems]=useState([]); const [modal,setModal]=useState(null); const [form,setForm]=useState({}); const [logoFile,setLogoFile]=useState(null); const [saving,setSaving]=useState(false);
  const load=()=>req('GET','/api/sponsors',null,token).then(setItems);
  useEffect(()=>{load();},[]);
  function openAdd(){setForm({name:'',logo_path:'',website_url:'#',sort_order:'0'});setLogoFile(null);setModal({mode:'add'});}
  function openEdit(s){setForm({...s,sort_order:String(s.sort_order||0)});setLogoFile(null);setModal({mode:'edit',id:s.id});}
  async function save(){setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v??''));if(logoFile)fd.append('logo_file',logoFile);if(modal.mode==='add')await req('POST','/api/sponsors',fd,token);else await req('PUT',`/api/sponsors/${modal.id}`,fd,token);await load();setModal(null);}catch(e){alert(e.message);}finally{setSaving(false);}}
  async function del(id){if(!confirm(tr('confirmDel')))return;await req('DELETE',`/api/sponsors/${id}`,null,token);load();}
  return (
    <div>
      <div className="tab-head"><h3>{tr('title')} ({items.length})</h3><button className="btn btn-primary" onClick={openAdd}>{tr('add')}</button></div>
      <div className="item-list">{items.map(s=>(<div className="item-card" key={s.id}><img src={s.logo_path||''} alt={s.name} style={{width:'52px',height:'40px',objectFit:'contain',background:'#fff',borderRadius:'6px',padding:'2px'}} onError={e=>e.target.style.display='none'}/><div className="card-info"><span className="card-name">{s.name}</span><span className="card-sub">{s.website_url}</span></div><div className="card-actions"><button className="btn-sm" onClick={()=>openEdit(s)}>{tr('edit')}</button><button className="btn-sm btn-danger" onClick={()=>del(s.id)}>{tr('del')}</button></div></div>))}</div>
      {modal&&(<Modal title={modal.mode==='add'?tr('addTitle'):tr('editTitle')} onClose={()=>setModal(null)}><div className="form-grid"><label className="label">{f.name}<input className="inp" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/></label><label className="label">{f.order}<input className="inp" type="number" value={form.sort_order||'0'} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>{f.website}<input className="inp" value={form.website_url||''} onChange={e=>setForm({...form,website_url:e.target.value})}/></label><label className="label" style={{gridColumn:'1/-1'}}>{f.logo}<PhotoUpload current={form.logo_path||''} onChange={setLogoFile}/></label></div><div className="modal-foot"><button className="btn btn-outline" onClick={()=>setModal(null)}>{tr('cancel')}</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?tr('saving'):tr('save')}</button></div></Modal>)}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState(0);
  const [lang, setLang] = useState('sq');

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (isTokenValid(t)) setToken(t);
    const l = localStorage.getItem('admin_lang');
    if (l) setLang(l);
    _forceLogout = () => setToken(null);
    return () => { _forceLogout = null; };
  }, []);

  const tr = TRANSLATIONS[lang];
  function switchLang() { const next=lang==='sq'?'en':'sq'; setLang(next); localStorage.setItem('admin_lang',next); }
  function t(path) { const keys=path.split('.'); let v=tr; for(const k of keys)v=v?.[k]; return v??path; }

  if (!token) return <Login onLogin={t=>{setToken(t);}} lang={lang} setLang={l=>{setLang(l);localStorage.setItem('admin_lang',l);}}/>;

  return (
    <LangCtx.Provider value={{t,lang}}>
      <div className="app">
        <div className="app-header">
          <div className="app-title">FC Malisheva <span> - {lang==='sq'?'Paneli i Administratorit':'Admin Panel'}</span></div>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <button className="lang-btn" onClick={switchLang} style={{display:'flex',alignItems:'center',gap:'6px'}}>
              {lang==='sq'?<><img src="/assets/logos/Gb.jpg" alt="EN" style={{width:'22px',height:'15px',objectFit:'cover',borderRadius:'2px'}}/><span>EN</span></>:<><img src="/assets/logos/Al.jpg" alt="SQ" style={{width:'22px',height:'15px',objectFit:'cover',borderRadius:'2px'}}/><span>SQ</span></>}
            </button>
            <button className="btn-sm btn-danger" onClick={()=>{localStorage.removeItem('admin_token');setToken(null);}}>{tr.logout}</button>
          </div>
        </div>
        <nav className="tabs">{tr.tabs.map((name,i)=>(<button key={i} className={'tab-btn'+(tab===i?' active':'')} onClick={()=>setTab(i)}>{name}</button>))}</nav>
        <div className="tab-content">
          {tab===0&&<PlayersTab token={token}/>}
          {tab===1&&<StaffTab token={token}/>}
          {tab===2&&<GalleryTab token={token}/>}
          {tab===3&&<ResultsTab token={token}/>}
          {tab===4&&<AnnouncementsTab token={token}/>}
          {tab===5&&<MatchTab token={token}/>}
          {tab===6&&<SponsorsTab token={token}/>}
        </div>
      </div>
    </LangCtx.Provider>
  );
}

export default function AdminApp() {
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'admin-panel-styles';
    el.textContent = ADMIN_CSS;
    document.head.appendChild(el);
    return () => document.getElementById('admin-panel-styles')?.remove();
  }, []);
  return <App />;
}