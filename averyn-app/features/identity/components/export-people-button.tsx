"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

/** Fila ya etiquetada para el CSV (el servidor resuelve afiliación y estado en texto). */
export type ExportRow = { name: string; document: string; affiliation: string; status: string };

/** Escapa un valor para CSV entre comillas (RFC 4180). */
function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Botón «Exportar» del listado de personas: descarga las filas visibles como CSV.
 *
 * El archivo se arma en el navegador con las filas que el servidor ya filtró (respeta `?q=` y
 * `?status=`), con BOM UTF-8 para que Excel abra tildes y ñ correctamente.
 *
 * @param props - Las filas a exportar, con las etiquetas ya resueltas.
 * @returns El botón.
 */
export function ExportPeopleButton({ rows }: { rows: readonly ExportRow[] }) {
  const exportCsv = () => {
    const header = ["Nombre", "Documento", "Afiliación", "Estado"];
    const lines = [header, ...rows.map((row) => [row.name, row.document, row.affiliation, row.status])].map((cells) => cells.map(csvCell).join(","));
    const blob = new Blob([`\uFEFF${lines.join("\r\n")}\r\n`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `personas-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="ghost" onClick={exportCsv}>
      <Icon name="download" /> Exportar
    </Button>
  );
}
