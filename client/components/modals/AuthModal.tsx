"use client";
import { type FormEvent, useState } from "react";
import { api } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";

export default function AuthModal({
  close,
  onAuthenticated,
}: {
  close: () => void;
  onAuthenticated?: (token: string) => void | Promise<void>;
}) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "registration">("login"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(e.currentTarget);
    const payload = {
      email: String(data.get("email")),
      password: String(data.get("password")),
    };
    try {
      const result =
        mode === "login"
          ? await api.users.login(payload)
          : await api.users.register(payload);
      localStorage.setItem("atelier-token", result.token);
      await onAuthenticated?.(result.token);
      setMessage(t.welcome);
      setTimeout(close, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.genericError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="auth-modal">
        <button className="modal-close" onClick={close}>
          <Icon name="close" />
        </button>
        <p className="eyebrow">{t.yourAccount}</p>
        <h2>{mode === "login" ? t.welcomeBack : t.joinAtelier}</h2>
        <p>{t.accountText}</p>
        <form onSubmit={submit}>
          <label>
            {t.emailAddress}
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            {t.password}
            <input
              name="password"
              type="password"
              required
              placeholder={t.passwordPlaceholder}
            />
          </label>
          {message && <div className="form-message">{message}</div>}
          <button className="primary full" disabled={busy}>
            {busy ? t.oneMoment : mode === "login" ? t.signIn : t.createAccount}
          </button>
        </form>
        <button
          className="switch-auth"
          onClick={() => {
            setMode(mode === "login" ? "registration" : "login");
            setMessage("");
          }}
        >
          {mode === "login" ? t.newHere : t.alreadyMember}
        </button>
      </div>
    </div>
  );
}
