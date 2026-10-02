# -*- coding: utf-8 -*-
"""
Exporta los tokens de averyn-frontend/assets/css/tokens.css (fuente de verdad) a docs/ds/tokens.json
en formato W3C Design Tokens ($value / $type / $description), para Figma (Tokens Studio), Style Dictionary, etc.

    python docs/ds/src/tokens_export.py

Lee solo el bloque :root. Los grupos se deducen del prefijo del nombre:
  color (hex/rgba), fontFamily, dimension (px/rem), shadow, transition, y los comentarios pasan a $description.
"""
import json, os, re, sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
SRC = os.path.join(ROOT, 'averyn-frontend', 'assets', 'css', 'tokens.css')
OUT = os.path.join(ROOT, 'docs', 'ds', 'tokens.json')


def hex8(v):
    v = v.strip()
    m = re.match(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)', v)
    if not m:
        return v.upper() if v.startswith('#') else v
    r, g, b = (int(float(x)) for x in m.groups()[:3])
    a = float(m.group(4)) if m.group(4) is not None else 1.0
    return '#%02X%02X%02X' % (r, g, b) + ('' if a >= 1 else '%02X' % round(a * 255))


def shadow(v):
    out = []
    for part in re.split(r',\s*(?![^()]*\))', v):
        m = re.match(r'\s*(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(?:(-?[\d.]+)(?:px)?\s+)?(rgba?\([^)]*\)|#[0-9a-fA-F]+)', part)
        if not m:
            return None
        ox, oy, bl, sp, col = m.groups()
        out.append({'color': hex8(col), 'offsetX': ox + 'px', 'offsetY': oy + 'px', 'blur': bl + 'px', 'spread': (sp or '0') + 'px'})
    return out[0] if len(out) == 1 else out


def main():
    css = open(SRC, encoding='utf-8').read()
    root = re.search(r':root\s*\{(.*?)\n\}', css, re.S).group(1)
    tokens = {}
    count = {}
    for m in re.finditer(r'--av-([a-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:/\*\s*(.*?)\s*\*/)?', root):
        name, val, desc = m.group(1), m.group(2).strip(), m.group(3)
        tok = None
        if re.match(r'^(#[0-9a-fA-F]{3,8}|rgba?\()', val):
            grp, tok = 'color', {'$type': 'color', '$value': hex8(val)}
        elif val.startswith("'") or name.startswith('font-'):
            fam = [f.strip().strip("'\"") for f in val.split(',')]
            grp, tok = 'fontFamily', {'$type': 'fontFamily', '$value': fam}
        elif re.match(r'^-?[\d.]+(px|rem)$', val):
            grp = 'fontSize' if name.startswith('text-') else ('radius' if name.startswith('radius') else 'space' if name.startswith('space') else 'dimension')
            tok = {'$type': 'dimension', '$value': val}
        elif name.startswith('shadow'):
            sv = shadow(val)
            grp, tok = 'shadow', ({'$type': 'shadow', '$value': sv} if sv else None)
        elif name.startswith('transition'):
            m2 = re.match(r'(\d+)ms\s+cubic-bezier\(([^)]*)\)', val)
            if m2:
                grp, tok = 'transition', {'$type': 'transition', '$value': {'duration': m2.group(1) + 'ms', 'delay': '0ms', 'timingFunction': [float(x) for x in m2.group(2).split(',')]}}
        elif name.startswith('ease'):
            m2 = re.match(r'cubic-bezier\(([^)]*)\)', val)
            if m2:
                grp, tok = 'easing', {'$type': 'cubicBezier', '$value': [float(x) for x in m2.group(1).split(',')]}
        elif name.startswith('ratio'):
            grp, tok = 'ratio', {'$type': 'other', '$value': val}
        elif name.startswith('text-welcome'):
            grp, tok = 'fontSize', {'$type': 'other', '$value': val}
        if not tok:
            continue
        if desc:
            tok['$description'] = desc
        key = re.sub(r'^(text|radius|space|font|shadow|transition|ease)-', '', name) if grp in ('fontSize', 'radius', 'space', 'fontFamily', 'shadow', 'transition', 'easing') else name
        tokens.setdefault(grp, {})[key] = tok
        count[grp] = count.get(grp, 0) + 1
    # Tokens de gráficos (docs/ds/charts.css): paleta validada con validate_palette.js
    charts = os.path.join(ROOT, 'docs', 'ds', 'charts.css')
    if os.path.exists(charts):
        cr = re.search(r':root\s*\{(.*?)\n\}', open(charts, encoding='utf-8').read(), re.S).group(1)
        for m in re.finditer(r'--viz-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;', cr):
            tokens.setdefault('chart', {})[m.group(1)] = {'$type': 'color', '$value': m.group(2).upper()}
            count['chart'] = count.get('chart', 0) + 1
    data = {'$description': 'Tokens de Averyn (Horizonte). Generado por docs/ds/src/tokens_export.py desde averyn-frontend/assets/css/tokens.css; no editar a mano.'}
    data.update(tokens)
    open(OUT, 'w', encoding='utf-8', newline='\n').write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print('escrito', os.path.relpath(OUT, ROOT), count)


if __name__ == '__main__':
    main()
