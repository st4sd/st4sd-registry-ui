<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Name</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Definition</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body>
          <bx-structured-list-row
            v-for="key in Object.keys(edge.definition)"
            :key="key"
          >
            <bx-structured-list-cell>{{ key }}</bx-structured-list-cell>
            <bx-structured-list-cell>{{
              edge.definition[key]
            }}</bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    </bx-modal-body>
  </bx-modal>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";

export default {
  props: {
    title: String,
    edge: Object,
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css"></style>
