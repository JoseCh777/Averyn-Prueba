/**
 * Textos de la landing pública. Viven aparte de los componentes para que cambiar un texto
 * no obligue a tocar el marcado (y para que las pruebas puedan revisarlos).
 */

/** Un elemento con título y descripción (listas de «Qué es», «Arquitectura», etc.). */
export interface LandingItem {
  title: string;
  text: string;
}

/** Integrante del equipo, con su perfil público de GitHub. */
export interface TeamMember {
  name: string;
  initials: string;
  role: string;
  github: string;
  bio: string;
}

/** Enlaces del menú principal: cada `id` es el de una sección de la página. */
export const LANDING_NAV = [
  { id: "que-es", label: "Qué es" },
  { id: "capacidades", label: "Capacidades" },
  { id: "soluciones", label: "Soluciones" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "proceso", label: "Proceso" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "seguridad", label: "Seguridad" },
  { id: "equipo", label: "Equipo" },
] as const;

export const HERO_COPY = {
  title: "Identidad inteligente para procesos institucionales",
  lead: "Plataforma de identidad, biometría, inteligencia artificial y seguridad diseñada para automatizar procesos institucionales críticos.",
} as const;

export const ABOUT_ITEMS: readonly LandingItem[] = [
  { title: "Multi-institucional", text: "Cada institución opera como un tenant lógico aislado: universidades, colegios, empresas y entidades públicas." },
  { title: "Identidad propia", text: "Averyn gestiona su propio modelo de identidad, independiente de bases de datos institucionales." },
  { title: "Núcleo + módulos", text: "Un núcleo común de identidad, biometría, OCR, IA y seguridad sobre el que se construyen módulos de negocio." },
];

export const CAPABILITIES: readonly LandingItem[] = [
  { title: "Identidad", text: "Personas con identificadores propios de Averyn, documentos múltiples y afiliaciones por institución." },
  { title: "Biometría", text: "Enrolamiento y verificación por huella y rostro, con liveness y plantillas protegidas." },
  { title: "OCR", text: "Procesamiento documental con validación antes de asociar datos a una persona." },
  { title: "Inteligencia artificial", text: "Modelos versionados y trazables para detección facial, liveness, clasificación y OCR." },
  { title: "Seguridad", text: "Roles, permisos, cifrado y aislamiento de tenants como dominios de primera clase." },
  { title: "Auditoría", text: "Registro trazable de operaciones críticas para investigación y control institucional." },
];

export const SOLUTIONS: readonly LandingItem[] = [
  { title: "Gestión electoral", text: "Procesos electorales institucionales seguros, automatizados y trazables." },
  { title: "Control de acceso", text: "Zonas, puntos, políticas y eventos para el acceso autorizado a espacios." },
  { title: "Verificación de identidad", text: "Autenticación biométrica y documental para onboarding y procesos sensibles." },
  { title: "Procesos institucionales", text: "Automatización de operaciones que requieren identidad y autorización." },
];

export const TECHNOLOGIES = ["Huella", "Rostro", "Liveness", "OCR", "IA", "APIs", "MCP", "RBAC", "Auditoría", "Cifrado"] as const;

export const PROCESS_STEPS: readonly LandingItem[] = [
  { title: "Conecta", text: "Tu institución se integra mediante APIs, importaciones o conectores sin depender de bases de datos externas." },
  { title: "Verifica", text: "La identidad se valida con OCR y biometría, incluyendo liveness, antes de cualquier operación." },
  { title: "Automatiza", text: "Los procesos operan con roles, permisos y auditoría de cada operación crítica." },
];

export const ARCHITECTURE_ITEMS: readonly LandingItem[] = [
  { title: "Identidad", text: "Núcleo de identidad multi-tenant con documentos y afiliaciones por persona." },
  { title: "Biometría", text: "Enrolamiento, verificación y liveness con abstracción de proveedores." },
  { title: "IA y OCR", text: "Modelos versionados y trazables para lectura documental y verificación facial." },
  { title: "Seguridad y auditoría", text: "Roles, permisos, cifrado, aislamiento de tenants y trazabilidad de operaciones." },
];

/** Flujo de alto nivel; la etapa marcada como `core` es el núcleo común. */
export const ARCHITECTURE_FLOW = [
  { label: "Interfaz web", core: false },
  { label: "Autenticación", core: false },
  { label: "Identidad · Biometría · IA", core: true },
  { label: "Módulos de negocio", core: false },
] as const;

export const SECURITY_ITEMS: readonly LandingItem[] = [
  { title: "Roles", text: "Modelo usuario → rol → permiso → recurso." },
  { title: "Permisos", text: "Autorización granular por capacidad y módulo." },
  { title: "MFA", text: "Autenticación reforzada para operaciones críticas." },
  { title: "Auditoría", text: "Registro de login, roles, biometría y procesos sensibles." },
  { title: "Cifrado", text: "Protección de datos altamente sensibles como plantillas biométricas." },
  { title: "Aislamiento de tenants", text: "Cada institución opera aislada: un tenant no accede a los datos de otro." },
  { title: "Trazabilidad", text: "Cada ejecución de IA y operación queda registrada con su resultado." },
];

export const TEAM: readonly TeamMember[] = [
  {
    name: "Jorge Ivan Herrera Garcia",
    initials: "JI",
    role: "Identidad y Auditoría",
    github: "ing-jorgehg",
    bio: "Módulo de identidad (personas, documentos y perfiles) y auditoría: consulta del historial y filtros.",
  },
  {
    name: "Daniel David Turizo Chacon",
    initials: "DD",
    role: "Core, Arquitectura e Integraciones críticas",
    github: "ddturizo-eng",
    bio: "Arquitectura general, Core, base de datos, multi-tenancy y contratos críticos con los servicios.",
  },
  {
    name: "Jose Antonio Chinchia Gutierrez",
    initials: "JC",
    role: "Frontend, Autenticación y Fingerprint",
    github: "JoseCh777",
    bio: "Frontend y Design System, autenticación y servicio de huella digital.",
  },
  {
    name: "Mateo Calderon Araujo",
    initials: "MC",
    role: "Elecciones y OCR",
    github: "mcalderona",
    bio: "Módulo electoral (elecciones, candidatos y votación) e integración del servicio OCR.",
  },
];

/**
 * Número de orden con dos cifras («01», «02»…), como en el prototipo.
 *
 * @param index - Posición empezando en 0.
 * @returns El número formateado.
 */
export function orderLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}
