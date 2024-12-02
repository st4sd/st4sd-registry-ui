<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow
      id="vue-flow-build-canvas"
      :class="{ dark }"
      :default-zoom="1"
      :delete-key-code="false"
      :min-zoom="0.2"
      :max-zoom="4"
      class="basicflow"
      fit-view-on-init
      elevate-edges-on-select
      @dragover="onDragOver"
    >
      <Background :pattern-color="dark ? '#FFFFFB' : '#aaa'" gap="8" />
      <MiniMap />
      <Controls />
      <Panel :position="PanelPosition.TopRight" class="controls">
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Reset canvas"
          @click="toggleVisibility('resetConfirmModal')"
          :disabled="!allNodes.some((node) => node.type != 'input')"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/reset.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Select Entrypoint"
          @click="toggleVisibility('selectEntryPointSidePanel')"
          kind="primary"
          :disabled="
            allNodes.filter((node) => node.type == 'workflow').length < 1
          "
        >
          Select Entrypoint
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/flow.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Add Workflow"
          kind="primary"
          @click="toggleVisibility('createWorkflowSidePanel')"
        >
          Add workflow
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/plus.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
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
          class="cds-button-padding"
          :title="
            allNodes.find((node) => node.isEntry == true) == undefined
              ? 'Select an entrypoint to download the DSL'
              : 'Download DSL'
          "
          @click="downloadExperimentFiles"
          :disabled="allNodes.find((node) => node.isEntry == true) == undefined"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/download.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Save canvas project"
          @click="saveGraph"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/save.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Load canvas from file"
          @click="toggleVisibility('fileUploadModal')"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/upload.svg"
          />
        </cds-button>
        <cds-button
          size="md"
          class="cds-button-padding"
          title="Register experiment"
          @click="toggleVisibility('registerExperimentSidePanel')"
          kind="secondary"
          :disabled="allNodes.find((node) => node.isEntry == true) == undefined"
        >
          Register Experiment
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/ibm--datastage.svg"
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
    <TemplateWorkspace
      ref="templateWorkspace"
      @updateLibraryNotification="updateLibraryNotification"
      @libraryLoaded="setupCanvas"
    />
    <!-- CRUD operations -->
    <createWorkflowSidePanel
      v-if="componentVisibilities.createWorkflowSidePanel.value"
      @added="addWorkflow"
      @side-panel-closed="toggleVisibility('createWorkflowSidePanel')"
    />
    <updateWorkflowSidePanel
      v-if="componentVisibilities.updateWorkflowSidePanel.value"
      :node="selectedNode"
      :allEdges="allEdges"
      :allNodes="allNodes"
      :parentNode="parentNode"
      :dslValidationErrorProp="dslValidationErrors"
      :templatesNamesSet="templatesNamesSet"
      :dslValidationErrors="dslValidationErrors"
      :setDslValidationErrorFunction="setDslValidationError"
      @side-panel-closed="toggleVisibility('updateWorkflowSidePanel')"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @stepDeleted="removeConnectingEdges"
      @addToTemplateWorkspace="addToTemplateWorkspace"
      @updateWorkflowSidePanelNotification="updateBuildCanvasNotifications"
    />
    <UpdateComponentSidePanel
      v-if="componentVisibilities.updateComponentSidePanel.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :allEdges="allEdges"
      :parentNode="parentNode"
      :dslValidationErrors="dslValidationErrors"
      :templatesNamesSet="templatesNamesSet"
      :setDslValidationErrorFunction="setDslValidationError"
      @side-panel-closed="toggleVisibility('updateComponentSidePanel')"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @addToTemplateWorkspace="addToTemplateWorkspace"
      @updateComponentModalNotification="updateBuildCanvasNotifications"
    />
    <createEdgeSidePanel
      v-if="componentVisibilities.createEdgeSidePanel.value"
      :edgeProp="newEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @side-panel-closed="toggleVisibility('createEdgeSidePanel')"
      @created="addEdge"
    />
    <updateEdgeSidePanel
      v-if="componentVisibilities.updateEdgeSidePanel.value"
      :edgeProp="selectedEdge"
      :allNodes="allNodes"
      :allEdges="allEdges"
      @side-panel-closed="toggleVisibility('updateEdgeSidePanel')"
      @update="toggleVisibility('updateEdgeSidePanel')"
      @delete="openDeleteModal"
    />
    <!-- Nesting -->
    <nestNodeSidePanel
      v-if="componentVisibilities.nestNodeSidePanel.value"
      :toBeNestedNode="nestingNode"
      :nestingWorkflows="nestingWFs"
      :allNodes="allNodes"
      @side-panel-closed="toggleVisibility('nestNodeSidePanel')"
      @nest-node-failure="updateBuildCanvasNotifications"
      @done="addStep"
    />
    <!-- Experiment configuration -->
    <fileUploadModal
      open
      title="Upload Files"
      @upload="uploadFiles"
      v-if="componentVisibilities.fileUploadModal.value"
      @cds-modal-closed="toggleVisibility('fileUploadModal')"
    />
    <registerExperiment
      open
      v-if="componentVisibilities.registerExperimentSidePanel.value"
      @side-panel-closed="toggleVisibility('registerExperimentSidePanel')"
      :dslValidationErrors="dslValidationErrors"
      :setDslValidationErrorFunction="setDslValidationError"
      @dslValidationError="setDslValidationError"
      :name="props.pvep"
      :allNodes="allNodes"
      :allEdges="allEdges"
    />
    <selectEntryPointSidePanel
      open
      v-if="componentVisibilities.selectEntryPointSidePanel.value"
      @side-panel-closed="toggleVisibility('selectEntryPointSidePanel')"
      :allNodes="allNodes"
    />
    <!-- Confirm Modals -->
    <!-- Confirm upload files-->
    <confirmModal
      open
      v-if="componentVisibilities.confirmUploadModal.value"
      title="Upload file?"
      paragraph1="Performing this action will replace all the templates and connections
        on the canvas with the contents of the uploaded file."
      paragraph2="This action cannot be undone. Do you still want to proceed?"
      buttonText="Yes, upload the file"
      @c4d-expressive-modal-closed="toggleVisibility('confirmUploadModal')"
      @confirm-button-clicked="applyUploadedFiles"
    />
    <!-- Confirm delete node -->
    <confirmModal
      open
      v-if="componentVisibilities.deleteModal.value"
      :title="`Delete ${nodeType}?`"
      :paragraph1="`Are you sure you want to delete this ${nodeType}?`"
      paragraph2="This action cannot be undone."
      :buttonText="`Yes, delete ${nodeType}`"
      @c4d-expressive-modal-closed="toggleVisibility('deleteModal')"
      @confirm-button-clicked="deleteNode"
    />
    <!-- Confirm reset canvas -->
    <confirmModal
      open
      v-if="componentVisibilities.resetConfirmModal.value"
      title="Reset the canvas?"
      paragraph1="Performing this action will remove all the templates and connections
        from the canvas."
      paragraph2="This action cannot be undone. Do you still want to proceed?"
      buttonText="Yes, reset the canvas"
      @c4d-expressive-modal-closed="toggleVisibility('resetConfirmModal')"
      @confirm-button-clicked="resetCanvas"
    />
  </div>
</template>

<script setup>
import "@carbon/web-components/es/components/button/index.js";

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
import TemplateWorkspace from "@/canvas/components/TemplateWorkspace.vue";
//Modals
import createEdgeSidePanel from "@/canvas/components/sidePanels/edges/createEdgeSidePanel.vue";
import updateEdgeSidePanel from "@/canvas/components/sidePanels/edges/updateEdgeSidePanel.vue";
import createWorkflowSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/createWorkflowSidePanel.vue";
import updateWorkflowSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/updateWorkflowSidePanel.vue";
import nestNodeSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/nestNodeSidePanel.vue";
import selectEntryPointSidePanel from "@/canvas/components/sidePanels/experiment/selectEntryPointSidePanel.vue";
import fileUploadModal from "@/canvas/components/modals/experiment/fileUploadModal.vue";
import registerExperiment from "@/canvas/components/sidePanels/experiment/registerExperiment.vue";

//Confirm Modal
import confirmModal from "@/canvas/components/modals/confirm-modal/confirmModal.vue";

//Side Panels
import UpdateComponentSidePanel from "@/canvas/components/sidePanels/st4sd_components/updateComponentSidePanel.vue";

//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

//Node types
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode.vue";
import WorkflowInputNode from "@/canvas/components/node_types/WorkflowInputNode.vue";

//Functions
import {
  downloadExperiment,
  download,
  getDsl,
} from "@/canvas/functions/downloadJSON";
import { hide, getWorkflowsEdges } from "@/canvas/functions/hideExpand";
import {
  addWorkflowNode,
  addWorkflowNodesToCanvas,
  isConnectionValid,
  setupInputs,
} from "@/canvas/functions/canvasFunctions";
import {
  isNestingValid,
  removeStep,
  removeNodeAndStepReference,
} from "@/canvas/functions/stepFunctions";

import readFile from "@/functions/read_file.js";

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
  "updateLibraryNotification",
  "updateBuildCanvasNotification",
  "updateFatalError",
]);
const localPVEP = ref();

const {
  onNodeDragStop,
  onConnect,
  addEdges,
  addNodes,
  onEdgeDoubleClick,
  onNodeDoubleClick,
  getIntersectingNodes,
  removeEdges,
  removeNodes,
  findNode,
  fitView,
  project,
  vueFlowRef,
  nodes,
  edges,
} = useVueFlow("vue-flow-build-canvas");
setupInputs(canvasStore.graph);

async function fetchData(id) {
  try {
    let graphData;
    let promisedDsl = axios.get(
      `${getDeploymentEndpoint()}registry-ui/backend/canvas/${id}`,
    );
    let promisedPvep = axios.get(
      `${getDeploymentEndpoint()}registry-ui/backend/experiments/${id}`,
    );

    await promisedDsl
      .then((response) => {
        if (response.data.length != 0) {
          graphData = response.data;
        }
        resetCanvas();
        const uploadedGraph = getEntryWorkflowBlock(graphData);
        //Change ID system and add workflow dimensions
        let id = addWorkflowNodesToCanvas(
          uploadedGraph,
          workflowDimensions,
          getId,
          addNodes,
          addEdges,
        );
        setEntrypointAndNotify(id);
      })
      .catch((error) => {
        let notification = {
          kind: "error",
          title: "Unable to load graph",
          caption: error.response.statusText,
          code: error.response.status,
        };
        emit("updateFatalError", notification);
      });

    await promisedPvep
      .then((response) => {
        if (
          response.data &&
          !response.data.entry.metadata.package.keywords.includes(
            "internal-experiment",
          )
        ) {
          let error = {
            kind: "experimentTypeUnsupported",
            title: "Editing is supported only for internal experiments",
            caption: "BAD_REQUEST",
            code: 400,
          };
          emit("experimentTypeUnsupported", error);
          return;
        }
        localPVEP.value = response.data;
        canvasStore.setPVEP(response.data.entry);
      })
      .catch((error) => {
        if ("kind" in error && error.kind == "experimentTypeUnsupported") {
          error.kind = "error";
          emit("updateFatalError", error);
        } else {
          let notification = {
            kind: "error",
            title: "Unable to load PVEP",
            caption: error.response.statusText,
            code: error.response.status,
          };
          emit("updateFatalError", notification);
        }
      });
  } finally {
    emit("updateLoading", false);
  }
}

//The 405 error code is being used to deny access to functionalities
//If the backend returns 405 then that functionality has not been enabled by the administrator.

let is405 = false;

function updateLibraryNotification(notification) {
  emit("updateLibraryNotification", notification);
  if (notification.code == 405) {
    is405 = true;
  }
}

function updateBuildCanvasNotifications(notification) {
  emit("updateBuildCanvasNotification", notification);
}

function setupCanvas() {
  if (is405) {
    emit("updateLoading", false);
    return;
  }

  if (props.pvep != "") {
    fetchData(props.pvep);
  } else {
    canvasStore.graph.elevateEdgesOnSelect = true;
    emit("updateLoading", false);
    canvasStore.clearDsl();
    canvasStore.clearPVEP();
  }
}

let allNodes = nodes;
let allEdges = edges;
let workflowDimensions = {};

const getId = () => crypto.randomUUID();

const onDragOver = (event) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

let componentVisibilities = {
  createWorkflowSidePanel: ref(false),
  createEdgeSidePanel: ref(false),
  updateEdgeSidePanel: ref(false),
  updateWorkflowSidePanel: ref(false),
  updateComponentModal: ref(false),
  updateComponentSidePanel: ref(false),
  selectEntryPointSidePanel: ref(false),
  nestNodeSidePanel: ref(false),
  stepExecuteModal: ref(false),
  deleteModal: ref(false),
  fileUploadModal: ref(false),
  registerExperimentSidePanel: ref(false),
  confirmUploadModal: ref(false),
  resetConfirmModal: ref(false),
};

let uploadedFilesConents;
const uploadFiles = async (files) => {
  //set the object here to avoid saved files from prev uploads
  uploadedFilesConents = { dsl: "", graph: "" };
  if (files.length == 2) {
    uploadedFilesConents.dsl = JSON.parse(await readFile(files[0]));
    if (files[1] != null) {
      localPVEP.value = JSON.parse(await readFile(files[1]));
    }
  } else {
    uploadedFilesConents.graph = JSON.parse(await readFile(files));
  }
  toggleVisibility("fileUploadModal");

  //Check if any nodes are in the current canvas, if so ask the user to confirm
  //that he wants to erase the current state
  if (nodes.value.some((node) => node.type != "input")) {
    toggleVisibility("confirmUploadModal");
  } else {
    applyUploadedFiles();
  }
};

function applyUploadedFiles() {
  if (uploadedFilesConents.dsl != "") {
    const uploadedGraph = getEntryWorkflowBlock(uploadedFilesConents.dsl);
    //Change ID system and add workflow dimensions
    if (uploadedGraph != undefined) {
      //Canvas is wiped clean
      nodes.value = [];
      edges.value = [];
      let id = addWorkflowNodesToCanvas(
        uploadedGraph,
        workflowDimensions,
        getId,
        addNodes,
        addEdges,
      );
      // Since we clear the canvas before applying uploaded files,
      // we are sure that this is the first workflow added to the canvas
      setEntrypointAndNotify(id);
      /*
        AP (18/09/24): 
        Fix timing issues in a similar way to what was done for applyUploadedFiles
        ref: https://github.ibm.com/st4sd/st4sd-registry-ui/pull/820
      */
      setTimeout(function () {
        fitView({ padding: 0.4 });
      }, 20);
    } else {
      let notification = {
        kind: "error",
        title: "Unable to load DSL files",
        subtitle: "The uploaded file is not in the expected format.",
        caption: "Did you choose the correct file type?",
        code: 0,
      };
      emit("updateBuildCanvasNotification", notification);
    }
  } else if (uploadedFilesConents.graph != "") {
    if (uploadedFilesConents.graph.nodes) {
      //Canvas is wiped clean
      nodes.value = [];
      edges.value = [];
      /* 
      AP (16/09/24): 
      We're adding a delay of 20ms due to this issue: 
      https://github.ibm.com/st4sd/st4sd-registry-ui/issues/811
      AP: 20/09/24: 
      The delay was originally 10ms but was bumped to 20 in:
      https://github.ibm.com/st4sd/st4sd-registry-ui/pull/820#issuecomment-91519950
      We're resetting the values referenced by the refs nodes, edges.
      This probably notifies VueFlow and if we re-add the nodes too quickly
      it leads to the issue above.
      */
      setTimeout(function () {
        addNodes(uploadedFilesConents.graph.nodes);
        addEdges(uploadedFilesConents.graph.edges);

        // Find if one entrypoint or more exist in this canvas project file
        let entrypoints = nodes.value.filter(
          (node) => node.type == "workflow" && node.isEntry == true,
        );
        // If there is 1 or no entrypoints, set one
        if (entrypoints.length == 1) {
          setEntrypointAndNotify(entrypoints[0].id);
        }
        //If more than 1 nodes are marked as entrypoint, we keep only one as entrypoint
        else if (entrypoints.length > 1) {
          entrypoints.map((node) => {
            findNode(node.id).isEntry = false;
          });
          setEntrypointAndNotify(entrypoints[0].id);
        }
        componentVisibilities["confirmUploadModal"].value = false;
        fitView({ padding: 0.4 });
      }, 20);
      return;
    } else {
      let notification = {
        kind: "error",
        title: "Unable to load project files",
        subtitle: "The uploaded file is not in the expected format.",
        caption: "Did you choose the correct file type?",
        code: 0,
      };
      emit("updateBuildCanvasNotification", notification);
    }
  }
  // Ensure the confirmUploadModal is hidden
  componentVisibilities["confirmUploadModal"].value = false;
}

function resetCanvas() {
  nodes.value = [];
  edges.value = [];
  setupInputs(canvasStore.graph);
  if (componentVisibilities.resetConfirmModal.value) {
    toggleVisibility("resetConfirmModal");
  }
}

const toggleVisibility = (modal) => {
  componentVisibilities[modal].value = !componentVisibilities[modal].value;
};

let nestingNode = {};
let nestingWFs = [];
const onDrop = (event) => {
  //copy the element so we do not change the source
  const newNode = JSON.parse(JSON.stringify(canvasStore.node));
  const { left, top } = vueFlowRef.value.getBoundingClientRect();

  newNode.position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  });
  let id;
  newNode.label = newNode.label.replace(" (*)", "");
  if (newNode.type == "workflow") {
    // In a workflow newNode is used to generate the whole workflow and thus
    // newNode itself will not be used in the workflow and will be replaced with
    // the workflow's entry point node, so we manually return the new id to be used
    // in the nextTick() function

    // Check if this is the first workflow added to the canvas
    // we do this check before adding the nodes to the canvas
    let workflows = nodes.value.filter((node) => node.type == "workflow");
    id = addWorkflowNodesToCanvas(
      newNode,
      workflowDimensions,
      getId,
      addNodes,
      addEdges,
    );
    if (workflows.length == 0) {
      setEntrypointAndNotify(id);
    }
  } else {
    newNode.id = getId();
    id = newNode.id;
    //To adjust the width of the component
    updateNodeLabel(newNode);
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
    let { isNesting, nestingWorkflows } = isNestingValid(
      node,
      getIntersectingNodes(node),
      nodes.value,
    );
    if (isNesting) {
      nestingNode = { ...node };
      nestingWFs = nestingWorkflows;
      toggleVisibility("nestNodeSidePanel");
    }
  });
};

function setEntrypointAndNotify(id) {
  let node = findNode(id);
  node.isEntry = true;
  let notification = {
    kind: "info",
    title: "Entrypoint auto-populated",
    subtitle: `Workflow ${node.label} is now the entrypoint of your experiment.`,
    caption: "You can change this by clicking on the Select Entrypoint button",
    code: 0,
  };
  emit("updateBuildCanvasNotification", notification);
}

const addWorkflow = (workflow, input) => {
  addWorkflowNode(workflow, input, workflowDimensions, getId, addNodes);
  // Check if this is the only workflow in the canvas
  let workflows = nodes.value.filter((node) => node.type == "workflow");
  if (workflows.length == 1) {
    setEntrypointAndNotify(workflows[0].id);
  }
  toggleVisibility("createWorkflowSidePanel");
};

onNodeDragStop((event) => {
  let { isNesting, nestingWorkflows } = isNestingValid(
    event.node,
    getIntersectingNodes(event.node),
    nodes.value,
  );
  if (isNesting) {
    nestingNode = { ...event.node };
    nestingWFs = nestingWorkflows;
    toggleVisibility("nestNodeSidePanel");
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
    toggleVisibility("updateEdgeSidePanel");
  } else if (isConnectionValid(newEdge, findNode)) {
    toggleVisibility("createEdgeSidePanel");
  }
});

let nodeType;
let selectedEdge;
onEdgeDoubleClick(({ edge }) => {
  selectedEdge = edge;
  nodeType = "connection";
  toggleVisibility("updateEdgeSidePanel");
});

const addEdge = (newEdge) => {
  if (Object.keys(newEdge.definition).length > 0) {
    addEdges([newEdge]);
  }
  toggleVisibility("createEdgeSidePanel");
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
let templatesNamesSet;
const templateWorkspace = ref();
onNodeDoubleClick(({ node }) => {
  selectedNode = node;
  parentNode = findNode(node.parentNode);
  templatesNamesSet = templateWorkspace.value.getTemplatesNamesSet();
  if (node.type == "component") {
    nodeType = "component";
    toggleVisibility("updateComponentSidePanel");
  } else {
    if (node.type == "workflow-input") {
      selectedNode = findNode(node.parentNode);
      parentNode = findNode(selectedNode.parentNode);
    }
    nodeType = "workflow";
    toggleVisibility("updateWorkflowSidePanel");
  }
});
function getChildrenNodes(parentNode, validNodes, childrenNodes) {
  childrenNodes.push(parentNode);
  validNodes.forEach((node) => {
    if (node.parentNode == parentNode.id) {
      if (node.type == "workflow") {
        getChildrenNodes(node, validNodes, childrenNodes);
      } else {
        childrenNodes.push(node);
      }
    }
  });
}
const addToTemplateWorkspace = () => {
  //Deep copy the node so we sever the connection between the node in the canvas
  //and the node in the template workspace
  let selectedTemplateCopy = JSON.parse(JSON.stringify(selectedNode));
  if (selectedTemplateCopy.type == "workflow") {
    //prep Nodes
    let validNodes = nodes.value.filter(
      (node) => node.type == "workflow" || node.type == "component",
    );
    let childrenNodes = [];
    //Set the node as entrypoint to get correct DSL
    selectedTemplateCopy.isEntry = true;
    getChildrenNodes(selectedTemplateCopy, validNodes, childrenNodes);
    //Make sure only the entrypointNode is set as entrypoint
    childrenNodes.map((node) => {
      if (node.id != selectedTemplateCopy.id) {
        node.isEntry = false;
      }
    });
    let workflowDsl = getDsl(childrenNodes, edges.value);
    templateWorkspace.value.addToTemplateWorkspace(workflowDsl, "workflow");
    let notification = {
      kind: "success",
      title: "Workflow successfully added to template workspace",
      code: 0,
    };
    emit("updateBuildCanvasNotification", notification);
  } else {
    //if node is a step, we have to remove stepId and update the node label
    if (selectedTemplateCopy.stepId) {
      delete selectedTemplateCopy.stepId;
    }
    updateNodeLabel(selectedTemplateCopy);
    templateWorkspace.value.addToTemplateWorkspace(
      selectedTemplateCopy,
      "component",
    );
    let notification = {
      kind: "success",
      title: "Component successfully added to template workspace",
      code: 0,
    };
    emit("updateBuildCanvasNotification", notification);
  }
};

const openDeleteModal = () => {
  toggleVisibility("deleteModal");
  //close update modals
  if (nodeType == "workflow") {
    toggleVisibility("updateWorkflowSidePanel");
  } else if (nodeType == "component") {
    toggleVisibility("updateComponentSidePanel");
  } else if (nodeType == "connection") {
    toggleVisibility("updateEdgeSidePanel");
  }
};

const deleteNode = () => {
  if (nodeType == "connection") {
    removeEdges([selectedEdge]);
  } else {
    removeNodeAndStepReference(selectedNode, findNode, removeNodes);
  }
  toggleVisibility("deleteModal");
};

const removeParentNode = () => {
  selectedNode.parentNode = undefined;
  selectedNode.expandParent = false;
  selectedNode.extent = undefined;
  //Remove it as a step from parent WF
  removeStep(parentNode, selectedNode);
  //We call this function after removeStep as removeStep deletes the stepId and then
  //updateNodeLabel tests if the stepId exists or not
  updateNodeLabel(selectedNode);
  removeConnectingEdges(selectedNode);
  if (nodeType == "workflow") {
    toggleVisibility("updateWorkflowSidePanel");
  } else if (nodeType == "component") {
    toggleVisibility("updateComponentSidePanel");
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
  let dslFileName = props.pvep;
  if (dslFileName.trim() == "") {
    // this should never be undefined at this stage but better to be safe
    let entrypoint = nodes.value.find((node) => node.isEntry == true);
    dslFileName = entrypoint == undefined ? "experiment" : entrypoint.label;
  }
  try {
    downloadExperiment(nodes.value, edges.value, dslFileName + "-dsl");
  } catch (error) {
    let notification = {
      kind: "error",
      title: "Unable to download DSL file",
      subtitle: "",
      caption: error.response.statusText,
      code: error.response.status,
    };
    emit("updateBuildCanvasNotification", notification);
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
  toggleVisibility("nestNodeSidePanel");
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

let dslValidationErrors = ref([]);
const setDslValidationError = (dslError) => {
  dslValidationErrors.value = dslError;
};
</script>

<style scoped lang="scss">
@use "@/canvas/styles/main.scss";
@use "@/styles/toast-notification-styles.scss";
@use "@/styles/svg.scss";
</style>
