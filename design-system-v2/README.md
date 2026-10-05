# Horizonte 2.0 · componentes en React

Proyecto Next.js (16, React 19, TypeScript estricto, Tailwind v4) donde se construye la v2.0 del Design System Horizonte.
Es un espacio de preparación: nada de esto está en los repositorios oficiales de `averyn-platform` hasta que el ADR-011
(`docs/propuestas/ADR-011-design-system-horizonte.md`) sea aprobado.

## Estructura

| Carpeta | Contenido |
|---|---|
| `app/tokens.css` | Tokens `--av-*` (copia de `averyn-frontend/assets/css/tokens.css`; fuente de verdad) |
| `app/globals.css` | Importa Tailwind y expone los tokens con `@theme inline`; breakpoints 576/768/1024/1280; foco y movimiento reducido |
| `components/ui/` | Componentes genéricos (Icon, y los que siguen) |
| `components/ui/icons/` | Iconos propios que el set gratuito de Lineicons no trae |
| `components/effects/` | Efectos de marca derivados de Aceternity UI, revisados y adaptados |
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge) |

## Reglas

1. Una librería por rol: Tailwind (estilos), shadcn/ui con Base UI (comportamiento), Aceternity + `motion` (efectos de marca), Lineicons (iconos).
2. Las páginas no importan Lineicons ni Aceternity directamente: usan `components/*`.
3. Aceternity solo en superficies de marca; cada efecto se revisa (reduced motion, hidratación, paleta) antes de entrar.
4. Con `shadcn add` hay que revisar lo que instala: el valor por defecto añade `lucide-react` y un paquete `cn` ajeno (ya retirados).

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # compilación y typecheck
npx shadcn@latest add @aceternity/<nombre>   # copia un componente de Aceternity (registro ya configurado)
```
