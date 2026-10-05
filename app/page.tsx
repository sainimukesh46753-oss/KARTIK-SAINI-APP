"use client";

import { useEffect, useState } from "react";
import ConfirmationFlow from "./confirmation-flow";

const nav = ["Dashboard", "Projects", "Services", "Messages", "Profile"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

type ProjectRequest = {
  id: string;
  project_name: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  business_type: string;
  existing_url: string | null;
  features: string;
  reference: string | null;
  details: string;
  status: string;
  created_at: string;
};

function getClientId() {
  const key = "ks-digital-client-id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

async function loadProjectRequests(): Promise<ProjectRequest[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const response = await fetch(`${SUPABASE_URL}/rest/v1/project_requests?select=*&order=created_at.desc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "x-client-id": getClientId(),
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function saveProjectRequest(payload: Record<string, string>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase is not configured.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/project_requests`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      "x-client-id": getClientId(),
    },
    body: JSON.stringify({ ...payload, client_id: getClientId(), status: "new" }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}


function Content({ tab, setTab }: { tab: string; setTab: (v: string) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [projectStage, setProjectStage] = useState("Strategy");
  if (tab === "Projects") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / PROJECTS</p><h1>Your <span>projects.</span></h1><p className="dash-sub">A clean space for everything you are building.</p><div className="project-grid"><button className="project-card project-button" onClick={()=>setTab("FindF")}><div className="project-art art-purple"><span>01 / PRODUCT</span><strong>FindF</strong><em>Discovery platform</em></div><div className="project-meta"><b>FindF</b><span>Product Design + Development · Open project ↗</span></div></button><button className="project-card project-button" onClick={()=>setTab("KASA")}><div className="project-art art-dark"><span>02 / E-COMMERCE</span><strong>KASA</strong><em>Commerce experience</em></div><div className="project-meta"><b>KASA</b><span>UI / UX + Full-Stack · Open project ↗</span></div></button>{requests.length>0&&requests.map((p)=><button className="project-card project-button" key={p.id} onClick={()=>setTab(`Request-${p.id}`)}><div className="project-art art-dark"><span>NEW REQUEST / {p.status.toUpperCase()}</span><strong>{p.project_name}</strong><em>{p.service}</em></div><div className="project-meta"><b>{p.project_name}</b><span>{p.budget} · Submitted {new Date(p.created_at).toLocaleDateString()}</span></div></button>)}<button className="quick-card" onClick={() => setTab("New Project")}><span>+</span><div><h3>Start a new project</h3><p>Turn your next idea into something real.</p></div><b>↗</b></button></div></section>;
  if (tab.startsWith("Request-")) { const request = requests.find((p) => p.id === tab.replace("Request-", "")); if (!request) return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back to projects</button><h1>Project <span>not found.</span></h1></section>; return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back to projects</button><p className="eyebrow">KS DIGITAL / PROJECT REQUEST</p><h1>{request.project_name} <span>details.</span></h1><p className="dash-sub">Submitted {new Date(request.created_at).toLocaleString()} · Status: {request.status}</p><div className="quick-grid"><div className="quick-card"><span>01</span><div><h3>Client</h3><p>{request.name} · {request.email}</p></div></div><div className="quick-card"><span>02</span><div><h3>Service</h3><p>{request.service} · {request.budget}</p></div></div><div className="quick-card"><span>03</span><div><h3>Timeline</h3><p>{request.timeline} · {request.business_type}</p></div></div></div><div className="workspace-banner stage-panel"><div><p className="eyebrow">PROJECT DETAILS</p><h2>Requirements</h2><p>{request.details}</p><p><strong>Features:</strong> {request.features}</p><p><strong>Current website/app:</strong> {request.existing_url || "Not provided"}</p><p><strong>Reference:</strong> {request.reference || "Not provided"}</p></div></div></section>; }\n  if (tab === "FindF" || tab === "KASA") { const isFindF = tab === "FindF"; const stages = ["Strategy","Design","Build"]; return <section className="dashboard"><button className="text-btn" onClick={()=>setTab("Projects")}>← Back to projects</button><p className="eyebrow">KS DIGITAL / PROJECT / {isFindF ? "01" : "02"}</p><h1>{isFindF ? "FindF" : "KASA"} <span>case study.</span></h1><p className="dash-sub">{isFindF ? "A discovery platform focused on helping people find what they need." : "A modern commerce experience designed for a clean, premium shopping journey."}</p><div className="workspace-banner"><div><h2>{isFindF ? "Product Design + Development" : "UI / UX + Full-Stack"}</h2><p>{isFindF ? "Search, discovery, product experience and responsive development." : "Premium storefront, product experience, checkout flow and full-stack development."}</p></div><button className="primary" onClick={()=>setTab("New Project")}>Start a similar project ↗</button></div><div className="stage-tabs">{stages.map((stage,i)=><button key={stage} className={projectStage===stage?"stage-tab active":"stage-tab"} onClick={()=>setProjectStage(stage)}><span>0{i+1}</span>{stage}</button>)}</div><div className="workspace-banner stage-panel"><div><p className="eyebrow">CURRENT PHASE</p><h2>{projectStage}</h2><p>{projectStage==="Strategy" ? "Goals, audience, requirements, sitemap and project roadmap." : projectStage==="Design" ? "Wireframes, UI system, responsive layouts and interaction design." : "Frontend, backend integrations, testing, deployment and launch support."}</p></div><button className="ghost" onClick={()=>setTab("New Project")}>Use this scope ↗</button></div><div className="quick-grid"><div className="quick-card"><span>01</span><div><h3>Scope</h3><p>Clear deliverables and milestones.</p></div></div><div className="quick-card"><span>02</span><div><h3>Premium quality</h3><p>Responsive, polished and launch-ready.</p></div></div><div className="quick-card"><span>03</span><div><h3>Support</h3><p>Post-launch fixes and improvements.</p></div></div></div></section>; }
  if (tab === "Services") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / SERVICES</p><h1>What we <span>do.</span></h1><p className="dash-sub">Development, design and branding for digital products.</p><div className="quick-grid">{["Web Development","UI / UX Design","Graphic Design","Brand Identity","E-commerce","Product Strategy"].map((x,i)=><button className="quick-card" key={x} onClick={()=>setTab("New Project")}><span>0{i+1}</span><div><h3>{x}</h3><p>View service details and start a project.</p></div><b>↗</b></button>)}</div></section>;
  if (tab === "Messages") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / MESSAGES</p><h1>Your <span>requests.</span></h1><p className="dash-sub">Your submitted project requests are saved permanently and shown here.</p>{requests.length===0?<div className="workspace-banner"><div><h2>No requests yet.</h2><p>Submit a project and it will appear here.</p></div><button className="primary" onClick={()=>setTab("New Project")}>Start a project ↗</button></div>:<div className="quick-grid">{requests.map(p=><button className="quick-card" key={p.id} onClick={()=>setTab(`Request-${p.id}`)}><span>↗</span><div><h3>{p.project_name}</h3><p>{p.service} · {p.budget} · {new Date(p.created_at).toLocaleDateString()}</p></div><b>Open</b></button>)}</div>}</section>;
  if (tab === "Profile") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / PROFILE</p><h1>Your <span>profile.</span></h1><p className="dash-sub">Manage your account details and workspace identity.</p><div className="workspace-banner"><div><h2>KS Digital Member</h2><p>Your profile details will be connected to your account once authentication is enabled.</p></div><button className="ghost" onClick={()=>setTab("Settings")}>Settings</button></div></section>;
  if (tab === "Settings") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / SYSTEM</p><h1>App <span>settings.</span></h1><p className="dash-sub">Control your workspace preferences.</p><div className="quick-grid"><button className="quick-card"><span>01</span><div><h3>Account</h3><p>Profile and account preferences.</p></div></button><button className="quick-card"><span>02</span><div><h3>Notifications</h3><p>Choose what you want to receive.</p></div></button><button className="quick-card"><span>03</span><div><h3>Privacy</h3><p>Manage privacy and security.</p></div></button></div></section>;
  if (tab === "New Project" || tab === "Start a project") return <section className="dashboard"><p className="eyebrow">KS DIGITAL / NEW PROJECT</p><h1>Let's build <span>it.</span></h1><p className="dash-sub">Tell us about your idea and we'll take it from there.</p>{submitted?<div className="workspace-banner"><div><h2>Project request received ✓</h2><p>Thanks. Your project details have been captured successfully.</p></div><button className="primary" onClick={()=>setSubmitted(false)}>Create another</button></div>:<form className="project-form" onSubmit={async (e)=>{e.preventDefault();setSaving(true);setFormError("");try{const data=Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string,string>;await saveProjectRequest(data);setSubmitted(true);}catch(err){setFormError(err instanceof Error?err.message:"Could not save project.");}finally{setSaving(false);}}}><label>Project name<input required name="projectName" placeholder="e.g. My new website" /></label><label>Your name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Service<select required name="service" defaultValue=""><option value="" disabled>Select a service</option><option>Web Development</option><option>UI / UX Design</option><option>Graphic Design</option><option>Brand Identity</option><option>E-commerce</option><option>Product Strategy</option><option>Mobile App Development</option><option>Custom Web App</option><option>SEO & Performance</option><option>Maintenance & Support</option></select></label><label>Budget package<select required name="budget" defaultValue=""><option value="" disabled>Select a budget</option><option>E-commerce Website — Premium starts from ₹50,000</option><option>Business Website — Premium starts from ₹35,000</option><option>UI / UX Design — Starts from ₹25,000</option><option>Graphic Design — Starts from ₹10,000</option><option>Brand Identity — Starts from ₹20,000</option><option>Mobile App — Premium starts from ₹75,000</option><option>Custom Web App — Premium starts from ₹1,00,000</option><option>Product Strategy — Starts from ₹15,000</option><option>SEO & Performance — Starts from ₹15,000</option><option>Maintenance & Support — Starts from ₹10,000/month</option></select></label><label>Timeline<select required name="timeline" defaultValue=""><option value="" disabled>Select timeline</option><option>1–2 weeks</option><option>2–4 weeks</option><option>1–2 months</option><option>2–3 months</option><option>3+ months</option></select></label><label>Business type<select required name="businessType" defaultValue=""><option value="" disabled>Select business type</option><option>Startup</option><option>Small Business</option><option>Agency</option><option>Creator / Personal Brand</option><option>Enterprise</option></select></label><label>Current website/app<input name="existing" placeholder="Optional — paste current website or app link" /></label><label>Features needed<input required name="features" placeholder="e.g. payments, login, admin panel, booking" /></label><label>Reference / inspiration<input name="reference" placeholder="Optional — links or examples you like" /></label><label>Project details<textarea required name="details" rows={5} placeholder="Tell us what you want to build..." /></label><div className="form-actions"><button type="button" className="ghost" onClick={()=>setTab("Dashboard")}>Back</button><button type="submit" className="primary" disabled={saving}>{saving?"Saving…":"Submit project ↗"}</button></div>{formError&&<p style={{gridColumn:"1 / -1",color:"#ff8f8f"}}>{formError}</p>}</form>}</section>;
  return <section className="dashboard"><div className="dash-top"><div><p className="eyebrow">KS DIGITAL / DASHBOARD</p><h1>Build something <span>great.</span></h1><p className="dash-sub">Your workspace for digital products, design and creative projects.</p></div><button className="primary" onClick={()=>setTab("New Project")}>New project ↗</button></div><div className="stats">{[["01","Projects",String(2+requests.length)],["02","Services","06"],["03","Messages",String(requests.length).padStart(2,"0")]].map(([n,l,v])=><div className="stat" key={l}><span>{n}</span><div><strong>{v}</strong><small>{l}</small></div></div>)}</div><div className="section-title"><div><p className="eyebrow">START HERE</p><h2>What do you want to do?</h2></div></div><div className="quick-grid">{[["Start a project","Tell us what you want to build."],["Explore services","Development, design & branding."],["View projects","See selected work and case studies."]].map(([t,d])=><button className="quick-card" key={t} onClick={()=>setTab(t==="Start a project"?"New Project":t==="Explore services"?"Services":"Projects")}><span>↗</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></button>)}</div><div className="section-title recent-title"><div><p className="eyebrow">WORK</p><h2>Selected projects.</h2></div><button className="text-btn" onClick={()=>setTab("Projects")}>View all →</button></div><div className="project-grid"><article className="project-card"><div className="project-art art-purple"><span>01 / PRODUCT</span><strong>FindF</strong><em>Discovery platform</em></div><div className="project-meta"><b>FindF</b><span>Product Design + Development</span></div></article><article className="project-card"><div className="project-art art-dark"><span>02 / E-COMMERCE</span><strong>KASA</strong><em>Commerce experience</em></div><div className="project-meta"><b>KASA</b><span>UI / UX + Full-Stack</span></div></article></div></section>;
}

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);
  const [tab, setTab] = useState("Dashboard");
  useEffect(() => setConfirmed(window.localStorage.getItem("ks-digital-onboarding-complete") === "true"), []);
  return <main className="app"><header className="app-header"><div className="brand"><img className="brand-logo" src="/ks-digital-logo.svg" alt="KS Digital" /></div><div className="header-right"><span className="live"><i /> Online</span><button className="profile-btn" onClick={()=>setTab("Profile")}>KS</button></div></header><div className="dashboard-shell"><aside className="sidebar"><p className="side-label">WORKSPACE</p>{nav.map(item=><button key={item} className={tab===item?"side-link active":"side-link"} onClick={()=>setTab(item)}><span>{item==="Dashboard"?"⌂":item==="Projects"?"▣":item==="Services"?"✦":item==="Messages"?"◌":"○"}</span>{item}</button>)}<div className="sidebar-bottom"><p className="side-label">SYSTEM</p><button className={tab==="Settings"?"side-link active":"side-link"} onClick={()=>setTab("Settings")}><span>⚙</span>Settings</button></div></aside><Content tab={tab} setTab={setTab}/></div><nav className="mobile-nav">{nav.map(x=><button className={tab===x?"active":""} key={x} onClick={()=>setTab(x)}>{x}</button>)}</nav>{!confirmed&&<ConfirmationFlow onComplete={()=>setConfirmed(true)}/>}</main>;
}
