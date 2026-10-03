# -*- coding: utf-8 -*-
"""
Empaqueta todo el design system en UN solo archivo HTML autocontenido para compartir:
  python docs/ds/src/bundle.py   ->   docs/averyn-design-system-horizonte.html

Cada página del DS (design-system, gráficos, patrones, sistema, ...) se construye con build.py,
se le incrustan CSS, JS e imágenes (data URI) y viaja como texto dentro del archivo. Un marco
mínimo la carga en un iframe (srcdoc), así los ids, estilos y scripts de cada página quedan aislados.
Las páginas de error reales (404, 403, ...) viajan igual y alimentan las vistas en vivo de "Plantillas y estados".
Requiere internet solo para las fuentes de Google y los iconos (CDN).
"""
import base64, importlib.util, json, os, re, sys
sys.dont_write_bytecode = True

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('build', os.path.join(HERE, 'build.py'))
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)
DOCS, FE = build.DOCS, os.path.join(os.path.dirname(build.DOCS), 'averyn-frontend')
OUT = os.path.join(DOCS, 'averyn-design-system-horizonte.html')
MIME = {'.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp'}


def rd(p):
    return open(p, encoding='utf-8').read()


def data_uri(p):
    return 'data:%s;base64,%s' % (MIME[os.path.splitext(p)[1].lower()], base64.b64encode(open(p, 'rb').read()).decode())


def safe_js(t):
    bs = chr(92)
    return t.replace('</script', '<' + bs + '/script').replace('<!--', '<' + bs + '!--')


def inline(html, base):
    """Incrusta CSS/JS/imágenes locales relativos a `base`; deja intactos los enlaces http(s)."""
    def css(m):
        h = m.group(1)
        return m.group(0) if h.startswith('http') else '<style>\n' + rd(os.path.normpath(os.path.join(base, h))) + '\n</style>'
    html = re.sub(r'<link href="([^"]+\.css)" rel="stylesheet"\s*/?>', css, html)

    def js(m):
        h = m.group(1)
        return m.group(0) if h.startswith('http') else '<script>\n' + safe_js(rd(os.path.normpath(os.path.join(base, h)))) + '\n</script>'
    html = re.sub(r'<script src="([^"]+\.js)"(?: defer)?></script>', js, html)

    def img(m):
        p = os.path.normpath(os.path.join(base, m.group(2)))
        return '%s="%s"' % (m.group(1), data_uri(p)) if os.path.exists(p) else m.group(0)
    return re.sub(r'(src|href)="((?!https?:)[^"]+\.(?:avif|png|jpe?g|svg|webp))"', img, html)


def error_page(name):
    h = rd(os.path.join(FE, name))
    h = re.sub(r'<!--.*?-->\s*<script>\(function\(\)\{var p=location.*?</script>', '', h, flags=re.S)  # <base> de rutas anidadas: no aplica en el empaquetado
    return inline(h, FE)


NAV = (
    '<script>document.addEventListener("click",function(e){'
    "var g=e.target.closest('a[href^=\"#go:\"]');"
    'if(g){e.preventDefault();parent.postMessage({dsGo:g.getAttribute("href").slice(4)},"*");return;}'
    # en un iframe srcdoc los enlaces "#ancla" se resolverían contra la URL del marco: se desplaza a mano
    "var a=e.target.closest('a[href^=\"#\"]');"
    'if(!a)return;var id=a.getAttribute("href").slice(1),t=id&&document.getElementById(id);'
    'if(id&&!t)return;e.preventDefault();'
    'var r=matchMedia("(prefers-reduced-motion: reduce)").matches;'
    'if(t){t.scrollIntoView({behavior:r?"auto":"smooth",block:"start"});if(t.id){try{t.setAttribute("tabindex","-1");t.focus({preventScroll:true});}catch(x){}}}else{window.scrollTo({top:0,behavior:r?"auto":"smooth"});}'
    '});</script>'
)


def key_of(rel):
    return os.path.splitext(os.path.basename(rel))[0]


def main():
    keys = {rel: key_of(rel) for rel, _l, _g in build.built_pages()}
    frames = {n: error_page(n) for n in ['404.html', '403.html', '500.html', 'offline.html', 'mantenimiento.html']}
    pages = {}
    for rel, key in keys.items():
        html = build.render(rel)
        base = os.path.dirname(os.path.join(DOCS, rel))
        # enlaces entre páginas -> mensajes al marco
        for r2, k2 in keys.items():
            html = re.sub(r'href="(?:\.\./|\./|ds/)*%s(?:#[^"]*)?"' % re.escape(os.path.basename(r2)), 'href="#go:%s"' % k2, html)
        html = re.sub(r'<a [^>]*href="[^"]*averyn-frontend/[^"]*\.html"[^>]*>.*?</a>', '', html, flags=re.S)  # "Abrir página": no existe en el archivo único
        if '<script src="./sistema.js"></script>' in html:
            fr = '<script>window.DS_FRAMES=%s;</script>\n' % safe_js(json.dumps(frames, ensure_ascii=False))
            html = html.replace('<script src="./sistema.js"></script>', fr + '<script src="./sistema.js"></script>')
        html = inline(html, base)
        k = html.rfind('</body>')  # solo el último: dentro de DS_FRAMES también hay </body>
        html = html[:k] + NAV + '\n' + html[k:]
        pages[key] = html
    first = 'inicio' if 'inicio' in pages else next(iter(pages))
    shell = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Averyn — Design System Horizonte v%(v)s</title>
<meta name="description" content="Design system de Averyn en un solo archivo: fundamentos, componentes, gráficos, patrones, plantillas y estados, marca y calidad.">
<style>html,body{margin:0;height:100%%;background:#F4F8FF}iframe{display:block;width:100%%;height:100%%;border:0}.ns{padding:2rem;font:16px/1.5 system-ui,sans-serif}</style>
</head>
<body>
<iframe id="ds" title="Design system Averyn Horizonte" allow="clipboard-write"></iframe>
<noscript><p class="ns">Este documento necesita JavaScript para mostrar el design system.</p></noscript>
<script>
(function () {
  'use strict';
  var PAGES = %(pages)s;
  var f = document.getElementById('ds'), cur = null;
  function go(k, push) {
    if (!PAGES[k]) k = %(first)s;
    if (k === cur) return;
    cur = k; f.srcdoc = PAGES[k];
    if (push && history.replaceState) history.replaceState(null, '', '#' + k);
  }
  window.addEventListener('message', function (e) { if (e.source === f.contentWindow && e.data && e.data.dsGo) go(e.data.dsGo, true); });
  window.addEventListener('hashchange', function () { go(location.hash.slice(1)); });
  go(location.hash.slice(1));
})();
</script>
</body>
</html>
''' % dict(v=build.VERSION, first=json.dumps(first), pages=safe_js(json.dumps(pages, ensure_ascii=False)))
    open(OUT, 'w', encoding='utf-8', newline='\n').write(shell)
    print('escrito', os.path.relpath(OUT, os.path.dirname(DOCS)), len(shell) // 1024, 'KB', sorted(pages))


if __name__ == '__main__':
    main()
