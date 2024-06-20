<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ this.node.label }} details</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
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
    </bx-modal-body>
  </bx-modal>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";

export default {
  props: {
    node: Object,
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css"></style>
