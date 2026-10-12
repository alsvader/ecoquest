"""Capturas de la landing con Playwright (Chromium headless). Uso: python3 scripts/screenshots.py
Requiere haber corrido `npm run build`. Variables: CHROME=/ruta/a/chrome (opcional)."""
import os, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
OUT = ROOT / "screenshots"; OUT.mkdir(exist_ok=True)
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome" if os.path.exists("/usr/bin/google-chrome") else None)

SECTIONS = ["inicio", "problema", "como-se-juega", "expedicion", "ia-abierta", "principios",
            "villahermosa", "stack", "contribuye", "roadmap", "faq", "jugar"]

def load(pg):
    pg.goto(URL, wait_until="networkidle")
    pg.evaluate("document.fonts.ready")
    pg.wait_for_timeout(600)

def check(pg, tag):
    r = pg.evaluate("""()=>{
      const fonts={};for(const f of ['700 16px "EQ Pixel"','16px "Archivo Black"','500 16px "Space Grotesk"'])fonts[f]=document.fonts.check(f,'ÉÓÁÑ');
      const sw=document.documentElement.scrollWidth, vw=window.innerWidth;
      const wide=[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>vw+1&&!e.closest('#inicio')}).slice(0,8).map(e=>e.tagName+'.'+(e.className.baseVal??e.className).toString().slice(0,60));
      const over=[...document.querySelectorAll('.scr-body')].map(b=>b.scrollHeight-b.clientHeight);
      return {fonts,scrollWidth:sw,vw,height:document.documentElement.scrollHeight,overflowing:wide,screenOverflow:over};
    }""")
    print(tag, r)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"]) if CHROME else p.chromium.launch()

    # Escritorio · página completa (1x para que el archivo sea razonable)
    pg = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1); load(pg); check(pg, "desktop")
    pg.screenshot(path=str(OUT / "desktop-full-1440.png"), full_page=True)
    pg.close()

    # Escritorio · above the fold + recortes por sección (2x)
    pg = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2); load(pg)
    pg.screenshot(path=str(OUT / "desktop-hero-1440@2x.png"))
    pg.add_style_tag(content="header.sticky{position:static!important}")
    for i, s in enumerate(SECTIONS[1:], start=2):
        pg.locator(f"#{s}").screenshot(path=str(OUT / f"desktop-{i:02d}-{s}@2x.png"))
    pg.locator("footer").screenshot(path=str(OUT / "desktop-13-footer@2x.png"))
    # FAQ con dos preguntas abiertas
    pg.evaluate("document.querySelectorAll('#faq details').forEach((d,i)=>{if(i<2)d.open=true})")
    pg.wait_for_timeout(200)
    pg.locator("#faq").screenshot(path=str(OUT / "desktop-11-faq-abierto@2x.png"))
    pg.close()

    # Móvil · página completa (390 px, 2x)
    pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True); load(pg); check(pg, "mobile")
    pg.screenshot(path=str(OUT / "mobile-full-390@2x.png"), full_page=True)
    # Menú móvil abierto
    pg.evaluate("window.scrollTo(0,0)"); pg.click("#menu-btn"); pg.wait_for_timeout(200)
    pg.screenshot(path=str(OUT / "mobile-menu-abierto-390@2x.png"))
    print("aria-expanded:", pg.get_attribute("#menu-btn", "aria-expanded"), pg.get_attribute("#menu-btn", "aria-label"))
    pg.close()
    b.close()
for f in sorted(OUT.iterdir()): print(f.name, f.stat().st_size // 1024, "KB")
