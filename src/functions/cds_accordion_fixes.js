/*  Temporary hack for accordion-items. When adding elments to structured list in
    an accordion that used to be closed, the max-block-size would be set to a fixed size until closed and reopened. Issue on carbon board - https://github.com/carbon-design-system/carbon-for-ibm-dotcom/issues/11897.
*/
export function fixAccordionStyle(id) {
  document
    .getElementById(id)
    .shadowRoot.querySelector(
      ".cds--accordion__wrapper",
    ).style.webkitMaxLogicalHeight = "fit-content";
}
