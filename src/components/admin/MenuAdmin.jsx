import { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { labelKat } from "../../data/data";
import { rupiah } from "../../utils/format";

const kosong = { nama: "", harga: "", kat: "lauk", ikon: "🍽️" };

export default function MenuAdmin() {
  const { produk, simpanProduk, hapusProduk, toggleTersedia, resetProduk } = useStore();
  const [form, setForm] = useState(null);   // null = tertutup
  const [galat, setGalat] = useState("");

  const buka = (p) => { setGalat(""); setForm(p ? { ...p, harga: String(p.harga) } : { ...kosong }); };
  const ubah = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSimpan = (e) => {
    e.preventDefault();
    const harga = parseInt(form.harga, 10);
    if (!form.nama.trim()) return setGalat("Nama menu wajib diisi.");
    if (!harga || harga < 1) return setGalat("Harga harus berupa angka lebih dari 0.");
    simpanProduk({ ...form, nama: form.nama.trim(), harga, ikon: form.ikon.trim() || "🍽️" });
    setForm(null);
  };

  const onHapus = (p) => { if (window.confirm(`Hapus "${p.nama}" dari menu?`)) hapusProduk(p.id); };
  const onReset = () => { if (window.confirm("Kembalikan seluruh menu dan harga ke data awal?")) resetProduk(); };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <button type="button" className="btn btn-k88" onClick={() => buka(null)}>+ Tambah menu</button>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onReset}>Reset ke menu awal</button>
      </div>

      {form && (
        <form className="k88-panel mb-4" onSubmit={onSimpan}>
          <h2 className="h6 k88-panel-judul">{form.id ? "Ubah menu" : "Menu baru"}</h2>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label" htmlFor="m-nama">Nama</label>
              <input id="m-nama" className="form-control" value={form.nama} onChange={(e) => ubah("nama", e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label" htmlFor="m-harga">Harga (Rp)</label>
              <input id="m-harga" type="number" min="1" inputMode="numeric" className="form-control" value={form.harga} onChange={(e) => ubah("harga", e.target.value)} />
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label" htmlFor="m-kat">Kategori</label>
              <select id="m-kat" className="form-select" value={form.kat} onChange={(e) => ubah("kat", e.target.value)}>
                {Object.entries(labelKat).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="m-ikon">Ikon (emoji)</label>
              <input id="m-ikon" className="form-control" maxLength="4" value={form.ikon} onChange={(e) => ubah("ikon", e.target.value)} />
            </div>
          </div>
          {galat && <div className="text-danger small mt-2">{galat}</div>}
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-k88">Simpan</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(null)}>Batal</button>
          </div>
        </form>
      )}

      <div className="table-responsive k88-panel p-0">
        <table className="table align-middle mb-0 k88-tabel">
          <thead>
            <tr><th>Menu</th><th>Kategori</th><th className="text-end">Harga</th><th>Tersedia</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {produk.map((p) => (
              <tr key={p.id} className={p.tersedia === false ? "table-secondary" : ""}>
                <td><span aria-hidden="true" className="me-2">{p.ikon}</span>{p.nama}</td>
                <td>{labelKat[p.kat] || p.kat}</td>
                <td className="text-end k88-price">{rupiah(p.harga)}</td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id={`t-${p.id}`}
                      checked={p.tersedia !== false} onChange={() => toggleTersedia(p.id)} />
                    <label className="form-check-label small" htmlFor={`t-${p.id}`}>{p.tersedia === false ? "Habis" : "Ada"}</label>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <button type="button" className="btn btn-sm btn-outline-k88" onClick={() => buka(p)}>Ubah</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onHapus(p)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small text-secondary mt-3">Harga lauk &amp; sayur di data awal masih perkiraan, silakan sesuaikan di sini.</p>
    </>
  );
}
