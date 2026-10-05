import Cover from "./inicio/cover";
import Content from "./inicio/content";

export const metadata = { title: "Design System Horizonte 2.0 · Averyn" };

export default function Page() {
  return (
    <>
      <Cover />
      <main id="contenido"><Content /></main>
    </>
  );
}
