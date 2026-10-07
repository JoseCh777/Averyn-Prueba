import { APP_MODULES } from "@/components/layout/modules";
import { Tile } from "@/components/ui/display";

import { QUICK_ACCESS, resolveQuickAccessHref } from "../quick-access";

/**
 * Mosaico de accesos rápidos a los módulos.
 *
 * Un módulo sin pantalla se muestra con la etiqueta «Próximamente» y no enlaza, en lugar
 * de llevar a un 404 (el sistema es honesto con el estado de cada módulo).
 *
 * @returns La sección con el mosaico.
 */
export function QuickAccessGrid() {
  return (
    <section aria-labelledby="quick-access-title">
      <header className="av-dashboard__head">
        <h2 id="quick-access-title">Accesos rápidos</h2>
        <p>Atajos a los módulos de la plataforma</p>
      </header>
      <ul className="av-dashboard__mosaic">
        {QUICK_ACCESS.map((access) => {
          const href = resolveQuickAccessHref(access.moduleLabel, APP_MODULES);
          return (
            <li key={access.title} className={`av-dashboard__cell av-dashboard__cell--${access.size}`}>
              <Tile
                tone={access.tone}
                icon={access.icon}
                title={access.title}
                description={access.description}
                href={href}
                tag={href === undefined ? "Próximamente" : undefined}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
