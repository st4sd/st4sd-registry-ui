<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div id="toast-notification-container">
    <cds-toast-notification
      v-for="error in errors"
      :key="error.description"
      kind="error"
      :title="error.description"
      :caption="error.statusText + ' (error ' + error.code + ')'"
      timeout="5000"
      lowContrast
    />
  </div>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: id,
        path: `/experiment/${props.id}`,
      },
      {
        name: 'View Canvas',
        path: `/experiment/${props.id}/viewcanvas`,
      },
    ]"
  />

  <cds-actionable-notification
    v-if="isPreview"
    kind="info"
    title="This is a preview"
    subtitle="Click the button to save this experiment"
    hideCloseButton
    lowContrast
  >
    <cds-actionable-notification-button
      @click="toggleModalVisibility('submitExperimentModal')"
      slot="action"
      >Register Transformed Experiment</cds-actionable-notification-button
    >
  </cds-actionable-notification>

  <div v-if="graphLoading">
    <div id="loadingContainer">
      <cds-loading></cds-loading>
    </div>
  </div>
  <div v-else-if="fatalGraphError.isError">
    <HttpErrorEmptyState
      id="http-error-empty-state"
      :errorDescription="fatalGraphError.description"
      :errorStatusText="fatalGraphError.statusText"
      :errorCode="fatalGraphError.code"
    />
  </div>
  <div v-else>
    <div id="no-results-message" v-if="response == null">
      <p>No Canvas Avaiblable</p>
    </div>

    <div v-else>
      <ViewCanvas
        v-if="!editButtonClicked"
        :id="props.id"
        @transform-button-clicked="toggleEditButtonClicked"
      />
      <EditCanvas
        v-else
        :id="props.id"
        :transforms="transforms"
        :transformApplied="isPreview"
        @transform-selected="handleTransformSelected"
      />
      <submitExperimentModal
        v-if="modalVisibilities.submitExperimentModal.value"
        @cancel="toggleModalVisibility('submitExperimentModal')"
        @submit="postNewExperiment"
        title="Submit Experiment"
        open="true"
      />
    </div>
  </div>
</template>

<script setup>
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/notification/index.js";

import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ViewCanvas from "@/canvas/components/canvases/ViewCanvas.vue";
import EditCanvas from "@/canvas/components/canvases/EditCanvas.vue";
import submitExperimentModal from "@/canvas/components/modals/experiment/submitExperimentModal.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import { ref, onMounted } from "vue";
import { canvasStore } from "@/canvas/stores/canvasStore";
import { createDAG } from "@/canvas/functions/createDAG";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});
let editButtonClicked = ref(false);
let transforms = ref(null);

const toggleEditButtonClicked = () => {
  editButtonClicked.value = !editButtonClicked.value;
  getGraphTransforms();
};

let errors = [];

const getGraphTransforms = () => {
  axios
    .get(
      window.location.origin +
        `/registry-ui/backend/canvas/${props.id}/relationships`,
    )
    .then((response) => {
      if (response.data.length != 0) {
        transforms.value = response.data;
      } else {
        transforms.value = [];
      }
    })
    .catch((error) => {
      errors.push({
        description: "Unable to load graph transformations",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });
};

let graphLoading = ref(true);
let response = ref(null);

let fatalGraphError = {
  isError: false,
  statusText: "",
  code: 0,
  description: "Unable to load graph",
};

const getGraph = async () => {
  let graphData;
  let inputsData;
  await axios
    .get(window.location.origin + "/registry-ui/backend/canvas/" + props.id)
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }
    })
    .catch((error) => {
      if (!fatalGraphError.isError) {
        fatalGraphError.statusText = error.response.statusText;
        fatalGraphError.code = error.response.status;
        fatalGraphError.isError = true;
      }
      errors.push({
        description: "Unable to load graph data",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });

  await axios
    .get(
      window.location.origin + "/registry-ui/backend/experiments/" + props.id,
    )
    .then((inputsResponse) => {
      if (inputsResponse.data.length != 0) {
        inputsData = inputsResponse.data.entry;
      }
    })
    .catch((error) => {
      if (!fatalGraphError.isError) {
        fatalGraphError.statusText = error.response.statusText;
        fatalGraphError.code = error.response.status;
        fatalGraphError.isError = true;
      }
      errors.push({
        description: "Unable to load input data",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });

  if (!fatalGraphError.isError) {
    const elements = ref(createDAG(graphData, inputsData));
    response.value = elements.value;
    canvasStore.setDAG(elements);
  }
  graphLoading.value = false;
};

onMounted(() => {
  getGraph();
});

let experimentTransformId = "";

const handleTransformSelected = (loading, transformId) => {
  graphLoading.value = loading;
  experimentTransformId = transformId.value;
  getPreviewGraph();
};

let isPreview = ref(false);

const getPreviewGraph = async () => {
  let graphData;
  let inputsData;
  let previewError = false;

  await axios
    .get(
      window.location.origin +
        "/registry-ui/backend/canvas/preview/" +
        experimentTransformId +
        "/dsl",
    )
    .then((graphResponse) => {
      if (graphResponse.data.length != 0) {
        graphData = graphResponse.data;
      }
    })
    .catch((error) => {
      previewError = true;
      errors.push({
        description: "Unable to load graph preview data",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });

  await axios
    .get(
      window.location.origin +
        "/registry-ui/backend/canvas/preview/" +
        experimentTransformId +
        "/inputs",
    )
    .then((inputsResponse) => {
      if (inputsResponse.data.length != 0) {
        inputsData = inputsResponse.data.entry;
      }
    })
    .catch((error) => {
      previewError = true;
      errors.push({
        description: "Unable to load input preview data",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });

  if (!previewError) {
    const elements = ref(createDAG(graphData, inputsData));
    response.value = elements.value;
    canvasStore.setDAG(elements);

    isPreview.value = true;
  }
  graphLoading.value = false;
};

const postNewExperiment = (experimentName) => {
  axios
    .post(
      window.location.origin +
        `/registry-ui/backend/canvas/relationships/${experimentTransformId}/synthesize/${experimentName}`,
    )
    .then(
      setTimeout(() => {
        router.push({ path: `/experiment/${experimentName}` });
      }, "5000"),
    )
    .catch((error) => {
      errors.push({
        description: "Unable to submit experiment",
        statusText: error.response.statusText,
        code: error.response.status,
      });
    });
};

let modalVisibilities = {
  submitExperimentModal: ref(false),
};

const toggleModalVisibility = (modal) => {
  modalVisibilities[modal].value = !modalVisibilities[modal].value;
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@use "@/styles/toast-notification-styles.scss";

#http-error-empty-state {
  min-height: 70vh;
}

#loadingContainer {
  width: 100%;
  height: calc(100vh - 12rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

#no-results-message {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  text-decoration: underline 1px;
  text-underline-offset: 5px;
  text-align: center;
}

cds-actionable-notification {
  max-width: 100%;
  margin-bottom: layout.$spacing-03;
}

cds-actionable-notification-button {
  padding-top: layout.$spacing-05;
  padding-right: layout.$spacing-06;
}
</style>
