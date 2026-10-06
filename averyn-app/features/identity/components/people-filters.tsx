"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Field, Select } from "@/components/ui/field";
import { SearchField } from "@/components/ui/inputs";

import { parseStatusFilter } from "../person-rules";
import type { PeopleFilter } from "../types";

/** Espera tras la última tecla antes de buscar, para no pedir datos en cada letra. */
const SEARCH_DEBOUNCE_MS = 250;

type PeopleFiltersProps = {
  /** Filtros que vienen de la URL. */
  initial: PeopleFilter;
  /** Cuántas personas se muestran y cuántas hay, para el aviso de conteo. */
  shown: number;
  total: number;
};

/**
 * Barra de filtros del listado: búsqueda por nombre o documento y filtro por estado.
 *
 * El estado vive en la URL (`?q=…&status=…`): se puede compartir y funciona con atrás/adelante.
 * Cada cambio reemplaza la URL y el servidor devuelve el listado ya filtrado.
 *
 * @param props - Los filtros actuales y los conteos.
 * @returns La barra de filtros.
 */
export function PeopleFilters({ initial, shown, total }: PeopleFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initial.query);
  const [status, setStatus] = useState(initial.status);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* Si la URL cambia desde fuera (p. ej. «Quitar filtros»), el campo la sigue. Mientras se
     escribe (hay un temporizador pendiente) no se toca: pisaría lo que la persona teclea. */
  useEffect(() => {
    if (timer.current !== undefined) return;
    setQuery((current) => (current.trim() === initial.query ? current : initial.query));
    setStatus(initial.status);
  }, [initial.query, initial.status]);

  const apply = (nextQuery: string, nextStatus: PeopleFilter["status"]) => {
    const params = new URLSearchParams();
    if (nextQuery.trim() !== "") params.set("q", nextQuery.trim());
    if (nextStatus !== "all") params.set("status", nextStatus);
    const search = params.toString();
    startTransition(() => router.replace(search === "" ? pathname : `${pathname}?${search}`, { scroll: false }));
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      apply(value, status);
    }, SEARCH_DEBOUNCE_MS);
  };

  const changeStatus = (value: string) => {
    const next = parseStatusFilter(value);
    setStatus(next);
    window.clearTimeout(timer.current);
    timer.current = undefined;
    apply(query, next);
  };

  return (
    <div className="av-toolbar">
      <div className="av-toolbar__search">
        <SearchField
          value={query}
          onChange={changeQuery}
          label="Buscar personas"
          placeholder="Nombre o documento"
          countText={`Mostrando ${shown} de ${total}`}
        />
      </div>
      <Field label="Estado" className="av-toolbar__field">
        {(a) => (
          <Select {...a} value={status} onChange={(event) => changeStatus(event.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="verified">Verificado</option>
            <option value="pending">Pendiente</option>
          </Select>
        )}
      </Field>
    </div>
  );
}
