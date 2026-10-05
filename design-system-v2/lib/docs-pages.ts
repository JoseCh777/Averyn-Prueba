/* Páginas de la documentación de Horizonte (orden y grupos de la barra lateral). */
export type DocPageMeta = { slug: string; href: string; label: string; group: string; eyebrow: string; title: string; lead: string };

export const DOC_PAGES: DocPageMeta[] = [
  {
    "slug": "inicio",
    "label": "Inicio",
    "group": "Empezar",
    "eyebrow": "",
    "title": "",
    "lead": "",
    "href": "/"
  },
  {
    "slug": "fundamentos",
    "label": "Fundamentos",
    "group": "Sistema",
    "eyebrow": "Fundamentos",
    "title": "Lo que no cambia.",
    "lead": "Principios, marca y figura de arcos, color, tipografía, espacio, iconografía y los tokens que los hacen exportables.",
    "href": "/fundamentos"
  },
  {
    "slug": "componentes",
    "label": "Componentes",
    "group": "Sistema",
    "eyebrow": "Componentes",
    "title": "Las piezas con las que se arma todo.",
    "lead": "Botones, formularios, datos y píldoras de estado, navegación, feedback y capas: cada pieza con su anatomía, su teclado y sus reglas.",
    "href": "/componentes"
  },
  {
    "slug": "graficos",
    "label": "Gráficos",
    "group": "Sistema",
    "eyebrow": "Gráficos",
    "title": "Datos con calma.",
    "lead": "Modelos y ejemplos de gráficos para el panel del futuro: tarjetas minimalistas, formas elegidas por el trabajo del dato, color validado y lectura accesible.",
    "href": "/graficos"
  },
  {
    "slug": "patrones",
    "label": "Patrones",
    "group": "Aplicación",
    "eyebrow": "Patrones",
    "title": "Cuando la pantalla toca el cuerpo de alguien.",
    "lead": "Captura facial y de huella, resultado de verificación, documento y OCR, papeleta electoral, dispositivos y consentimiento. Simulaciones sin cámara ni datos reales.",
    "href": "/patrones"
  },
  {
    "slug": "plantillas",
    "label": "Plantillas y estados",
    "group": "Aplicación",
    "eyebrow": "Plantillas y estados",
    "title": "Pantallas completas, no piezas sueltas.",
    "lead": "Bitácora, configuración, detalle de persona, asistente, notificaciones y perfil; los estados de carga y vacío; y las páginas de error y avisos del sistema.",
    "href": "/plantillas"
  },
  {
    "slug": "marca",
    "label": "Marca y entregables",
    "group": "Marca y calidad",
    "eyebrow": "Marca y entregables",
    "title": "Todo lo que sale de Averyn.",
    "lead": "Ilustración con arcos, favicons, correos transaccionales, estilos de impresión y tokens exportables: la identidad fuera de la pantalla.",
    "href": "/marca"
  },
  {
    "slug": "calidad",
    "label": "Calidad y gobernanza",
    "group": "Marca y calidad",
    "eyebrow": "Calidad y gobernanza",
    "title": "Cómo se mantiene bien.",
    "lead": "Microcopy, accesibilidad, gobernanza (versiones, novedades y deuda) y cómo usar el sistema en una pantalla nueva.",
    "href": "/calidad"
  }
];

export const VERSION = "2.0";
