<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <!-- Error Notification -->
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="(notification, notifIdx) in toastNotifications"
      :key="notifIdx"
      timeout="5000"
      :kind="notification.kind"
      :title="notification.title"
      :subtitle="notification.subtitle"
      :caption="notification.caption"
      lowContrast
    />
  </div>
  <!--  https://vueflow.dev/examples/dnd.html -->
  <div class="dndflow">
    <VueFlow
      id="vue-flow-view-canvas"
      :nodes="elements.nodes"
      :edges="elements.edges"
      :class="{ dark }"
      class="basicflow"
      :delete-key-code="false"
      :default-zoom="1"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
      elevate-edges-on-select
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls>
        <cds-button
          class="controls-extra-button"
          size="md"
          style="padding-left: 4px"
          title="Auto align nodes"
          @click="alignNodes()"
          :disabled="!nodes.some((node) => node.type != 'input')"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/align--horizontal-center.svg"
          />
        </cds-button>
      </Controls>

      <Panel :position="PanelPosition.TopRight" class="controls">
        <cds-button
          size="md"
          v-if="!registryUISharedState.isGlobalRegistry"
          title="Transform Experiment"
          @click="$emit('transform-button-clicked')"
        >
          Transform Experiment
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/network--3--reference.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          v-if="doesOtherOrPresetsExist()"
          title="toggle inputs visibility"
          @click="showHideInputNodes"
        >
          {{ showHideButtonTitle }}
          <img
            v-if="!inputNodesVisibility"
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/upstream.svg"
          />
          <img
            v-else
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/view--off.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          @click="toggleTheme"
          title="Toggle light/dark mode"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/brightness-contrast.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          title="Download DSL"
          @click="downloadExperimentFiles"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/download.svg"
          />
        </cds-button>
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
    <readWorkflowSidePanel
      v-if="modalVisibilities.readWorkflowSidePanel.value"
      title="Workflow Details"
      @side-panel-closed="toggleModalVisibility('readWorkflowSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    />
    <readComponentSidePanel
      v-if="modalVisibilities.readComponentSidePanel.value"
      title="Component Details"
      @side-panel-closed="toggleModalVisibility('readComponentSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    />
    <readExperimentInputsSidePanel
      v-if="modalVisibilities.readExperimentInputsSidePanel.value"
      @side-panel-closed="
        toggleModalVisibility('readExperimentInputsSidePanel')
      "
      :node="clickedNode"
      open="true"
    />
    <readEdgeSidePanel
      v-if="modalVisibilities.readEdgeSidePanel.value"
      @side-panel-closed="toggleModalVisibility('readEdgeSidePanel')"
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
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode.vue";
//Modals
import readEdgeSidePanel from "@/canvas/components/sidePanels/edges/readEdgeSidePanel.vue";
import readWorkflowSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/readWorkflowSidePanel.vue";
import readComponentSidePanel from "@/canvas/components/sidePanels/st4sd_components/readComponentSidePanel.vue";
import readExperimentInputsSidePanel from "@/canvas/components/sidePanels/experiment/readExperimentInputsSidePanel.vue";
//Functions
import { downloadExperiment } from "@/canvas/functions/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/canvas/functions/hideExpand";
import { autoAlignNodes } from "@/canvas/functions/autoAlignNodes";

import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/button/index.js";

import { registryUISharedState } from "@/stores/registryUISharedState";
import { nextTick } from "process";

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */

const elements = ref(canvasStore.DAG);

let clickedNode;
let clickedEdge;
let inputingEdges;
let modalVisibilities = {
  readEdgeSidePanel: ref(false),
  readComponentSidePanel: ref(false),
  readWorkflowSidePanel: ref(false),
  readExperimentInputsSidePanel: ref(false),
};
const dark = ref(false);
let toastNotifications = ref([]);

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["transform-button-clicked"]);

const {
  onInit,
  onEdgeDoubleClick,
  onConnect,
  addNodes,
  addEdges,
  onNodeDoubleClick,
  removeEdges,
  fitView,
  getIntersectingNodes,
  getConnectedEdges,
  nodes,
  edges,
} = useVueFlow("vue-flow-view-canvas");

const doesOtherOrPresetsExist = () => {
  return nodes.value.some((node) => node.id == "other" || node.id == "presets");
};

let showHideButtonTitle = ref("Show all inputs");
let inputNodesVisibility = ref(false);
const showHideInputNodes = () => {
  inputNodesVisibility.value = !inputNodesVisibility.value;
  let Other = nodes.value.find((a) => a.id == "other");
  if (Other != undefined) {
    Other.hidden = !inputNodesVisibility.value;
  }
  let Presets = nodes.value.find((a) => a.id == "presets");
  if (Presets != undefined) {
    Presets.hidden = !inputNodesVisibility.value;
  }
  showHideButtonTitle.value =
    showHideButtonTitle.value == "Hide presets & other"
      ? "Show all inputs"
      : "Hide presets & other";
};

const workflowsDims = getWorkflowsDimensions(nodes.value);
const workflowsEdges = getWorkflowsEdges(nodes.value, edges.value);

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

onNodeDoubleClick(({ node }) => {
  clickedNode = { ...node };
  inputingEdges = edges.value.filter((n) => n.target == node.id);
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowSidePanel");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentSidePanel");
  } else if (node.type == "input") {
    toggleModalVisibility("readExperimentInputsSidePanel");
  }
});

onEdgeDoubleClick(({ edge }) => {
  clickedEdge = { ...edge };
  toggleModalVisibility("readEdgeSidePanel");
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
  try {
    downloadExperiment(nodes.value, edges.value, props.id + "-dsl");
  } catch (error) {
    let dslDownloadError = {
      kind: "error",
      title: "Unable to download DSL file",
      subtitle: "",
      caption: error.message,
    };
    toastNotifications.value.push(dslDownloadError);
  }
};

function alignNodes() {
  autoAlignNodes(
    nodes.value,
    edges.value,
    getIntersectingNodes,
    getConnectedEdges,
  ).then(({ newNodes, newEdges }) => {
    edges.value = [];
    nodes.value = [];
    /*
      AP (25/09/24):
      We're adding a delay of 5ms due to this issue:
      https://github.ibm.com/st4sd/st4sd-registry-ui/issues/811
    */
    setTimeout(() => {
      addNodes(newNodes);
      addEdges(newEdges);
      nextTick(() => fitView());
    }, 5);
  });
}
</script>
<style scoped lang="scss">
@use "@/canvas/styles/main.scss";
@use "@/styles/svg.scss";
@use "@/styles/toast-notification-styles.scss";

cds-button {
  padding: 0 3px 0 3px;
}
</style>
