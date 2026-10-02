"""Construye las páginas del design system Horizonte.

Uso:  python docs/ds/src/build.py

Cada página = plantilla común (barra lateral por grupos, portada, pie) + uno o varios archivos de cuerpo en src/.
Las rutas se calculan según la carpeta: docs/design-system.html y docs/ds/*.html.
Marcadores en los cuerpos: {{FE}} -> carpeta averyn-frontend, {{DS}} -> carpeta docs/ds, {{DOCS}} -> carpeta docs.

Cómo se organiza (ver también la sección "Gobernanza" del propio design system):
  * PAGES define el orden y el GRUPO de cada página en la barra lateral.
  * Cada <section> declara data-nav (etiqueta del índice) y data-grp (subgrupo dentro de la página).
  * No hay numeración: el orden lo da la posición. Los fondos alternos se calculan aquí, no a mano.
  * Al construir se VALIDA: ids repetidos dentro de una página, enlaces internos (#ancla) y enlaces
    entre páginas (incluidos sus #fragmentos). Si algo falla, el script termina con error.
"""
import importlib.util, json, os, re, sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
DS_DIR = os.path.dirname(HERE)            # docs/ds
DOCS = os.path.dirname(DS_DIR)            # docs
VERSION = '1.4'

# (archivo de salida relativo a docs, etiqueta del menú, grupo de la barra lateral)
PAGES = [
    ('ds/fundamentos.html', 'Fundamentos', 'Sistema'),
    ('design-system.html', 'Componentes base', 'Sistema'),
    ('ds/graficos.html', 'Gráficos', 'Sistema'),
    ('ds/componentes.html', 'Componentes que faltaban', 'Sistema'),
    ('ds/patrones.html', 'Patrones de Averyn', 'Aplicación'),
    ('ds/plantillas.html', 'Plantillas', 'Aplicación'),
    ('ds/sistema.html', 'Estados del sistema', 'Aplicación'),
    ('ds/marca.html', 'Marca y entregables', 'Marca y calidad'),
    ('ds/calidad.html', 'Calidad y gobernanza', 'Marca y calidad'),
]
LABEL = {rel: label for rel, label, _g in PAGES}

# Páginas con configuración propia. Se construyen solo si existe su cuerpo en src/.
CONFIG = {
    'design-system.html': dict(body=['main-body.html'], cover='main-cover.html', css=[], js=['foundations.js']),
    'ds/fundamentos.html': dict(body=['fundamentos-body.html'], eyebrow='Fundamentos', title='Lo que no cambia.',
                                lead='Principios, marca y figura de arcos, color, tipografía, espacio, iconografía y los tokens que los hacen exportables.',
                                css=['fundamentos.css'], js=['foundations.js', 'fundamentos.js'],
                                inject={'{{TOKENS_JSON}}': lambda: tokens_json()}),
    'ds/calidad.html': dict(body=['calidad-body.html'], eyebrow='Calidad y gobernanza', title='Cómo se mantiene bien.',
                            lead='Microcopy, accesibilidad, gobernanza (versiones, novedades y deuda) y cómo usar el sistema en una pantalla nueva.',
                            css=[], js=['foundations.js']),
    'ds/graficos.html': dict(body=['graficos-body.html'], eyebrow='Gráficos', title='Datos con calma.',
                             lead='Modelos y ejemplos de gráficos para el panel del futuro: tarjetas minimalistas, formas elegidas por el trabajo del dato, color validado y lectura accesible.',
                             css=['charts.css'], js=['charts.js']),
    'ds/patrones.html': dict(body=['patrones-body.html'], eyebrow='Patrones', title='Cuando la pantalla toca el cuerpo de alguien.',
                             lead='Captura facial y de huella, resultado de verificación, documento y OCR, papeleta electoral, dispositivos y consentimiento. Simulaciones sin cámara ni datos reales.',
                             css=['charts.css', 'patrones.css'], js=['patrones.js']),
    'ds/componentes.html': dict(body=['componentes-body.html'], eyebrow='Componentes', title='Lo que faltaba para trabajar de verdad.',
                                lead='Selector de fechas, menú de acciones, combobox, acordeón, stepper, popover, drawer, paleta de comandos y tabla avanzada, con teclado completo.',
                                css=['charts.css', 'componentes.css'], js=['componentes.js']),
    'ds/plantillas.html': dict(body=['plantillas-body.html'], eyebrow='Plantillas', title='Pantallas completas, no piezas sueltas.',
                               lead='Bitácora, configuración, detalle de persona, asistente, notificaciones y perfil: los componentes compuestos en pantallas reales, con sus estados.',
                               css=['charts.css', 'componentes.css', 'plantillas.css'], js=['plantillas.js']),
    'ds/marca.html': dict(body=['marca-body.html'], eyebrow='Marca y entregables', title='Todo lo que sale de Averyn.',
                          lead='Ilustración con arcos, favicons, correos transaccionales, estilos de impresión y tokens exportables: la identidad fuera de la pantalla.',
                          css=['charts.css', 'marca.css', 'print.css'], js=['marca.js'],
                          inject={'{{EMAILS_JSON}}': lambda: emails_json()}),
    'ds/sistema.html': dict(body=['sistema-body.html'], eyebrow='Sistema', title='Cuando algo no sale como se espera.',
                            lead='Páginas de error y estados del sistema: 404, 403, 500, sin conexión y mantenimiento.',
                            css=[], js=['sistema.js']),
}


def _json_script(obj):
    return json.dumps(obj, ensure_ascii=False).replace('</', '<' + chr(92) + '/')


def emails_json():
    spec = importlib.util.spec_from_file_location('emails', os.path.join(HERE, 'emails.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return _json_script(m.all_mails())


def tokens_json():
    return _json_script(json.load(open(os.path.join(DS_DIR, 'tokens.json'), encoding='utf-8')))


def read(name):
    return open(os.path.join(HERE, name), encoding='utf-8').read()


def built_pages():
    """Páginas cuyo cuerpo existe en src/ (en el orden de PAGES)."""
    return [(rel, label, grp) for rel, label, grp in PAGES if os.path.exists(os.path.join(HERE, CONFIG[rel]['body'][0]))]


SEC_RE = re.compile(r'<section\b[^>]*>')


def normalize(body):
    """Quita numeración de eyebrows/etiquetas y recalcula el fondo alterno (tinte en las secciones impares)."""
    body = re.sub(r'(<span class="ds-eyebrow mono">)\d+ · ', r'\1', body)
    body = re.sub(r'(data-nav=")\d+ · ', r'\1', body)
    out, pos, idx = [], 0, 0
    for m in SEC_RE.finditer(body):
        tag = m.group(0)
        cm = re.search(r'class="([^"]*)"', tag)
        cls = [c for c in cm.group(1).split() if c != 'ds-sec--tint']
        if 'ds-sec--night' not in cls and idx % 2 == 1:
            cls.append('ds-sec--tint')
        out.append(body[pos:m.start()] + tag.replace(cm.group(0), 'class="%s"' % ' '.join(cls)))
        pos = m.end(); idx += 1
    out.append(body[pos:])
    return ''.join(out)


def anchors_from(body):
    """Índice de la página: [('sub', 'Subgrupo'), (id, etiqueta), ...] según data-grp / data-nav de cada sección."""
    out, last = [], None
    for m in SEC_RE.finditer(body):
        tag = m.group(0)
        i = re.search(r'\bid="([^"]+)"', tag); n = re.search(r'\bdata-nav="([^"]+)"', tag); g = re.search(r'\bdata-grp="([^"]+)"', tag)
        if not (i and n):
            continue
        if g and g.group(1) != last:
            out.append(('sub', g.group(1))); last = g.group(1)
        out.append((i.group(1), n.group(1)))
    return out


def paths(out_rel):
    in_ds = out_rel.startswith('ds/')
    return dict(FE='../../averyn-frontend' if in_ds else '../averyn-frontend', DS='.' if in_ds else 'ds', DOCS='..' if in_ds else '.')


def render(out_rel):
    cfg = CONFIG[out_rel]
    p = paths(out_rel)
    body = ''.join(read(n) for n in cfg['body'])
    for token, fn in cfg.get('inject', {}).items():
        body = body.replace(token, fn())
    body = normalize(body)
    anchors = anchors_from(body)
    rep = lambda s: s.replace('{{FE}}', p['FE']).replace('{{DS}}', p['DS']).replace('{{DOCS}}', p['DOCS'])
    # --- barra lateral: grupos de páginas; bajo la página actual, su índice por subgrupos
    nav, last_grp = [], None
    for rel, label, grp in built_pages():
        if grp != last_grp:
            nav.append('      <span class="grp mono">%s</span>' % grp); last_grp = grp
        href = os.path.relpath(os.path.join(DOCS, rel), os.path.dirname(os.path.join(DOCS, out_rel))).replace('\\', '/')
        cur = ' aria-current="page"' if rel == out_rel else ''
        nav.append('      <a class="ds-page" href="%s"%s>%s</a>' % (href, cur, label))
        if rel == out_rel and anchors:
            sub = ['      <div class="ds-subnav">']
            for a, text in anchors:
                sub.append('        <span class="grp sub mono">%s</span>' % text if a == 'sub' else '        <a href="#%s">%s</a>' % (a, text))
            sub.append('      </div>')
            nav.append('\n'.join(sub))
    side = ('<aside class="ds-side" aria-label="Índice del design system">\n'
            '    <a class="ds-side__brand" href="%s/design-system.html" aria-label="Averyn, inicio del design system"><img src="%s/assets/images/averyn-logo-font-black.avif" alt="Averyn"></a>\n'
            '    <p class="ds-side__ver mono">Design System · v%s Horizonte</p>\n'
            '    <nav>\n%s\n    </nav>\n  </aside>' % (p['DOCS'], p['FE'], VERSION, '\n'.join(nav)))
    # --- portada
    if cfg.get('cover'):
        cover = read(cfg['cover'])
    else:
        cover = ('<header class="ds-cover ds-cover--page"><div class="ds-wrap"><span class="mono" style="color:#fff;opacity:.85">%s</span>'
                 '<h1>%s</h1><p>%s</p></div></header>' % (cfg['eyebrow'], cfg['title'], cfg['lead']))
    css_links = ''.join('<link href="%s/%s" rel="stylesheet">\n' % (p['DS'], c) for c in cfg['css'])
    js_links = ''.join('<script src="%s/%s"></script>\n' % (p['DS'], j) for j in cfg['js'])
    title = LABEL[out_rel]
    html = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>Averyn — Design System Horizonte v%s · %s</title>\n'
            '<meta name="description" content="Design system de Averyn: principios, tokens, componentes y reglas de uso del estilo Horizonte.">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">\n'
            '<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">\n'
            '<link rel="icon" href="%s/assets/images/averyn-logo-blue.avif">\n<link href="%s/ds.css" rel="stylesheet">\n%s</head>\n<body>\n'
            '<a class="skip" href="#contenido">Saltar al contenido</a>\n<div class="ds-shell">\n  %s\n\n  <div class="ds-main" id="top">\n    %s\n\n    <main id="contenido">\n%s\n    </main>\n\n'
            '    <footer class="ds-sec" style="padding-block:2.4rem;border-top:1px solid var(--av-hairline)"><div class="ds-wrap"><div class="row" style="justify-content:space-between">'
            '<span class="mono" style="color:var(--av-gray-500)">Averyn · Design System v%s Horizonte</span><span class="mono" style="color:var(--av-gray-500)">Fuente: DESIGN.md · tokens.css</span></div></div></footer>\n'
            '  </div>\n</div>\n<div class="hz-toasts" id="toasts" role="region" aria-label="Notificaciones" aria-live="polite"></div>\n'
            '<script src="%s/ds.js"></script>\n%s</body>\n</html>\n'
            % (VERSION, title, p['FE'], p['DS'], css_links, side, cover, body, VERSION, p['DS'], js_links))
    return rep(html)


# ---------------------------------------------------------------- validación
def _strip_code(html):
    html = re.sub(r'<script\b.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<style\b.*?</style>', '', html, flags=re.S)
    html = re.sub(r'<pre\b.*?</pre>', '', html, flags=re.S)    # ejemplos de código: no son enlaces reales
    html = re.sub(r'<code\b.*?</code>', '', html, flags=re.S)
    return re.sub(r'<!--.*?-->', '', html, flags=re.S)


def validate(rendered):
    """rendered: {rel: html}. Devuelve la lista de problemas (ids repetidos, anclas y enlaces rotos)."""
    errors, ids_by_page = [], {}
    outs = {os.path.normpath(os.path.join(DOCS, rel)): rel for rel, _l, _g in built_pages()}
    for rel, html in rendered.items():
        clean = _strip_code(html)
        ids = re.findall(r'\sid="([^"]+)"', clean)
        seen = set()
        for i in ids:
            if i in seen:
                errors.append('%s: id repetido "%s"' % (rel, i))
            seen.add(i)
        ids_by_page[rel] = seen
    for rel, html in rendered.items():
        clean = _strip_code(html)
        base = os.path.dirname(os.path.join(DOCS, rel))
        for href in re.findall(r'\bhref="([^"]*)"', clean):
            if not href or href.startswith(('http', 'mailto:', 'data:', 'javascript:')):
                continue
            if href.startswith('#'):
                frag = href[1:]
                if frag and not frag.startswith('go:') and frag not in ids_by_page[rel] and frag not in ('top',):
                    errors.append('%s: ancla rota "%s"' % (rel, href))
                continue
            path, _, frag = href.partition('#')
            target = os.path.normpath(os.path.join(base, path))
            if target in outs:
                if frag and frag not in ids_by_page.get(outs[target], set()):
                    errors.append('%s: el fragmento "#%s" no existe en %s' % (rel, frag, outs[target]))
            elif path.endswith(('.html', '.css', '.js')) and not os.path.exists(target):
                errors.append('%s: enlace roto "%s"' % (rel, href))
    return errors


if __name__ == '__main__':
    rendered = {}
    for rel, _label, _grp in built_pages():
        out = os.path.join(DOCS, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        html = render(rel)
        rendered[rel] = html
        open(out, 'w', encoding='utf-8', newline='\n').write(html)
        print('escrito', rel, len(html) // 1024, 'KB')
    for rel, _l, _g in PAGES:
        if rel not in rendered:
            print('omitida (sin cuerpo):', rel)
    problems = validate(rendered)
    if problems:
        print('\nVALIDACIÓN: %d problema(s)' % len(problems))
        for e in problems:
            print('  -', e)
        sys.exit(1)
    print('validación OK (%d páginas)' % len(rendered))
