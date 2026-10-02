# -*- coding: utf-8 -*-
"""
Genera los correos transaccionales de Averyn (HTML compatible con clientes de correo + texto plano):

    python docs/ds/src/emails.py   ->   docs/ds/emails/*.html y *.txt

Reglas: maquetación con tablas, estilos en línea, 600 px, sin JavaScript ni CSS externo; botón "a prueba de
Outlook" (VML); fuentes con respaldo a Arial; imagen del logo con alt y URL absoluta ({{logo_url}}); texto de
preencabezado oculto; todos los datos variables como {{variable}}. El contraste del botón (blanco sobre #145FEE)
es 5.4:1. Las plantillas no contienen datos reales.
"""
import json, os, sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'emails')

HEAD_FONT = "'Space Grotesk', Arial, Helvetica, sans-serif"
BODY_FONT = "Inter, Arial, Helvetica, sans-serif"
MONO_FONT = "'JetBrains Mono', 'Courier New', monospace"

# clave: (nombre de archivo, asunto, preencabezado, titular, párrafos, botón|None, bloque extra, texto de pie)
MAILS = {
    'invitacion': dict(
        name='Invitación', subject='{{invitador}} te invitó a Averyn', pre='Crea tu cuenta para verificar tu identidad. El enlace vence en 48 horas.',
        title='Te invitaron a Averyn.',
        body=['Hola {{nombre}},', '{{institucion}} te invitó a crear tu cuenta en Averyn, la plataforma con la que verificarás tu identidad de forma segura.', 'Solo toma unos minutos. Te pediremos tu consentimiento antes de usar la cámara o el lector de huellas.'],
        button=('Crear mi cuenta', '{{enlace}}'), note='El enlace vence en 48 horas. Si no esperabas esta invitación, puedes ignorar este correo.',
        extra=None),
    'verificar-correo': dict(
        name='Verificación de correo', subject='Tu código de verificación de Averyn', pre='Tu código es {{codigo}}. Vence en 10 minutos.',
        title='Confirma tu correo.',
        body=['Hola {{nombre}},', 'Usa este código para confirmar tu correo electrónico. Vence en 10 minutos.'],
        button=None, note='No compartas este código con nadie. Averyn nunca te lo pedirá por teléfono, chat ni redes sociales. Si no lo solicitaste, ignora este correo.',
        extra='code'),
    'recuperar-contrasena': dict(
        name='Recuperación de contraseña', subject='Restablece tu contraseña de Averyn', pre='Usa este enlace en los próximos 30 minutos.',
        title='Restablece tu contraseña.',
        body=['Hola {{nombre}},', 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Pulsa el botón para elegir una nueva.'],
        button=('Elegir nueva contraseña', '{{enlace}}'), note='El enlace vence en 30 minutos y solo se puede usar una vez. Si no fuiste tú, ignora este correo: tu contraseña no cambiará.',
        extra='meta'),
}


def html(m):
    paras = ''.join('<p style="margin:0 0 16px;font-family:%s;font-size:16px;line-height:24px;color:#26304A;">%s</p>' % (BODY_FONT, p) for p in m['body'])
    btn = ''
    if m['button']:
        label, href = m['button']
        btn = ('<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr><td align="center" bgcolor="#145FEE" style="border-radius:8px;">'
               '<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="%(h)s" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="17%%" stroke="f" fillcolor="#145FEE"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">%(l)s</center></v:roundrect><![endif]-->'
               '<!--[if !mso]><!--><a href="%(h)s" target="_blank" style="display:inline-block;padding:14px 28px;font-family:%(m)s;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;border-radius:8px;background:#145FEE;">%(l)s &rarr;</a><!--<![endif]-->'
               '</td></tr></table>'
               '<p style="margin:0 0 8px;font-family:%(b)s;font-size:13px;line-height:20px;color:#56637F;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>'
               '<p style="margin:0 0 24px;font-family:%(m)s;font-size:12px;line-height:18px;color:#145FEE;word-break:break-all;">%(h)s</p>') % dict(h=href, l=label, m=MONO_FONT, b=BODY_FONT)
    extra = ''
    if m['extra'] == 'code':
        extra = ('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:8px 0 24px;"><tr><td align="center" style="padding:20px;background:#EAF0FE;border:1px solid #CFDCF3;border-radius:12px;">'
                 '<span style="font-family:%s;font-size:36px;line-height:44px;font-weight:700;letter-spacing:10px;color:#000C24;">{{codigo}}</span></td></tr></table>') % MONO_FONT
    if m['extra'] == 'meta':
        extra = ('<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 24px;border-top:1px solid #DCE5F5;">'
                 '<tr><td style="padding:10px 0;border-bottom:1px solid #DCE5F5;font-family:%(m)s;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#56637F;" width="120">Solicitado</td><td style="padding:10px 0;border-bottom:1px solid #DCE5F5;font-family:%(b)s;font-size:14px;color:#26304A;">{{fecha}}</td></tr>'
                 '<tr><td style="padding:10px 0;border-bottom:1px solid #DCE5F5;font-family:%(m)s;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#56637F;">Dispositivo</td><td style="padding:10px 0;border-bottom:1px solid #DCE5F5;font-family:%(b)s;font-size:14px;color:#26304A;">{{dispositivo}} · {{ubicacion}}</td></tr></table>') % dict(m=MONO_FONT, b=BODY_FONT)
    return '''<!doctype html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>%(subject)s</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:#F4F8FF;-webkit-text-size-adjust:100%%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">%(pre)s&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F8FF"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%%;max-width:600px;">
    <tr><td style="padding:0 0 20px;"><img src="{{logo_url}}" width="110" alt="Averyn" style="display:block;border:0;height:auto;font-family:%(h)s;font-size:20px;color:#000C24;"></td></tr>
    <tr><td style="background:#FFFFFF;border:1px solid #DCE5F5;border-radius:16px;padding:40px 40px 32px;">
      <h1 style="margin:0 0 20px;font-family:%(h)s;font-size:30px;line-height:34px;font-weight:500;letter-spacing:-0.5px;color:#000C24;">%(title)s</h1>
      %(paras)s
      %(extra)s
      %(btn)s
      <p style="margin:0;padding-top:20px;border-top:1px solid #DCE5F5;font-family:%(b)s;font-size:13px;line-height:20px;color:#56637F;">%(note)s</p>
    </td></tr>
    <tr><td style="padding:24px 8px 0;font-family:%(b)s;font-size:12px;line-height:18px;color:#56637F;">
      Enviado por Averyn en nombre de {{institucion}}. Este es un mensaje automático: no respondas a este correo.<br>
      ¿Necesitas ayuda? Escribe a {{correo_soporte}}.
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>
''' % dict(subject=m['subject'], pre=m['pre'], title=m['title'], paras=paras, extra=extra, btn=btn, note=m['note'], h=HEAD_FONT, b=BODY_FONT)


def text(m):
    lines = [m['title'], '']
    lines += m['body'] + ['']
    if m['extra'] == 'code':
        lines += ['Código: {{codigo}}', '']
    if m['extra'] == 'meta':
        lines += ['Solicitado: {{fecha}}', 'Dispositivo: {{dispositivo}} · {{ubicacion}}', '']
    if m['button']:
        lines += ['%s: %s' % m['button'], '']
    lines += [m['note'], '', '--', 'Enviado por Averyn en nombre de {{institucion}}. Mensaje automático: no respondas a este correo.', '¿Necesitas ayuda? {{correo_soporte}}']
    return '\n'.join(lines) + '\n'


def all_mails():
    return {k: dict(name=m['name'], subject=m['subject'], pre=m['pre'], html=html(m), text=text(m)) for k, m in MAILS.items()}


def main():
    os.makedirs(OUT, exist_ok=True)
    for k, m in all_mails().items():
        open(os.path.join(OUT, k + '.html'), 'w', encoding='utf-8', newline='\n').write(m['html'])
        open(os.path.join(OUT, k + '.txt'), 'w', encoding='utf-8', newline='\n').write(m['text'])
        print('escrito', k, len(m['html']) // 1024, 'KB')


if __name__ == '__main__':
    main()
