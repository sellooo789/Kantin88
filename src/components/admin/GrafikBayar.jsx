import { useMemo, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { metodeBayar, warnaBayar } from "../../data/data";
import { rupiah, angka, kunciHari, waktuWib } from "../../utils/format";
import { namaHari } from "../../data/data";

const URUT = ["qris", "tunai"];
const RENTANG = { hari: "Hari ini", minggu: "7 hari", semua: "Semua" };
const bayarDari = (p) => (p.bayar === "tunai" ? "tunai" : "qris");   // pesanan lama tanpa metode dianggap QRIS

function Donat({ data, total }) {
  const r = 52, k = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" className="k88-donat" role="img"
      aria-label={`Perbandingan metode pembayaran: ${URUT.map((m) => `${metodeBayar[m]} ${data[m].jumlah} transaksi`).join(", ")}`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1e6cf" strokeWidth="22" />
      {total > 0 && URUT.map((m) => {
        const panjang = (data[m].jumlah / total) * k;
        const el = (
          <circle key={m} cx="70" cy="70" r={r} fill="none" stroke={warnaBayar[m]} strokeWidth="22"
            strokeDasharray={`${panjang} ${k - panjang}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
        );
        offset += panjang;
        return el;
      })}
      <text x="70" y="66" textAnchor="middle" className="k88-donat-angka">{angka(total)}</text>
      <text x="70" y="84" textAnchor="middle" className="k88-donat-ket">transaksi</text>
    </svg>
  );
}

function Batang7Hari({ hari }) {
  const maks = Math.max(1, ...hari.map((h) => h.qris + h.tunai));
  const W = 320, H = 150, dasar = 120, tinggiMaks = 100, lebar = 28, jarak = (W - hari.length * lebar) / (hari.length + 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="k88-batang7" role="img"
      aria-label={`Pendapatan 7 hari terakhir. ${hari.map((h) => `${h.label}: QRIS ${rupiah(h.qris)}, Tunai ${rupiah(h.tunai)}`).join("; ")}`}>
      <line x1="0" y1={dasar} x2={W} y2={dasar} stroke="#e8c77a" />
      {hari.map((h, i) => {
        const x = jarak + i * (lebar + jarak);
        const hQ = (h.qris / maks) * tinggiMaks, hT = (h.tunai / maks) * tinggiMaks;
        return (
          <g key={h.kunci}>
            <title>{`${h.label}: QRIS ${rupiah(h.qris)} · Tunai ${rupiah(h.tunai)}`}</title>
            {hT > 0 && <rect x={x} y={dasar - hT} width={lebar} height={hT} fill={warnaBayar.tunai} rx="2" />}
            {hQ > 0 && <rect x={x} y={dasar - hT - hQ} width={lebar} height={hQ} fill={warnaBayar.qris} rx="2" />}
            <text x={x + lebar / 2} y={dasar + 14} textAnchor="middle" className="k88-batang7-label">{h.label}</text>
            <text x={x + lebar / 2} y={dasar + 26} textAnchor="middle" className="k88-batang7-tgl">{h.tgl}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function GrafikBayar() {
  const { pesanan } = useStore();
  const [rentang, setRentang] = useState("hari");

  const d = useMemo(() => {
    const sah = pesanan.filter((p) => p.status !== "batal");
    const hariIni = kunciHari();
    const kunci7 = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - (6 - i) * 86400000));
    const set7 = new Set(kunci7.map((x) => kunciHari(x)));

    const terpilih = sah.filter((p) => {
      const k = kunciHari(new Date(p.waktu));
      return rentang === "semua" || (rentang === "hari" ? k === hariIni : set7.has(k));
    });
    const data = Object.fromEntries(URUT.map((m) => [m, { jumlah: 0, nominal: 0 }]));
    terpilih.forEach((p) => { const m = bayarDari(p); data[m].jumlah++; data[m].nominal += p.total; });

    const hari = kunci7.map((x) => {
      const w = waktuWib(x), kunci = kunciHari(x);
      const h = { kunci, label: namaHari[w.N].slice(0, 3), tgl: String(w.j), qris: 0, tunai: 0 };
      sah.filter((p) => kunciHari(new Date(p.waktu)) === kunci).forEach((p) => { h[bayarDari(p)] += p.total; });
      return h;
    });

    const belumLunas = pesanan.filter((p) => p.status !== "batal" && !p.lunas);
    return {
      data, hari, total: data.qris.jumlah + data.tunai.jumlah, nominal: data.qris.nominal + data.tunai.nominal,
      belum: belumLunas.length, nominalBelum: belumLunas.reduce((a, p) => a + p.total, 0),
    };
  }, [pesanan, rentang]);

  const persen = (n) => (d.total ? Math.round((n / d.total) * 100) : 0);

  return (
    <div className="row g-3 mb-4">
      <div className="col-lg-5">
        <div className="k88-panel h-100">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <h2 className="h6 k88-panel-judul mb-0">QRIS vs Tunai</h2>
            <div className="btn-group btn-group-sm" role="group" aria-label="Rentang waktu grafik">
              {Object.entries(RENTANG).map(([k, v]) => (
                <button key={k} type="button" className={`btn ${rentang === k ? "btn-k88" : "btn-outline-k88"}`} onClick={() => setRentang(k)}>{v}</button>
              ))}
            </div>
          </div>
          {d.total === 0 ? (
            <p className="text-secondary small text-center py-4 mb-0">Belum ada transaksi pada rentang ini.</p>
          ) : (
            <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center">
              <Donat data={d.data} total={d.total} />
              <ul className="list-unstyled mb-0 k88-legenda">
                {URUT.map((m) => (
                  <li key={m}>
                    <span className="k88-legenda-titik" style={{ background: warnaBayar[m] }} aria-hidden="true" />
                    <strong>{metodeBayar[m]}</strong> · {persen(d.data[m].jumlah)}%
                    <div className="small text-secondary">{angka(d.data[m].jumlah)} transaksi · {rupiah(d.data[m].nominal)}</div>
                  </li>
                ))}
                <li className="small border-top pt-2">Total <strong>{rupiah(d.nominal)}</strong></li>
              </ul>
            </div>
          )}
          <div className="small mt-3 text-secondary">
            {d.belum > 0 ? <>Belum lunas: <strong>{d.belum}</strong> pesanan ({rupiah(d.nominalBelum)})</> : "Semua pesanan sudah lunas."}
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <div className="k88-panel h-100">
          <h2 className="h6 k88-panel-judul">Pendapatan 7 hari terakhir</h2>
          <Batang7Hari hari={d.hari} />
          <div className="d-flex gap-3 small justify-content-center">
            {URUT.map((m) => (
              <span key={m}><span className="k88-legenda-titik" style={{ background: warnaBayar[m] }} aria-hidden="true" /> {metodeBayar[m]}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
