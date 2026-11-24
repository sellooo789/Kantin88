import { rupiah } from "../utils/format";
import { useCart } from "../context/CartContext";
import { fotoMenu } from "../data/data";

export default function KartuMenu({ item }) {
  const { tambah } = useCart();
  const foto = item.foto || fotoMenu[item.id];   // data lama di localStorage belum punya field foto
  return (
    <div className="col">
      <article className="card h-100 k88-card">
        {foto ? (
          <div className="k88-tile">
            <img src={foto} alt={item.nama} loading="lazy" />
          </div>
        ) : (
          <div className="k88-tile" aria-hidden="true">{item.ikon}</div>
        )}
        <div className="card-body d-flex flex-column">
          <h3 className="h6 card-title mb-1">{item.nama}</h3>
          {item.ket && <div className="small text-secondary mb-1">{item.ket}</div>}
          <div className="k88-price mb-3">{rupiah(item.harga)}</div>
          <button type="button" className="btn btn-k88 mt-auto w-100" onClick={() => tambah(item)} disabled={item.tersedia === false}>
            {item.tersedia === false ? "Habis" : "+ Tambah ke Keranjang"}
          </button>
        </div>
      </article>
    </div>
  );
}
