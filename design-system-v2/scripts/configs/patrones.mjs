import { attr, child, hasClass, imp, byClass } from "./helpers.mjs";

export default {
  name: "PatronesContent",
  replace: {
    face: { jsx: "<FaceCapture />", imports: imp(["FaceCapture"]) },
    fp: { jsx: "<FingerprintCapture />", imports: imp(["FingerprintCapture"]) },
    vr: { jsx: "<VerificationResult />", imports: imp(["VerificationResult"]) },
    rv: { jsx: "<ManualReview />", imports: imp(["ManualReview"]) },
    ballot: { jsx: "<Ballot />", imports: imp(["Ballot"]) },
    devs: { jsx: "<DeviceList />", imports: imp(["DeviceList"]) },
  },
  matchers: [
    byClass("pt-ocr", "<DocumentCapture />", ["DocumentCapture"]),
    byClass("pt-cons", "<BiometricConsent />", ["BiometricConsent"]),
    (n) => (n.tagName && hasClass(n, "stage") && child(n, (c) => attr(c, "id") === "hero-demo") ? { jsx: "<HeroStage />", imports: imp(["HeroStage"]) } : null),
    (n) => (n.tagName && hasClass(n, "stage") && child(n, (c) => attr(c, "id") === "hd-range") ? { jsx: "<HeroSlider />", imports: imp(["HeroSlider"]) } : null),
  ],
};
