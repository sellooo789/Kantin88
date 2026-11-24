import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import StatusBuka from "../components/StatusBuka";
import Ringkasan from "../components/admin/Ringkasan";
import PesananAdmin from "../components/admin/PesananAdmin";
import MenuAdmin from "../components/admin/MenuAdmin";
import { namaSitus } from "../data/data";

function Login() {
  const { login } = useStore();
  const [pin, setPin] = useState("");
  const [galat, setGalat] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!login(pin)) { setGalat(true); setPin(""); }
  };

  return (
    <div className="k88-login">
      <form className="card k88-login-card p-4" onSubmit={onSubmit}>
        <div className="k88-brand text-center mb-1">Kantin<span>88</span></div>
        <h1 className="h5 text-center k88-gold-dark mb-4">Dashboard Admin</h1>
        <label className="form-label" htmlFor="pin">PIN admin</label>
        <input id="pin" type="password" inputMode="numeric" autoComplete="off" autoFocus
          className={`form-control mb-2 ${galat ? "is-invalid" : ""}`}
          value={pin} onChange={(e) => { setPin(e.target.value); setGalat(false); }} />
        {galat && <div className="text-danger small mb-2">PIN salah, coba lagi.</div>}
        <button type="submit" className="btn btn-k88 w-100 mt-2">Masuk</button>
        <Link to="/" className="btn btn-link btn-sm mt-2">&larr; Kembali ke situs</Link>
      </form>
    </div>
  );
}

export default function Admin() {
  const { admin, logout, pesanan } = useStore();
  const [tab, setTab] = useState("ringkasan");

  if (!admin) return <Login />;

  const baru = pesanan.filter((p) => p.status === "baru").length;
  const tabs = [
    { k: "ringkasan", t: "Ringkasan" },
    { k: "pesanan", t: "Pesanan", badge: baru },
    { k: "menu", t: "Kelola Menu" },
  ];

  return (
    <div className="k88-admin">
      <header className="k88-header text-white py-3">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div className="k88-brand">Kantin<span>88</span></div>
            <small className="k88-motto">Dashboard Admin</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <StatusBuka />
            <Link className="btn btn-sm btn-outline-light" to="/">Lihat situs</Link>
            <button type="button" className="btn btn-sm btn-k88" onClick={logout}>Keluar</button>
          </div>
        </div>
      </header>

      <div className="container py-4">
        <ul className="nav nav-pills k88-admin-tabs mb-4" role="tablist" aria-label={`Menu admin ${namaSitus}`}>
          {tabs.map((x) => (
            <li className="nav-item" key={x.k}>
              <button type="button" role="tab" aria-selected={tab === x.k}
                className={`nav-link ${tab === x.k ? "active" : ""}`} onClick={() => setTab(x.k)}>
                {x.t}
                {x.badge > 0 && <span className="badge rounded-pill k88-badge ms-2">{x.badge}</span>}
              </button>
            </li>
          ))}
        </ul>

        {tab === "ringkasan" && <Ringkasan pindah={setTab} />}
        {tab === "pesanan" && <PesananAdmin />}
        {tab === "menu" && <MenuAdmin />}
      </div>
    </div>
  );
}
