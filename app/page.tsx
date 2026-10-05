"use client";

import { useEffect, useState } from "react";
import ConfirmationFlow from "./confirmation-flow";

const stats = [
  ["01", "Projects", "12"],
  ["02", "Services", "08"],
  ["03", "Messages", "03"],
];

const quick = [
  ["Start a project", "Tell us what you want to build.", "↗"],
  ["Explore services", "Development, design & branding.", "→"],
  ["View portfolio", "See selected work and case studies.", "→"],
];

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);
  const [tab, setTab] = useState("Dashboard");

  useEffect(() => {
    setConfirmed(window.localStorage.getItem("ks-digital-onboarding-complete") === "true");
  }, []);

  const go = (label: string) => {
    setTab(label);
    const id = label.toLowerCase().replace(" ", "-");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="app">
      <header className="app-header">
        <div className="brand"><img className="brand-logo" src="/ks-digital-logo.svg" alt="KS Digital" /></div>
        <div className="header-right"><span className="live"><i /> Online</span><button className="profile-btn" onClick={() => setTab("Profile")}>KS</button></div>
      </header>

      <div className="dashboard-shell">
        <aside className="sidebar">
          <p className="side-label">WORKSPACE</p>
          {["Dashboard", "Projects", "Services", "Messages", "Profile"].map((item) => (
            <button key={item} className={tab === item ? "side-link active" : "side-link"} onClick={() => setTab(item)}>
              <span>{item === "Dashboard" ? "⌂" : item === "Projects" ? "▣" : item === "Services" ? "✦" : item === "Messages" ? "◌" : "○"}</span>{item}
            </button>
          ))}
          <div className="sidebar-bottom"><p className="side-label">SYSTEM</p><button className="side-link" onClick={() => setTab("Settings")}><span>⚙</span>Settings</button></div>
        </aside>

        <section className="dashboard" id="dashboard">
          <div className="dash-top">
            <div><p className="eyebrow">KS DIGITAL / DASHBOARD</p><h1>Build something <span>great.</span></h1><p className="dash-sub">Your workspace for digital products, design and creative projects.</p></div>
            <button className="primary" onClick={() => setTab("New Project")}>New project <b>↗</b></button>
          </div>

          <div className="stats">
            {stats.map(([n, label, value]) => <div className="stat" key={label}><span>{n}</span><div><strong>{value}</strong><small>{label}</small></div></div>)}
          </div>

          <div className="section-title"><div><p className="eyebrow">QUICK ACTIONS</p><h2>What do you want to do?</h2></div></div>
          <div className="quick-grid">
            {quick.map(([title, text, icon]) => <button className="quick-card" key={title} onClick={() => setTab(title)}><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div><b>↗</b></button>)}
          </div>

          <div className="section-title recent-title"><div><p className="eyebrow">RECENT WORK</p><h2>Projects in focus.</h2></div><button className="text-btn" onClick={() => setTab("Projects")}>View all →</button></div>
          <div className="project-grid">
            <article className="project-card"><div className="project-art art-purple"><span>01 / PRODUCT</span><strong>FindF</strong><em>Discovery platform</em></div><div className="project-meta"><b>FindF</b><span>Product Design + Development</span></div></article>
            <article className="project-card"><div className="project-art art-dark"><span>02 / E-COMMERCE</span><strong>KASA</strong><em>Commerce experience</em></div><div className="project-meta"><b>KASA</b><span>UI / UX + Full-Stack</span></div></article>
            <article className="project-card"><div className="project-art art-blue"><span>03 / BRANDING</span><strong>KS</strong><em>Identity system</em></div><div className="project-meta"><b>Brand Systems</b><span>Strategy + Visual Identity</span></div></article>
          </div>

          <section className="workspace-banner" id="projects">
            <div><p className="eyebrow">YOUR WORKSPACE</p><h2>One place for every <span>digital idea.</span></h2><p>Projects, files, conversations and services will live here as we build the next version of KS Digital.</p></div>
            <button className="ghost" onClick={() => setTab("Projects")}>Open projects</button>
          </section>
        </section>
      </div>

      <nav className="mobile-nav">{["Dashboard","Projects","Services","Messages","Profile"].map(x => <button className={tab===x?"active":""} key={x} onClick={() => setTab(x)}>{x}</button>)}</nav>
      {!confirmed && <ConfirmationFlow onComplete={() => setConfirmed(true)} />}
    </main>
  );
}
