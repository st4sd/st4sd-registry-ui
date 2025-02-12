<template>
  <c4p-side-panel
    open
    size="lg"
    includeOverlay="true"
    title="Edge Parameters"
    @c4p-side-panel-closed="$emit('side-panel-closed')"
  >
    <cds-structured-list>
      <cds-structured-list-head>
        <cds-structured-list-header-row>
          <cds-structured-list-header-cell
            >Name</cds-structured-list-header-cell
          >
          <cds-structured-list-header-cell
            >Definition</cds-structured-list-header-cell
          >
        </cds-structured-list-header-row>
      </cds-structured-list-head>
      <cds-structured-list-body>
        <cds-structured-list-row
          v-for="key in Object.keys(edge.definition)"
          :key="key"
        >
          <cds-structured-list-cell>{{ key }}</cds-structured-list-cell>
          <cds-structured-list-cell
            v-if="
              edge.actualValue &&
              edge.actualValue[key] != undefined &&
              edge.actualValue[key] != ''
            "
            >{{ edge.actualValue[key] }}</cds-structured-list-cell
          >
          <cds-structured-list-cell v-else>{{
            edge.definition[key]
          }}</cds-structured-list-cell>
        </cds-structured-list-row>
      </cds-structured-list-body>
    </cds-structured-list>
  </c4p-side-panel>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/modal/index.js";

export default {
  props: {
    edge: Object,
  },
};
</script>
