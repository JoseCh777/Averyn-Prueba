/* Datos de la sección Fundamentos (extraídos de foundations.js de la v1.7). */
export const COLORS: Record<string, [name: string, token: string, hex: string, use: string, ink: string][]> = {
  "brand": [
    [
      "Azul de señal",
      "--av-blue",
      "#145FEE",
      "Botones, enlaces, cierre azul",
      "#fff"
    ],
    [
      "Azul hover",
      "--av-blue-hover",
      "#0F4BC7",
      "Hover del botón primario",
      "#fff"
    ],
    [
      "Azul activo",
      "--av-blue-active",
      "#0C3B9E",
      "Pulsado",
      "#fff"
    ],
    [
      "Tinte de señal",
      "--av-blue-tint",
      "#EAF0FE",
      "Chips, avatares, tiles medianos",
      "#145FEE"
    ]
  ],
  "horizon": [
    [
      "Navy profundo",
      "--av-navy",
      "#000C24",
      "Texto principal, footer, tramo final",
      "#fff"
    ],
    [
      "Navy nocturno",
      "--av-navy-night",
      "#071A36",
      "Panel oscuro, sección Capacidades",
      "#fff"
    ],
    [
      "Navy de horizonte",
      "--av-navy-horizon",
      "#0A2A66",
      "Tramo medio del degradado",
      "#fff"
    ],
    [
      "Cielo",
      "--av-sky",
      "#DCECFF",
      "Inicio del degradado",
      "#000C24"
    ],
    [
      "Papel azul",
      "--av-paper-blue",
      "#F4F8FF",
      "Fondos alternos de sección",
      "#000C24"
    ],
    [
      "Traza cian",
      "--av-cyan",
      "#00ACD2",
      "Trazos de la figura de arcos",
      "#fff"
    ],
    [
      "Brillo cian",
      "--av-cyan-glow",
      "#55D6FF",
      "Índices, hover y puntos sobre navy",
      "#000C24"
    ],
    [
      "Texto nocturno",
      "--av-night-text",
      "#B9C9E4",
      "Texto secundario sobre navy",
      "#000C24"
    ]
  ],
  "neutral": [
    [
      "Blanco",
      "--av-white",
      "#FFFFFF",
      "Fondos y texto sobre oscuro",
      "#000C24"
    ],
    [
      "Gris 50",
      "--av-gray-50",
      "#F4F6FA",
      "Fondo deshabilitado",
      "#000C24"
    ],
    [
      "Gris 100",
      "--av-gray-100",
      "#E7EBF3",
      "Pistas, esqueletos",
      "#000C24"
    ],
    [
      "Gris 200",
      "--av-gray-200",
      "#CBD3E1",
      "Bordes en reposo (deshabilitado)",
      "#000C24"
    ],
    [
      "Gris 300",
      "--av-gray-300",
      "#A9B4C7",
      "Solo decoración (2.09:1)",
      "#000C24"
    ],
    [
      "Gris 400",
      "--av-gray-400",
      "#7C89A3",
      "Iconos y numeración; texto solo grande (3.52:1)",
      "#fff"
    ],
    [
      "Gris 500",
      "--av-gray-500",
      "#56637F",
      "Texto secundario (6.02:1)",
      "#fff"
    ],
    [
      "Gris 600",
      "--av-gray-600",
      "#3B4664",
      "Texto de apoyo (9.4:1)",
      "#fff"
    ],
    [
      "Gris 700",
      "--av-gray-700",
      "#26304A",
      "Texto de navegación",
      "#fff"
    ],
    [
      "Línea",
      "--av-hairline",
      "#DCE5F5",
      "Separadores de 1 px",
      "#000C24"
    ],
    [
      "Línea fuerte",
      "--av-hairline-strong",
      "#CFDCF3",
      "Bordes de contenedor y franja",
      "#000C24"
    ],
    [
      "Borde de campo",
      "--av-field-border",
      "#6E86B0",
      "Bordes de campo y borde discontinuo (3.68:1)",
      "#fff"
    ],
    [
      "Placeholder",
      "--av-placeholder",
      "#667390",
      "Texto de ejemplo en campos (4.75:1)",
      "#fff"
    ],
    [
      "Tinta tenue",
      "--av-ink-faint",
      "#9DB6E6",
      "Solo sobre navy o decoración",
      "#000C24"
    ]
  ],
  "semantic": [
    [
      "Éxito",
      "--av-success",
      "#12B76A",
      "Puntos y rellenos",
      "#fff"
    ],
    [
      "Éxito texto",
      "--av-success-text",
      "#047857",
      "Texto de éxito y relleno de la píldora sólida (5.48:1)",
      "#fff"
    ],
    [
      "Éxito strong",
      "--av-success-strong",
      "#065F46",
      "Texto sobre fondo suave (≥ 5:1)",
      "#fff"
    ],
    [
      "Éxito fondo",
      "--av-success-bg",
      "#E8F8F0",
      "Fondo de chip y alerta",
      "#047857"
    ],
    [
      "Aviso",
      "--av-warning",
      "#F79009",
      "Puntos y rellenos",
      "#000C24"
    ],
    [
      "Aviso texto",
      "--av-warning-text",
      "#B45309",
      "Texto de aviso y relleno de la píldora sólida (5.02:1)",
      "#fff"
    ],
    [
      "Aviso strong",
      "--av-warning-strong",
      "#92400E",
      "Texto sobre fondo suave (≥ 5:1)",
      "#fff"
    ],
    [
      "Aviso fondo",
      "--av-warning-bg",
      "#FEF3E2",
      "Fondo de chip y alerta",
      "#B45309"
    ],
    [
      "Error",
      "--av-error",
      "#F04438",
      "Puntos y rellenos",
      "#fff"
    ],
    [
      "Error texto",
      "--av-error-text",
      "#B91C1C",
      "Texto de error (6.47:1)",
      "#fff"
    ],
    [
      "Error fondo",
      "--av-error-bg",
      "#FDECEA",
      "Fondo de chip y alerta",
      "#B91C1C"
    ],
    [
      "Info",
      "--av-info",
      "#00ACD2",
      "Puntos y rellenos",
      "#fff"
    ],
    [
      "Info texto",
      "--av-info-text",
      "#0369A1",
      "Texto informativo (5.93:1)",
      "#fff"
    ],
    [
      "Info fondo",
      "--av-info-bg",
      "#E3F6FA",
      "Fondo de chip y alerta",
      "#0369A1"
    ],
    [
      "Neutro texto",
      "--av-neutral-text",
      "#3B4664",
      "Pendiente y estados sin juicio (9.4:1)",
      "#fff"
    ],
    [
      "Neutro fondo",
      "--av-neutral-bg",
      "#F4F6FA",
      "Fondo de la píldora neutra",
      "#3B4664"
    ],
    [
      "Éxito sobre navy",
      "--av-success-on-navy",
      "#6EE7B7",
      "Barras, puntos y toast sobre navy (11.4:1)",
      "#000C24"
    ],
    [
      "Aviso sobre navy",
      "--av-warning-on-navy",
      "#FFC15A",
      "Reintento sobre navy (10.8:1)",
      "#000C24"
    ],
    [
      "Error sobre navy",
      "--av-error-on-navy",
      "#FCA5A5",
      "Rechazo sobre navy (9.1:1)",
      "#000C24"
    ]
  ]
};

/** [texto, fondo, descripción, uso] */
export const CONTRAST_PAIRS: [string, string, string, string][] = [
  [
    "#000C24",
    "#FFFFFF",
    "Texto principal sobre blanco",
    "Cuerpo y titulares"
  ],
  [
    "#56637F",
    "#FFFFFF",
    "Gris 500 sobre blanco",
    "Texto secundario"
  ],
  [
    "#56637F",
    "#F4F8FF",
    "Gris 500 sobre papel azul",
    "Texto secundario en secciones alternas"
  ],
  [
    "#145FEE",
    "#FFFFFF",
    "Azul de señal sobre blanco",
    "Enlaces y rótulos"
  ],
  [
    "#FFFFFF",
    "#145FEE",
    "Blanco sobre azul de señal",
    "Botón primario, cierre azul"
  ],
  [
    "#F0F5FF",
    "#145FEE",
    "Texto de apoyo sobre azul",
    "Párrafos del cierre azul (mín.)"
  ],
  [
    "#DCE8FF",
    "#145FEE",
    "Texto #DCE8FF sobre azul",
    "NO USAR (usar #F0F5FF)"
  ],
  [
    "#FFFFFF",
    "#071A36",
    "Blanco sobre navy nocturno",
    "Titulares del panel"
  ],
  [
    "#B9C9E4",
    "#071A36",
    "Texto nocturno sobre navy",
    "Texto secundario del panel"
  ],
  [
    "#55D6FF",
    "#071A36",
    "Brillo cian sobre navy",
    "Índices, enlaces, foco"
  ],
  [
    "#9DB6E6",
    "#071A36",
    "Tinta tenue sobre navy",
    "Solo sobre navy"
  ],
  [
    "#9DB6E6",
    "#F4F8FF",
    "Tinta tenue sobre papel azul",
    "NO USAR como texto"
  ],
  [
    "#FF8A80",
    "#071A36",
    "Rojo suave sobre navy",
    "Rechazo en el panel"
  ],
  [
    "#FFC15A",
    "#071A36",
    "Ámbar sobre navy",
    "Reintento en el panel"
  ],
  [
    "#6E86B0",
    "#FFFFFF",
    "Borde de campo sobre blanco",
    "Componente (mín. 3:1)"
  ],
  [
    "#CFDCF3",
    "#FFFFFF",
    "Línea fuerte sobre blanco",
    "Solo separador, no borde de campo"
  ],
  [
    "#667390",
    "#FFFFFF",
    "Placeholder sobre blanco",
    "Texto de ejemplo"
  ],
  [
    "#7C89A3",
    "#FFFFFF",
    "Gris 400 sobre blanco",
    "Solo grande o decorativo"
  ],
  [
    "#A9B4C7",
    "#FFFFFF",
    "Gris 300 sobre blanco",
    "NO USAR para texto"
  ],
  [
    "#047857",
    "#FFFFFF",
    "Éxito texto sobre blanco",
    "Chips y alertas"
  ],
  [
    "#B91C1C",
    "#FFFFFF",
    "Error texto sobre blanco",
    "Chips, alertas y mensajes"
  ],
  [
    "#12B76A",
    "#FFFFFF",
    "Éxito base sobre blanco",
    "Solo punto o relleno, nunca texto"
  ],
  [
    "#000C24",
    "#145FEE",
    "Anillo navy sobre azul de señal",
    "Foco del tile azul (≥ 3:1)"
  ]
];

export const SPACES: [string, number][] = [["space-1",4],["space-2",8],["space-3",12],["space-4",16],["space-6",24],["space-8",32],["space-12",48],["space-16",64]];
export const RADII: [string, string, string, string][] = [["4 px","sm","Marcos de media","4px"],["8 px","control","Botones y campos","8px"],["10 px","pill","Píldora de navegación pública","10px"],["16 px","tile","Tiles, menús, toasts","16px"],["24 px","frame","Marco del login, modal, panel","24px"],["9999 px","full","Dock, chips, avatares","9999px"]];
export const ICON_SAMPLES: [string, string][] = [["person-vcard","Identidad"],["fingerprint","Biometría"],["file-earmark-text","Documento / OCR"],["camera","Cámara"],["card-checklist","Procesos electorales"],["check2-square","Electoral (dock)"],["stars","IA"],["cpu","IA (dock)"],["person-gear","Usuarios"],["clipboard-data","Reportes"],["door-open","Accesos"],["gear","Administración"],["grid-1x2","Dashboard"],["search","Buscar"],["bell","Notificaciones"],["box-arrow-right","Cerrar sesión"],["chevron-down","Desplegar"],["patch-check","Verificar"],["collection","Vacío"],["cloud-arrow-up","Subir archivo"],["exclamation-circle","Error"],["check-circle","Éxito"],["info-circle","Información"],["x-circle","Rechazo"]];
