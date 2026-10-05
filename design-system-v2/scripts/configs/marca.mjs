import { imp, byClass } from "./helpers.mjs";
const M = "@/components/docs/marca-demos";

export default {
  name: "MarcaContent",
  replace: {
    "ill-grid": { jsx: "<IllustrationGrid />", imports: imp(["IllustrationGrid"], M) },
    "ill-empties": { jsx: "<EmptyStateExamples />", imports: imp(["EmptyStateExamples"], M) },
    "emails-data": { jsx: "{null}" },
  },
  matchers: [
    byClass("mail", "<MailPreview />", ["MailPreview"], M),
    byClass("pr-stage", "<PrintPreview />", ["PrintPreview"], M),
  ],
};
