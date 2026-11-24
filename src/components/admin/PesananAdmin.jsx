import { useState } from "react";
import { useStore } from "../../context/StoreContext";
import Barcode from "../Barcode";
import { alurStatus, labelStatus, warnaStatus, aksiStatus, metodeBayar } from "../../data/data";
import { rupiah, tanggalJam } from "../../utils/format";

const bayarDari = (p) => (p.bayar === "tunai" ? "tunai" : "qris");

function unduhCsv(daftar) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const baris = [["ID", "Waktu", "Meja", "Nama", "Pesanan", "Catatan", "Total", "Metode", "Lunas", "Status"]];
  daftar.forEach((p) => baris.push([
    p.kode, new Date(p.waktu).toISOString(), p.meja, p.nama,
    p.items.map((i) => `${i.qty}x ${i.nama}`).join("; "), p.catatan, p.total,
    metodeBayar[bayarDari(p)], p.lunas ? "Ya" : "Tidak", labelStatus[p.status],
  ]));
  const csv = "\ufeff" + baris.map((b) => b.map(esc).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `pesanan-kantin88-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function PesananAdmin() {
  const { pesanan, ubahStatus, tandaiLunas, hapusRiwayat } = useStore();
  const [saring, setSaring] = useState("semua");
  const [metode, setMetode] = useState("semua");
  const [cari, setCari] = useState("");

  const q = cari.trim().toLowerCase();
  const tampil = pesanan.filter((p) =>
    (saring === "semua" || p.status === saring) &&
    (metode === "semua" || bayarDari(p) === metode) &&
    (!q || p.kode.toLowerCase().includes(q) || (p.nama || "").toLowerCase().includes(q) || `meja ${p.meja}`.includes(q)));
  const hitung = (s) => (s === "semua" ? pesanan.length : pesanan.filter((p) => p.status === s).length);
  const adaRiwayat = pesanan.some((p) => p.status === "selesai" || p.status === "batal");

  const onHapus = () => {
    if (window.confirm("Hapus semua pesanan yang sudah selesai atau dibatalkan?")) hapusRiwayat();
  };

  return (
    <>
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <label className="visually-hidden" htmlFor="cari-kode">Cari atau pindai ID pesanan</label>
          <input id="cari-kode" type="search" className="form-control" placeholder="Cari / pindai ID pesanan (mis. K88-102), nama, atau meja"
            value={cari} onChange={(e) => setCari(e.target.value)} autoComplete="off" />
        </div>
        <div className="col-md-6 d-flex flex-wrap gap-2 justify-content-md-end" role="group" aria-label="Saring metode pembayaran">
          {[["semua", "Semua bayar"], ...Object.entries(metodeBayar)].map(([k, v]) => (
            <button key={k} type="button" className={`btn btn-sm rounded-pill ${metode === k ? "btn-k88" : "btn-outline-k88"}`} onClick={() => setMetode(k)}>{v}</button>
          ))}
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2" role="group" aria-label="Saring status">
          {["semua", ...alurStatus, "batal"].map((s) => (
            <button key={s} type="button"
              className={`btn btn-sm rounded-pill ${saring === s ? "btn-k88" : "btn-outline-k88"}`}
              onClick={() => setSaring(s)}>
              {s === "semua" ? "Semua" : labelStatus[s]} ({hitung(s)})
            </button>
          ))}
        </div>
        <div className="d-flex gap-2">
          {tampil.length > 0 && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => unduhCsv(tampil)}>Unduh CSV</button>}
          {adaRiwayat && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onHapus}>Hapus riwayat selesai</button>}
        </div>
      </div>

      {tampil.length === 0 ? (
        <p className="text-center text-secondary py-5">Tidak ada pesanan yang cocok.</p>
      ) : (
        <div className="table-responsive k88-panel p-0">
          <table className="table align-middle mb-0 k88-tabel">
            <thead>
              <tr><th>ID</th><th>Meja / Nama</th><th>Pesanan</th><th className="text-end">Total</th><th>Bayar</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {tampil.map((p) => (
                <tr key={p.id}>
                  <td style={{ minWidth: 130 }}>
                    <strong>{p.kode}</strong><div className="small text-secondary mb-1">{tanggalJam(new Date(p.waktu))}</div>
                    <Barcode nilai={p.kode} tinggi={26} tampilTeks={false} className="k88-barcode-mini" />
                  </td>
                  <td>Meja {p.meja}{p.nama && <div className="small text-secondary">{p.nama}</div>}</td>
                  <td>
                    <ul className="list-unstyled small mb-0">
                      {p.items.map((i) => <li key={i.id}>{i.qty}× {i.nama}</li>)}
                    </ul>
                    {p.catatan && <div className="small fst-italic text-secondary mt-1">“{p.catatan}”</div>}
                  </td>
                  <td className="text-end k88-price">{rupiah(p.total)}</td>
                  <td>
                    <span className="badge text-bg-light border">{metodeBayar[bayarDari(p)]}</span>
                    <div className="mt-1">
                      <span className={`badge text-bg-${p.lunas ? "success" : "warning"}`}>{p.lunas ? "Lunas" : "Belum lunas"}</span>
                    </div>
                  </td>
                  <td><span className={`badge text-bg-${warnaStatus[p.status]}`}>{labelStatus[p.status]}</span></td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {aksiStatus[p.status] && (
                        <button type="button" className="btn btn-sm btn-k88"
                          onClick={() => ubahStatus(p.id, alurStatus[alurStatus.indexOf(p.status) + 1])}>
                          {aksiStatus[p.status]}
                        </button>
                      )}
                      {p.status !== "batal" && !p.lunas && (
                        <button type="button" className="btn btn-sm btn-outline-k88" onClick={() => tandaiLunas(p.id, true)}>Tandai lunas</button>
                      )}
                      {p.status !== "batal" && p.lunas && p.status !== "selesai" && (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => tandaiLunas(p.id, false)}>Batalkan lunas</button>
                      )}
                      {(p.status === "baru" || p.status === "diproses") && (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => ubahStatus(p.id, "batal")}>Batal</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
