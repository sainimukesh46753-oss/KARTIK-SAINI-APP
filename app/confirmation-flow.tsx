"use client";

import { useState } from "react";

const countries = ["India","United States","United Kingdom","United Arab Emirates","Australia","Canada"];
const languages = ["English","Hindi","Hinglish"];

export default function ConfirmationFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [done, setDone] = useState(false);

  const next = () => {
    if (step === 1 && (!country || !language)) return;
    if (step === 2 && (!mobile || !email.includes("@"))) return;
    if (step === 3) setDemoOtp("123456");
    if (step === 4 && otp !== demoOtp) return;
    setStep(Math.min(step + 1, 5));
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-card" role="dialog" aria-modal="true">
        <div className="confirm-top">
          <div><p className="eyebrow">PROJECT CONFIRMATION</p><h2>{done ? "Confirmed." : "Let&apos;s get started."}</h2></div>
          <button className="confirm-close" onClick={onClose}>×</button>
        </div>
        {!done ? <>
          <div className="stepper">{[1,2,3,4,5].map(n => <span key={n} className={n <= step ? "done" : ""}>{n}</span>)}</div>
          {step === 1 && <div className="confirm-step"><p className="step-kicker">STEP 1 OF 5</p><h3>Select country & language</h3><label>Country<select value={country} onChange={e=>setCountry(e.target.value)}><option value="">Select country</option>{countries.map(x=><option key={x}>{x}</option>)}</select></label><label>Language<select value={language} onChange={e=>setLanguage(e.target.value)}><option value="">Select language</option>{languages.map(x=><option key={x}>{x}</option>)}</select></label></div>}
          {step === 2 && <div className="confirm-step"><p className="step-kicker">STEP 2 OF 5</p><h3>Mobile number & email</h3><label>Mobile number<input inputMode="tel" placeholder="+91 98765 43210" value={mobile} onChange={e=>setMobile(e.target.value)}/></label><label>Email<input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></label></div>}
          {step === 3 && <div className="confirm-step"><p className="step-kicker">STEP 3 OF 5</p><h3>Verify your details</h3><div className="confirm-summary"><span>Country</span><b>{country}</b><span>Language</span><b>{language}</b><span>Mobile</span><b>{mobile}</b><span>Email</span><b>{email}</b></div></div>}
          {step === 4 && <div className="confirm-step"><p className="step-kicker">STEP 4 OF 5</p><h3>Enter OTP</h3><p className="confirm-note">Enter the 6-digit code. Real SMS/email delivery can be connected next.</p><input className="otp-input" inputMode="numeric" maxLength={6} placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}/><div className="demo-code">Demo code: <b>{demoOtp}</b></div></div>}
          {step === 5 && <div className="confirm-step"><p className="step-kicker">STEP 5 OF 5</p><h3>Final confirmation</h3><p className="confirm-note">Review complete. Confirm to finish your enquiry.</p><div className="confirm-summary"><span>Country</span><b>{country}</b><span>Language</span><b>{language}</b><span>Mobile</span><b>{mobile}</b><span>Email</span><b>{email}</b></div></div>}
          <div className="confirm-actions">{step > 1 && <button className="ghost" onClick={()=>setStep(step-1)}>Back</button>}<button className="primary" onClick={()=>step===5?setDone(true):next()}>{step===5?"Final Confirm":step===3?"Send OTP":"Continue"} <b>→</b></button></div>
        </> : <div className="confirm-success"><div className="success-mark">✓</div><h3>Confirmation complete.</h3><p>Your details are ready for the next step.</p><button className="primary" onClick={onClose}>Done</button></div>}
      </div>
    </div>
  );
}