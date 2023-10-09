<template>
  <bx-modal class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ this.node.label }} details</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell
              >Input name</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >Definition</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <bx-structured-list-body v-if="this.node.definition != undefined">
          <bx-structured-list-row
            v-for="(inputValue, inputName) in this.node.definition"
            :key="inputName"
          >
            <bx-structured-list-cell>{{ inputName }}</bx-structured-list-cell>
            <bx-structured-list-cell v-if="inputValue != undefined">{{
              inputValue
            }}</bx-structured-list-cell>
            <bx-structured-list-cell v-else></bx-structured-list-cell>
          </bx-structured-list-row>
        </bx-structured-list-body>
      </bx-structured-list>
    </bx-modal-body>
  </bx-modal>
</template>

<script>
export default {
  props: {
    node: Object,
  },
};
</script>
<style lang="css" scoped src="@/styles/bx-modal-styles.css"></style>
