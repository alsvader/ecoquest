// Genera los PixelIcons de la guía (estilo-visual/index.html) como SVG estáticos en assets/icons/.
// k=tinta, g=lima, d=selva, p=rosa, y=amarillo, c=cian, o=naranja, w=blanco, b=café
const fs = require("fs");
const path = require("path");
const C = { k: "#000", g: "#B6FF3B", d: "#0A5C2B", p: "#FF3EA5", y: "#FFE600", c: "#00E5FF", o: "#FF7A00", w: "#FFFFFF", b: "#7A4A1E" };
const I = {
  // —— idénticos a la guía ——
  leaf: ["....kkkk", "..kkgggk", ".kggggdk", ".kgggdgk", "kgggdggk", "kggdggk.", "kgdkkk..", "kd......"],
  flower: ["..kkkk..", ".kppppk.", "kppyyppk", "kpyyyypk", "kppyyppk", ".kppppk.", "..kkdk..", "...kdk.."],
  tree: ["...kkkk...", "..kggggk..", ".kggdgggk.", "kgggggdggk", "kgdggggggk", ".kkgggkkk.", "...kbbk...", "...kbbk...", "..bbbbbb..", "bbb.bb.bbb"],
  heart: [".kk..kk.", "kppkkppk", "kppppppk", "kppppppk", ".kppppk.", "..kppk..", "...kk...", "........"],
  star: ["...kk...", "..kyyk..", "kkkyykkk", "kyyyyyyk", ".kyyyyk.", ".kyyyyk.", "kyykkyyk", "kk....kk"],
  camera: ["..kkk...", "kkkkkkkk", "kwwkkwck", "kwkcckwk", "kwkcckwk", "kwwkkwwk", "kkkkkkkk", "........"],
  eye: ["........", "..kkkk..", ".kwwwwk.", "kwwcckwk", "kwckkcwk", ".kwccwk.", "..kkkk..", "........"],
  warn: ["...kk...", "..kook..", "..kook..", ".kokkok.", ".kokkok.", "kooooooo", "kookkook", "kkkkkkkk"],
  check: ["........", "......kk", ".....kgk", "k...kgk.", "kk.kgk..", "kgkgk...", ".kgk....", "..k....."],
  // —— extensiones de la landing (misma cuadrícula 8×8 y paleta) ——
  medal: ["kpk..kpk", ".kpkkpk.", "..kkkk..", ".kyyyyk.", "kyywyyyk", "kyyyyyyk", ".kyyyyk.", "..kkkk.."],
  lock: ["..kkkk..", ".kk..kk.", ".k....k.", "kkkkkkkk", "kyyyyyyk", "kyykkyyk", "kyykkyyk", "kkkkkkkk"],
  phone: [".kkkkkk.", ".kcccck.", ".kcccck.", ".kcccck.", ".kcccck.", ".kkkkkk.", ".kkwwkk.", ".kkkkkk."],
  arrow: ["....k...", "....kk..", "kkkkkkk.", "kkkkkkkk", "kkkkkkk.", "....kk..", "....k..."],
  plus: ["...kk...", "...kk...", "...kk...", "kkkkkkkk", "kkkkkkkk", "...kk...", "...kk...", "...kk..."],
  pin: ["..kkkk..", ".kppppk.", "kppkkppk", "kppkkppk", ".kppppk.", "..kppk..", "...kk...", "........"],
};
const out = path.join(__dirname, "..", "assets", "icons");
fs.mkdirSync(out, { recursive: true });
for (const [name, g] of Object.entries(I)) {
  const w = Math.max(...g.map((r) => r.length)), h = g.length;
  let r = "";
  g.forEach((row, y) => [...row].forEach((ch, x) => { if (C[ch]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${C[ch]}"/>`; }));
  fs.writeFileSync(path.join(out, `${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 8}" height="${h * 8}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${r}</svg>\n`);
}
console.log(`PixelIcons: ${Object.keys(I).length} SVG en assets/icons/`);
