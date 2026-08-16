"use client";
import { type FormEvent, useState } from "react";
import { api } from "@/lib/api";
import Icon from "@/components/ui/Icon";

export default function AuthModal({close,onAuthenticated}:{close:()=>void;onAuthenticated?:(token:string)=>void|Promise<void>}){
 const[mode,setMode]=useState<"login"|"registration">("login"),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage("");const data=new FormData(e.currentTarget);const payload={email:String(data.get("email")),password:String(data.get("password"))};try{const result=mode==="login"?await api.users.login(payload):await api.users.register(payload);localStorage.setItem("atelier-token",result.token);await onAuthenticated?.(result.token);setMessage("Welcome to Atelier Market.");setTimeout(close,900)}catch(error){setMessage(error instanceof Error?error.message:"Something went wrong.")}finally{setBusy(false)}}
 return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="auth-modal"><button className="modal-close" onClick={close}><Icon name="close"/></button><p className="eyebrow">Your account</p><h2>{mode==="login"?"Welcome back.":"Join the atelier."}</h2><p>Save favorites and keep your considered finds close.</p><form onSubmit={submit}><label>Email address<input name="email" type="email" required placeholder="you@example.com"/></label><label>Password<input name="password" type="password" required placeholder="Enter any password"/></label>{message&&<div className="form-message">{message}</div>}<button className="primary full" disabled={busy}>{busy?"One moment…":mode==="login"?"Sign in":"Create account"}</button></form><button className="switch-auth" onClick={()=>{setMode(mode==="login"?"registration":"login");setMessage("")}}>{mode==="login"?"New here? Create an account":"Already a member? Sign in"}</button></div></div>;
}
