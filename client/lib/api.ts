const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api").replace(/\/$/, "");
export const FILE_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

export type DeviceInfo = { id?:number; title:string; description:string; deviceId?:number };
export type Device = { id:number; name:string; price:number; rating?:number; img?:string; brandId?:number; typeId?:number; info?:DeviceInfo[] };
export type Taxonomy = { id:number; name:string };
export type DeviceList = { count:number; rows:Device[] };
export type AuthPayload = { email:string; password:string; role?:string };
export type User = { id:number; email:string; role:string; createdAt:string; updatedAt:string };
export type AuthResponse = { token:string; user:User };
export type DeviceFilters = { page?:number; limit?:number; brandId?:number; typeId?:number };
export type CreateDevicePayload = { name:string; price:number|string; brandId:number|string; typeId:number|string; img:File; info?:DeviceInfo[] };
export type BasketDevice = { id:number; basketId:number; deviceId:number; device:Device };
export type Basket = { id:number; userId:number; basket_devices:BasketDevice[] };
export type SavedCard = { id:number; holderName:string; brand:string; last4:string; expiryMonth:number; expiryYear:number; isDefault:boolean; userId:number; createdAt:string; updatedAt:string };
export type CardPayload = { holderName:string; brand:string; last4:string; expiryMonth:number; expiryYear:number; isDefault?:boolean };
export type OrderItem = { deviceId:number; quantity:number; price:number };
export type PaymentCard = { number:string; expiryMonth:number; expiryYear:number; password:string };
export type PendingOrder = { success:true; message:string; transactionId:string; status:"PENDING_VERIFICATION"; verificationCode:string };
export type PaidOrder = { success:true; message:string; transactionId:string; orderId:number; status:"PAID"; amount:string; card?:{id:number;brand:string;last4:string} };

export class ApiError extends Error {
  constructor(message:string, public status:number, public data:unknown) { super(message); this.name="ApiError"; }
}

async function request<T>(path:string, options:RequestInit={}, token?:string):Promise<T> {
  const headers=new Headers(options.headers);
  if(token) headers.set("Authorization",`Bearer ${token}`);
  if(options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type","application/json");
  const response=await fetch(`${API_BASE_URL}${path}`,{...options,headers});
  const data=response.headers.get("content-type")?.includes("application/json") ? await response.json() : await response.text();
  if(!response.ok){const message=typeof data==="object"&&data&&"message" in data?String(data.message):`Request failed with status ${response.status}`;throw new ApiError(message,response.status,data)}
  return data as T;
}

export const api={
  users:{
    register:(payload:AuthPayload)=>request<{token:string}>("/user/registration",{method:"POST",body:JSON.stringify(payload)}),
    login:(payload:AuthPayload)=>request<{token:string}>("/user/login",{method:"POST",body:JSON.stringify(payload)}),
    authenticate:(token:string)=>request<AuthResponse>("/user/auth",{},token),
  },
  types:{
    list:()=>request<Taxonomy[]>("/type"), get:(id:number|string)=>request<Taxonomy>(`/type/${id}`),
    create:(name:string,token:string)=>request<{message:string;type:Taxonomy}>("/type",{method:"POST",body:JSON.stringify({name})},token),
    update:(id:number|string,name:string)=>request<{message:string;id:string}>(`/type/${id}`,{method:"PUT",body:JSON.stringify({name})}),
    remove:(id:number|string)=>request<unknown>(`/type/${id}`,{method:"DELETE"}),
  },
  brands:{
    list:()=>request<Taxonomy[]>("/brand"), get:(id:number|string)=>request<Taxonomy|null>(`/brand/${id}`),
    create:(name:string)=>request<{message:string;brand:Taxonomy}>("/brand",{method:"POST",body:JSON.stringify({name})}),
    update:(id:number|string,name:string)=>request<Taxonomy>(`/brand/${id}`,{method:"PUT",body:JSON.stringify({name})}),
    remove:(id:number|string)=>request<{message:string}>(`/brand/${id}`,{method:"DELETE"}),
  },
  devices:{
    list:(filters:DeviceFilters={})=>{const params=new URLSearchParams();Object.entries(filters).forEach(([key,value])=>{if(value!==undefined)params.set(key,String(value))});return request<DeviceList>(`/device${params.size?`?${params}`:""}`)},
    get:(id:number|string)=>request<Device>(`/device/${id}`),
    create:(payload:CreateDevicePayload)=>{const form=new FormData();form.set("name",payload.name);form.set("price",String(payload.price));form.set("brandId",String(payload.brandId));form.set("typeId",String(payload.typeId));form.set("img",payload.img);if(payload.info)form.set("info",JSON.stringify({array:payload.info}));return request<Device>("/device",{method:"POST",body:form})},
    update:(id:number|string,payload:Partial<Omit<CreateDevicePayload,"img">>)=>request<{message:string;id:string}>(`/device/${id}`,{method:"PUT",body:JSON.stringify(payload)}),
    remove:(id:number|string)=>request<unknown>(`/device/${id}`,{method:"DELETE"}),
  },
  basket:{
    get:(token:string)=>request<Basket>("/basket",{},token),
    add:(deviceId:number,token:string)=>request<Basket>("/basket",{method:"POST",body:JSON.stringify({deviceId})},token),
    remove:(deviceId:number,token:string)=>request<Basket>(`/basket/${deviceId}`,{method:"DELETE"},token),
    clear:(token:string)=>request<{message:string;removed:number}>("/basket",{method:"DELETE"},token),
  },
  cards:{
    list:(token:string)=>request<SavedCard[]>("/card",{},token),
    get:(id:number,token:string)=>request<SavedCard>(`/card/${id}`,{},token),
    create:(payload:CardPayload,token:string)=>request<SavedCard>("/card",{method:"POST",body:JSON.stringify(payload)},token),
    update:(id:number,payload:Partial<CardPayload>,token:string)=>request<SavedCard>(`/card/${id}`,{method:"PUT",body:JSON.stringify(payload)},token),
    remove:(id:number,token:string)=>request<{message:string}>(`/card/${id}`,{method:"DELETE"},token),
  },
  orders:{
    create:(payload:{items:OrderItem[];amount:number;card:PaymentCard},token:string)=>request<PendingOrder>("/order",{method:"POST",body:JSON.stringify(payload)},token),
    purchaseWithSavedCard:(payload:{items:OrderItem[];amount:number;cardId:number},token:string)=>request<PaidOrder>("/order/saved-card",{method:"POST",body:JSON.stringify(payload)},token),
    verify:(payload:{transactionId:string;verificationCode:string},token:string)=>request<PaidOrder>("/order/verify",{method:"POST",body:JSON.stringify(payload)},token),
  },
};

export { API_BASE_URL };
