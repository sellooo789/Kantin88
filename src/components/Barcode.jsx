import { useMemo } from "react";
import { code128 } from "../utils/code128";

// Barcode Code 128 dari ID pesanan. Teks ID ditampilkan di bawahnya.
export default function Barcode({ nilai, tinggi = 44, tampilTeks = true, className = "" }) {
  const b = useMemo(() => { try { return code128(nilai); } catch { return null; } }, [nilai]);
  if (!b) return null;
  return (
    <figure className={`k88-barcode m-0 ${className}`}>
      <svg viewBox={`0 0 ${b.lebar} ${tinggi}`} preserveAspectRatio="none" role="img"
        aria-label={`Barcode ID pesanan ${nilai}`} style={{ width: "100%", height: tinggi, display: "block" }}>
        <rect width={b.lebar} height={tinggi} fill="#fff" />
        {b.batang.map((x, i) => <rect key={i} x={x.x} y="0" width={x.w} height={tinggi} fill="#000" />)}
      </svg>
      {tampilTeks && <figcaption className="k88-barcode-id">{nilai}</figcaption>}
    </figure>
  );
}
