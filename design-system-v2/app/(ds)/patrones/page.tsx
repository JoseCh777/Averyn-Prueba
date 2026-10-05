import { DocPage } from "@/components/docs/doc-page";
import Content from "./content";

export const metadata = { title: "Patrones · Horizonte 2.0" };

export default function Page() {
  return <DocPage slug="patrones"><Content /></DocPage>;
}
