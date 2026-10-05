"use client";

import { useState } from "react";
import ConfirmationFlow from "./confirmation-flow";

const services = [
  { n: "01", title: "Web Development", text: "Fast, polished digital experiences built for real use." },
  { n: "02", title: "Full-Stack Apps", text: "Products with thoughtful flows, data and scalable foundations." },
  { n: "03", title: "UI / UX Design", text: "Interfaces that feel clear, premium and intentional." },
  { n: "04", title: "Brand & Graphic Design", text: "Visual systems, logos and campaign creatives that stick." },
];

const work = [
  { tag: "PRODUCT", title: "FindF", desc: "A concept product experience focused on discovery and conversion." },
  { tag: "E-COMMERCE", title: "KASA", desc: "A modern commerce interface designed around browsing and trust." },
  { tag: "BRANDING", title: "Brand Systems", desc: "Identity direction, logo systems and supporting visual language." },
];

export default function Home() {
  const [tab, setTab] = useState("Home");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const closeConfirmation = () => setConfirmOpen(!confirmOpen);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const openConfirmation = () => {
    setConfirmOpen(true);
    setStep(1);
    setConfirmed(false);
  };

  const nextStep = () => {
    if (step === 1 && (!country || !language)) return;
    if (step === 2 && (!mobile || !email || !email.includes("@"))) return;
    if (step === 3) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setDemoOtp(code);
    }
    if (step === 4 && otp !== demoOtp) return;
    setStep((value) => Math.min(value + 1, 5));
  };

  const scrollTo = (id: string, nextTab: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setTab(nextTab);
  };

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand"><img className="brand-logo" src="/ks-digital-logo.svg" alt="KS Digital" /></div>
        <span className="status"><i /> Available for projects</span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">DEVELOPMENT × DESIGN</p>
        <h1>Ideas into <span>digital products.</span></h1>
        <p className="hero-copy">Development, design and visual identity — forged together into focused digital products.</p>
        <div className="hero-actions">
          <button className="primary" onClick={openConfirmation}>Start a project <b>↗</b></button>
          <button className="ghost" onClick={() => scrollTo("work", "Work")}>Explore work</button>
        </div>
      </section>

      <section className="featured" id="work">
        <div className="section-head"><div><p className="eyebrow">SELECTED WORK</p><h2>Built with intent.</h2></div><span className="count">03 PROJECTS</span></div>
        <div className="work-grid">
          {work.map((item, i) => (
            <article className="work-card" key={item.title}>
              <div className={"work-art art-" + (i + 1)}><span>{item.tag}</span><strong>{item.title}</strong><em>↗</em></div>
              <div className="card-copy"><h3>{item.title}</h3><p>{item.desc}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-head"><div><p className="eyebrow">WHAT I DO</p><h2>Small team energy.<br />Full product thinking.</h2></div></div>
        <div className="service-list">
          {services.map((s) => <article className="service" key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div><b>↗</b></article>)}
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow">HAVE A PROJECT?</p>
        <h2>Let&apos;s make something<br /><span>worth remembering.</span></h2>
        <p>Tell me what you&apos;re building, what&apos;s stuck, or simply where you want to go.</p>
        <button className="primary" onClick={() => window.location.href = "mailto:sainimukesh46753@gmail.com"}>Send an enquiry <b>↗</b></button>
      </section>

      <nav className="bottom-nav" aria-label="App navigation">
        {[["Home","home","⌂"],["Work","work","◫"],["Services","services","✦"],["Contact","contact","↗"]].map(([label,id,icon]) =>
          <button className={tab === label ? "active" : ""} key={label} onClick={() => scrollTo(id, label)}><span>{icon}</span>{label}</button>
        )}
      </nav>
    </main>
  );
}
