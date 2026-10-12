const C: Record<string, string> = {
  k: "#000000", g: "#B6FF3B", d: "#0A5C2B", p: "#FF3EA5", y: "#FFE600",
  c: "#00E5FF", o: "#FF7A00", w: "#FFFFFF", b: "#7A4A1E",
};

const I = {
  leaf:   ["....kkkk", "..kkgggk", ".kggggdk", ".kgggdgk", "kgggdggk", "kggdggk.", "kgdkkk..", "kd......"],
  flower: ["..kkkk..", ".kppppk.", "kppyyppk", "kpyyyypk", "kppyyppk", ".kppppk.", "..kkdk..", "...kdk.."],
  tree:   ["...kkkk...", "..kggggk..", ".kggdgggk.", "kgggggdggk", "kgdggggggk", ".kkgggkkk.", "...kbbk...", "...kbbk...", "..bbbbbb..", "bbb.bb.bbb"],
  heart:  [".kk..kk.", "kppkkppk", "kppppppk", "kppppppk", ".kppppk.", "..kppk..", "...kk...", "........"],
  star:   ["...kk...", "..kyyk..", "kkkyykkk", "kyyyyyyk", ".kyyyyk.", ".kyyyyk.", "kyykkyyk", "kk....kk"],
  camera: ["..kkk...", "kkkkkkkk", "kwwkkwck", "kwkcckwk", "kwkcckwk", "kwwkkwwk", "kkkkkkkk", "........"],
  eye:    ["........", "..kkkk..", ".kwwwwk.", "kwwcckwk", "kwckkcwk", ".kwccwk.", "..kkkk..", "........"],
  warn:   ["...kk...", "..kook..", "..kook..", ".kokkok.", ".kokkok.", "kooooooo", "kookkook", "kkkkkkkk"],
  check:  ["........", "......kk", ".....kgk", "k...kgk.", "kk.kgk..", "kgkgk...", ".kgk....", "..k....."],
} as const;

export type PixelIconName = keyof typeof I;

/** Iconos pixel de la guía (§7.9). Decorativos: siempre acompañados de texto. */
export function PixelIcon({
  name,
  scale = 4,
  flat = false,
  className,
}: {
  name: PixelIconName;
  scale?: number;
  flat?: boolean;
  className?: string;
}) {
  const g = I[name];
  const w = g[0].length;
  const h = g.length;
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: "block", imageRendering: "pixelated", filter: flat ? "none" : "drop-shadow(3px 3px 0 #000)" }}
    >
      {g.flatMap((row, y) =>
        [...row].map((ch, x) => (C[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={C[ch]} /> : null)),
      )}
    </svg>
  );
}
