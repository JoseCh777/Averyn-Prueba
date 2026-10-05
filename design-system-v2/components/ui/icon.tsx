import type { ComponentType, SVGProps } from "react";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowRepeat,
  ArrowUp,
  Bell,
  BoxArrowRight,
  Calendar3,
  Camera,
  CameraVideo,
  CameraVideoOff,
  CheckCircle,
  CheckCircleFill,
  CheckLg,
  Check2,
  Check2Circle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  CloudArrowUp,
  Copy,
  DashCircle,
  Display,
  DoorOpen,
  ExclamationCircle,
  ExclamationTriangle,
  Eye,
  File,
  FileEarmark,
  FileEarmarkImage,
  FileEarmarkPdf,
  Fingerprint,
  Grid,
  Grid1x2,
  Inbox,
  Info,
  InfoCircle,
  JournalCheck,
  Lightbulb,
  List,
  Medium,
  Option,
  Pass,
  Pencil,
  People,
  PersonFill,
  PersonPlus,
  Plug,
  QuestionCircle,
  Search,
  ShieldLock,
  Signal,
  Stars,
  Table,
  ThreeDots,
  Trash3,
  Type,
  XCircle,
  XCircleFill,
  XLg,
} from "react-bootstrap-icons";
import { cn } from "@/lib/utils";

/* Bootstrap Icons (decisión del equipo, 5-oct-2026). Es el único punto de entrada a los iconos: se importan uno a uno
   (tree-shaking) y se llaman por el mismo nombre que en la documentación (`bi-check-circle` → name="check-circle").
   Generado por scripts/gen-icons.mjs (npm run icons). Lineicons queda como opción futura (ver ADR-011). */
const ICONS = {
  "arrow-down": ArrowDown,
  "arrow-down-up": ArrowDownUp,
  "arrow-repeat": ArrowRepeat,
  "arrow-up": ArrowUp,
  "bell": Bell,
  "box-arrow-right": BoxArrowRight,
  "calendar3": Calendar3,
  "camera": Camera,
  "camera-video": CameraVideo,
  "camera-video-off": CameraVideoOff,
  "check-circle": CheckCircle,
  "check-circle-fill": CheckCircleFill,
  "check-lg": CheckLg,
  "check2": Check2,
  "check2-circle": Check2Circle,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "circle": Circle,
  "clock": Clock,
  "cloud-arrow-up": CloudArrowUp,
  "copy": Copy,
  "dash-circle": DashCircle,
  "display": Display,
  "door-open": DoorOpen,
  "exclamation-circle": ExclamationCircle,
  "exclamation-triangle": ExclamationTriangle,
  "eye": Eye,
  "file": File,
  "file-earmark": FileEarmark,
  "file-earmark-image": FileEarmarkImage,
  "file-earmark-pdf": FileEarmarkPdf,
  "fingerprint": Fingerprint,
  "grid": Grid,
  "grid-1x2": Grid1x2,
  "inbox": Inbox,
  "info": Info,
  "info-circle": InfoCircle,
  "journal-check": JournalCheck,
  "lightbulb": Lightbulb,
  "list": List,
  "medium": Medium,
  "option": Option,
  "pass": Pass,
  "pencil": Pencil,
  "people": People,
  "person-fill": PersonFill,
  "person-plus": PersonPlus,
  "plug": Plug,
  "question-circle": QuestionCircle,
  "search": Search,
  "shield-lock": ShieldLock,
  "signal": Signal,
  "stars": Stars,
  "table": Table,
  "three-dots": ThreeDots,
  "trash3": Trash3,
  "type": Type,
  "x-circle": XCircle,
  "x-circle-fill": XCircleFill,
  "x-lg": XLg,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof ICONS;

export type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  /** Nombre accesible. Sin él, el icono es decorativo y se oculta a los lectores de pantalla. */
  label?: string;
  size?: number | string;
};

export function Icon({ name, label, size = "1em", className, ...props }: IconProps) {
  const Svg = ICONS[name];
  return (
    <Svg
      width={size}
      height={size}
      className={cn("bi shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: "false" })}
      {...props}
    />
  );
}
