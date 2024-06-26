<template>
  <!-- Error Notification -->
  <div id="toast-notification-container">
    <bx-toast-notification
      v-for="(notification, notifIdx) in toastNotifications"
      :key="notifIdx"
      timeout="5000"
      :kind="notification.kind"
      :title="notification.title"
      :subtitle="notification.subtitle"
      :caption="notification.caption"
    />
  </div>
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
          v-if="!registryUISharedState.isGlobalRegistry"
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
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/brightness-contrast.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Download DSL" @click="downloadExperimentFiles">
          <img
            class="white-svg"
            width="16"
            height="16"
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
    <readWorkflowSidePanel
      v-if="modalVisibilities.readWorkflowSidePanel.value"
      title="Workflow Details"
      @closeSidePanel="toggleModalVisibility('readWorkflowSidePanel')"
      :node="clickedNode"
      :inputingEdges="inputingEdges"
      open="true"
    />
    <readComponentSidePanel
      v-if="modalVisibilities.readComponentSidePanel.value"
      title="Component Details"
      @closeSidePanel="toggleModalVisibility('readComponentSidePanel')"
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
    <readEdgeSidePanel
      v-if="modalVisibilities.readEdgeSidePanel.value"
      @closeSidePanel="toggleModalVisibility('readEdgeSidePanel')"
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
import readExperimentInputsModal from "@/canvas/components/modals/experiment/readExperimentInputsModal.vue";
//Functions
import { downloadExperiment } from "@/canvas/functions/downloadJSON";
import {
  getWorkflowsDimensions,
  getWorkflowsEdges,
  hide,
} from "@/canvas/functions/hideExpand";

import "@carbon/web-components/es/components/notification/index.js";

import { registryUISharedState } from "@/stores/registryUISharedState";

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
  readExperimentInputsModal: ref(false),
};
const dark = ref(false);
let toastNotifications = ref([]);

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

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
    toggleModalVisibility("readWorkflowSidePanel");
    //node type to change to component instead of empty string
    //there is an issue to track this
    //https://github.ibm.com/st4sd/overview/issues/517
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentSidePanel");
  } else if (node.type == "input") {
    toggleModalVisibility("readExperimentInputsModal");
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
</script>
<style lang="scss">
@import "@/canvas/styles/main.scss";
@import "@/styles/svg.scss";
@import "@/styles/toast-notification-styles.scss";
bx-btn::part(button) {
  padding: calc(0.375rem - 3px) 0.5rem calc(0.375rem - 3px) 0.5rem;
  margin: 0.2rem;
}
</style>
