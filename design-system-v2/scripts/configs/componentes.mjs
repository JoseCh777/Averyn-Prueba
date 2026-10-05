import { attr, hasClass, imp, contains, withClass, child } from "./helpers.mjs";
const D = "@/components/docs/demos";
const F = "@/components/docs/foundation-demos";
const demo = (name) => ({ jsx: `<${name} />`, imports: imp([name], D) });
const nul = { jsx: "{null}" };

export default {
  name: "ComponentesContent",
  replace: {
    "btn-load": demo("ButtonLoadDemo"),
    sw1: demo("SwitchDemo"),
    tp1: nul, tp2: nul, tp3: nul,
    tabs: demo("TabsPagerDemo"),
    modal: nul,
    "open-modal": demo("ModalDemo"),
    "dp-demo": demo("DatePickerDemo"),
    am: demo("ActionMenuDemo"),
    cb: demo("ComboboxDemo"),
    st: demo("StepperDemo"),
    po: demo("PopoverDemo"),
    ta: { jsx: '<div style={{ marginTop: "1.8rem" }}><TableDemo /></div>', imports: imp(["TableDemo"], D) },
    "otp-box": demo("OtpDemo"),
    pw: demo("PasswordDemo"),
    fv: demo("ValidationDemo"),
    ld: demo("LoadingDemo"),
    "chip-matrix": { jsx: "<ChipMatrix />", imports: imp(["ChipMatrix"], F) },
    "kpi-ver": { jsx: "<ActivityKpi />", imports: imp(["ActivityKpi"], F) },
    "act-panel": { jsx: "<ActivityPanelDemo />", imports: imp(["ActivityPanelDemo"], F) },
  },
  matchers: [
    // El div .cp-demo del bloque de carga contiene #ld: lo reemplaza LoadingDemo (que trae su propio .cp-demo).
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "ld-go") ? demo("LoadingDemo") : null),
    // Contraseña del campo de ejemplo
    (n) => (n.tagName && hasClass(n, "hz-pass") && contains(n, "f-pass") ? demo("PasswordFieldDemo") : null),
    // Barra de usuario: la fila con el avatar y la fila del menú
    (n) => (n.tagName && hasClass(n, "row") && contains(n, "av-open") ? demo("AvatarMenuDemo") : null),
    (n) => (n.tagName && hasClass(n, "row") && contains(n, "av-menu") ? nul : null),
    // Pestañas: paginación estática la reemplaza TabsPagerDemo
    (n) => (n.tagName === "div" && child(n, (c) => hasClass(c, "hz-pager")) ? nul : null),
    // Toasts
    (n) => (n.tagName && hasClass(n, "row--col") && child(n, (c) => attr(c, "data-toast")) ? demo("ToastButtons") : null),
    // Contenedores .cp-demo que envuelven demos
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "ac-multi") ? { jsx: '<div className="cp-demo"><AccordionDemo /></div>', imports: imp(["AccordionDemo"], D) } : null),
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "dr-open") ? { jsx: '<div className="cp-demo"><DrawerDemo /></div>', imports: imp(["DrawerDemo"], D) } : null),
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "cmd-open") ? { jsx: '<div className="cp-demo"><CommandDemo /></div>', imports: imp(["CommandDemo"], D) } : null),
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "sf-in") ? { jsx: '<div className="cp-demo"><SearchDemo /></div>', imports: imp(["SearchDemo"], D) } : null),
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "ms-in") ? { jsx: '<div className="cp-demo cp-demo--open" style={{ minHeight: 420 }}><MultiSelectDemo /></div>', imports: imp(["MultiSelectDemo"], D) } : null),
    (n) => (n.tagName && hasClass(n, "cp-demo") && contains(n, "up-drop") ? { jsx: '<div className="cp-demo"><UploadDemo /></div>', imports: imp(["UploadDemo"], D) } : null),
  ],
};
