<template>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      :class="{ dark }"
      class="basicflow"
      :delete-key-code="false"
      :default-zoom="1"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />

      <Panel :position="PanelPosition.TopRight" class="controls">
        <bx-btn
          title="Transform Experiment"
          @click="$emit('transformButtonClicked')"
        >
          Transform Experiment
        </bx-btn>
        <bx-btn
          v-if="doesOtherOrPresetsExist()"
          title="toggle inputs visibility"
          @click="showHideInputNodes"
        >
          {{ showHideButtonTitle }}
        </bx-btn>
        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Download as JSON"
          @click="downloadExperimentFiles"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/download.svg"
          />
        </bx-btn>
      </Panel>
      <template #node-component="{ label }">
        <ComponentNode :label="label" />
      </template>
      <template #node-workflow="nodeProps">
        <WorkflowNode
          :data="nodeProps.data"
          :label="nodeProps.label"
          :isHidden="false"
          @changeVisibility="onChangeVisibility(nodeProps, $event.value)"
        />
      </template>
      <template #node-workflow-input="{ label }">
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
      :inputingEdges="inputingEdges"
      open="true"
    />
    <readComponentModal
      v-if="modalVisibilities.readComponentModal.value"
      title="Component Details"
      @bx-modal-closed="toggleModalVisibility('readComponentModal')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    />
    <readExperimentInputsModal
      v-if="modalVisibilities.readExperimentInputsModal.value"
      @bx-modal-closed="toggleModalVisibility('readExperimentInputsModal')"
      :node="clickedNode"
      open="true"
    />
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
import { canvasStore } from "@/canvas/stores/canvasStore";
//Node types
import WorkflowInputNode from "@/canvas/components/node_types/WorkflowInputNode.vue";
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode";
//Modals
import readEdgeModal from "@/canvas/components/modals/edges/readEdgeModal.vue";
import readWorkflowModal from "@/canvas/components/modals/st4sd_workflows/readWorkflowModal.vue";
import readComponentModal from "@/canvas/components/modals/st4sd_components/readComponentModal.vue";
import readExperimentInputsModal from "@/canvas/components/modals/experiment/readExperimentInputsModal.vue";
//Functions
import { downloadExperiment } from "@/canvas/functions/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/canvas/functions/hideExpand";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

const elements = ref(canvasStore.DAG);

let clickedNode;
let clickedEdge;
let inputingEdges;
let modalVisibilities = {
  readEdgeModal: ref(false),
  readComponentModal: ref(false),
  readWorkflowModal: ref(false),
  readExperimentInputsModal: ref(false),
};
const dark = ref(false);

const {
  onPaneReady,
  onEdgeDoubleClick,
  onConnect,
  addEdges,
  onNodeDoubleClick,
  removeEdges,
  nodes,
  edges,
} = useVueFlow(elements.value);

const doesOtherOrPresetsExist = () => {
  return nodes.value.some((node) => node.id == "other" || node.id == "presets");
};

let showHideButtonTitle = ref("Show all inputs");
let inputNodesVisability = ref(false);
const showHideInputNodes = () => {
  inputNodesVisability.value = !inputNodesVisability.value;
  let Other = nodes.value.find((a) => a.id == "other");
  if (Other != undefined) {
    Other.hidden = !inputNodesVisability.value;
  }
  let Presets = nodes.value.find((a) => a.id == "presets");
  if (Presets != undefined) {
    Presets.hidden = !inputNodesVisability.value;
  }
  showHideButtonTitle.value =
    showHideButtonTitle.value == "Hide presets & other"
      ? "Show all inputs"
      : "Hide presets & other";
};

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
  inputingEdges = edges.value.filter((n) => n.target == node.id);
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowModal");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentModal");
  } else if (node.type == "input") {
    toggleModalVisibility("readExperimentInputsModal");
  }
});

onEdgeDoubleClick(({ edge }) => {
  clickedEdge = { ...edge };
  toggleModalVisibility("readEdgeModal");
});

/**
 * onConnect is called when a new connection/edge is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges([params]));

const toggleTheme = () => (dark.value = !dark.value);

const onChangeVisibility = (node, isHidden) => {
  let result = hide(
    node,
    nodes.value,
    edges.value,
    workflowsDims,
    workflowsEdges,
    isHidden,
  );
  removeEdges(result.toDelete);
};

const downloadExperimentFiles = () => {
  downloadExperiment(nodes.value, edges.value, "experiment");
};
</script>
<style lang="scss">
@import "@/canvas/styles/main.scss";
bx-btn::part(button) {
  padding: calc(0.375rem - 3px) 0.5rem calc(0.375rem - 3px) 0.5rem;
  margin: 0.2rem;
}
</style>
