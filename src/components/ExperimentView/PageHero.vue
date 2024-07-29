<template>
  <!-- Experiment header -->
  <div class="cds--row">
    <!-- Left column  -->
    <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-12">
      <!-- Experiment name and description -->
      <div>
        <c4d-content-block>
          <c4d-content-block-heading>{{
            experiment.metadata.package.name
          }}</c4d-content-block-heading>
          <c4d-content-block-copy>
            {{ experiment.metadata.package.description }}
          </c4d-content-block-copy>

          <!-- Experiment tags -->
          <div class="tag-group-container">
            <!-- Virtual experiment -->
            <cds-tag v-if="checkVeInterfaceIsPresent(experiment)" type="green">
              virtual-experiment
            </cds-tag>
            <!-- Platforms -->
            <cds-tag
              v-for="option in getAvailablePlatforms"
              :key="`platformoption-${option}`"
              type="red"
            >
              platform: {{ option }}
            </cds-tag>
            <!-- Tags -->
            <cds-tag
              v-for="(tag, idx) in experiment.metadata.registry.tags"
              :key="`registrytag-${idx}`"
              type="blue"
            >
              tag: {{ tag }}
            </cds-tag>
            <!-- Digest -->
            <!-- AP: cds-tag has a set max-inline-size value which force the component to take multiple lines -->
            <cds-tag type="blue" style="max-inline-size: fit-content">
              digest: {{ experiment.metadata.registry.digest }}
            </cds-tag>
          </div>

          <!-- eslint-disable -->
          <c4d-link-list type="end">
            <c4d-link-list-item
              v-if="!isGlobalRegistry"
              :href="`${getDeploymentEndpoint()}experiment/${id}/runs`"
            >
              View Runs
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="!isCanvasDisabled"
              :href="`${getDeploymentEndpoint()}experiment/${id}/viewcanvas`"
            >
              View Graph
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              :href="`${getDeploymentEndpoint()}experiment/${id}/parameterisation-options`"
              v-if="isParameterisationEnabled"
            >
              Parameterisation Options
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="isRunExperimentEnabled"
              @click="toggleModalVisibility('runExperimentFormModal')"
            >
              Run Experiment
              <img
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
            <c4d-link-list-item
              v-if="isBuildCanvasEditingEnabled"
              :href="`${getDeploymentEndpoint()}experiment/${this.id}/edit`"
              :disabled="
                !experiment.metadata.package.keywords.includes(
                  'internal-experiment',
                )
              "
              :title="
                !experiment.metadata.package.keywords.includes(
                  'internal-experiment',
                )
                  ? 'This experiment was created outside the canvas and therefore it cannot be edited'
                  : ''
              "
            >
              Edit Experiment
              <img
                v-if="
                  experiment.metadata.package.keywords.includes(
                    'internal-experiment',
                  )
                "
                slot="icon"
                src="@/assets/arrow--right.svg"
                width="20"
                height="20"
              />
            </c4d-link-list-item>
          </c4d-link-list>
        </c4d-content-block>
        <!-- eslint-enable -->
      </div>
    </div>

    <!-- Right column -->
    <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-4 pad1">
      <!-- Progress indicator -->
      <St4sdBestPracticesProgressIndicator
        :loading="loading"
        :experiment="experiment"
      />
    </div>
    <runExperimentFormModal
      v-if="runExperimentFormModal"
      @submit="toggleRunExperimentFormEmit"
      @bx-modal-closed="toggleModalVisibility('runExperimentFormModal')"
      open="true"
      title="Run Experiment"
    >
      <runExperimentForm
        :formEmit="runExperimentFormEmit"
        @post-experiment-run="setRunExperimentFormPayload"
      />
    </runExperimentFormModal>
  </div>
</template>

<script>
import "@carbon/ibmdotcom-web-components/es/components/content-block/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/ibmdotcom-web-components/es/components/link-list/index.js";

import St4sdBestPracticesProgressIndicator from "@/components/St4sdBestPracticesProgressIndicator";
import runExperimentFormModal from "@/canvas/components/modals/experiment/runExperimentFormModal.vue";
import runExperimentForm from "@/canvas/components/forms/runExperimentForm.vue";

import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getDeploymentEndpoint } from "@/functions/public_path";

import axios from "axios";
import router from "@/router";

export default {
  name: "PageHero",
  components: {
    St4sdBestPracticesProgressIndicator,
    runExperimentFormModal,
    runExperimentForm,
  },
  props: {
    experiment: Object,
    id: String,
    isParameterisationEnabled: Boolean,
    isRunExperimentEnabled: Boolean,
    isCanvasDisabled: Boolean,
    isGlobalRegistry: Boolean,
    isBuildCanvasEditingEnabled: Boolean,
    loading: Number,
    getAvailablePlatforms: Array,
  },
  data() {
    return {
      modalActive: false,
      runModalActive: false,
      runExperimentFormEmit: false,
      formDataCollected: false,
      runExperimentPayload: {},
      runExperimentFormModal: false,
    };
  },
  methods: {
    checkVeInterfaceIsPresent,
    getDeploymentEndpoint,
    toggleModalVisibility(modal) {
      this[modal] = !this[modal];
    },
    toggleRunExperimentFormEmit() {
      this.runExperimentFormEmit = !this.runExperimentFormEmit;
    },
    setRunExperimentFormPayload(runExperimentPayload) {
      this.runExperimentPayload = runExperimentPayload;
      this.formDataCollected = true;

      this.postRunExperimentForm();
    },
    postRunExperimentForm() {
      let data;
      if (this.formDataCollected) {
        data = { ...this.runExperimentPayload };
        data = JSON.stringify(data);
        axios
          .post(
            window.location.origin +
              `/registry-ui/backend/experiments/${this.id}/start`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
          .then((response) => {
            if (response.status == 200) {
              router.push({
                path: `/experiment/${this.id}/runs/`,
              });
            }
          })
          .catch((error) => {
            if (error.response.status == 400) {
              alert(`${error.response.data.message}`);
            } else {
              alert(
                "Experiment not found or internal error while creating experiment",
              );
            }
          });
      }
      this.toggleRunExperimentFormEmit();
    },
    filterResponseReason(reason) {
      let strArr = reason.split("");
      let startIndex = strArr.indexOf(")") + 1;
      let newStrArr = strArr.slice(startIndex);
      let endIndex = newStrArr.indexOf(".");
      return newStrArr.slice(0, endIndex).join("");
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
@import "@/styles/cds-tag-styles.scss";

c4d-content-block {
  margin: 0 0 layout.$spacing-09 0;
}

c4d-content-block-heading,
c4d-content-block-copy {
  margin-left: 0;
}

c4d-cta-block {
  display: inline;
}

c4d-link-list {
  margin-top: layout.$spacing-07;

  @media screen and (max-width: 671px) {
    margin-left: 0;
  }
}
</style>
