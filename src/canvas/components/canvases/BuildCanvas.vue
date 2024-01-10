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
          size="sm"
          title="Reset canvas"
          @click="toggleModalVisibility('resetConfirmModal')"
          :disabled="!allNodes.some((node) => node.type != 'input')"
        >
          <img
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/reset.svg"
          />
        </bx-btn>
        <bx-btn
          title="Select Entrypoint"
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
          kind="primary"
          @click="toggleModalVisibility('createWorkflowModal')"
        >
          + Add workflow
        </bx-btn>

        <bx-btn size="sm" @click="toggleTheme" title="Toggle light/dark mode">
          <img
            class="white-svg"
            width="16"
            height="16"
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
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/download.svg"
          />
        </bx-btn>
        <bx-btn size="sm" title="Save canvas project" @click="saveGraph">
          <img
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/save.svg"
          />
        </bx-btn>
        <bx-btn
          size="sm"
          title="Load canvas from file"
          @click="toggleModalVisibility('fileUploadModal')"
        >
          <img
            class="white-svg"
            width="16"
            height="16"
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
    <TemplateWorkspace
      ref="templateWorkspace"
      @updateLibraryNotification="updateLibraryNotification"
      @libraryLoaded="setupCanvas"
    />
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
      :dslValidationErrorProp="dslValidationErrors"
      :templatesNamesSet="templatesNamesSet"
      @bx-modal-closed="toggleModalVisibility('updateWorkflowModal')"
      @openShowDslErrors="toggleModalVisibility('showDslErrors')"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @stepDeleted="removeConnectingEdges"
      @addToTemplateWorkspace="addToTemplateWorkspace"
      @updateWorkflowModalNotification="updateBuildCanvasNotifications"
    />
    <updateComponentModal
      v-if="modalVisibilities.updateComponentModal.value"
      :node="selectedNode"
      :allNodes="allNodes"
      :parentNode="parentNode"
      :dslValidationErrorProp="dslValidationErrors"
      :templatesNamesSet="templatesNamesSet"
      @bx-modal-closed="toggleModalVisibility('updateComponentModal')"
      @openShowDslErrors="toggleModalVisibility('showDslErrors')"
      @delete="openDeleteModal"
      @removeParent="removeParentNode"
      @addToTemplateWorkspace="addToTemplateWorkspace"
      @updateComponentModalNotification="updateBuildCanvasNotifications"
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
      open
      title="Upload Files"
      @upload="uploadFiles"
      v-if="modalVisibilities.fileUploadModal.value"
      @bx-modal-closed="toggleModalVisibility('fileUploadModal')"
    />
    <registerExperiment
      open
      v-if="modalVisibilities.registerExperimentModal.value"
      @bx-modal-closed="toggleModalVisibility('registerExperimentModal')"
      @openShowDslErrors="toggleModalVisibility('showDslErrors')"
      @dslValidationError="setDslValidationError"
      :name="props.pvep"
      :allNodes="allNodes"
      :allEdges="allEdges"
    />
    <ShowDslValidationErrors
      open
      v-if="modalVisibilities.showDslErrors.value"
      @bx-modal-closed="toggleModalVisibility('showDslErrors')"
      @dslValidationError="setDslValidationError"
      :dslErrorsProp="dslValidationErrors"
      :allNodes="allNodes"
      :allEdges="allEdges"
    />
    <!-- Confirm Modals -->
    <!-- Confirm upload files-->
    <confirmModal
      open
      v-if="modalVisibilities.confirmUploadModal.value"
      title="Upload file?"
      paragraph1="Performing this action will replace all the templates and connections
        on the canvas with the contents of the uploaded file."
      paragraph2="This action cannot be undone. Do you still want to proceed?"
      buttonText="Yes, upload the file"
      @dds-expressive-modal-closed="toggleModalVisibility('confirmUploadModal')"
      @confirm-button-clicked="applyUploadedFiles"
    />
    <!-- Confirm delete node -->
    <confirmModal
      open
      v-if="modalVisibilities.deleteModal.value"
      :title="`Delete ${nodeType}?`"
      :paragraph1="`Are you sure you want to delete this ${nodeType}?`"
      paragraph2="This action cannot be undone."
      :buttonText="`Yes, delete ${nodeType}`"
      @dds-expressive-modal-closed="toggleModalVisibility('deleteModal')"
      @confirm-button-clicked="deleteNode"
    />
    <!-- Confirm reset canvas -->
    <confirmModal
      open
      v-if="modalVisibilities.resetConfirmModal.value"
      title="Reset the canvas?"
      paragraph1="Performing this action will remove all the templates and connections
        from the canvas."
      paragraph2="This action cannot be undone. Do you still want to proceed?"
      buttonText="Yes, reset the canvas"
      @dds-expressive-modal-closed="toggleModalVisibility('resetConfirmModal')"
      @confirm-button-clicked="resetCanvas"
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
import TemplateWorkspace from "@/canvas/components/TemplateWorkspace";
//Modals
import createEdgeModal from "@/canvas/components/modals/edges/createEdgeModal.vue";
import updateEdgeModal from "@/canvas/components/modals/edges/updateEdgeModal.vue";
import createWorkflowModal from "@/canvas/components/modals/st4sd_workflows/createWorkflowModal.vue";
import updateWorkflowModal from "@/canvas/components/modals/st4sd_workflows/updateWorkflowModal.vue";
import nestNodeModal from "@/canvas/components/modals/st4sd_workflows/nestNodeModal";
import updateComponentModal from "@/canvas/components/modals/st4sd_components/updateComponentModal.vue";
import selectEntryPointModal from "@/canvas/components/modals/experiment/selectEntryPointModal.vue";
import fileUploadModal from "@/canvas/components/modals/experiment/fileUploadModal.vue";
import registerExperiment from "@/canvas/components/modals/experiment/registerExperiment.vue";
import ShowDslValidationErrors from "@/canvas/components/modals/experiment/showDslValidationErrors.vue";

//Confirm Modal
import confirmModal from "@/canvas/components/modals/confirm-modal/confirmModal.vue";

//Stores
import { canvasStore } from "@/canvas/stores/canvasStore";

//Node types
import ComponentNode from "@/canvas/components/node_types/ComponentNode.vue";
import WorkflowNode from "@/canvas/components/node_types/WorkflowNode";
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
  "updateLibraryNotification",
  "updateBuildCanvasNotification",
  "updateFatalError",
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
setupInputs(elements);

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
    elements.elevateEdgesOnSelect = true;
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
  confirmUploadModal: ref(false),
  resetConfirmModal: ref(false),
  showDslErrors: ref(false),
};

let uploadedFilesConents;
const uploadFiles = async (files) => {
  //set the object here to avoid saved files from prev uploads
  uploadedFilesConents = { dsl: "", graph: "" };
  if (files.length == 2) {
    uploadedFilesConents.dsl = await readFile(files[0]);
    if (files[1] != null) {
      localPVEP.value = await readFile(files[1]);
    }
  } else {
    uploadedFilesConents.graph = await readFile(files);
  }
  toggleModalVisibility("fileUploadModal");

  //Check if any nodes are in the current canvas, if so ask the user to confirm
  //that he wants to erase the current state
  if (nodes.value.some((node) => node.type != "input")) {
    toggleModalVisibility("confirmUploadModal");
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
  modalVisibilities["confirmUploadModal"].value = false;
}

function resetCanvas() {
  nodes.value = [];
  edges.value = [];
  setupInputs(elements);
  if (modalVisibilities.resetConfirmModal.value) {
    toggleModalVisibility("resetConfirmModal");
  }
}

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
let templatesNamesSet;
const templateWorkspace = ref();
onNodeDoubleClick(({ node }) => {
  selectedNode = node;
  parentNode = findNode(node.parentNode);
  templatesNamesSet = templateWorkspace.value.getTemplatesNamesSet();
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
  selectedNode.extent = undefined;
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

let dslValidationErrors = ref([]);
const setDslValidationError = (dslError) => {
  dslValidationErrors.value = dslError;
};
</script>

<style lang="scss">
@import "@/canvas/styles/main.scss";
@import "@/styles/toast-notification-styles.scss";
@import "@/styles/svg.scss";
</style>
