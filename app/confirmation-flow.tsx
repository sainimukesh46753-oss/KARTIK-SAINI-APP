"use client";

import { useMemo, useState } from "react";

const countries = ["India","United States","United Kingdom","United Arab Emirates","Australia","Canada"];
const languages = ["English","Hindi","Hinglish"];

export default function ConfirmationFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const validAge = useMemo(() => {
    const value = Number(age);
    return Number.isInteger(value) && value >= 18 && value <= 120;
  }, [age]);

  const next = () => {
    if (step === 1 && !country) return;
    if (step === 2 && !language) return;
    if (step === 3 && (!name.trim() || !validAge || !mobile.trim() || !email.includes("@"))) return;
    if (step === 4 && otp !== otpCode) return;
    if (step === 3) setOtpCode("123456");
    setStep(Math.min(step + 1, 5));
  };

  const finish = () => {
    window.localStorage.setItem("ks-digital-onboarding-complete", "true");
    onComplete();
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <div className="confirm-top">
          <div><p className="eyebrow">WELCOME TO KS DIGITAL</p><h2 id="welcome-title">Complete your profile.</h2></div>
          <span className="confirm-lock" aria-hidden="true">18+</span>
        </div>
        <div className="stepper">{[1,2,3,4,5].map(n => <span key={n} className={n <= step ? "done" : ""}>{n}</span>)}</div>

        {step === 1 && <div className="confirm-step"><p className="step-kicker">STEP 1 OF 5</p><h3>Select your country</h3><label>Country<select value={country} onChange={e=>setCountry(e.target.value)}><option value="">Select country</option>{countries.map(x=><option key={x}>{x}</option>)}</select></label></div>}

        {step === 2 && <div className="confirm-step"><p className="step-kicker">STEP 2 OF 5</p><h3>Select your language</h3><label>Language<select value={language} onChange={e=>setLanguage(e.target.value)}><option value="">Select language</option>{languages.map(x=><option key={x}>{x}</option>)}</select></label></div>}

        {step === 3 && <div className="confirm-step"><p className="step-kicker">STEP 3 OF 5</p><h3>Tell us about you</h3><label>Full name<input type="text" autoComplete="name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></label><label>Age <span className="age-hint">18+ only</span><input type="number" min="18" max="120" inputMode="numeric" placeholder="18" value={age} onChange={e=>setAge(e.target.value)}/></label><label>Mobile number<input inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={mobile} onChange={e=>setMobile(e.target.value)}/></label><label>Email<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></label>{age && !validAge && <p className="confirm-error">KS Digital is available only to users aged 18 or above.</p>}</div>}

        {step === 4 && <div className="confirm-step"><p className="step-kicker">STEP 4 OF 5</p><h3>Verify your contact</h3><p className="confirm-note">Enter the 6-digit OTP sent to your mobile/email.</p><input className="otp-input" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}/><div className="demo-code">Demo OTP: <b>{otpCode}</b></div></div>}

        {step === 5 && <div className="confirm-step"><p className="step-kicker">STEP 5 OF 5</p><h3>Final confirmation</h3><p className="confirm-note">Confirm your details to enter KS Digital.</p><div className="confirm-summary"><span>Name</span><b>{name}</b><span>Age</span><b>{age}</b><span>Country</span><b>{country}</b><span>Language</span><b>{language}</b><span>Mobile</span><b>{mobile}</b><span>Email</span><b>{email}</b></div></div>}

        <div className="confirm-actions">{step > 1 && <button className="ghost" onClick={()=>setStep(step-1)}>Back</button>}<button className="primary" onClick={step===5?finish:next}>{step===5?"Confirm & Enter":"Continue"} <b>→</b></button></div>
        <p className="confirm-footer">You must be 18+ to use KS Digital.</p>
      </div>
    </div>
  );
}
