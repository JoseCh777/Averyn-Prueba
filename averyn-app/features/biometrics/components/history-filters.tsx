"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Field, Select } from "@/components/ui/field";

import { parseHistoryFilter } from "../biometric-rules";
import { EVENT_RESULTS, EVENT_RESULT_FILTER_LABEL, METHODS, METHOD_LABEL } from "../labels";
import type { HistoryFilter } from "../types";

type HistoryFiltersProps = {
  /** Filtros que vienen de la URL. */
  initial: HistoryFilter;
  /** Cuántos eventos se muestran y cuántos hay, para el aviso de conteo. */
  shown: number;
  total: number;
};

/**
 * Filtros del historial por método y resultado. El estado vive en la URL (`?method=…&result=…`):
 * se puede compartir y funciona con atrás/adelante; el servidor devuelve el historial ya filtrado.
 *
 * @param props - Los filtros actuales y los conteos.
 * @returns La barra de filtros.
 */
export function HistoryFilters({ initial, shown, total }: HistoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState(initial);

  /* Si la URL cambia desde fuera (p. ej. «Quitar filtros»), los selectores la siguen. */
  useEffect(() => setFilter({ method: initial.method, result: initial.result }), [initial.method, initial.result]);

  const apply = (next: HistoryFilter) => {
    setFilter(next);
    const params = new URLSearchParams();
    if (next.method !== "all") params.set("method", next.method);
    if (next.result !== "all") params.set("result", next.result);
    const search = params.toString();
    startTransition(() => router.replace(search === "" ? pathname : `${pathname}?${search}`, { scroll: false }));
  };

  return (
    <div className="av-toolbar">
      <Field label="Método" className="av-toolbar__field">
        {(a) => (
          <Select {...a} value={filter.method} onChange={(event) => apply({ ...filter, method: parseHistoryFilter({ method: event.target.value }).method })}>
            <option value="all">Todos los métodos</option>
            {METHODS.map((method) => (
              <option key={method} value={method}>
                {METHOD_LABEL[method]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Resultado" className="av-toolbar__field">
        {(a) => (
          <Select {...a} value={filter.result} onChange={(event) => apply({ ...filter, result: parseHistoryFilter({ result: event.target.value }).result })}>
            <option value="all">Todos los resultados</option>
            {EVENT_RESULTS.map((result) => (
              <option key={result} value={result}>
                {EVENT_RESULT_FILTER_LABEL[result]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <p className="av-toolbar__count" role="status">
        {shown} de {total} eventos
      </p>
    </div>
  );
}
