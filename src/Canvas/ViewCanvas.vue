<template>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      :class="{ dark }"
      class="basicflow"
      :default-zoom="1"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />

      <Panel :position="PanelPosition.TopRight" class="controls">
        <bx-btn size="sm" title="Reset Transform" @click="resetTransform">
          <img class="canvas-logo" src="../assets/reset.svg" />
        </bx-btn>

        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="to JSON" @click="downloadJSON">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="../assets/download.svg"
          />
        </bx-btn>
      </Panel>
      <template #node-workflow="nodeProps">
        <WorkflowNode
          :data="nodeProps.data"
          :label="nodeProps.label"
          :isHidden="false"
          @changeVisibility="onChangeVisibility(nodeProps, $event.value)"
        />
      </template>
      <template #node-param="{ label }">
        <WorkflowInputNode :label="label" />
      </template>
    </VueFlow>
    <!-- v-if is necessary
      Modals need to only render once the props (clickedNode) 
      are populated, if it's rendered on start and the modal 
      is toggled with open/close then the prop data will not 
      be passed to the modal and the modal will appear empty -->
    <readWorkflowModal
      v-if="modalVisibilities.readWorkflowModal.value"
      title="Workflow Details"
      @bx-modal-closed="toggleModalVisibility('readWorkflowModal')"
      :node="clickedNode"
      open="true"
    >
    </readWorkflowModal>
    <readComponentModal
      v-if="modalVisibilities.readComponentModal.value"
      title="Component Details"
      @bx-modal-closed="toggleModalVisibility('readComponentModal')"
      :node="clickedNode"
      open="true"
    >
    </readComponentModal>
    <readEdgeModal
      v-if="modalVisibilities.readEdgeModal.value"
      title="Edge Parameters"
      @bx-modal-closed="toggleModalVisibility('readEdgeModal')"
      :edge="clickedEdge"
      open="true"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  PanelPosition,
} from "@vue-flow/additional-components";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { dagStore } from "@/Canvas/stores/dagStore";
import WorkflowInputNode from "@/Canvas/Nodes/WorkflowInputNode.vue";
import WorkflowNode from "@/Canvas/Nodes/WorkflowNode";
import readEdgeModal from "@/Canvas/Modals/edgeCRUD/readEdge.vue";
import readWorkflowModal from "@/Canvas/Modals/nodeCRUD/readWorkflow.vue";
import readComponentModal from "@/Canvas/Modals/nodeCRUD/readComponent.vue";
import { toJSON } from "@/Canvas/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/Canvas/hideExpand";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

const elements = ref(dagStore.DAG);

let clickedNode;
let clickedEdge;
let modalVisibilities = {
  readEdgeModal: ref(false),
  readComponentModal: ref(false),
  readWorkflowModal: ref(false),
};
const dark = ref(false);

const {
  onPaneReady,
  onEdgeDoubleClick,
  onConnect,
  addEdges,
  setTransform,
  onNodeDoubleClick,
  removeEdges,
  nodes,
  edges,
} = useVueFlow(elements.value);

const workflowsDims = getWorkflowsDimensions(nodes.value);
const workflowsEdges = getWorkflowsEdges(nodes.value, edges.value);
/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
onPaneReady(({ fitView }) => {
  fitView();
});

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

onNodeDoubleClick(({ node }) => {
  clickedNode = { ...node };
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowModal");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "") {
    toggleModalVisibility("readComponentModal");
  }
});

onEdgeDoubleClick(({ edge }) => {
  clickedEdge = { ...edge };
  toggleModalVisibility("readEdgeModal");
});

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges([params]));

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
const resetTransform = () => setTransform({ x: 0, y: 0, zoom: 1 });

const toggleTheme = () => (dark.value = !dark.value);

const onChangeVisibility = (node, isHidden) => {
  let result = hide(
    node,
    nodes.value,
    edges.value,
    workflowsDims,
    workflowsEdges,
    isHidden
  );
  removeEdges(result.toDelete);
};

const downloadJSON = () => {
  let nodesToDownload = elements.value.nodes;
  let entrypointNodeId = ref(
    elements.value.nodes.find((node) => node.isEntry == true).id
  );
  toJSON(nodesToDownload, entrypointNodeId);
};
</script>
<style>
.canvas-logo {
  max-height: 16px;
  max-width: 16px;
  width: 100%;
  height: 100%;
  -webkit-filter: invert(0.99);
  filter: invert(0.99);
}

bx-btn::part(button) {
  padding: calc(0.375rem - 3px) 0.5rem calc(0.375rem - 3px) 0.5rem;
  margin: 0.2rem;
}
</style>
