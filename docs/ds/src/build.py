"""Construye las páginas del design system Horizonte.

Uso:  python docs/ds/src/build.py

Cada página = plantilla común (barra lateral, portada, pie) + un archivo de cuerpo en src/.
Las rutas se calculan según la carpeta: docs/design-system.html y docs/ds/*.html.
Marcadores en los cuerpos: {{FE}} -> carpeta averyn-frontend, {{DS}} -> carpeta docs/ds, {{DOCS}} -> carpeta docs.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DS_DIR = os.path.dirname(HERE)            # docs/ds
DOCS = os.path.dirname(DS_DIR)            # docs
VERSION = '1.2'

# (archivo de salida relativo a docs, etiqueta del menú, titular de la página)
PAGES = [
    ('design-system.html', 'Fundamentos y componentes'),
    ('ds/graficos.html', 'Gráficos'),
    ('ds/sistema.html', 'Estados del sistema'),
]

MAIN_ANCHORS = [
    ('grp', 'Fundamentos'), ('principios', '01 · Principios'), ('marca', '02 · Marca y figura'), ('colores', '03 · Colores'),
    ('tipografia', '04 · Tipografía'), ('espacio', '05 · Espacio, forma y movimiento'), ('iconografia', '06 · Iconografía'),
    ('grp', 'Componentes'), ('botones', '07 · Botones'), ('campos', '08 · Campos de formulario'), ('superficies', '09 · Tarjetas y superficies'),
    ('navegacion', '10 · Navegación'), ('datos', '11 · Tablas, chips y datos'), ('feedback', '12 · Alertas y feedback'),
    ('estados', '13 · Estados: carga, vacío, subida'),
    ('grp', 'Composición'), ('patrones', '14 · Patrones de página'), ('plantillas', '15 · Plantillas'),
    ('grp', 'Contenido y calidad'), ('microcopy', '16 · Microcopy'), ('accesibilidad', '17 · Accesibilidad'),
    ('gobernanza', '18 · Gobernanza'), ('consumo', '19 · Consumo'),
]

# Páginas con configuración propia. Se construyen solo si existe su cuerpo en src/.
CONFIG = {
    'design-system.html': dict(body=['main-body.html'], cover='main-cover.html', anchors=MAIN_ANCHORS, css=[], js=['foundations.js']),
    'ds/graficos.html': dict(body=['graficos-body.html'], eyebrow='Gráficos', title='Datos con calma.',
                             lead='Modelos y ejemplos de gráficos para el panel del futuro: tarjetas minimalistas, formas elegidas por el trabajo del dato, color validado y lectura accesible.',
                             anchors=None, css=['charts.css'], js=['charts.js']),
    'ds/sistema.html': dict(body=['sistema-body.html'], eyebrow='Sistema', title='Cuando algo no sale como se espera.',
                            lead='Páginas de error y estados del sistema: 404, 403, 500, sin conexión y mantenimiento.',
                            anchors=None, css=[], js=['sistema.js']),
}


def read(name):
    return open(os.path.join(HERE, name), encoding='utf-8').read()


def anchors_from(body):
    """Extrae (id, etiqueta) de las secciones <section class="ds-sec" id=... data-nav="..."> del cuerpo."""
    import re
    out = []
    for m in re.finditer(r'<section[^>]*\bid="([^"]+)"[^>]*\bdata-nav="([^"]+)"', body):
        out.append((m.group(1), m.group(2)))
    return out


def paths(out_rel):
    in_ds = out_rel.startswith('ds/')
    return dict(FE='../../averyn-frontend' if in_ds else '../averyn-frontend', DS='.' if in_ds else 'ds', DOCS='..' if in_ds else '.')


def render(out_rel):
    cfg = CONFIG[out_rel]
    p = paths(out_rel)
    body = ''.join(read(n) for n in cfg['body'])
    if cfg.get('anchors') is None:
        cfg['anchors'] = [('grp', 'En esta página')] + anchors_from(body)
    rep = lambda s: s.replace('{{FE}}', p['FE']).replace('{{DS}}', p['DS']).replace('{{DOCS}}', p['DOCS'])
    # --- barra lateral
    links = []
    for rel, label in PAGES:
        if not os.path.exists(os.path.join(HERE, CONFIG[rel]['body'][0])):
            continue
        href = os.path.relpath(os.path.join(DOCS, rel), os.path.dirname(os.path.join(DOCS, out_rel))).replace('\\', '/')
        cur = ' aria-current="page"' if rel == out_rel else ''
        links.append('      <a class="ds-page" href="%s"%s>%s</a>' % (href, cur, label))
    anchors = []
    for a, label in cfg['anchors']:
        anchors.append('      <span class="grp mono">%s</span>' % label if a == 'grp' else '      <a href="#%s">%s</a>' % (a, label))
    side = ('<aside class="ds-side" aria-label="Índice del design system">\n'
            '    <a class="ds-side__brand" href="%s/design-system.html" aria-label="Averyn, inicio del design system"><img src="%s/assets/images/averyn-logo-font-black.avif" alt="Averyn"></a>\n'
            '    <p class="ds-side__ver mono">Design System · v%s Horizonte</p>\n'
            '    <nav>\n      <span class="grp mono">Design system</span>\n%s\n%s\n    </nav>\n  </aside>'
            % (p['DOCS'], p['FE'], VERSION, '\n'.join(links), '\n'.join(anchors)))
    # --- portada
    if cfg.get('cover'):
        cover = read(cfg['cover'])
    else:
        cover = ('<header class="ds-cover ds-cover--page"><div class="ds-wrap"><span class="mono" style="color:#fff;opacity:.85">%s</span>'
                 '<h1>%s</h1><p>%s</p></div></header>' % (cfg['eyebrow'], cfg['title'], cfg['lead']))
    css_links = ''.join('<link href="%s/%s" rel="stylesheet">\n' % (p['DS'], c) for c in cfg['css'])
    js_links = ''.join('<script src="%s/%s"></script>\n' % (p['DS'], j) for j in cfg['js'])
    title = dict(PAGES)[out_rel]
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


if __name__ == '__main__':
    for rel, _ in PAGES:
        cfg = CONFIG[rel]
        if not os.path.exists(os.path.join(HERE, cfg['body'][0])):
            print('omitida (sin cuerpo):', rel)
            continue
        out = os.path.join(DOCS, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        html = render(rel)
        open(out, 'w', encoding='utf-8', newline='\n').write(html)
        print('escrito', rel, len(html) // 1024, 'KB')
