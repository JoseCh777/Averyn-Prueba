import { Icon } from "@/components/ui/icon";

import { AFFILIATION_LABEL } from "../labels";
import { fullNameOf, normalizeDocument, normalizeName, type PersonFormFields } from "../person-form";
import { avatarToneOf, formatDocument, formatIsoDate, parseAffiliation } from "../person-rules";
import { StatusChip, AffiliationTag } from "./person-badges";

/** Valor de una fila de la vista previa; «Sin registrar» (atenuado) mientras no se escriba. */
function Value({ children }: { children: string | undefined }) {
  return children === undefined || children === "" ? <span className="idn-preview__empty">Sin registrar</span> : <>{children}</>;
}

/**
 * Vista previa de la persona que se está registrando: avatar, nombre completo, afiliación, estado y
 * datos. Se actualiza mientras se escribe, para que quien registra compruebe de un vistazo que el
 * nombre quedó bien armado antes de crearla.
 *
 * Es presentación pura. Nada de lo que muestra se guarda hasta enviar el formulario.
 *
 * @param props - Lo escrito en el formulario.
 * @returns La tarjeta de vista previa.
 */
export function PersonPreview({ fields }: { fields: PersonFormFields }) {
  const name = fullNameOf(fields);
  const first = normalizeName(fields.firstName).charAt(0);
  const last = normalizeName(fields.lastName).charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  const affiliation = parseAffiliation(fields.affiliation);
  const document = normalizeDocument(fields.document);

  return (
    <aside className="idn-preview" aria-label="Vista previa de la persona">
      <p className="idn-preview__label">Vista previa</p>
      <div className="idn-preview__card">
        <span className="av-initials av-initials--lg" data-tone={avatarToneOf(name === "" ? "nueva" : name)} aria-hidden="true">
          {initials === "" ? <Icon name="person" /> : initials}
        </span>
        <p className={name === "" ? "idn-preview__name idn-preview__name--empty" : "idn-preview__name"}>{name === "" ? "Nombre de la persona" : name}</p>
        <div className="idn-preview__chips">
          {affiliation === undefined ? null : <AffiliationTag affiliation={affiliation} />}
          <StatusChip status="pending" />
        </div>
        <dl className="idn-preview__list">
          <div>
            <dt>Documento</dt>
            <dd>
              <Value>{document === "" ? undefined : formatDocument(document)}</Value>
            </dd>
          </div>
          <div>
            <dt>Afiliación</dt>
            <dd>
              <Value>{affiliation === undefined ? undefined : AFFILIATION_LABEL[affiliation]}</Value>
            </dd>
          </div>
          <div>
            <dt>Nacimiento</dt>
            <dd>
              <Value>{/^\d{4}-\d{2}-\d{2}$/u.test(fields.birthDate) ? formatIsoDate(fields.birthDate) : undefined}</Value>
            </dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>
              <Value>{fields.email.trim()}</Value>
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
