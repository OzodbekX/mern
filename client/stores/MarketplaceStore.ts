import { computed, makeAutoObservable, runInAction } from "mobx";
import { api, type Basket, type Device, type Taxonomy } from "@/lib/api";
import type { CartItem } from "@/components/modals/CartDrawer";

export class MarketplaceStore {
  devices: Device[] = [];
  brands: Taxonomy[] = [];
  types: Taxonomy[] = [];
  loading = true;
  error = "";
  query = "";
  sort = "featured";
  page = 1;
  count = 0;
  selected: Device | null = null;
  cartOpen = false;
  authOpen = false;
  cart: CartItem[] = [];
  favorites: number[] = [];
  toast = "";
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    makeAutoObservable(this, { shownDevices: computed, cartCount: computed, cartTotal: computed }, { autoBind: true });
  }

  get shownDevices() {
    const normalizedQuery = this.query.trim().toLowerCase();
    const matches = this.devices.filter(device => !normalizedQuery || device.name.toLowerCase().includes(normalizedQuery));
    return [...matches].sort((a, b) => {
      if (this.sort === "price-low") return a.price - b.price;
      if (this.sort === "price-high") return b.price - a.price;
      if (this.sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }

  get cartCount() { return this.cart.reduce((sum, item) => sum + item.quantity, 0); }
  get cartTotal() { return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }

  async initialize() {
    try {
      const token = localStorage.getItem("atelier-token");
      if (token) {
        const basket = await api.basket.get(token);
        this.cart = this.basketToCart(basket);
      } else this.cart = [];
      localStorage.removeItem("atelier-cart");
      this.favorites = JSON.parse(localStorage.getItem("atelier-favorites") || "[]");
    } catch {}
    try {
      const [brands, types] = await Promise.all([api.brands.list(), api.types.list()]);
      runInAction(() => { this.brands = brands; this.types = types; });
    } catch {}
  }

  async loadDevices(brandId: number | null, typeId: number | null) {
    this.loading = true;
    this.error = "";
    try {
      const data = await api.devices.list({ page: this.page, limit: 9, brandId: brandId || undefined, typeId: typeId || undefined });
      runInAction(() => { this.devices = data.rows || []; this.count = data.count || 0; });
    } catch {
      runInAction(() => {
        this.devices = [];
        this.count = 0;
        this.error = "We couldn’t reach the marketplace server. Check the API URL in your .env file and make sure the server is running.";
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  setQuery(value: string) { this.query = value; }
  setSort(value: string) { this.sort = value; }
  setPage(value: number) { this.page = value; }
  setSelected(value: Device | null) { this.selected = value; }
  setCartOpen(value: boolean) { this.cartOpen = value; }
  setAuthOpen(value: boolean) { this.authOpen = value; }

  private basketToCart(basket: Basket): CartItem[] {
    return (basket.basket_devices || []).filter(item => item.device).map(item => ({ ...item.device, quantity: 1 }));
  }

  async addToCart(device: Device) {
    const token = localStorage.getItem("atelier-token");
    if (!token) { this.authOpen = true; return; }
    const basket = await api.basket.add(device.id, token);
    runInAction(() => { this.cart = this.basketToCart(basket); });
    this.toast = `${device.name} added to your bag`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => runInAction(() => { this.toast = ""; }), 2400);
  }

  async updateCart(id: number, delta: number) {
    const token = localStorage.getItem("atelier-token");
    if (!token) { this.authOpen = true; return; }
    const basket = delta < 0 ? await api.basket.remove(id, token) : await api.basket.add(id, token);
    runInAction(() => { this.cart = this.basketToCart(basket); });
  }

  toggleFavorite(id: number) {
    this.favorites = this.favorites.includes(id) ? this.favorites.filter(item => item !== id) : [...this.favorites, id];
    localStorage.setItem("atelier-favorites", JSON.stringify(this.favorites));
  }

  clearLocalFilters() { this.query = ""; this.page = 1; }
}
