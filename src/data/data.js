import fotoAyamLadaHitam from "../assets/menu/ayam-lada-hitam.jpg";
import fotoAyamKuluyuk from "../assets/menu/ayam-kuluyuk.jpg";
import fotoAyamPentung from "../assets/menu/ayam-pentung.jpg";
import fotoKatsu from "../assets/menu/katsu.jpg";
import fotoNugget from "../assets/menu/nugget.jpg";
import fotoTahuDaging from "../assets/menu/tahu-daging.jpg";
import fotoGohiong from "../assets/menu/gohiong.jpg";
import fotoSopJagung from "../assets/menu/sop-jagung.jpg";
import fotoTelurBalado from "../assets/menu/telur-balado.jpg";
import fotoMunTahu from "../assets/menu/mun-tahu.jpg";
import fotoCapcay from "../assets/menu/capcay.jpg";

export const namaSitus = "Kantin 88";
export const namaKampus = "Universitas Tarumanagara";
export const slogan = "Pesan dari meja, tanpa antre";
export const motto = "Enak · Sehat · Murah";
export const jamBuka = 7;
export const jamTutup = 16;
export const noWa = "0818-0855-1680 (Anie)";
export const email = "halo@kantin88.com";
export const perHalaman = 8;

export const namaHari = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const namaBulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const menuNav = [
  { to: "/", teks: "Home", end: true },
  { to: "/menu", teks: "Menu" },
  { to: "/tentang", teks: "Tentang" },
  { to: "/kontak", teks: "Kontak" },
];

export const kategori = [
  { kunci: "semua", label: "Semua" },
  { kunci: "lauk", label: "Lauk" },
  { kunci: "sayur", label: "Sayur & Sup" },
];

export const paket = [
  { id: "p1", nama: "Paket Telor", harga: 13000, kat: "paket", ikon: "🍳",
    isi: ["1 nasi putih", "1 olahan telur", "1 tumisan sayur"] },
  { id: "p2", nama: "Paket Daging", harga: 17000, kat: "paket", ikon: "🥩",
    isi: ["1 nasi putih", "1 olahan daging", "1 tumisan sayur"] },
  { id: "p3", nama: "Paket Daging Telor", harga: 22000, kat: "paket", ikon: "🍱" },
  { id: "p4", nama: "Paket Spesial", harga: 25000, kat: "paket", ikon: "⭐" },
];

// CATATAN: harga lauk/sayur masih perkiraan, sesuaikan dengan harga asli kantin.
export const menu = [
  { id: "l1", nama: "Ayam Lada Hitam", harga: 10000, kat: "lauk", ikon: "🍗" },
  { id: "l2", nama: "Ayam Kuluyuk Asem Manis", harga: 10000, kat: "lauk", ikon: "🍗" },
  { id: "l3", nama: "Ayam Pentung", harga: 10000, kat: "lauk", ikon: "🍗" },
  { id: "l4", nama: "Katsu Homemade", harga: 10000, kat: "lauk", ikon: "🍖" },
  { id: "l5", nama: "Nugget Homemade", harga: 10000, kat: "lauk", ikon: "🍢" },
  { id: "l6", nama: "Telur Balado", harga: 10000, kat: "lauk", ikon: "🥚" },
  { id: "l7", nama: "Tahu Daging", harga: 10000, kat: "lauk", ikon: "🍲" },
  { id: "l8", nama: "Mun Tahu", harga: 10000, kat: "lauk", ikon: "🍲" },
  { id: "l9", nama: "Gohiong", harga: 10000, kat: "lauk", ikon: "🥟" },
  { id: "s1", nama: "Capcay", harga: 10000, kat: "sayur", ikon: "🥦" },
  { id: "s2", nama: "Sop Jagung", harga: 10000, kat: "sayur", ikon: "🌽" },
];

// Foto menu, dikunci berdasarkan id. Menu tanpa foto (mis. buatan admin) memakai ikon emoji.
export const fotoMenu = {
  l1: fotoAyamLadaHitam,
  l2: fotoAyamKuluyuk,
  l3: fotoAyamPentung,
  l4: fotoKatsu,
  l5: fotoNugget,
  l6: fotoTelurBalado,
  l7: fotoTahuDaging,
  l8: fotoMunTahu,
  l9: fotoGohiong,
  s1: fotoCapcay,
  s2: fotoSopJagung,
};

// ---------- Admin ----------
// PIN hanya pengaman demo di sisi browser (bukan keamanan sungguhan). Ganti sesuai kebutuhan.
export const adminPin = "88888";
export const alurStatus = ["baru", "diproses", "siap", "selesai"];
export const labelStatus = { baru: "Baru", diproses: "Diproses", siap: "Siap diantar", selesai: "Selesai", batal: "Dibatalkan" };
export const warnaStatus = { baru: "warning", diproses: "info", siap: "primary", selesai: "success", batal: "secondary" };
export const aksiStatus = { baru: "Proses", diproses: "Siap diantar", siap: "Selesai" };
export const labelKat = { paket: "Paket", lauk: "Lauk", sayur: "Sayur & Sup" };

// ---------- Pembayaran ----------
export const metodeBayar = { qris: "QRIS", tunai: "Tunai" };
export const warnaBayar = { qris: "#8C1C2E", tunai: "#F2B01E" };   // maroon & emas Kantin 88
export const bayarBawaan = "qris";
