import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import Barcode from "./Barcode";
import { metodeBayar, bayarBawaan, labelStatus, warnaStatus } from "../data/data";
import { rupiah } from "../utils/format";

export default function CartDrawer() {
  const { cart, total, terakhir, ubahQty, kirim, pesanLagi } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [nama, setNama] = useState("");
  const [meja, setMeja] = useState("");
  const [catatan, setCatatan] = useState("");
  const [galat, setGalat] = useState(false);
  const [bayar, setBayar] = useState(bayarBawaan);
  const { pesanan } = useStore();

  const ids = Object.keys(cart);
  const selesai = !!terakhir;
  // Status terkini pesanan yang baru dikirim (diperbarui saat admin mengubahnya)
  const pesananIni = selesai ? pesanan.find((p) => p.kode === terakhir.kode) : null;

  const tutup = () => {
    const el = document.getElementById("keranjang");
    if (el) Offcanvas.getOrCreateInstance(el).hide();
  };

  const onKirim = () => {
    if (!meja.trim() || parseInt(meja, 10) < 1) { setGalat(true); return; }
    setGalat(false);
    // Pesanan disimpan di browser (localStorage) dan tampil di dashboard admin
    kirim(meja.trim(), nama.trim(), catatan.trim(), bayar);
    setNama("");
    setMeja("");
    setCatatan("");
  };

  const onLagi = () => {
    pesanLagi();
    tutup();
    if (pathname !== "/menu") navigate("/menu");
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="keranjang" aria-labelledby="judulKeranjang">
      <div className="offcanvas-header k88-drawer-head">
        <h2 className="offcanvas-title h5" id="judulKeranjang">Keranjang</h2>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Tutup keranjang" />
      </div>
      <div className="offcanvas-body">
        {!selesai && ids.length === 0 && (
          <div className="text-center text-secondary py-5">
            <p>Keranjangmu masih kosong.</p>
            <Link to="/menu" className="btn btn-k88" onClick={tutup}>Lihat Menu</Link>
          </div>
        )}

        {!selesai && ids.length > 0 && (
          <div>
            <div>
              {ids.map((id) => {
                const it = cart[id];
                return (
                  <div className="cart-line" key={id}>
                    <div>
                      <div className="fw-semibold">{it.nama}</div>
                      <div className="k88-price">{rupiah(it.harga)}</div>
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => ubahQty(id, -1)} aria-label={`Kurangi ${it.nama}`}>&minus;</button>
                      <span>{it.qty}</span>
                      <button type="button" onClick={() => ubahQty(id, 1)} aria-label={`Tambah ${it.nama}`}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 my-3">
              <span>Total</span><span>{rupiah(total)}</span>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="f-nama">Nama (opsional)</label>
              <input className="form-control" id="f-nama" autoComplete="name" value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="f-meja">Nomor meja</label>
              <input className="form-control" id="f-meja" type="number" inputMode="numeric" min="1" max="999"
                value={meja} onChange={(e) => setMeja(e.target.value)} />
              {galat && <div className="text-danger small mt-1">Isi nomor meja supaya pesananmu diantar ke tempat yang benar.</div>}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="f-note">Catatan (opsional)</label>
              <textarea className="form-control" id="f-note" rows="2" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </div>
            <fieldset className="mb-3">
              <legend className="form-label fs-6">Metode pembayaran</legend>
              <div className="k88-bayar-pilih">
                {Object.entries(metodeBayar).map(([k, v]) => (
                  <label key={k} className={`k88-bayar-opsi${bayar === k ? " aktif" : ""}`}>
                    <input type="radio" name="bayar" value={k} checked={bayar === k} onChange={() => setBayar(k)} />
                    <span aria-hidden="true">{k === "qris" ? "📱" : "💵"}</span> {v}
                  </label>
                ))}
              </div>
              <div className="small text-secondary mt-1">
                {bayar === "qris" ? "Scan QRIS di kasir lalu tunjukkan barcode pesananmu." : "Bayar tunai di kasir sambil menunjukkan barcode pesananmu."}
              </div>
            </fieldset>
            <button type="button" className="btn btn-k88 w-100 py-2" onClick={onKirim}>Kirim Pesanan</button>
          </div>
        )}

        {selesai && (
          <div className="text-center py-4">
            <div className="display-4" aria-hidden="true">✅</div>
            <h3 className="h5">Pesanan diterima</h3>
            <div className="k88-code my-2">{terakhir.kode}</div>
            <p className="k88-price mb-2">
              Untuk Meja {terakhir.meja}, total {rupiah(terakhir.total)}. Pesananmu sedang disiapkan.
            </p>
            <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
              <span className="badge text-bg-light border">{metodeBayar[terakhir.bayar] || "QRIS"}</span>
              <span className={`badge text-bg-${pesananIni?.lunas ? "success" : "warning"}`}>{pesananIni?.lunas ? "Lunas" : "Belum dibayar"}</span>
              {pesananIni && <span className={`badge text-bg-${warnaStatus[pesananIni.status]}`}>{labelStatus[pesananIni.status]}</span>}
            </div>
            <div className="k88-barcode-kotak mx-auto mb-3">
              <Barcode nilai={terakhir.kode} tinggi={64} />
            </div>
            <p className="small text-secondary">Tunjukkan barcode ini ke kasir untuk membayar dan mengambil pesanan.</p>
            <button type="button" className="btn btn-k88" onClick={onLagi}>Pesan lagi</button>
          </div>
        )}
      </div>
    </div>
  );
}
