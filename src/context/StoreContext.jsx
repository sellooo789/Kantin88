import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { menu as menuAwal, paket as paketAwal, adminPin } from "../data/data";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const K_PRODUK = "k88produk";
const K_PESANAN = "k88pesanan";
const K_ADMIN = "k88admin";

const bawaan = () => [...paketAwal, ...menuAwal].map((p) => ({ ...p, tersedia: true }));
const kosong = () => [];

function baca(kunci, awal) {
  try {
    const v = localStorage.getItem(kunci);
    const data = v ? JSON.parse(v) : null;
    return Array.isArray(data) ? data : awal();
  } catch { return awal(); }
}

const nomorBerikut = (list) =>
  list.reduce((m, p) => Math.max(m, parseInt(String(p.kode).slice(4), 10) || 0), 100) + 1;

export function StoreProvider({ children }) {
  const [produk, setProduk] = useState(() => baca(K_PRODUK, bawaan));
  const [pesanan, setPesanan] = useState(() => baca(K_PESANAN, kosong));
  const [admin, setAdmin] = useState(() => {
    try { return sessionStorage.getItem(K_ADMIN) === "1"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(K_PRODUK, JSON.stringify(produk)); } catch { /* abaikan */ }
  }, [produk]);
  useEffect(() => {
    try { localStorage.setItem(K_PESANAN, JSON.stringify(pesanan)); } catch { /* abaikan */ }
  }, [pesanan]);

  // Sinkron antar tab: pesanan baru dari tab pelanggan langsung muncul di tab admin
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === K_PRODUK) setProduk(baca(K_PRODUK, bawaan));
      if (e.key === K_PESANAN) setPesanan(baca(K_PESANAN, kosong));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ---------- Pesanan ----------
  const tambahPesanan = useCallback(({ meja, nama, catatan, items, total, bayar }) => {
    const kode = "K88-" + nomorBerikut(pesanan);
    setPesanan((l) => [{
      id: kode, kode, waktu: new Date().toISOString(),
      meja: String(meja), nama: nama || "", catatan: catatan || "",
      items, total, status: "baru",
      bayar: bayar === "tunai" ? "tunai" : "qris", lunas: false,
    }, ...l]);
    return kode;
  }, [pesanan]);

  const ubahStatus = useCallback((id, status) => {
    setPesanan((l) => l.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const tandaiLunas = useCallback((id, lunas = true) => {
    setPesanan((l) => l.map((p) => (p.id === id ? { ...p, lunas } : p)));
  }, []);

  const hapusRiwayat = useCallback(() => {
    setPesanan((l) => l.filter((p) => p.status === "baru" || p.status === "diproses" || p.status === "siap"));
  }, []);

  const isiContoh = useCallback(() => {
    const sumber = produk.filter((p) => p.tersedia);
    if (!sumber.length) return;
    const nama = ["Sean", "Budi", "Citra", "Dewi", "Eko", "Farah", ""];
    const status = ["baru", "baru", "diproses", "siap", "selesai", "selesai", "selesai", "selesai", "selesai", "batal"];
    const mulai = nomorBerikut(pesanan);
    const contoh = status.map((st, i) => {
      const n = 1 + Math.floor(Math.random() * 3);
      const gabung = {};
      for (let k = 0; k < n; k++) {
        const it = sumber[Math.floor(Math.random() * sumber.length)];
        gabung[it.id] = gabung[it.id] || { id: it.id, nama: it.nama, harga: it.harga, qty: 0 };
        gabung[it.id].qty++;
      }
      const items = Object.values(gabung);
      const kode = "K88-" + (mulai + status.length - 1 - i);
      return {
        id: kode, kode, waktu: new Date(Date.now() - i * 17 * 60000).toISOString(),
        meja: String(1 + Math.floor(Math.random() * 30)), nama: nama[i % nama.length], catatan: "",
        items, total: items.reduce((a, x) => a + x.harga * x.qty, 0), status: st,
        bayar: Math.random() < 0.6 ? "qris" : "tunai", lunas: st === "selesai",
      };
    });
    setPesanan((l) => [...contoh, ...l]);
  }, [produk, pesanan]);

  // ---------- Menu ----------
  const simpanProduk = useCallback((p) => {
    setProduk((l) => {
      if (p.id && l.some((x) => x.id === p.id)) return l.map((x) => (x.id === p.id ? { ...x, ...p } : x));
      const awalan = p.kat === "paket" ? "p" : p.kat === "sayur" ? "s" : "l";
      return [...l, { ...p, id: awalan + Date.now().toString(36), tersedia: true }];
    });
  }, []);

  const hapusProduk = useCallback((id) => setProduk((l) => l.filter((x) => x.id !== id)), []);
  const toggleTersedia = useCallback((id) => {
    setProduk((l) => l.map((x) => (x.id === id ? { ...x, tersedia: !x.tersedia } : x)));
  }, []);
  const resetProduk = useCallback(() => setProduk(bawaan()), []);

  // ---------- Login admin ----------
  const login = useCallback((pin) => {
    if (pin !== adminPin) return false;
    try { sessionStorage.setItem(K_ADMIN, "1"); } catch { /* abaikan */ }
    setAdmin(true);
    return true;
  }, []);
  const logout = useCallback(() => {
    try { sessionStorage.removeItem(K_ADMIN); } catch { /* abaikan */ }
    setAdmin(false);
  }, []);

  return (
    <StoreContext.Provider value={{
      produk, pesanan, admin,
      tambahPesanan, ubahStatus, tandaiLunas, hapusRiwayat, isiContoh,
      simpanProduk, hapusProduk, toggleTersedia, resetProduk,
      login, logout,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
