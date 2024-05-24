<template>
  <!-- Experiment header -->
  <div>
    <div class="cds--row topPad">
      <!-- Left column  -->
      <div class="cds--col-sm-4 cds--col-md-8 cds--col-lg-12">
        <!-- Experiment name and description -->
        <dds-content-block>
          <dds-content-block-heading>{{
            experiment.metadata.package.name
          }}</dds-content-block-heading>
          <dds-content-block-copy>{{
            experiment.metadata.package.description
          }}</dds-content-block-copy>

          <!-- Experiment tags -->
          <dds-tag-group>
            <!-- Virtual experiment -->
            <bx-tag v-if="checkVeInterfaceIsPresent(experiment)" type="green">
              virtual-experiment
            </bx-tag>
            <!-- Platforms -->
            <bx-tag
              v-for="option in getAvailablePlatforms"
              :key="`platformoption-${option}`"
              type="red"
            >
              platform: {{ option }}
            </bx-tag>
            <!-- Tags -->
            <bx-tag
              v-for="(tag, idx) in experiment.metadata.registry.tags"
              :key="`registrytag-${idx}`"
              type="blue"
            >
              tag: {{ tag }}
            </bx-tag>
            <!-- Digest -->
            <bx-tag type="blue">
              digest: {{ experiment.metadata.registry.digest }}
            </bx-tag>
          </dds-tag-group>

          <!-- eslint-disable -->
          <dds-cta-block no-border>
            <dds-link-list slot="link-list" type="end">
              <dds-link-list-item
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
              </dds-link-list-item>
              <dds-link-list-item
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
              </dds-link-list-item>
              <dds-link-list-item
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
              </dds-link-list-item>
              <dds-link-list-item
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
              </dds-link-list-item>
              <dds-link-list-item
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
              </dds-link-list-item>
            </dds-link-list>
          </dds-cta-block>
          <!-- eslint-enable -->
        </dds-content-block>
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
  </div>
</template>

<script>
import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getDeploymentEndpoint } from "@/functions/public_path";

import St4sdBestPracticesProgressIndicator from "@/components/St4sdBestPracticesProgressIndicator";
import runExperimentFormModal from "@/canvas/components/modals/experiment/runExperimentFormModal.vue";
import runExperimentForm from "@/canvas/components/forms/runExperimentForm.vue";

import "@carbon/ibmdotcom-web-components/es/components/link-list/index.js";
import "@carbon/ibmdotcom-web-components/es/components/cta-section/index.js";
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
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

<style lang="scss">
dds-content-block {
  padding-bottom: 0;
  padding-top: 0;
}
dds-structured-list-cell {
  overflow-wrap: anywhere;
}

dds-cta-block {
  padding: 0;
  font-size: 16px;

  @media screen and (max-width: 672px) {
    padding-top: 2rem;
  }
}

bx-toggle {
  padding-bottom: 1rem !important;
}

.inputs {
  width: 100%;
}

.input-wrapper {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.remove-button {
  width: 7.5% !important;
  background-color: #0f62fe;
}

.add-button {
  width: 12% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style scoped lang="scss">
@media screen and (max-width: 671px) {
  dds-content-block-copy,
  dds-content-block-heading,
  dds-text-cta {
    margin-left: 0;
  }
}
</style>
