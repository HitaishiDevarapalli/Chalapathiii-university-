import React, { useState } from "react";
import { Lock, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { securityRequest } from "../../security/adminAccess";

export function AdminLoginSteps({ step, onStep, onComplete, onBack }: { step: string; onStep: (value: string) => void; onComplete: () => void; onBack: () => void }) {
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState(""); const [recovery, setRecovery] = useState(false);
  const [setup, setSetup] = useState<{ qrCode: string; manualKey: string } | null>(null);
  const [codes, setCodes] = useState<string[]>([]); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const complete = (data: any) => { setCode(""); setPassword(""); setConfirm(""); if (data.recoveryCodes) setCodes(data.recoveryCodes); else if (data.next === "complete") onComplete(); else onStep(data.next); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      if (step === "password" && password !== confirm) throw new Error("The passwords do not match.");
      const path = step === "password" ? "auth/password" : step === "enroll" ? "auth/totp/confirm" : "auth/totp";
      complete(await securityRequest(path, "POST", step === "password" ? { password } : { code, recovery }));
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };
  const enroll = async () => { setBusy(true); setError(""); try { setSetup(await securityRequest("auth/totp/enroll", "POST", {})); } catch (err: any) { setError(err.message); } finally { setBusy(false); } };
  if (codes.length) return <div className="security-login-step"><ShieldCheck size={30} /><h3>Save your recovery codes</h3><p>Store these codes privately. Each can be used once if your authenticator is unavailable. They will not be shown again.</p><div className="security-recovery-codes">{codes.map(value => <code key={value}>{value}</code>)}</div><button type="button" className="admin-button admin-button-primary" onClick={() => { setCodes([]); onComplete(); }}>I have saved my codes <ArrowRight size={17} /></button></div>;
  return <div className="security-login-step">
    <div className="security-step-icon">{step === "password" ? <Lock size={24} /> : <ShieldCheck size={25} />}</div>
    <h3>{step === "password" ? "Choose your new password" : step === "google" ? "Verify your Google identity" : step === "enroll" ? "Set up Google Authenticator" : "Verify your authenticator"}</h3>
    <p>{step === "password" ? "Your temporary password must be replaced before continuing." : step === "google" ? "Continue with the Google account authorized by the university. Your account remains restricted until all required steps are complete." : step === "enroll" ? "Scan your personal QR code with Google Authenticator, then enter its current six-digit code." : recovery ? "Enter one unused recovery code." : "Enter the current six-digit code from Google Authenticator."}</p>
    {error && <div role="alert" className="security-error">{error}</div>}
    {step === "google" ? <a className="admin-button admin-button-primary" href="/api/auth/google/start">Continue with Google <ArrowRight size={17} /></a> : step === "enroll" && !setup ? <button type="button" className="admin-button admin-button-primary" disabled={busy} onClick={enroll}><ShieldCheck size={17} />{busy ? "Preparing secure enrollment…" : "Create my enrollment QR code"}</button> :
      <form onSubmit={submit} className="space-y-4">
        {step === "password" ? <><label>New password<input type="password" autoComplete="new-password" minLength={14} required value={password} onChange={e => setPassword(e.target.value)} /></label><label>Confirm password<input type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} /></label><small>At least 14 characters, including uppercase, lowercase, a number and a symbol.</small></> :
          <>{setup && <div className="security-qr"><img src={setup.qrCode} alt="Your personal Google Authenticator enrollment QR code" /><details><summary>Enter a setup key manually</summary><code>{setup.manualKey}</code></details></div>}<label>{recovery ? "Recovery code" : "Authenticator code"}<input autoComplete="one-time-code" inputMode={recovery ? "text" : "numeric"} pattern={recovery ? undefined : "[0-9]{6}"} maxLength={recovery ? 80 : 6} required value={code} onChange={e => setCode(e.target.value.trim())} /></label></>}
        <button type="submit" className="admin-button admin-button-primary" disabled={busy}>{busy ? <RefreshCw size={16} /> : <ShieldCheck size={17} />}{busy ? "Verifying…" : "Verify and continue"}</button>
      </form>}
    {step === "totp" && <button type="button" className="security-text-button" onClick={() => { setRecovery(!recovery); setCode(""); }}>{recovery ? "Use authenticator instead" : "Use a recovery code"}</button>}
    <button type="button" className="security-text-button" onClick={onBack}>Start sign-in again</button>
  </div>;
}
