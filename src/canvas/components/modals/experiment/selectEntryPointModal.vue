<template>
  <bx-modal open>
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading data-modal-primary-focus
        >Select Entrypoint</bx-modal-heading
      >
    </bx-modal-header>
    <bx-modal-body>
      <template v-if="Object.keys(entryPointSelectionNodes).length > 0">
        <bx-radio-button-group
          name="entryPointOptions"
          orientation="vertical"
          :value="selectedNodeId"
          @bx-radio-button-group-changed="selectedNodeId = $event.detail.value"
        >
          <template v-for="(node, i) in entryPointSelectionNodes" :key="i">
            <bx-radio-button
              :label-text="node.label + ' (' + node.id + ')'"
              :value="node.id"
            ></bx-radio-button>
          </template>
        </bx-radio-button-group>
      </template>
      <template v-else>
        <br />
        <h5>Please drop nodes into the canvas before making a selection</h5>
      </template>
    </bx-modal-body>
    <bx-modal-footer>
      <bx-modal-footer-button kind="secondary" data-modal-close
        >Cancel</bx-modal-footer-button
      >
      <bx-modal-footer-button kind="primary" type="submit" @click="update"
        >Save changes</bx-modal-footer-button
      >
    </bx-modal-footer>
  </bx-modal>
</template>

<script>
export default {
  props: {
    allNodes: Object,
  },
  emits: ["update"],
  data() {
    return {
      entryPointSelectionNodes: {},
      selectedNodeId: "",
    };
  },
  mounted() {
    this.entryPointSelectionNodes = this.allNodes.filter(
      (node) => node.type == "workflow",
    );
    let entryNode = this.allNodes.find((node) => node.isEntry == true);
    if (entryNode != undefined) {
      console.log(entryNode);
      this.selectedNodeId = entryNode.id;
    }
  },
  methods: {
    update() {
      this.entryPointSelectionNodes.forEach((node) => {
        node.isEntry = false;
      });
      let entryNode = this.allNodes.find(
        (node) => node.id == this.selectedNodeId,
      );
      if (entryNode != undefined) {
        entryNode.isEntry = true;
      }
      this.$emit("update");
    },
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/delete-button-icon-inside-cell-style.css";
@import "@/styles/bx-structured-list-styles.css";
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
