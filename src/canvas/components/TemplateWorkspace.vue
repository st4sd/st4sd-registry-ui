<template>
  <aside>
    <div id="controls">
      <div id="title">Template Workspace</div>
      <div id="buttons">
        <bx-btn
          title="Create Component"
          icon-layout
          @click="toggleModalVisibility('createComponentModal')"
          size="sm"
        >
          <img width="16" heigth="16" src="@/assets/plus.svg" />
          New Component
        </bx-btn>
        <bx-btn
          v-if="isGlobalRegistryLibraryEnabled"
          title="Add Global Registry Component"
          icon-layout
          @click="navigateToGlobalRegistryLibrary"
          size="sm"
        >
          <img width="16" heigth="16" src="@/assets/embed.svg" />
          Import Component
        </bx-btn>
      </div>
      <bx-search
        placeholder="Search here"
        @keyup="updateList"
        @input="searchTerm = $event.target.value"
        :value="searchTerm"
        class="library-search-bar"
      />
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
          class="vue-flow__node-workflow"
          :draggable="true"
          @dragstart="onDragStart($event, element)"
          v-if="element.type == 'workflow'"
          @dblclick="onDoubleClick(element)"
        >
          {{ element.label }}
        </div>
        <div
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
    <createComponentModal
      v-if="modalVisibilities.createComponentModal.value"
      @componentAdded="addComponentNode"
      @bx-modal-closed="toggleModalVisibility('createComponentModal')"
    />
    <readWorkflowModal
      v-if="modalVisibilities.readWorkflowModal.value"
      title="Workflow Details"
      @bx-modal-closed="toggleModalVisibility('readWorkflowModal')"
      :node="clickedNode"
      :inputingEdges="[]"
      :shareEnabled="
        !persistedGraphs.has(clickedNode.definition.signature.name) &&
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      :deleteEnabled="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      @deleteWorkflow="handleDeleteTemplate"
      :requestInProgress="readModalRequestInProgress"
    />
    <readComponentModal
      v-if="modalVisibilities.readComponentModal.value"
      title="Component Details"
      @bx-modal-closed="toggleModalVisibility('readComponentModal')"
      :node="clickedNode"
      :inputingEdges="[]"
      :shareEnabled="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      :deleteEnabled="
        registryUISharedState.isLocalGraphsLibraryWriteAccessEnabled
      "
      @shareComponent="shareComponent"
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
      @dds-expressive-modal-closed="toggleModalVisibility('confirmDeleteModal')"
      @confirm-button-clicked="deleteTemplate(templateToDelete)"
    />
  </aside>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { getEntryWorkflowBlock } from "@/canvas/functions/getEntryWorkflowBlock";
import { canvasStore } from "@/canvas/stores/canvasStore";
import readWorkflowModal from "@/canvas/components/modals/st4sd_workflows/readWorkflowModal.vue";
import readComponentModal from "@/canvas/components/modals/st4sd_components/readComponentModal.vue";
import createComponentModal from "@/canvas/components/modals/st4sd_components/createComponentModal.vue";
import confirmModal from "@/canvas/components/modals/confirm-modal/confirmModal.vue";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/number-input/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/search/index.js";
import router from "@/router";
import { registryUISharedState } from "@/stores/registryUISharedState";
import { getDeploymentEndpoint } from "@/functions/public_path";

import getDSLDefinition from "@/canvas/functions/removeEmptyValues";

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
        statusText: error.response.statusText,
        code: error.response.status,
        description: `Template Library could not be loaded`,
        type: "error",
      };
      emit("updateLibraryNotification", notification);
    })
    .finally(() => {
      emit("libraryLoaded");
    });
  return nodes;
}

let modalVisibilities = {
  readComponentModal: ref(false),
  readWorkflowModal: ref(false),
  createComponentModal: ref(false),
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
          statusText: response.statusText,
          code: response.status,
          description: `${template.definition.signature.name} successfully deleted.`,
          type: "success",
        };
      })
      .catch((error) => {
        notification = {
          statusText: error.response.statusText,
          code: error.response.status,
          description: `${template.definition.signature.name} could not be deleted.`,
          type: "error",
        };
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
    toggleModalVisibility("readWorkflowModal");
  }

  if (template.type == "component") {
    toggleModalVisibility("readComponentModal");
  }
}

async function shareComponent(component) {
  readModalRequestInProgress.value = true;
  let definition = getDSLDefinition(component.definition);
  let wrappedComponent = { components: [definition] };

  let notification = {};

  axios
    .post(
      `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library/internal`,
      wrappedComponent,
    )
    .then((response) => {
      removeTemplateFromTemplateWorkspace(component.label);

      let graph = response.data.graph;

      const entryWorkflowBlock = getEntryWorkflowBlock(graph);

      if (entryWorkflowBlock.parentNode == undefined) {
        entryWorkflowBlock.parentNode = "";
        entryWorkflowBlock.id = getId();
      }
      persistedGraphs.add(entryWorkflowBlock.definition.signature.name);
      elements.value.push(entryWorkflowBlock);

      notification = {
        statusText: response.statusText,
        code: response.status,
        description: `${component.definition.signature.name} successfully shared.`,
        type: "success",
      };
    })
    .catch((error) => {
      notification = {
        statusText: error.response.statusText,
        code: error.response.status,
        description: `${component.definition.signature.name} could not be shared.`,
        type: "error",
      };
    })
    .finally(() => {
      emit("updateLibraryNotification", notification);
      readModalRequestInProgress.value = false;
      toggleModalVisibility("readComponentModal");
    });
}

function removeTemplateFromTemplateWorkspace(templateLabel) {
  for (let index in elements.value) {
    if (templateLabel == elements.value[index].label) {
      elements.value.splice(index, 1);
      break;
    }
  }
}
//

const onDragStart = (event, element) => {
  canvasStore.setNode(element);
};

const elements = ref([]);
const fullElements = ref([]);
getNodesFromUrls().then((data) => {
  fullElements.value = [...fullElements.value, ...data];
  elements.value = [...elements.value, ...data];
});

function navigateToGlobalRegistryLibrary() {
  router.push({ path: "/build-canvas/global-registry-library" });
}

const addComponentNode = (newComponent) => {
  newComponent.id = getId();
  fullElements.value.push(newComponent);
  elements.value.push(newComponent);
  toggleModalVisibility("createComponentModal");
};

//Search bar function
let searchTerm = "";
const updateList = () => {
  let searchResult = [];
  if (searchTerm.length > 0) {
    fullElements.value.forEach((item) => {
      if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchResult.push(item);
      }
    });
    elements.value = [...searchResult];
  } else {
    elements.value = [...fullElements.value];
  }
};

let clickedNode;
const onDoubleClick = (node) => {
  clickedNode = { ...node };
  if (node.type == "workflow") {
    toggleModalVisibility("readWorkflowModal");
  } else if (node.type == "component") {
    toggleModalVisibility("readComponentModal");
  }
};
</script>

<style scoped lang="scss">
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
</style>
