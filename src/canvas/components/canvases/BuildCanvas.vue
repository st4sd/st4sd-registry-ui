<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow
      :class="{ dark }"
      :default-zoom="1"
      :elevate-edges-on-select="true"
      :delete-key-code="false"
      :min-zoom="0.2"
      :max-zoom="4"
      class="basicflow"
      fit-view-on-init
      @dragover="onDragOver"
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />
      <Panel :position="PanelPosition.TopRight" class="controls">
        <bx-btn
          title="Configure Experiment"
          @click="toggleModalVisibility('selectEntryPointModal')"
          kind="primary"
          :disabled="
            allNodes.filter((node) => node.type == 'workflow').length < 1
          "
        >
          Select Entrypoint
        </bx-btn>
        <bx-btn
          size="sm"
          title="Add Workflow"
          @click="toggleModalVisibility('createWorkflowModal')"
        >
          + Add workflow
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
          :title="
            allNodes.find((node) => node.isEntry == true) == undefined
              ? 'Select an entrypoint to download the DSL'
              : 'Download DSL'
          "
          @click="downloadExperimentFiles"
          :disabled="allNodes.find((node) => node.isEntry == true) == undefined"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/download.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Save canvas project" @click="saveGraph">
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/save.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Load canvas from file"
          @click="toggleModalVisibility('fileUploadModal')"
        >
          <img
            class="canvas-logo"
            width="16"
            heigth="16"
            src="@/assets/upload.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Register experiment"
          @click="toggleModalVisibility('registerExperimentModal')"
          kind="secondary"
          :disabled="allNodes.find((node) => node.isEntry == true) == undefined"
        >
          Register Experiment
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
    <BlocksLibrary
      @updateLibraryError="updateLibraryError"
      @libraryLoaded="setupCanvas"
    />
    <!-- Error Notification -->
    <div id="toast-notification-container">
      <bx-toast-notification
        v-for="(notification, notifIdx) in toastNotifications"
        :key="notifIdx"
        timeout="10000"
        :kind="notification.kind"
        :title="notification.title"
        :subtitle="notification.subtitle"
        :caption="notification.caption"
      />
    </div>
    <!-- CRUD operations -->
    <createWorkflowModal
      v-if="modalVisibilities.createWorkflowModal.value"
      @added="addWorkflow"
      @bx-modal-closed="toggleModalVisibility('createWorkflowModal')"
    />
    <updateWorkflowModal
      v-if="modalVisibilities.updateWorkflowModal.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :parentNode="parentNode"
      @bx-modal-closed="toggleModalVisibility('updateWorkflowModal')"
      @update="nodeUpdated"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @stepDeleted="removeConnectingEdges"
    />
    <updateComponentModal
      v-if="modalVisibilities.updateComponentModal.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :parentNode="parentNode"
      @bx-modal-closed="toggleModalVisibility('updateComponentModal')"
      @updated="nodeUpdated"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
    />
    <createEdgeModal
      v-if="modalVisibilities.createEdgeModal.value"
      :edgeProp="newEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @bx-modal-closed="toggleModalVisibility('createEdgeModal')"
      @created="addEdge"
    />
    <updateEdgeModal
      v-if="modalVisibilities.updateEdgeModal.value"
      :edgeProp="selectedEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @bx-modal-closed="toggleModalVisibility('updateEdgeModal')"
      @update="toggleModalVisibility('updateEdgeModal')"
      @delete="openDeleteModal"
    />
    <deleteModal
      v-if="modalVisibilities.deleteModal.value"
      :nodeType="nodeType"
      @delete="deleteNode"
      @bx-modal-closed="toggleModalVisibility('deleteModal')"
    />
    <!-- Nesting -->
    <nestNodeModal
      v-if="modalVisibilities.nestingModal.value"
      :toBeNestedNode="nestingNode"
      :nestingWorkflows="nestingWFs"
      :allNodes="allNodes"
      @bx-modal-closed="toggleModalVisibility('nestingModal')"
      @done="addStep"
    />
    <!-- Experiment configuration -->
    <selectEntryPointModal
      v-if="modalVisibilities.selectEntryPointModal.value"
      :allNodes="allNodes"
      @bx-modal-closed="toggleModalVisibility('selectEntryPointModal')"
      @update="toggleModalVisibility('selectEntryPointModal')"
    />
    <fileUploadModal
      @upload="displayUploadedElements"
      v-if="modalVisibilities.fileUploadModal.value"
      @bx-modal-closed="toggleModalVisibility('fileUploadModal')"
      title="Upload Files"
      open="true"
    />
    <registerExperiment
      v-if="modalVisibilities.registerExperimentModal.value"
      @bx-modal-closed="toggleModalVisibility('registerExperimentModal')"
      open="true"
      :name="props.pvep"
      :allNodes="allNodes"
      :allEdges="allEdges"
    />
  </div>
</template>

<script setup>
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";

import { nextTick, watch } from "vue";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  PanelPosition,
} from "@vue-flow/additional-components";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BlocksLibrary from "@/canvas/components/BlocksLibrary";
//Modals
import createEdgeModal from "@/canvas/components/modals/edges/createEdgeModal.vue";
import updateEdgeModal from "@/canvas/components/modals/edges/updateEdgeModal.vue";
import createWorkflowModal from "@/canvas/components/modals/st4sd_workflows/createWorkflowModal.vue";
import updateWorkflowModal from "@/canvas/components/modals/st4sd_workflows/updateWorkflowModal.vue";
import nestNodeModal from "@/canvas/components/modals/st4sd_workflows/nestNodeModal";
import updateComponentModal from "@/canvas/components/modals/st4sd_components/updateComponentModal.vue";
import selectEntryPointModal from "@/canvas/components/modals/experiment/selectEntryPointModal.vue";
import deleteModal from "@/canvas/components/modals/delete_modal/deleteModal.vue";
import fileUploadModal from "@/canvas/components/modals/experiment/fileUploadModal.vue";
import registerExperiment from "@/canvas/components/modals/experiment/registerExperiment.vue";

//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

//Node types
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode";
import WorkflowInputNode from "@/canvas/components/node_types/WorkflowInputNode.vue";

//Functions
import { downloadExperiment, download } from "@/canvas/functions/downloadJSON";
import { hide, getWorkflowsEdges } from "@/canvas/functions/hideExpand";
import {
  addWorkflowNode,
  addWorkflowNodesToCanvas,
  isConnectionValid,
  setUpCanvas,
} from "@/canvas/functions/canvasFunctions";
import {
  isNestingValid,
  removeStep,
  removeNodeAndStepReference,
} from "@/canvas/functions/stepFunctions";

import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import { updateNodeLabel } from "@/canvas/functions/updateNodeLabel";
import axios from "axios";
import { getEntryWorkflowBlock } from "@/canvas/functions/getEntryWorkflowBlock";

import { getDeploymentEndpoint } from "@/functions/public_path";

const props = defineProps({
  pvep: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "updateLoading",
  "updateLibraryError",
  "updateGraphError",
]);
const localPVEP = ref();
let elements = {};

const {
  onNodeDragStop,
  onConnect,
  addEdges,
  addNodes,
  onEdgeDoubleClick,
  onNodeDoubleClick,
  removeEdges,
  removeNodes,
  findNode,
  project,
  vueFlowRef,
  nodes,
  edges,
} = useVueFlow(elements);

async function getGraph() {
  let graphData;

  await axios
    .get(`${getDeploymentEndpoint()}registry-ui/backend/canvas/${props.pvep}`)
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }

      nodes.value = [];
      edges.value = [];
      const uploadedGraph = getEntryWorkflowBlock(graphData);
      //Change ID system and add workflow dimensions
      addWorkflowNodesToCanvas(
        uploadedGraph,
        workflowDimensions,
        getId,
        addNodes,
        addEdges,
      );
    })
    .catch((error) => {
      emit("updateGraphError", error);
    })
    .finally(() => {
      emit("updateLoading", false);
    });
}

//The 405 error code is being used to deny access to functionalities
//If the backend returns 405 then that functionality has not been enabled by the administrator.

let is405 = false;

function updateLibraryError(error) {
  emit("updateLibraryError", error);
  if (error.response.status == 405) {
    is405 = true;
  }
}

function setupCanvas() {
  if (is405) {
    emit("updateLoading", false);
    return;
  }

  if (props.pvep != "") {
    localPVEP.value = { ...props.pvep };
    getGraph();
  } else {
    elements.elevateEdgesOnSelect = true;
    emit("updateLoading", false);
  }
}

setUpCanvas(elements);

let allNodes = nodes;
let allEdges = edges;
let workflowDimensions = {};
let id = ref(0);
const getId = () => `dndnode_${id.value++}`;
const onDragOver = (event) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};
let modalVisibilities = {
  createWorkflowModal: ref(false),
  createEdgeModal: ref(false),
  updateEdgeModal: ref(false),
  updateWorkflowModal: ref(false),
  updateComponentModal: ref(false),
  selectEntryPointModal: ref(false),
  nestingModal: ref(false),
  stepExecuteModal: ref(false),
  deleteModal: ref(false),
  fileUploadModal: ref(false),
  registerExperimentModal: ref(false),
};

let toastNotifications = ref([]);
const displayUploadedElements = async (files) => {
  if (files.length == 2) {
    let dslFileContents = await readFile(files[0]);
    if (files[1] != null) {
      localPVEP.value = await readFile(files[1]);
    }
    nodes.value = [];
    edges.value = [];
    const uploadedGraph = getEntryWorkflowBlock(dslFileContents);
    //Change ID system and add workflow dimensions
    if (uploadedGraph != undefined) {
      addWorkflowNodesToCanvas(
        uploadedGraph,
        workflowDimensions,
        getId,
        addNodes,
        addEdges,
      );
    } else {
      let dslFileUploadError = {
        kind: "error",
        title: "Unable to load DSL files",
        subtitle: "The uploaded file is not in the expected format.",
        caption: "Did you choose the correct file type?",
      };
      toastNotifications.value.push(dslFileUploadError);
    }
    addNodes(uploadedGraph.nodes);
    addEdges(uploadedGraph.edges);

    toggleModalVisibility("fileUploadModal");
  } else {
    let graphFileContents = await readFile(files);
    if (graphFileContents.nodes) {
      addNodes(graphFileContents.nodes);
      addEdges(graphFileContents.edges);
    } else {
      let canvasProjectFileUploadError = {
        kind: "error",
        title: "Unable to load project files",
        subtitle: "The uploaded file is not in the expected format.",
        caption: "Did you choose the correct file type?",
      };
      toastNotifications.value.push(canvasProjectFileUploadError);
    }
    toggleModalVisibility("fileUploadModal");
  }
};

function readFile(file) {
  return new Promise((resolve, reject) => {
    try {
      var fileReader = new FileReader();
      fileReader.onload = (f) => {
        const contents = JSON.parse(f.target.result);
        resolve(contents);
      };
      fileReader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

const onDrop = (event) => {
  //copy the element so we do not change the source
  const newNode = JSON.parse(JSON.stringify(canvasStore.node));
  const { left, top } = vueFlowRef.value.getBoundingClientRect();

  newNode.position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  });
  let id;
  if (newNode.type == "workflow") {
    // In a workflow newNode is used to generate the whole workflow and thus
    // newNode itself will not be used in the workflow and will be replaced with
    // the workflow's entry point node, so we manually return the new id to be used
    // in the nextTick() function
    id = addWorkflowNodesToCanvas(
      newNode,
      workflowDimensions,
      getId,
      addNodes,
      addEdges,
    );
  } else {
    newNode.id = getId();
    id = newNode.id;
    addNodes([newNode]);
  }

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(id);
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          //For workflows we want the mouse to be in the top centre
          if (node.type == "workflow") {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 6,
            };
          } else {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 2,
            };
          }

          stop();
        }
      },
      { deep: true, flush: "post" },
    );
  });
};

const addWorkflow = (workflow, input) => {
  addWorkflowNode(workflow, input, workflowDimensions, getId, addNodes);
  toggleModalVisibility("createWorkflowModal");
};

let nestingNode = {};
let nestingWFs = [];
onNodeDragStop((event) => {
  let { isNesting, nestingWorkflows } = isNestingValid(
    event.node,
    event.intersections,
    nodes.value,
  );
  if (isNesting) {
    nestingNode = { ...event.node };
    nestingWFs = nestingWorkflows;
    toggleModalVisibility("nestingModal");
  }
});

let newEdge;
onConnect((edgeInProgress) => {
  newEdge = edgeInProgress;
  let existingEdge = edges.value.find(
    (edge) =>
      edge.source == edgeInProgress.source &&
      edge.target == edgeInProgress.target,
  );
  if (existingEdge != undefined) {
    selectedEdge = existingEdge;
    nodeType = "connection";
    toggleModalVisibility("updateEdgeModal");
  } else if (isConnectionValid(newEdge, findNode)) {
    toggleModalVisibility("createEdgeModal");
  }
});

let nodeType;
let selectedEdge;
onEdgeDoubleClick(({ edge }) => {
  selectedEdge = edge;
  nodeType = "connection";
  toggleModalVisibility("updateEdgeModal");
});

const addEdge = (newEdge) => {
  if (Object.keys(newEdge.definition).length > 0) {
    addEdges([newEdge]);
  }
  toggleModalVisibility("createEdgeModal");
};

const dark = ref(false);

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
//const resetTransform = () => setTransform({ x: 0, y: 0, zoom: 1 });

const toggleTheme = () => (dark.value = !dark.value);

//NODE - COMPONENT
let selectedNode;
let parentNode;

onNodeDoubleClick(({ node }) => {
  selectedNode = node;
  parentNode = findNode(node.parentNode);
  if (node.type == "component") {
    nodeType = "component";
    toggleModalVisibility("updateComponentModal");
  } else {
    if (node.type == "workflow-input") {
      selectedNode = findNode(node.parentNode);
      parentNode = findNode(selectedNode.parentNode);
    }
    nodeType = "workflow";
    toggleModalVisibility("updateWorkflowModal");
  }
});

const nodeUpdated = () => {
  if (selectedNode.type == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else {
    toggleModalVisibility("updateComponentModal");
  }
};

const openDeleteModal = () => {
  toggleModalVisibility("deleteModal");
  //close update modals
  if (nodeType == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else if (nodeType == "component") {
    toggleModalVisibility("updateComponentModal");
  } else if (nodeType == "connection") {
    toggleModalVisibility("updateEdgeModal");
  }
};

const deleteNode = () => {
  if (nodeType == "connection") {
    removeEdges([selectedEdge]);
  } else {
    removeNodeAndStepReference(selectedNode, findNode, removeNodes);
  }
  toggleModalVisibility("deleteModal");
};

const removeParentNode = () => {
  selectedNode.parentNode = undefined;
  selectedNode.expandParent = false;
  //Remove it as a step from parent WF
  removeStep(parentNode, selectedNode);
  //We call this function after removeStep as removeStep deletes the stepId and then
  //updateNodeLabel tests if the stepId exists or not
  updateNodeLabel(selectedNode);
  removeConnectingEdges(selectedNode);
  if (nodeType == "workflow") {
    toggleModalVisibility("updateWorkflowModal");
  } else if (nodeType == "component") {
    toggleModalVisibility("updateComponentModal");
  }
};

const removeConnectingEdges = (node) => {
  const connectingEdges = edges.value.filter(
    (edge) => edge.source == node.id || edge.target == node.id,
  );
  //remove edges that have any child of the node as source//
  removeEdges(connectingEdges);
};

const downloadExperimentFiles = () => {
  // this should never be undefined at this stage but better to be safe
  let entrypoint = nodes.value.find((node) => node.isEntry == true);
  let dslFileName = entrypoint == undefined ? "experiment" : entrypoint.label;
  try {
    downloadExperiment(nodes.value, edges.value, dslFileName + "-dsl");
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

const saveGraph = () => {
  let d = new Date();
  download(`build-canvas-${d.toISOString()}.json`, {
    nodes: nodes._object.nodes,
    edges: edges._object.edges,
  });
};

const onChangeVisibility = (node, isHidden) => {
  let result = hide(
    node,
    nodes.value,
    edges.value,
    workflowDimensions,
    getWorkflowsEdges(nodes.value, edges.value),
    isHidden,
  );
  removeEdges(result.toDelete);
};

const addStep = () => {
  toggleModalVisibility("nestingModal");
};

onMounted(() => {
  const route = useRoute();
  if (route.query.registrationCancelled == "true") {
    let graph = canvasStore.graph;
    addNodes(graph.nodes);
    addEdges(graph.edges);
    canvasStore.clearGraph();
  }
});
</script>

<style lang="scss" src="@/canvas/styles/main.scss">
@import "@/styles/toast-notification-styles.scss";
</style>
