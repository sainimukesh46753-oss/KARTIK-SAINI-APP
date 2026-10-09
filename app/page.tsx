"use client";

import { useEffect, useMemo, useState } from "react";
import ConfirmationFlow from "./confirmation-flow";

const nav = ["Dashboard","Projects","Products","Services","Messages","Files","Payments","Timeline","Notifications","Analytics","Support","Admin Panel","Profile","Settings"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

type Project = {
  id:string; project_name:string; name:string; email:string; service:string; budget:string;
  timeline:string; business_type:string; existing_url:string|null; features:string;
  reference:string|null; details:string; status:string; created_at:string;
};
type Message = {id:string; project_id:string|null; sender:string; message:string; created_at:string};
type Task = {id:string; project_id:string|null; title:string; status:string; due_date:string|null; created_at:string};
type FileRow = {id:string; project_id:string|null; name:string; url:string|null; created_at:string};
type Invoice = {id:string; project_id:string|null; amount:number; status:string; due_date:string|null; created_at:string};
type Notice = {id:string; title:string; body:string; read:boolean; created_at:string};
type Profile = {client_id:string; full_name:string; email:string|null; mobile:string|null; company:string|null; country:string|null; role:string|null; about:string|null};
type Ticket = {id:string; project_id:string|null; subject:string; message:string; status:string; created_at:string};
type StoreProduct = {id:number; title:string; description:string; category:string; price:number; rating:number; thumbnail:string; images:string[]; brand?:string};

function clientId() {
  const key = "ks-digital-client-id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (typeof window !== "undefined") localStorage.setItem(key,id);
  }
  return id;
}
async function api(path:string, init:RequestInit={}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase is not configured.");
  const headers = {
    apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`,
    "Content-Type":"application/json", "x-ks-token":clientId(), "x-client-id":clientId(),
    ...(init.headers || {})
  };
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...init,headers,cache:"no-store"});
  if (!r.ok) throw new Error(await r.text());
  return r.status===204 ? null : r.json();
}
async function getRows<T>(table:string, query:string):Promise<T[]> { return api(`${table}?select=*${query}`); }
async function insertRow<T>(table:string, body:unknown):Promise<T[]> {
  return api(table,{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(body)});
}
async function updateRow(table:string, query:string, body:unknown) {
  return api(`${table}?${query}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(body)});
}

function ConnectionStatus() {
  const [weak,setWeak]=useState(false);
  useEffect(()=>{
    const check=()=>{
      const connection=(navigator as Navigator & {connection?:{effectiveType?:string;rtt?:number;downlink?:number}}).connection;
      setWeak(!navigator.onLine || connection?.effectiveType==="2g" || connection?.effectiveType==="slow-2g" || (connection?.rtt??0)>=700 || (connection?.downlink??10)<0.8);
    };
    check(); window.addEventListener("online",check); window.addEventListener("offline",check);
    const connection=(navigator as Navigator & {connection?:EventTarget}).connection;
    connection?.addEventListener("change",check);
    const timer=window.setInterval(check,5000);
    return()=>{window.removeEventListener("online",check);window.removeEventListener("offline",check);connection?.removeEventListener("change",check);window.clearInterval(timer)};
  },[]);
  if(!weak) return null;
  return <span className="connection-status" title="Internet connection is weak"><span className="connection-bars"><i/><i/><i/></span><span>Slow connection</span></span>;
}

function Card({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <div className={`quick-card ${className}`}>{children}</div>;
}

function Content({tab,setTab}:{tab:string;setTab:(v:string)=>void}) {
  const [projects,setProjects]=useState<Project[]>([]);\n  const [storeProducts,setStoreProducts]=useState<StoreProduct[]>([]);\n  const [productsLoading,setProductsLoading]=useState(false);\n  const [productsError,setProductsError]=useState("");\n  const [productSearch,setProductSearch]=useState("");\n  const [productCategory,setProductCategory]=useState("all");
  const [messages,setMessages]=useState<Message[]>([]);
  const [tasks,setTasks]=useState<Task[]>([]);
  const [files,setFiles]=useState<FileRow[]>([]);
  const [invoices,setInvoices]=useState<Invoice[]>([]);
  const [notices,setNotices]=useState<Notice[]>([]);
  const [tickets,setTickets]=useState<Ticket[]>([]);
  const [profile,setProfile]=useState<Profile>({client_id:clientId(),full_name:"KS Digital Member",email:"",mobile:"",company:"",country:"India",role:"",about:""});
  const [selectedProject,setSelectedProject]=useState("");
  const [search,setSearch]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [taskTitle,setTaskTitle]=useState("");
  const [taskDue,setTaskDue]=useState("");
  const [fileName,setFileName]=useState("");
  const [fileUrl,setFileUrl]=useState("");
  const [ticketSubject,setTicketSubject]=useState("");
  const [ticketMessage,setTicketMessage]=useState("");
  const [projectStage,setProjectStage]=useState("Strategy");
  const [settings,setSettings]=useState<Record<string,boolean>>({autoSave:true,progress:true,compact:false,projectUpdates:true,newMessages:true,paymentReminders:true,sessionProtection:true});
  const [theme,setTheme]=useState("dark");
  const [submitted,setSubmitted]=useState(false);

  const reload=async()=>{
    try {
      const token=clientId();
      const [p,m,t,f,i,n,s,pr]=await Promise.all([
        getRows<Project>("project_requests","&order=created_at.desc"),
        getRows<Message>("project_messages",`&browser_token=eq.${encodeURIComponent(token)}&order=created_at.asc`),
        getRows<Task>("project_tasks",`&browser_token=eq.${encodeURIComponent(token)}&order=created_at.desc`),
        getRows<FileRow>("project_files",`&browser_token=eq.${encodeURIComponent(token)}&order=created_at.desc`),
        getRows<Invoice>("project_invoices",`&browser_token=eq.${encodeURIComponent(token)}&order=created_at.desc`),
        getRows<Notice>("project_notifications",`&browser_token=eq.${encodeURIComponent(token)}&order=created_at.desc`),
        getRows<Ticket>("support_tickets",`&client_id=eq.${encodeURIComponent(token)}&order=created_at.desc`),
        getRows<Profile>("client_profiles",`&client_id=eq.${encodeURIComponent(token)}&limit=1`)
      ]);
      setProjects(p);setMessages(m);setTasks(t);setFiles(f);setInvoices(i);setNotices(n);setTickets(s);
      if(pr[0]) setProfile(pr[0]);
    } catch(e) { console.error(e); }
  };
  useEffect(()=>{ reload(); },[tab,submitted]);

  useEffect(()=>{\n    if(tab!=="Products" || storeProducts.length) return;\n    let cancelled=false;\n    setProductsLoading(true);setProductsError("");\n    fetch("https://dummyjson.com/products?limit=0")\n      .then(r=>{if(!r.ok) throw new Error("Product catalog could not be loaded.");return r.json();})\n      .then(data=>{if(!cancelled)setStoreProducts(Array.isArray(data.products)?data.products:[]);})\n      .catch(()=>{if(!cancelled)setProductsError("Product photos could not load. Please check your internet connection and try again.");})\n      .finally(()=>{if(!cancelled)setProductsLoading(false);});\n    return()=>{cancelled=true;};\n  },[tab,storeProducts.length]);

  useEffect(()=>{
    const raw=localStorage.getItem("ks-digital-settings");
    if(raw) setSettings(JSON.parse(raw));
    const savedTheme=localStorage.getItem("ks-digital-theme") || "dark";
    setTheme(savedTheme); document.documentElement.classList.toggle("light-mode",savedTheme==="light");
  },[]);
  const setSetting=(key:string,value:boolean)=>{
    const next={...settings,[key]:value};setSettings(next);localStorage.setItem("ks-digital-settings",JSON.stringify(next));
  };
  const changeTheme=(value:string)=>{
    setTheme(value);localStorage.setItem("ks-digital-theme",value);
    document.documentElement.classList.toggle("light-mode",value==="light");
    if(value==="system") document.documentElement.classList.toggle("light-mode",window.matchMedia("(prefers-color-scheme: light)").matches);
  };

  const filteredProjects=useMemo(()=>projects.filter(p=>`${p.project_name} ${p.service} ${p.status}`.toLowerCase().includes(search.toLowerCase())),[projects,search]);
  const activeProject=projects.find(p=>p.id===selectedProject) || projects[0];

  const createProject=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();setBusy(true);setMessage("");
    const fd=new FormData(e.currentTarget);
    try {
      const rows=await insertRow<Project>("project_requests",{
        client_id:clientId(),project_name:fd.get("projectName"),name:fd.get("name"),email:fd.get("email"),
        service:fd.get("service"),budget:fd.get("budget"),timeline:fd.get("timeline"),business_type:fd.get("businessType"),
        existing_url:fd.get("existing")||null,features:fd.get("features"),reference:fd.get("reference")||null,details:fd.get("details"),status:"new"
      });
      const p=rows[0];
      if(p) {
        await insertRow("project_notifications",{browser_token:clientId(),title:"Project received",body:`${p.project_name} has been added to your workspace.`,read:false});
        await insertRow("project_tasks",{browser_token:clientId(),project_id:p.id,title:"Project kickoff",status:"todo"});
      }
      setMessage("Project saved successfully.");setSubmitted(x=>!x);setTab("Projects");
    } catch(e) { setMessage(e instanceof Error?e.message:"Could not save project."); } finally { setBusy(false); }
  };

  const sendMessage=async()=>{
    if(!message.trim() || !activeProject) return;
    await insertRow("project_messages",{browser_token:clientId(),project_id:activeProject.id,sender:"client",message:message.trim()});
    setMessage("");await reload();
  };
  const addTask=async()=>{
    if(!taskTitle.trim()||!activeProject)return;
    await insertRow("project_tasks",{browser_token:clientId(),project_id:activeProject.id,title:taskTitle.trim(),status:"todo",due_date:taskDue||null});
    setTaskTitle("");setTaskDue("");await reload();
  };
  const toggleTask=async(t:Task)=>{
    await updateRow("project_tasks",`id=eq.${t.id}&browser_token=eq.${encodeURIComponent(clientId())}`,{status:t.status==="done"?"todo":"done"});await reload();
  };
  const addFile=async()=>{
    if(!fileName.trim()||!activeProject)return;
    await insertRow("project_files",{browser_token:clientId(),project_id:activeProject.id,name:fileName.trim(),url:fileUrl.trim()||null});
    setFileName("");setFileUrl("");await reload();
  };
  const saveProfile=async()=>{
    setBusy(true);
    try {
      const body={...profile,client_id:clientId(),updated_at:new Date().toISOString()};
      await api(`client_profiles?client_id=eq.${encodeURIComponent(clientId())}`,{method:"DELETE"});
      await insertRow("client_profiles",body);
      setMessage("Profile saved permanently.");
    } catch(e){setMessage(e instanceof Error?e.message:"Profile save failed.");} finally{setBusy(false);}
  };
  const addTicket=async()=>{
    if(!ticketSubject.trim()||!ticketMessage.trim())return;
    await insertRow("support_tickets",{client_id:clientId(),project_id:activeProject?.id||null,subject:ticketSubject.trim(),message:ticketMessage.trim(),status:"open"});
    setTicketSubject("");setTicketMessage("");await reload();
  };
  const markRead=async(n:Notice)=>{await updateRow("project_notifications",`id=eq.${n.id}&browser_token=eq.${encodeURIComponent(clientId())}`,{read:true});await reload();};

  if(tab==="Dashboard") return <section className="dashboard">
    <div className="dash-top"><div><p className="eyebrow">KS DIGITAL / WORKSPACE</p><h1>Build something <span>great.</span></h1><p className="dash-sub">Your complete project workspace for ideas, delivery, files, communication and growth.</p></div><button className="primary" onClick={()=>setTab("New Project")}>+ New project</button></div>
    <div className="stats">{[[String(projects.length).padStart(2,"0"),"Projects","Projects"],["10","Services","Services"],[String(messages.length).padStart(2,"0"),"Messages","Messages"]].map(([v,l,t])=><button className="stat" key={l} onClick={()=>setTab(t)}><span>01</span><div><strong>{v}</strong><small>{l}</small></div></button>)}</div>
    <div className="section-title"><h2>Workspace tools</h2><span className="count">13 AREAS</span></div>
    <div className="quick-grid">{[["Projects","Manage projects, briefs and milestones."],["Messages","Chat about active projects."],["Files","Keep shared files and deliverable links."],["Payments","Track invoices and payment status."],["Timeline","Follow project milestones and tasks."],["Analytics","Understand workspace activity."],["Notifications","See important updates."],["Support","Open and track support tickets."],["Admin Panel","Workspace overview and management shortcuts."]].map(([t,d],i)=><button className="quick-card" key={t} onClick={()=>setTab(t)}><span>0${i+1}</span><h3>{t}</h3><p>{d}</p><b>↗</b></button>)}</div>
  </section>;

  if(tab==="Projects") return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / PROJECTS</p><h1>Your <span>projects.</span></h1><p className="dash-sub">Search, open and manage every project in your workspace.</p></div><button className="primary" onClick={()=>setTab("New Project")}>+ New project</button></div><div className="workspace-search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects, services or status..." /></div><div className="project-grid">{filteredProjects.map(p=><button className="project-card project-button" key={p.id} onClick={()=>{setSelectedProject(p.id);setTab(`Project-${p.id}`)}}><div className="project-art art-dark"><span>{p.status.toUpperCase()}</span><strong>{p.project_name}</strong><em>{p.service}</em></div><div className="project-meta"><b>{p.project_name}</b><span>{p.budget} · {new Date(p.created_at).toLocaleDateString()}</span></div></button>)}<button className="project-card project-button" onClick={()=>setTab("FindF")}><div className="project-art art-purple"><span>CASE STUDY / 01</span><strong>FindF</strong><em>Discovery platform</em></div><div className="project-meta"><b>FindF</b><span>Open case study ↗</span></div></button><button className="project-card project-button" onClick={()=>setTab("KASA")}><div className="project-art art-dark"><span>CASE STUDY / 02</span><strong>KASA</strong><em>Commerce experience</em></div><div className="project-meta"><b>KASA</b><span>Open case study ↗</span></div></button><a className="project-card project-button" href="https://stripe.com" target="_blank" rel="noreferrer"><div className="project-art art-purple"><span>LIVE REFERENCE / 03</span><strong>Stripe</strong><em>Fintech website</em></div><div className="project-meta"><b>Stripe</b><span>Open website ↗</span></div></a><a className="project-card project-button" href="https://linear.app" target="_blank" rel="noreferrer"><div className="project-art art-dark"><span>LIVE REFERENCE / 04</span><strong>Linear</strong><em>Productivity platform</em></div><div className="project-meta"><b>Linear</b><span>Open website ↗</span></div></a><a className="project-card project-button" href="https://www.notion.so" target="_blank" rel="noreferrer"><div className="project-art art-purple"><span>LIVE REFERENCE / 05</span><strong>Notion</strong><em>Workspace product</em></div><div className="project-meta"><b>Notion</b><span>Open website ↗</span></div></a><a className="project-card project-button" href="https://vercel.com" target="_blank" rel="noreferrer"><div className="project-art art-dark"><span>LIVE REFERENCE / 06</span><strong>Vercel</strong><em>Developer platform</em></div><div className="project-meta"><b>Vercel</b><span>Open website ↗</span></div></a></div></section>;

  if(tab.startsWith("Project-")) { const p=projects.find(x=>x.id===tab.replace("Project-","")); if(!p)return <section className="dashboard"><h1>Project <span>not found.</span></h1></section>; const ptasks=tasks.filter(x=>x.project_id===p.id);const pmsgs=messages.filter(x=>x.project_id===p.id);return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back to projects</button><p className="eyebrow">KS DIGITAL / PROJECT</p><h1>{p.project_name} <span>workspace.</span></h1><p className="dash-sub">{p.service} · {p.budget} · {p.timeline}</p><div className="quick-grid"><Card><span>CLIENT</span><h3>{p.name}</h3><p>{p.email}</p></Card><Card><span>STATUS</span><h3>{p.status}</h3><p>{p.business_type}</p></Card><Card><span>MESSAGES</span><h3>{pmsgs.length}</h3><p>Project conversation</p></Card></div><div className="workspace-columns"><div className="settings-section"><p className="eyebrow">TASKS</p><h2>Milestones & tasks</h2>{ptasks.map(t=><label className="task-row" key={t.id}><input type="checkbox" checked={t.status==="done"} onChange={()=>toggleTask(t)}/><span>{t.title}</span><small>{t.due_date||"No due date"}</small></label>)}<div className="inline-form"><input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="Add a task"/><input type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)}/><button className="primary" onClick={addTask}>Add</button></div></div><div className="settings-section"><p className="eyebrow">MESSAGES</p><h2>Project chat</h2><div className="chat-list">{pmsgs.map(m=><div className={`chat-bubble ${m.sender==="client"?"mine":""}`} key={m.id}><b>{m.sender==="client"?"You":"KS Digital"}</b><p>{m.message}</p></div>)}</div><div className="inline-form"><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a message..."/><button className="primary" onClick={sendMessage}>Send</button></div></div></div></section>; }

  if(tab==="FindF"||tab==="KASA"){const isFindF=tab==="FindF";return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back</button><p className="eyebrow">KS DIGITAL / CASE STUDY</p><h1>{isFindF?"FindF":"KASA"} <span>case study.</span></h1><div className="workspace-banner"><div><h2>{isFindF?"Product Design + Development":"UI / UX + Full-Stack"}</h2><p>{isFindF?"Discovery, search and responsive product experience.":"Premium storefront, product journey and full-stack commerce."}</p></div><button className="primary" onClick={()=>setTab("New Project")}>Start similar project ↗</button></div><div className="stage-tabs">{["Strategy","Design","Build"].map((x,i)=><button key={x} className={projectStage===x?"stage-tab active":"stage-tab"} onClick={()=>setProjectStage(x)}><span>0{i+1}</span>{x}</button>)}</div><div className="workspace-banner stage-panel"><div><p className="eyebrow">CURRENT PHASE</p><h2>{projectStage}</h2><p>Goals → design system → responsive build → testing → launch.</p></div></div></section>}

  if(tab==="New Project") return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back</button><p className="eyebrow">KS DIGITAL / NEW PROJECT</p><h1>Start your <span>next project.</span></h1><p className="dash-sub">Tell us what you want to build. This request will be saved to your workspace.</p>{message&&<div className="workspace-banner"><p>{message}</p></div>}<form className="project-form" onSubmit={createProject}><label>Project name<input name="projectName" required placeholder="e.g. KASA 2.0"/></label><label>Your name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label><label>Service<select name="service" defaultValue="Web Development"><option>Web Development</option><option>UI / UX Design</option><option>Graphic Design</option><option>Brand Identity</option><option>E-commerce</option><option>Mobile App Development</option><option>Custom Web App</option><option>SEO & Performance</option><option>Maintenance & Support</option></select></label><label>Budget<select name="budget"><option>E-commerce Website — Premium starts from ₹50,000</option><option>Business Website — Premium starts from ₹35,000</option><option>UI / UX Design — Starts from ₹25,000</option><option>Graphic Design — Starts from ₹10,000</option><option>Brand Identity — Starts from ₹20,000</option><option>Mobile App — Premium starts from ₹75,000</option><option>Custom Web App — Premium starts from ₹1,00,000</option></select></label><label>Timeline<select name="timeline"><option>1–2 weeks</option><option>2–4 weeks</option><option>1–2 months</option><option>2–3 months</option><option>3+ months</option></select></label><label>Business type<select name="businessType"><option>Startup</option><option>Small Business</option><option>Agency</option><option>Creator / Personal Brand</option><option>Enterprise</option></select></label><label>Current website/app<input name="existing" placeholder="https://..."/></label><label>Features needed<textarea name="features" rows={4} required placeholder="Search, login, payments, dashboard..."/></label><label>Reference / inspiration<input name="reference"/></label><label>Project details<textarea name="details" rows={6} required/></label><div className="form-actions"><button className="primary" disabled={busy}>{busy?"Saving...":"Submit project ↗"}</button></div></form></section>;

  if(tab==="Messages") return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / MESSAGES</p><h1>Project <span>communication.</span></h1><p className="dash-sub">Choose a project to open its live message history.</p></div></div><div className="quick-grid">{projects.map(p=><button className="quick-card" key={p.id} onClick={()=>{setSelectedProject(p.id);setTab(`Project-${p.id}`)}}><span>↗</span><h3>{p.project_name}</h3><p>{messages.filter(m=>m.project_id===p.id).length} messages · {p.service}</p></button>)}</div></section>;

  if(tab==="Files") return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / FILES</p><h1>Your digital <span>vault.</span></h1><p className="dash-sub">Save project files, shared links and deliverables.</p></div></div><div className="settings-section"><div className="inline-form"><select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}><option value="">Select project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.project_name}</option>)}</select><input value={fileName} onChange={e=>setFileName(e.target.value)} placeholder="File name"/><input value={fileUrl} onChange={e=>setFileUrl(e.target.value)} placeholder="File URL"/><button className="primary" onClick={addFile}>Add file</button></div></div><div className="file-grid">{files.map(f=><a className="file-card" key={f.id} href={f.url||"#"} target="_blank" rel="noreferrer"><span>↗</span><div><h3>{f.name}</h3><p>{projects.find(p=>p.id===f.project_id)?.project_name||"Project file"}</p></div><b>Open</b></a>)}</div></section>;

  if(tab==="Payments") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / PAYMENTS</p><h1>Invoices & <span>payments.</span></h1><p className="dash-sub">Track actual invoice records saved in your workspace.</p><div className="analytics-grid"><div className="metric-card"><span>TOTAL</span><strong>₹{invoices.reduce((a,x)=>a+Number(x.amount||0),0).toLocaleString("en-IN")}</strong><p>Total invoice value</p></div><div className="metric-card"><span>PENDING</span><strong>{invoices.filter(x=>x.status==="pending").length}</strong><p>Awaiting payment</p></div><div className="metric-card"><span>PAID</span><strong>{invoices.filter(x=>x.status==="paid").length}</strong><p>Completed invoices</p></div><div className="metric-card"><span>PROJECTS</span><strong>{projects.length}</strong><p>Workspace projects</p></div></div><div className="quick-grid">{invoices.map(i=><Card key={i.id}><span>{i.status.toUpperCase()}</span><h3>₹{Number(i.amount).toLocaleString("en-IN")}</h3><p>Due {i.due_date||"Not set"}</p></Card>)}</div></section>;

  if(tab==="Timeline") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / TIMELINE</p><h1>Project <span>timeline.</span></h1><p className="dash-sub">Track milestones, tasks and delivery stages.</p><div className="stage-tabs">{["Pending","Strategy","Design","Development","Testing","Completed"].map((x,i)=><button className={projectStage===x?"stage-tab active":"stage-tab"} key={x} onClick={()=>setProjectStage(x)}><span>0{i+1}</span>{x}</button>)}</div><div className="workspace-banner stage-panel"><div><p className="eyebrow">CURRENT STATUS</p><h2>{projectStage}</h2><p>{tasks.filter(t=>t.status==="done").length} completed tasks · {tasks.filter(t=>t.status!=="done").length} open tasks.</p></div></div></section>;

  if(tab==="Notifications") return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / ACTIVITY</p><h1>All your <span>updates.</span></h1><p className="dash-sub">Database-backed notifications with read/unread state.</p></div></div><div className="notification-list">{notices.length?notices.map(n=><button className="notification-card" key={n.id} onClick={()=>markRead(n)}><div className="notification-dot">{n.read?"✓":"!"}</div><div><h3>{n.title}</h3><p>{n.body}</p></div><time>{new Date(n.created_at).toLocaleString()}</time></button>):<div className="workspace-banner"><p>No notifications yet.</p></div>}</div></section>;

  if(tab==="Analytics") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / ANALYTICS</p><h1>Your project <span>insights.</span></h1><p className="dash-sub">Live counts calculated from your workspace data.</p><div className="analytics-grid">{[["PROJECTS",projects.length,"Saved projects"],["MESSAGES",messages.length,"Project messages"],["TASKS",tasks.length,"Workspace tasks"],["FILES",files.length,"Shared files"]].map(([a,b,d])=><div className="metric-card" key={a as string}><span>{a}</span><strong>{b}</strong><p>{d}</p></div>)}</div><div className="analytics-panel">{["Strategy","Design","Development","Testing"].map((x,i)=><div className="bar-row" key={x}><span>{x}</span><i style={{width:`${Math.max(18,75-i*16)}%`}} /></div>)}</div></section>;

  if(tab==="Support") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / SUPPORT</p><h1>Support <span>center.</span></h1><p className="dash-sub">Open a ticket and keep your support history in one place.</p><div className="settings-section"><div className="project-form"><label>Subject<input value={ticketSubject} onChange={e=>setTicketSubject(e.target.value)} placeholder="What do you need help with?"/></label><label>Project<select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}><option value="">No project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.project_name}</option>)}</select></label><label className="profile-full">Message<textarea value={ticketMessage} onChange={e=>setTicketMessage(e.target.value)} rows={5}/></label><div className="form-actions"><button className="primary" onClick={addTicket}>Create support ticket</button></div></div></div><div className="quick-grid">{tickets.map(t=><Card key={t.id}><span>{t.status.toUpperCase()}</span><h3>{t.subject}</h3><p>{t.message}</p></Card>)}</div></section>;

  if(tab==="Admin Panel") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / ADMIN</p><h1>Workspace <span>overview.</span></h1><p className="dash-sub">A single place to review activity and jump to the tools you use to manage client work.</p><div className="analytics-grid">{[["PROJECTS",projects.length,"Project requests","Projects"],["MESSAGES",messages.length,"Project conversations","Messages"],["TASKS",tasks.length,"Milestones and tasks","Timeline"],["FILES",files.length,"Shared files and links","Files"],["INVOICES",invoices.length,"Invoice records","Payments"],["TICKETS",tickets.length,"Support requests","Support"]].map(([label,value,desc,target])=><button className="metric-card admin-metric" key={label} onClick={()=>setTab(target as string)}><span>{label}</span><strong>{value}</strong><p>{desc}</p><small>Open section ↗</small></button>)}</div><div className="settings-section"><p className="eyebrow">QUICK ACTIONS</p><h2>Manage your workspace</h2><div className="settings-tools"><button onClick={()=>setTab("New Project")}>＋ Create project</button><button onClick={()=>setTab("Notifications")}>♧ Review notifications</button><button onClick={()=>setTab("Analytics")}>↗ View analytics</button><button onClick={()=>setTab("Support")}>? Support tickets</button><button onClick={()=>setTab("Profile")}>◎ Client profile</button><button onClick={()=>setTab("Settings")}>⚙ Workspace settings</button></div></div><div className="workspace-banner"><div><h2>Payments and files</h2><p>Payment processing and direct file uploads require a connected payment provider and configured file storage. The current workspace can track invoice records and shared file links.</p></div></div></section>;

  if(tab==="Profile") return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / ACCOUNT</p><h1>Your <span>profile.</span></h1><p className="dash-sub">Your saved workspace identity and contact details.</p></div></div><div className="profile-hero"><div className="avatar-xl">KS</div><div><p className="eyebrow">CLIENT PROFILE</p><h2>{profile.full_name}</h2><p>{profile.company||"Your project account"}</p></div><span className="profile-status">● Active</span></div><div className="profile-form"><label>Full name<input value={profile.full_name} onChange={e=>setProfile({...profile,full_name:e.target.value})}/></label><label>Email<input value={profile.email||""} onChange={e=>setProfile({...profile,email:e.target.value})}/></label><label>Mobile number<input value={profile.mobile||""} onChange={e=>setProfile({...profile,mobile:e.target.value})}/></label><label>Company / Brand<input value={profile.company||""} onChange={e=>setProfile({...profile,company:e.target.value})}/></label><label>Country<input value={profile.country||""} onChange={e=>setProfile({...profile,country:e.target.value})}/></label><label>Role<input value={profile.role||""} onChange={e=>setProfile({...profile,role:e.target.value})}/></label><label className="profile-full">About you<textarea rows={5} value={profile.about||""} onChange={e=>setProfile({...profile,about:e.target.value})}/></label><div className="form-actions"><button className="primary" onClick={saveProfile} disabled={busy}>{busy?"Saving...":"Save profile ✓"}</button></div></div></section>;

  if(tab==="Settings") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / SYSTEM</p><h1>Workspace <span>settings.</span></h1><p className="dash-sub">These preferences now persist on this device.</p><div className="settings-layout"><aside className="settings-nav">{["General","Notifications","Appearance","Privacy & Security","Desktop App","Language & Region","Workspace","Help & Support"].map((x,i)=><button className={i===0?"setting-nav-active":""} key={x}>{["⚙","🔔","🎨","🔐","💻","🌐","📊","❓"][i]} {x}</button>)}</aside><div className="settings-content"><div className="settings-section"><p className="eyebrow">GENERAL</p><h2>Workspace preferences</h2>{[["autoSave","Auto-save project activity","Keep project updates saved automatically."],["progress","Show project progress","Display milestones and progress."],["compact","Compact workspace","Use a tighter layout."]].map(([k,t,d])=><div className="setting-row" key={k}><div><b>{t}</b><small>{d}</small></div><label className="toggle"><input type="checkbox" checked={settings[k]??false} onChange={e=>setSetting(k,e.target.checked)}/><i/></label></div>)}</div><div className="settings-section"><p className="eyebrow">NOTIFICATIONS</p><h2>Stay updated</h2>{[["projectUpdates","Project updates"],["newMessages","New messages"],["paymentReminders","Payment reminders"]].map(([k,t])=><div className="setting-row" key={k}><div><b>{t}</b><small>Workspace alerts and activity notifications.</small></div><label className="toggle"><input type="checkbox" checked={settings[k]??false} onChange={e=>setSetting(k,e.target.checked)}/><i/></label></div>)}</div><div className="settings-section"><p className="eyebrow">APPEARANCE</p><h2>Make it yours</h2><div className="appearance-grid">{["dark","light","system"].map(x=><button key={x} onClick={()=>changeTheme(x)}><strong>{x==="dark"?"◐":x==="light"?"○":"↔"}</strong><b>{x[0].toUpperCase()+x.slice(1)}</b><small>{theme===x?"Currently selected":"Choose this theme"}</small></button>)}</div></div><div className="settings-section"><p className="eyebrow">PRIVACY & SECURITY</p><h2>Workspace protection</h2><div className="security-card"><span>✓</span><div><b>Protected</b><small>Your client workspace uses a private browser token for row-level access.</small></div><em>Active</em></div><div className="setting-row"><div><b>Session protection</b><small>Protect this workspace session on this device.</small></div><label className="toggle"><input type="checkbox" checked={settings.sessionProtection} onChange={e=>setSetting("sessionProtection",e.target.checked)}/><i/></label></div></div><div className="settings-section"><p className="eyebrow">LANGUAGE & REGION</p><h2>Regional preferences</h2><div className="settings-fields"><label>Language<select><option>English</option><option>Hindi</option></select></label><label>Currency<select><option>INR — ₹</option><option>USD — $</option><option>GBP — £</option><option>AED — د.إ</option></select></label><label>Time zone<select><option>India Standard Time</option><option>UTC</option><option>Gulf Standard Time</option></select></label></div></div><div className="settings-section"><p className="eyebrow">WORKSPACE TOOLS</p><div className="settings-tools"><button onClick={()=>setTab("Profile")}>Profile →</button><button onClick={()=>setTab("Notifications")}>Notifications →</button><button onClick={()=>setTab("Analytics")}>Analytics →</button><button onClick={()=>setTab("Support")}>Support center →</button></div></div><div className="settings-section"><p className="eyebrow">DESKTOP APP</p><h2>Install KS Digital</h2><p>Use your browser menu and choose Install app when this site is available as a PWA.</p></div></div></div></section>;

  if(tab==="Products") {\n    const categories=Array.from(new Set(storeProducts.map(p=>p.category))).sort();\n    const visibleProducts=storeProducts.filter(p=>(productCategory==="all"||p.category===productCategory)&&`\u0024{p.title} \u0024{p.brand||""} \u0024{p.category}`.toLowerCase().includes(productSearch.toLowerCase()));\n    return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / STORE</p><h1>Product <span>catalog.</span></h1><p className="dash-sub">Browse product listings with real product photos. This is the starter catalog; reaching 10,000+ items will require connecting a larger supplier feed or importing a product file.</p></div><span className="count">{storeProducts.length.toLocaleString("en-IN")} PRODUCTS</span></div><div className="product-controls"><input aria-label="Search products" value={productSearch} onChange={e=>setProductSearch(e.target.value)} placeholder="Search products..." /><select aria-label="Filter by category" value={productCategory} onChange={e=>setProductCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c} value={c}>{c.replace(/-/g," ")}</option>)}</select></div>{productsLoading&&<div className="workspace-banner"><p>Loading product catalog and photos…</p></div>}{productsError&&<div className="workspace-banner"><div><p>{productsError}</p><button className="primary" onClick={()=>{setStoreProducts([]);setProductsError("");setTab("Dashboard");setTimeout(()=>setTab("Products"),0);}}>Try again</button></div></div>}{!productsLoading&&!productsError&&<><p className="product-result-count">Showing {visibleProducts.length.toLocaleString("en-IN")} of {storeProducts.length.toLocaleString("en-IN")} starter products</p><div className="catalog-grid">{visibleProducts.map(p=><article className="catalog-card" key={p.id}><div className="catalog-photo"><img src={p.thumbnail||p.images?.[0]} alt={p.title} loading="lazy" /></div><div className="catalog-info"><span className="catalog-category">{p.category.replace(/-/g," ")}</span><h3>{p.title}</h3><p>{p.brand||p.description}</p><div className="catalog-price"><strong>₹{Math.round(p.price*83).toLocaleString("en-IN")}</strong><span>★ {p.rating.toFixed(1)}</span></div></div></article>)}</div>{visibleProducts.length===0&&<div className="workspace-banner"><p>No products match that search.</p></div>}</>}</section>;\n  }\n\n  if(tab==="Services") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / SERVICES</p><h1>What we <span>do.</span></h1><p className="dash-sub">Development, design, branding and growth services.</p><div className="quick-grid">{["Web Development","UI / UX Design","Graphic Design","Brand Identity","E-commerce","Mobile App Development","Custom Web App","SEO & Performance","Maintenance & Support"].map((x,i)=><button className="quick-card" key={x} onClick={()=>setTab("New Project")}><span>{String(i+1).padStart(2,"0")}</span><h3>{x}</h3><p>Open a new project request for this service.</p><b>↗</b></button>)}</div></section>;

  return <section className="dashboard"><h1>Page <span>ready.</span></h1><p className="dash-sub">Choose an area from the workspace navigation.</p></section>;
}

export default function Home() {
  const [tab,setTab]=useState("Dashboard");
  const [ready,setReady]=useState(false);
  useEffect(()=>{setReady(localStorage.getItem("ks-digital-onboarding-complete")==="true"); if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});},[]);
  if(!ready) return <ConfirmationFlow onComplete={()=>setReady(true)}/>;
  return <main className="app"><header className="app-header"><div className="brand"><div className="brand-mark">KS</div></div><div className="header-right"><ConnectionStatus/><span className="live">● Online</span><button className="profile-btn" onClick={()=>setTab("Profile")}>KS</button></div></header><div className="dashboard-shell"><aside className="sidebar"><p className="side-label">WORKSPACE</p>{nav.map((item,i)=><button className={tab===item?"side-link active":"side-link"} key={item} onClick={()=>setTab(item)}><span>{["⌂","▣","▦","✦","✉","□","₹","◷","●","◒","?","◎","⚙","☰"][i]}</span>{item}</button>)}</aside><Content tab={tab} setTab={setTab}/></div><nav className="mobile-nav">{nav.slice(0,5).map((item)=><button className={tab===item?"active":""} key={item} onClick={()=>setTab(item)}>{item}</button>)}</nav></main>;
}
