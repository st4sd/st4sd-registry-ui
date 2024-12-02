export function progressStepOverflowFix(stepID) {
  document
    .getElementById(stepID)
    .shadowRoot.querySelector("div")
    .querySelector("slot")
    .querySelector("p").style.overflow = "visible";
}
