"use client";

import { Alert, Chip } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Icon, type IconName } from "@/components/ui/icon";

import { AFFILIATIONS, AFFILIATION_LABEL } from "../labels";
import {
  DOCUMENT_MAX_LENGTH,
  DOCUMENT_MIN_LENGTH,
  MIN_BIRTH_DATE,
  PERSON_FORM_FIELDS,
  sectionStatus,
  type PersonFormErrors,
  type PersonFormField,
  type PersonFormFields,
  type PersonFormSection,
} from "../person-form";
import { IDENTITY_PATH } from "../routes";
import { personFieldId, type NewPersonFormController } from "../use-new-person-form";

/** Nombre de cada campo para el resumen de errores. */
const FIELD_LABEL: Record<PersonFormField, string> = {
  firstName: "Primer nombre",
  middleName: "Segundo nombre",
  lastName: "Primer apellido",
  secondLastName: "Segundo apellido",
  birthDate: "Fecha de nacimiento",
  document: "Número de documento",
  affiliation: "Afiliación",
  email: "Correo de contacto",
};

/** Marca de campo obligatorio: el asterisco es visual y el lector de pantalla lee «obligatorio». */
function Required() {
  return (
    <>
      <span className="idn-req" aria-hidden="true">
        {" "}
        *
      </span>
      <span className="sr-only"> (obligatorio)</span>
    </>
  );
}

/** Marca de campo opcional: texto atenuado junto a la etiqueta, para no repetir «Opcional» como ayuda. */
function Optional() {
  return <span className="idn-opt"> (opcional)</span>;
}

type SectionHeadProps = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  section: PersonFormSection;
  fields: PersonFormFields;
  errors: PersonFormErrors;
};

/**
 * Cabecera de una sección: icono en recuadro de tinte de señal, título, descripción y, a la derecha,
 * el avance de la sección («Faltan 2», «Revise» o «Completo»). El estado se dice con icono y palabra.
 *
 * @param props - La sección y lo escrito, para calcular su avance.
 * @returns La cabecera.
 */
function SectionHead({ id, icon, title, description, section, fields, errors }: SectionHeadProps) {
  const status = sectionStatus(section, fields, errors);
  return (
    <header className="idn-section__head">
      <span className="idn-section__icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <div className="idn-section__text">
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      {status.hasErrors ? (
        <Chip tone="error" icon="exclamation-circle">
          Revise
        </Chip>
      ) : status.missing > 0 ? (
        <Chip tone="neutral" icon="clock">
          {status.missing === 1 ? "Falta 1" : `Faltan ${status.missing}`}
        </Chip>
      ) : (
        <Chip tone="success" icon="check-circle">
          Completo
        </Chip>
      )}
    </header>
  );
}

/**
 * Formulario de alta de persona, en tres secciones: datos personales, identificación y pertenencia.
 *
 * Es presentación: el estado, la validación y el envío viven en `useNewPersonForm`. Cada campo dice su
 * error junto a sí y, tras un envío fallido, un resumen arriba lleva al campo con un clic. Los
 * autocompletados están en `off`: son datos de la persona que se da de alta, no de quien escribe.
 *
 * @param props - El controlador del formulario.
 * @returns El formulario.
 */
export function NewPersonForm({ controller }: { controller: NewPersonFormController }) {
  const { fields, errors, formError, attempted, pending, today, lastCreated, setField, blurField, focusField, submit } = controller;
  const invalid = PERSON_FORM_FIELDS.filter((field) => errors[field] !== undefined);

  const bind = (field: PersonFormField) => ({
    id: personFieldId(field),
    name: field,
    value: fields[field],
    autoComplete: "off",
    onChange: (event: { target: { value: string } }) => setField(field, event.target.value),
    // Si el foco pasa a un botón (el envío), no se valida aquí: el envío valida todo y el aviso de un
    // campo movería el botón entre el clic y el soltar.
    onBlur: (event: { relatedTarget: unknown }) => {
      if (!(event.relatedTarget instanceof HTMLButtonElement)) blurField(field);
    },
  });

  return (
    <form className="idn-form" onSubmit={(event) => void submit(event)} noValidate aria-busy={pending}>
      {attempted && (invalid.length > 0 || formError !== undefined) ? (
        <Alert tone="error" title={invalid.length > 0 ? `Revise ${invalid.length === 1 ? "1 campo" : `${invalid.length} campos`} antes de continuar` : "No se pudo crear a la persona"}>
          {formError ?? null}
          {invalid.length > 0 ? (
            <ul className="idn-summary">
              {invalid.map((field) => (
                <li key={field}>
                  <a
                    href={`#${personFieldId(field)}`}
                    onClick={(event) => {
                      event.preventDefault();
                      focusField(field);
                    }}
                  >
                    {FIELD_LABEL[field]}
                  </a>
                  : {errors[field]}
                </li>
              ))}
            </ul>
          ) : null}
        </Alert>
      ) : null}

      <section className="idn-section" aria-labelledby="idn-personal">
        <SectionHead id="idn-personal" icon="person" title="Datos personales" description="Como figuran en su documento de identidad." section="personal" fields={fields} errors={errors} />
        <div className="idn-grid">
          <Field id={personFieldId("firstName")} label={<>Primer nombre<Required /></>} error={errors.firstName}>
            {(aria) => <Input {...aria} {...bind("firstName")} aria-required="true" autoFocus />}
          </Field>
          <Field id={personFieldId("middleName")} label={<>Segundo nombre<Optional /></>} error={errors.middleName}>
            {(aria) => <Input {...aria} {...bind("middleName")} />}
          </Field>
          <Field id={personFieldId("lastName")} label={<>Primer apellido<Required /></>} error={errors.lastName}>
            {(aria) => <Input {...aria} {...bind("lastName")} aria-required="true" />}
          </Field>
          <Field id={personFieldId("secondLastName")} label={<>Segundo apellido<Optional /></>} error={errors.secondLastName}>
            {(aria) => <Input {...aria} {...bind("secondLastName")} />}
          </Field>
          <Field id={personFieldId("birthDate")} label={<>Fecha de nacimiento<Optional /></>} error={errors.birthDate}>
            {(aria) => <Input {...aria} {...bind("birthDate")} type="date" min={MIN_BIRTH_DATE} max={today === "" ? undefined : today} />}
          </Field>
        </div>
      </section>

      <section className="idn-section" aria-labelledby="idn-document">
        <SectionHead
          id="idn-document"
          icon="person-vcard"
          title="Identificación"
          description="Con este número se reconoce a la persona en todo el sistema."
          section="identification"
          fields={fields}
          errors={errors}
        />
        <div className="idn-grid">
          <Field
            id={personFieldId("document")}
            label={<>Número de documento<Required /></>}
            error={errors.document}
            help={`Solo números, de ${DOCUMENT_MIN_LENGTH} a ${DOCUMENT_MAX_LENGTH} dígitos. Puede escribirlo con puntos o guiones.`}
          >
            {(aria) => <Input {...aria} {...bind("document")} type="text" inputMode="numeric" aria-required="true" />}
          </Field>
        </div>
      </section>

      <section className="idn-section" aria-labelledby="idn-membership">
        <SectionHead
          id="idn-membership"
          icon="briefcase"
          title="Pertenencia y contacto"
          description="Su relación con la institución y cómo contactarla."
          section="membership"
          fields={fields}
          errors={errors}
        />
        <div className="idn-grid">
          <Field id={personFieldId("affiliation")} label={<>Afiliación<Required /></>} error={errors.affiliation}>
            {(aria) => (
              <Select {...aria} {...bind("affiliation")} aria-required="true">
                {AFFILIATIONS.map((affiliation) => (
                  <option key={affiliation} value={affiliation}>
                    {AFFILIATION_LABEL[affiliation]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field id={personFieldId("email")} label={<>Correo de contacto<Optional /></>} error={errors.email} help="Por ejemplo, nombre@institucion.edu.">
            {(aria) => <Input {...aria} {...bind("email")} type="email" inputMode="email" spellCheck={false} />}
          </Field>
        </div>
      </section>

      <div className="idn-actions">
        <p className="idn-actions__note">
          Los campos con <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> son obligatorios. La persona queda como <strong>Pendiente</strong> hasta que se verifique.
        </p>
        <div className="idn-actions__buttons">
          <ButtonLink href={IDENTITY_PATH}>Cancelar</ButtonLink>
          <Button variant="light" onClick={() => void submit(undefined, true)} disabled={pending}>
            <Icon name="plus-lg" /> Crear y agregar otra
          </Button>
          <Button type="submit" loading={pending}>
            {pending ? (
              "Creando…"
            ) : (
              <>
                <Icon name="check-lg" /> Crear persona
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="sr-only" role="status">
        {lastCreated === undefined ? "" : `${lastCreated} fue creada. Puede registrar otra persona.`}
      </p>
    </form>
  );
}
