import { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { alurStatus, labelStatus, warnaStatus } from "../../data/data";
import GrafikBayar from "./GrafikBayar";
import { rupiah, kunciHari, tanggalJam, tanggalIndonesia } from "../../utils/format";

function Kartu({ judul, nilai, ket, onClick }) {
  const isi = (
    <>
      <div className="k88-stat-label">{judul}</div>
      <div className="k88-stat-nilai">{nilai}</div>
      {ket && <div className="small text-secondary">{ket}</div>}
    </>
  );
  return (
    <div className="col">
      {onClick
        ? <button type="button" className="k88-stat w-100 text-start" onClick={onClick}>{isi}</button>
        : <div className="k88-stat">{isi}</div>}
    </div>
  );
}

export default function Ringkasan({ pindah }) {
  const { pesanan, produk, isiContoh } = useStore();

  const d = useMemo(() => {
    const hari = kunciHari();
    const hariIni = pesanan.filter((p) => kunciHari(new Date(p.waktu)) === hari);
    const sah = hariIni.filter((p) => p.status !== "batal");
    const pendapatan = sah.reduce((a, p) => a + p.total, 0);
    const antre = pesanan.filter((p) => p.status === "baru" || p.status === "diproses").length;

    const jual = {};
    pesanan.filter((p) => p.status !== "batal").forEach((p) =>
      p.items.forEach((i) => { jual[i.nama] = (jual[i.nama] || 0) + i.qty; }));
    const terlaris = Object.entries(jual).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const perStatus = Object.fromEntries([...alurStatus, "batal"].map((s) => [s, pesanan.filter((p) => p.status === s).length]));
    return { jumlah: hariIni.length, pendapatan, antre, terlaris, perStatus, rata: sah.length ? Math.round(pendapatan / sah.length) : 0 };
  }, [pesanan]);

  const habis = produk.filter((p) => p.tersedia === false).length;
  const maks = d.terlaris[0]?.[1] || 1;

  return (
    <>
      <p className="text-secondary">{tanggalIndonesia()}</p>

      <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
        <Kartu judul="Pesanan hari ini" nilai={d.jumlah} ket={`${pesanan.length} pesanan seluruhnya`} />
        <Kartu judul="Pendapatan hari ini" nilai={rupiah(d.pendapatan)} ket={d.rata ? `Rata-rata ${rupiah(d.rata)}/pesanan` : "Belum ada pesanan"} />
        <Kartu judul="Dalam antrean" nilai={d.antre} ket="Baru + diproses" onClick={() => pindah("pesanan")} />
        <Kartu judul="Menu habis" nilai={habis} ket={`dari ${produk.length} menu`} onClick={() => pindah("menu")} />
      </div>

      {pesanan.length > 0 && <GrafikBayar />}

      {pesanan.length === 0 ? (
        <div className="k88-panel text-center py-5">
          <p className="mb-1 fw-semibold">Belum ada pesanan masuk.</p>
          <p className="text-secondary small">Pesanan dari keranjang di situs akan muncul di sini. Untuk mencoba tampilan dashboard, isi data contoh.</p>
          <button type="button" className="btn btn-k88" onClick={isiContoh}>Isi data contoh</button>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="k88-panel h-100">
              <h2 className="h6 k88-panel-judul">Menu terlaris</h2>
              {d.terlaris.map(([nama, qty]) => (
                <div className="mb-2" key={nama}>
                  <div className="d-flex justify-content-between small"><span>{nama}</span><strong>{qty}</strong></div>
                  <div className="k88-bar"><div style={{ width: `${(qty / maks) * 100}%` }} /></div>
                </div>
              ))}
              <h2 className="h6 k88-panel-judul mt-4">Status pesanan</h2>
              <div className="d-flex flex-wrap gap-2">
                {[...alurStatus, "batal"].map((s) => (
                  <span key={s} className={`badge text-bg-${warnaStatus[s]}`}>{labelStatus[s]}: {d.perStatus[s]}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="k88-panel h-100">
              <h2 className="h6 k88-panel-judul">Pesanan terbaru</h2>
              <ul className="list-unstyled mb-3">
                {pesanan.slice(0, 5).map((p) => (
                  <li className="k88-baris-pesanan" key={p.id}>
                    <div>
                      <strong>{p.kode}</strong> · Meja {p.meja}
                      <div className="small text-secondary">{tanggalJam(new Date(p.waktu))} · {rupiah(p.total)}</div>
                    </div>
                    <span className={`badge text-bg-${warnaStatus[p.status]}`}>{labelStatus[p.status]}</span>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-outline-k88 btn-sm" onClick={() => pindah("pesanan")}>Kelola pesanan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
