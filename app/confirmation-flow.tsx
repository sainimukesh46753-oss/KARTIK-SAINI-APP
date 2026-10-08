"use client";

import { useMemo, useState } from "react";

const countryLanguages: Record<string, string[]> = {
  "Afghanistan":["Dari","Pashto"],"Albania":["Albanian"],"Algeria":["Arabic","Tamazight"],"Andorra":["Catalan"],"Angola":["Portuguese"],
  "Antigua and Barbuda":["English"],"Argentina":["Spanish"],"Armenia":["Armenian"],"Australia":["English"],"Austria":["German"],
  "Azerbaijan":["Azerbaijani"],"Bahamas":["English"],"Bahrain":["Arabic"],"Bangladesh":["Bengali"],"Barbados":["English"],
  "Belarus":["Belarusian","Russian"],"Belgium":["Dutch","French","German"],"Belize":["English","Spanish"],"Benin":["French"],
  "Bhutan":["Dzongkha"],"Bolivia":["Spanish","Quechua","Aymara"],"Bosnia and Herzegovina":["Bosnian","Croatian","Serbian"],
  "Botswana":["English","Tswana"],"Brazil":["Portuguese"],"Brunei":["Malay"],"Bulgaria":["Bulgarian"],"Burkina Faso":["French"],
  "Burundi":["Kirundi","French","English"],"Cabo Verde":["Portuguese"],"Cambodia":["Khmer"],"Cameroon":["English","French"],
  "Canada":["English","French"],"Central African Republic":["French","Sango"],"Chad":["French","Arabic"],"Chile":["Spanish"],
  "China":["Mandarin Chinese"],"Colombia":["Spanish"],"Comoros":["Comorian","Arabic","French"],"Congo, Democratic Republic":["French"],
  "Congo, Republic":["French"],"Costa Rica":["Spanish"],"Côte d'Ivoire":["French"],"Croatia":["Croatian"],"Cuba":["Spanish"],
  "Cyprus":["Greek","Turkish"],"Czechia":["Czech"],"Denmark":["Danish"],"Djibouti":["French","Arabic"],"Dominica":["English"],
  "Dominican Republic":["Spanish"],"Ecuador":["Spanish"],"Egypt":["Arabic"],"El Salvador":["Spanish"],"Equatorial Guinea":["Spanish","French","Portuguese"],
  "Eritrea":["Tigrinya","Arabic","English"],"Estonia":["Estonian"],"Eswatini":["Swazi","English"],"Ethiopia":["Amharic","English"],
  "Fiji":["English","Fijian","Fiji Hindi"],"Finland":["Finnish","Swedish"],"France":["French"],"Gabon":["French"],
  "Gambia":["English"],"Georgia":["Georgian"],"Germany":["German"],"Ghana":["English"],"Greece":["Greek"],"Grenada":["English"],
  "Guatemala":["Spanish"],"Guinea":["French"],"Guinea-Bissau":["Portuguese"],"Guyana":["English"],"Haiti":["Haitian Creole","French"],
  "Honduras":["Spanish"],"Hungary":["Hungarian"],"Iceland":["Icelandic"],"India":["Hindi","English","Bengali","Telugu","Marathi","Tamil","Gujarati","Kannada","Malayalam","Punjabi","Urdu"],
  "Indonesia":["Indonesian"],"Iran":["Persian"],"Iraq":["Arabic","Kurdish"],"Ireland":["Irish","English"],"Israel":["Hebrew","Arabic"],
  "Italy":["Italian"],"Jamaica":["English"],"Japan":["Japanese"],"Jordan":["Arabic"],"Kazakhstan":["Kazakh","Russian"],
  "Kenya":["English","Swahili"],"Kiribati":["English","Gilbertese"],"Kuwait":["Arabic"],"Kyrgyzstan":["Kyrgyz","Russian"],
  "Laos":["Lao"],"Latvia":["Latvian"],"Lebanon":["Arabic"],"Lesotho":["Sesotho","English"],"Liberia":["English"],
  "Libya":["Arabic"],"Liechtenstein":["German"],"Lithuania":["Lithuanian"],"Luxembourg":["Luxembourgish","French","German"],
  "Madagascar":["Malagasy","French"],"Malawi":["English","Chichewa"],"Malaysia":["Malay"],"Maldives":["Dhivehi"],"Mali":["French"],
  "Malta":["Maltese","English"],"Marshall Islands":["Marshallese","English"],"Mauritania":["Arabic"],"Mauritius":["English","French","Mauritian Creole"],
  "Mexico":["Spanish"],"Micronesia":["English"],"Moldova":["Romanian"],"Monaco":["French"],"Mongolia":["Mongolian"],
  "Montenegro":["Montenegrin"],"Morocco":["Arabic","Amazigh"],"Mozambique":["Portuguese"],"Myanmar":["Burmese"],"Namibia":["English"],
  "Nauru":["Nauruan","English"],"Nepal":["Nepali"],"Netherlands":["Dutch"],"New Zealand":["English","Māori","New Zealand Sign Language"],
  "Nicaragua":["Spanish"],"Niger":["French"],"Nigeria":["English"],"North Korea":["Korean"],"North Macedonia":["Macedonian","Albanian"],
  "Norway":["Norwegian"],"Oman":["Arabic"],"Pakistan":["Urdu","English","Punjabi","Sindhi","Pashto","Balochi"],"Palau":["Palauan","English"],
  "Palestine":["Arabic"],"Panama":["Spanish"],"Papua New Guinea":["English","Tok Pisin","Hiri Motu"],"Paraguay":["Spanish","Guaraní"],
  "Peru":["Spanish","Quechua","Aymara"],"Philippines":["Filipino","English"],"Poland":["Polish"],"Portugal":["Portuguese"],
  "Qatar":["Arabic"],"Romania":["Romanian"],"Russia":["Russian"],"Rwanda":["Kinyarwanda","English","French"],"Saint Kitts and Nevis":["English"],
  "Saint Lucia":["English"],"Saint Vincent and the Grenadines":["English"],"Samoa":["Samoan","English"],"San Marino":["Italian"],
  "São Tomé and Príncipe":["Portuguese"],"Saudi Arabia":["Arabic"],"Senegal":["French","Wolof"],"Serbia":["Serbian"],
  "Seychelles":["Seychellois Creole","English","French"],"Sierra Leone":["English"],"Singapore":["English","Malay","Mandarin Chinese","Tamil"],
  "Slovakia":["Slovak"],"Slovenia":["Slovenian"],"Solomon Islands":["English"],"Somalia":["Somali","Arabic"],"South Africa":["English","Zulu","Xhosa","Afrikaans","Sesotho","Setswana"],
  "South Korea":["Korean"],"South Sudan":["English"],"Spain":["Spanish"],"Sri Lanka":["Sinhala","Tamil"],"Sudan":["Arabic","English"],
  "Suriname":["Dutch"],"Sweden":["Swedish"],"Switzerland":["German","French","Italian","Romansh"],"Syria":["Arabic"],
  "Tajikistan":["Tajik"],"Tanzania":["Swahili","English"],"Thailand":["Thai"],"Timor-Leste":["Tetum","Portuguese"],"Togo":["French"],
  "Tonga":["Tongan","English"],"Trinidad and Tobago":["English"],"Tunisia":["Arabic"],"Türkiye":["Turkish"],"Turkmenistan":["Turkmen"],
  "Tuvalu":["Tuvaluan","English"],"Uganda":["English","Swahili"],"Ukraine":["Ukrainian"],"United Arab Emirates":["Arabic","English"],
  "United Kingdom":["English","Welsh","Scottish Gaelic"],"United States":["English","Spanish"],"Uruguay":["Spanish"],"Uzbekistan":["Uzbek"],
  "Vanuatu":["Bislama","English","French"],"Vatican City":["Italian","Latin"],"Venezuela":["Spanish"],"Vietnam":["Vietnamese"],
  "Yemen":["Arabic"],"Zambia":["English"],"Zimbabwe":["English","Shona","Ndebele"]
};
const countries = Object.keys(countryLanguages).sort((a,b)=>a.localeCompare(b));


export default function ConfirmationFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  const normalizePhone = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.startsWith("+")) return trimmed.replace(/[^+\d]/g, "");
    const digits = trimmed.replace(/\D/g, "");
    if (country === "India" && digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
  };

  const sendOtp = async () => {
    setOtpSending(true); setOtpError("");
    try {
      const phone = normalizePhone(mobile);
      if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error("Please enter a valid mobile number with country code.");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("Authentication service is not configured.");
      const res = await fetch(`${url}/functions/v1/swift-worker`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "OTP could not be sent. Please try again.");
      setStep(4);
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "OTP could not be sent.");
    } finally { setOtpSending(false); }
  };

  const verifyOtp = async () => {
    setOtpVerifying(true); setOtpError("");
    try {
      const phone = normalizePhone(mobile);
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("Authentication service is not configured.");
      const res = await fetch(`${url}/functions/v1/swift-worker`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone, otp })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Invalid or expired OTP.");
      setStep(5);
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "OTP verification failed.");
    } finally { setOtpVerifying(false); }
  };

  const validAge = useMemo(() => {
    const value = Number(age);
    return Number.isInteger(value) && value >= 18 && value <= 120;
  }, [age]);

  const next = async () => {
    if (step === 1 && !country) return;
    if (step === 2 && !language) return;
    if (step === 3 && (!name.trim() || !validAge || !mobile.trim() || !email.includes("@"))) return;
    if (step === 3) { await sendOtp(); return; }
    if (step === 4) { await verifyOtp(); return; }
    setStep(Math.min(step + 1, 5));
  };

  const finish = () => {
    window.localStorage.setItem("ks-digital-onboarding-complete", "true");
    onComplete();
  };

  const startAgain = () => {
    window.localStorage.removeItem("ks-digital-onboarding-complete");
    window.location.reload();
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

        {step === 2 && <div className="confirm-step"><p className="step-kicker">STEP 2 OF 5</p><h3>Select your language</h3><label>Language<select value={language} onChange={e=>setLanguage(e.target.value)} disabled={!country}><option value="">{country ? "Select language" : "Select country first"}</option>{(countryLanguages[country] || []).map(x=><option key={x}>{x}</option>)}</select></label></div>}

        {step === 3 && <div className="confirm-step"><p className="step-kicker">STEP 3 OF 5</p><h3>Tell us about you</h3><label>Full name<input type="text" autoComplete="name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></label><label>Age <span className="age-hint">18+ only</span><input type="number" min="18" max="120" inputMode="numeric" placeholder="18" value={age} onChange={e=>setAge(e.target.value)}/></label><label>Mobile number<input inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={mobile} onChange={e=>setMobile(e.target.value)}/></label><label>Email<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></label>{age && !validAge && <p className="confirm-error">KS Digital is available only to users aged 18 or above.</p>}</div>}

        {step === 4 && <div className="confirm-step"><p className="step-kicker">STEP 4 OF 5</p><h3>Verify your contact</h3><p className="confirm-note">Enter the 6-digit OTP sent to your mobile. A fresh code is generated for each OTP request.</p><input className="otp-input" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="000000" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}/>{otpError && <p className="confirm-error">{otpError}</p>}<button className="ghost" type="button" onClick={sendOtp} disabled={otpSending}>{otpSending ? "Sending..." : "Resend OTP"}</button></div>}

        {step === 5 && <div className="confirm-step"><p className="step-kicker">STEP 5 OF 5</p><h3>Final confirmation</h3><p className="confirm-note">Confirm your details to enter KS Digital.</p><div className="confirm-summary"><span>Name</span><b>{name}</b><span>Age</span><b>{age}</b><span>Country</span><b>{country}</b><span>Language</span><b>{language}</b><span>Mobile</span><b>{mobile}</b><span>Email</span><b>{email}</b></div></div>}

        <div className="confirm-actions">{step > 1 && <button className="ghost" onClick={()=>setStep(step-1)}>Back</button>}<button className="primary" onClick={step===5?finish:next} disabled={otpSending || otpVerifying}>{step===5?"Confirm & Enter":step===3?(otpSending?"Sending OTP...":"Send real OTP"):step===4?(otpVerifying?"Verifying...":"Verify OTP"):"Continue"} <b>→</b></button></div>
        <button type="button" className="ghost" onClick={startAgain} disabled={otpSending || otpVerifying}>↻ Start again / Logout</button>
        <p className="confirm-footer">You must be 18+ to use KS Digital.</p>
      </div>
    </div>
  );
}
