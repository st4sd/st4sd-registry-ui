<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="`${this.node.label} details`"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
  >
    <cds-structured-list>
      <cds-structured-list-head>
        <cds-structured-list-header-row>
          <cds-structured-list-header-cell
            >Input name</cds-structured-list-header-cell
          >
          <cds-structured-list-header-cell
            >Definition</cds-structured-list-header-cell
          >
        </cds-structured-list-header-row>
      </cds-structured-list-head>
      <cds-structured-list-body v-if="this.node.definition != undefined">
        <cds-structured-list-row
          v-for="(inputValue, inputName) in this.node.definition"
          :key="inputName"
        >
          <cds-structured-list-cell>{{ inputName }}</cds-structured-list-cell>
          <cds-structured-list-cell v-if="inputValue != undefined">{{
            inputValue
          }}</cds-structured-list-cell>
          <cds-structured-list-cell v-else></cds-structured-list-cell>
        </cds-structured-list-row>
      </cds-structured-list-body>
    </cds-structured-list>
  </c4p-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/ibm-products-web-components/es/components/side-panel/index.js";

export default {
  props: {
    node: Object,
  },
};
</script>
