<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>Edge Parameters</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
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
    </bx-modal-body>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";

export default {
  props: {
    edge: Object,
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css"></style>
