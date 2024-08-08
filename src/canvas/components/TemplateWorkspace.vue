<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <aside>
    <div id="controls">
      <div id="title">Template Workspace</div>
      <div id="buttons">
        <cds-button
          title="Create Component"
          @click="toggleModalVisibility('createComponentSidePanel')"
          size="sm"
          style="padding-bottom: 5px"
        >
          <img
            slot="icon"
            class="white-svg"
            width="16"
            height="16"
            src="@/assets/plus.svg"
          />
          New Component
        </cds-button>
        <cds-button
          v-if="isGlobalRegistryLibraryEnabled"
          title="Add Global Registry Component"
          @click="navigateToGlobalRegistryLibrary"
          size="sm"
        >
          <img
            slot="icon"
            class="white-svg"
            width="15"
            height="15"
            src="@/assets/embed.svg"
          />
          Import Component
        </cds-button>
      </div>
      <div style="display: flex">
        <cds-search
          placeholder="Search here"
          @cds-search-input="
            templateQuery = $event.detail.value;
            filterTemplates();
          "
          class="library-search-bar"
        />
        <cds-overflow-menu
          leave-delay-ms="0"
          enter-delay-ms="100000"
          class="overflow-menu-container"
        >
          <img slot="icon" width="16" height="16" src="@/assets/settings.svg" />
          <cds-overflow-menu-body :flipped="true">
            <cds-overflow-menu-item>
              <cds-checkbox
                @cds-checkbox-changed="caseSensitive = !caseSensitive"
                >Case Sensitive</cds-checkbox
              >
            </cds-overflow-menu-item>
          </cds-overflow-menu-body>
        </cds-overflow-menu>
      </div>
    </div>
    <div id="nodes-container">
      <div
        v-for="element in elements.sort((a, b) =>
          a.label.localeCompare(b.label),
        )"
        :key="element.id"
        class="node"
      >
        <div
          :id="element.id"
          class="vue-flow__node-workflow"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          v-if="element.type == 'workflow'"
          @dblclick="onDoubleClick(element)"
        >
          {{ element.label }}
        </div>
        <div
          :id="element.id"
          class="vue-flow__node-component"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          @dblclick="onDoubleClick(element)"
          v-else
        >
          {{ element.label }}
        </div>
      </div>
    </div>
    <createComponentSidePanel
      v-if="modalVisibilities.createComponentSidePanel.value"
      :existingTemplates="
        new Set(
          fullElements.map((template) => template.definition.signature.name),
        )
      "
      @componentAdded="addComponentNode"
      @side-panel-closed="toggleModalVisibility('createComponentSidePanel')"
      @updateCreateComponentModalNotification="
        onUpdateCreateComponentModalNotification
      "
    />
    <readWorkflowSidePanel
      v-if="modalVisibilities.readWorkflowSidePanel.value"
      title="Workflow Details"
      @side-panel-closed="toggleModalVisibility('readWorkflowSidePanel')"
      :node="clickedNode"
      :inputingEdges="[]"
      :shareEnabled="
        !persistedGraphs.has(clickedNode.definition.signature.name) &&
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      :shareAndDeleteButtonsAvailable="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      @shareWorkflow="shareTemplate"
      @deleteWorkflow="handleDeleteTemplate"
      :requestInProgress="readModalRequestInProgress"
    />
    <readComponentSidePanel
      v-if="modalVisibilities.readComponentSidePanel.value"
      title="Component Details"
      @side-panel-closed="toggleModalVisibility('readComponentSidePanel')"
      :node="clickedNode"
      :inputingEdges="[]"
      :shareEnabled="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      :shareAndDeleteButtonsAvailable="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      @shareComponent="shareTemplate"
      @deleteComponent="handleDeleteTemplate"
      :requestInProgress="readModalRequestInProgress"
    />
    <!--Confirm delete template modal-->
    <confirmModal
      open
      v-if="modalVisibilities.confirmDeleteModal.value"
      title="Delete template?"
      paragraph1="Are you sure you want to delete this template?"
      paragraph2="This action cannot be undone."
      buttonText="Yes, delete template"
      @c4d-expressive-modal-closed="toggleModalVisibility('confirmDeleteModal')"
      @confirm-button-clicked="deleteTemplate(templateToDelete)"
    />
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { getEntryWorkflowBlock } from "@/canvas/functions/getEntryWorkflowBlock";
import { canvasStore } from "@/canvas/stores/canvasStore";
import readWorkflowSidePanel from "@/canvas/components/sidePanels/st4sd_workflows/readWorkflowSidePanel.vue";
import readComponentSidePanel from "@/canvas/components/sidePanels/st4sd_components/readComponentSidePanel.vue";
import createComponentSidePanel from "@/canvas/components/sidePanels/st4sd_components/createComponentSidePanel.vue";
import confirmModal from "@/canvas/components/modals/confirm-modal/confirmModal.vue";
import router from "@/router";
import { registryUISharedState } from "@/stores/registryUISharedState";
import { getDeploymentEndpoint } from "@/functions/public_path";

import getDSLDefinition from "@/canvas/functions/removeEmptyValues";

import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/search/index.js";

let isGlobalRegistryLibraryEnabled = ref(
  registryUISharedState.isGlobalRegistryLibraryEnabled,
);

const getId = () => crypto.randomUUID();

const emit = defineEmits(["updateLibraryNotification", "libraryLoaded"]);

let persistedGraphs = new Set();

async function getNodesFromUrls() {
  let nodes = [];

  await axios
    .get(
      `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library/internal`,
    )
    .then((response) => {
      for (let entryIndex in response.data.entries) {
        let graph = response.data.entries[entryIndex].graph;
        const entryWorkflowBlock = getEntryWorkflowBlock(graph);

        if (entryWorkflowBlock.parentNode == undefined) {
          entryWorkflowBlock.parentNode = "";
          entryWorkflowBlock.id = getId();
        }
        persistedGraphs.add(entryWorkflowBlock.definition.signature.name);

        nodes.push(entryWorkflowBlock);
      }
    })
    .catch((error) => {
      let notification = {
        kind: "error",
        title: "Template Workspace contents could not be loaded",
        caption: error.response.statusText,
        code: error.response.status,
      };
      emit("updateLibraryNotification", notification);
    })
    .finally(() => {
      emit("libraryLoaded");
    });
  return nodes;
}

let caseSensitive = ref(false);

watch(caseSensitive, () => {
  if (templateQuery) {
    filterTemplates();
  }
});

const elements = ref([]);
const fullElements = ref([]);
getNodesFromUrls().then((data) => {
  fullElements.value = [...fullElements.value, ...data];
  elements.value = [...elements.value, ...data];
});

let modalVisibilities = {
  readComponentSidePanel: ref(false),
  readWorkflowSidePanel: ref(false),
  createComponentSidePanel: ref(false),
  confirmDeleteModal: ref(false),
};

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};

//NEW LIBRARY MANAGEMENT FUNCTIONS
let readModalRequestInProgress = ref(false);

let templateToDelete = null;

function handleDeleteTemplate(template) {
  toggleModalVisibility("confirmDeleteModal");
  templateToDelete = template;
}

function getTemplatesNamesSet() {
  return new Set(
    fullElements.value.map((template) => template.definition.signature.name),
  );
}

function addToTemplateWorkspace(data, type) {
  if (type == "workflow") {
    const block = getEntryWorkflowBlock(data);
    block.label = block.label + " (*)";
    block.id = getId();
    fullElements.value.push(block);
    elements.value.push(block);
  } else {
    //Create a new object to make sure no values are carried over when un needed
    //We don't do this for workflow type as the dsl generate new element objects anyway
    let element = {
      id: getId(),
      definition: data.definition,
      label: data.label + " (*)",
      parentNode: "",
      type: data.type,
      position: { x: 0, y: 0 },
      width: data.width,
    };
    fullElements.value.push(element);
    elements.value.push(element);
  }
}

defineExpose({
  getTemplatesNamesSet,
  addToTemplateWorkspace,
});

async function deleteTemplate(template) {
  readModalRequestInProgress.value = true;
  toggleModalVisibility("confirmDeleteModal");

  if (persistedGraphs.has(template.label)) {
    let notification = {};
    await axios
      .delete(
        `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library/internal/${
          template.label
        }`,
      )
      .then((response) => {
        persistedGraphs.delete(template.label);

        notification = {
          kind: "success",
          title: `${template.definition.signature.name} successfully deleted.`,
          caption: response.statusText,
          code: response.status,
        };
      })
      .catch((error) => {
        notification = {
          kind: "error",
          title: `${template.definition.signature.name} could not be deleted.`,
          caption: error.response.statusText,
          code: error.response.status,
        };
        document.getElementById(template.id).classList.add("errored-template");
      })
      .finally(() => {
        emit("updateLibraryNotification", notification);
      });
  }

  //This if statement ensures the template is only removed from the UI if:
  // - It was never present on the backend.
  // - It has deleted on the backend succesfully.
  if (!persistedGraphs.has(template.label)) {
    removeTemplateFromTemplateWorkspace(template.label);
  }

  readModalRequestInProgress.value = false;

  if (template.type == "workflow") {
    toggleModalVisibility("readWorkflowSidePanel");
  }

  if (template.type == "component") {
    toggleModalVisibility("readComponentSidePanel");
  }
}

async function shareTemplate(template) {
  readModalRequestInProgress.value = true;
  let definition = getDSLDefinition(template.definition);
  let wrappedTemplate = {};
  if (template.type == "component") {
    wrappedTemplate = { components: [definition] };
  } else {
    wrappedTemplate = {
      entrypoint: {
        "entry-instance": template.definition.signature.name,
        execute: [
          {
            target: "<entry-instance>",
            args: {},
          },
        ],
      },
      workflows: [definition].concat(template.dependencies.workflows),
      components: template.dependencies.components,
    };
  }

  let notification = {};

  axios
    .post(
      `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library/internal`,
      wrappedTemplate,
    )
    .then((response) => {
      removeTemplateFromTemplateWorkspace(template.label);

      let graph = response.data.graph;

      const entryWorkflowBlock = getEntryWorkflowBlock(graph);

      if (entryWorkflowBlock.parentNode == undefined) {
        entryWorkflowBlock.parentNode = "";
        entryWorkflowBlock.id = getId();
      }
      persistedGraphs.add(entryWorkflowBlock.definition.signature.name);
      fullElements.value.push(entryWorkflowBlock);
      filterTemplates();

      notification = {
        kind: "success",
        title: `${template.definition.signature.name} successfully shared.`,
        caption: response.statusText,
        code: response.status,
      };
    })
    .catch((error) => {
      notification = {
        kind: "error",
        title: `${template.definition.signature.name} could not be shared.`,
        caption: error.response.statusText,
        code: error.response.status,
      };
      document.getElementById(template.id).classList.add("errored-template");
    })
    .finally(() => {
      emit("updateLibraryNotification", notification);
      readModalRequestInProgress.value = false;
      toggleModalVisibility(
        `read${
          template.type.charAt(0).toUpperCase() + template.type.slice(1)
        }Modal`,
      );
    });
}

function removeTemplateFromTemplateWorkspace(templateLabel) {
  for (let index in fullElements.value) {
    if (templateLabel == fullElements.value[index].label) {
      fullElements.value.splice(index, 1);
      break;
    }
  }
  filterTemplates();
}
//

const onDragStart = (event, element) => {
  canvasStore.setNode(element);
};

function navigateToGlobalRegistryLibrary() {
  router.push({ path: "/build-canvas/global-registry-library" });
}

const addComponentNode = (newComponent) => {
  newComponent.id = getId();
  fullElements.value.push(newComponent);
  filterTemplates();
  toggleModalVisibility("createComponentSidePanel");
};

function onUpdateCreateComponentModalNotification(notification) {
  emit("updateLibraryNotification", notification);
}

//Search bar function
let templateQuery = "";
const filterTemplates = () => {
  caseSensitive.value
    ? (templateQuery = templateQuery.trim())
    : (templateQuery = templateQuery.trim().toLowerCase());

  if (templateQuery == "") {
    elements.value = [...fullElements.value];
    return;
  }

  elements.value = caseSensitive.value
    ? fullElements.value.filter((element) => {
        return element.label.includes(templateQuery);
      })
    : fullElements.value.filter((element) => {
        return element.label.toLowerCase().includes(templateQuery);
      });
};

let clickedNode;
const onDoubleClick = (node) => {
  clickedNode = { ...node };
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowSidePanel");
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentSidePanel");
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/svg.scss";
@import "@/styles/overflow-menu-checkbox-styles.scss";

.title {
  padding-top: 1.5rem;
}

#controls {
  margin-bottom: 1rem;
}
#nodes-container {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.node {
  margin-bottom: 0.5rem;
}

.overflow-menu-container {
  background-color: white;
  border-bottom: 1px solid grey;
}

.overflow-menu-container:hover {
  border: none;
}
</style>
