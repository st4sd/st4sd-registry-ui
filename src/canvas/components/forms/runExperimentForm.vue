<template>
  <div v-if="pageNo == 0" class="tab-panels">
    <RunExperimentFiles />
    <FilesTable :experiment="experiment" />
  </div>
  <div v-if="pageNo == 1" class="tab-panels">
    <RunExperimentVariables :experiment="experiment" />
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/accordion.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/textarea.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/tabs.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/toggle.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/dropdown.min.js";
import "@carbon/web-components/es/components/text-input/index.js";

import InputConfigurationS3Form from "@/components/ExperimentView/InputConfigurationS3Form.vue";
import RunExperimentFiles from "@/components/ExperimentView/ExperimentFiles/RunExperimentFiles.vue";
import RunExperimentVariables from "@/components/ExperimentView/RunExperimentVariables.vue";
import FilesTable from "@/components/ExperimentView/ExperimentFiles/FilesTable.vue";

export default {
  name: "RunExperimentForm",
  props: {
    experiment: Object,
    formEmit: Boolean,
    title: String,
    pageNo: Number,
  },
  watch: {
    formEmit(newValue) {
      if (newValue == true) {
        this.emitRunExperimentPayload();
      }
    },
  },
  emits: ["post-experiment-run"],
  components: {
    FilesTable,
    RunExperimentFiles,
    InputConfigurationS3Form,
    RunExperimentVariables,
  },
  data() {
    return {
      storeIns3Bucket: true,
      s3StoreKeyAdded: false,
      s3StoreCredentialsKeyAdded: false,
      s3KeyAdded: false,
      runtimePolicyKeyAdded: false,
      platform: "",
      volumeTypeKey: "persistentVolumeClaim",
      runtimePolicy: {
        name: "",
        config: {},
      },
      runtimePolicyConfigKey: "",
      runtimePolicyConfigValue: "",
      environmentalVariable: {
        name: "",
        value: "",
      },
      metadata: {
        name: "",
        value: "",
      },
      experimentData: { name: "", value: "" },
      additionalOption: "",
      data: { name: "", value: "" },
      variable: { name: "", value: "" },
      volume: {
        type: {
          persistentVolumeClaim: "",
          dataset: "",
          configMap: "",
          secret: "",
        },
        applicationDependency: "",
        subPath: "",
      },
      input: {
        filename: "",
        content: "",
      },
      s3: {
        dataset: "",
        accessKey: "",
        secretAccessKey: "",
        bucket: "",
        endpoint: "",
        region: "",
      },
      s3Store: {
        bucketPath: "",
        credentials: {
          accessKey: "",
          secretAccessKey: "",
          bucket: "",
          endpoint: "",
          region: "",
        },
        datasetStoreURI: "",
      },
      runExperimentPayload: {},
    };
  },
  methods: {
    handleVolumeDropdownSelect(event) {
      this.volumeTypeKey = event.target.value;
      this.volume.type = {
        persistentVolumeClaim: "",
        dataset: "",
        configMap: "",
        secret: "",
      };
    },
    handleStoreToggle() {
      this.storeIns3Bucket = !this.storeIns3Bucket;
    },
    addKeyToPayload(key, value) {
      this.runExperimentPayload[key] = value;
    },
    addToArray(key, value) {
      this.runExperimentPayload[key].push(value);
    },
    validateObjectForEmptyValues(object) {
      Object.keys(object).forEach(function (key) {
        if (object[key] == "") {
          delete object[key];
        }
      });
      return object;
    },
    addToPayloadArray(key, value) {
      if (typeof value == "object") {
        if (key == "volumes") {
          value.type = this.validateObjectForEmptyValues(this.volume.type);
          this.addToArray(key, this.validateObjectForEmptyValues(value));
          setTimeout(() => this.addLightColorThemeToDropdown(), 3);
        } else {
          this.addToArray(key, this.validateObjectForEmptyValues(value));
        }
      }
      if (typeof value == "string") {
        this.addToArray(key, value);
      }
      this.resetCurrentInput(key);
    },
    addObjectToPayload(key, value) {
      let keyArr = key.split(".");
      if (keyArr.length == 2) {
        this.runExperimentPayload[keyArr[0]][keyArr[1]][value.name] =
          value.value;
      } else {
        this.runExperimentPayload[keyArr[0]][value.name] = value.value;
      }
      this.resetInputObjects(key);
    },
    resetCurrentInput(key) {
      if (key == "inputs") {
        this.resetInputs();
      }
      if (key == "data") {
        this.resetData();
      }
      if (key == "volumes") {
        this.resetVolumes();
      }
      if (key == "additionalOptions") {
        this.resetAdditionalOptions();
      }
    },
    resetInputs() {
      this.input = {
        filename: "",
        content: "",
      };
    },
    resetData() {
      this.data = { name: "", value: "" };
    },
    resetVolumes() {
      this.volume = {
        type: {
          persistentVolumeClaim: "",
          dataset: "",
          configMap: "",
          secret: "",
        },
        applicationDependency: "",
        subPath: "",
      };
    },
    resetAdditionalOptions() {
      this.additionalOption = "";
    },
    removeFromArray(key, idx) {
      let keyArr = key.split(".");
      if (keyArr.length == 2) {
        this.runExperimentPayload[keyArr[0]][keyArr[1]].splice(idx, 1);
      } else {
        this.runExperimentPayload[keyArr[0]].splice(idx, 1);
      }
    },
    removeFromObject(key, deleteKey) {
      let keyArr = key.split(".");
      if (keyArr.length == 2) {
        delete this.runExperimentPayload[keyArr[0]][keyArr[1]][deleteKey];
      } else if (keyArr.length == 1) {
        delete this.runExperimentPayload[keyArr[0]][deleteKey];
      }
    },
    removeString(key, index) {
      this.runExperimentPayload[key].splice(index, 1);
    },
    resetInputObjects(variable) {
      let obj = { name: "", value: "" };
      if (variable == "runtimePolicy.config") {
        this.runtimePolicy = obj;
      }
      if (variable == "environmentalVariables") {
        this.environmentalVariable = obj;
      }
      if (variable == "metadata") {
        this.metadata = obj;
      }
      if (variable == "variables") {
        this.variable = obj;
      }
    },
    addPlatformToPayload() {
      this.runExperimentPayload["platform"] = this.platform;
    },
    addS3KeyToPayload() {
      if (!this.s3KeyAdded) {
        this.runExperimentPayload["s3"] = {};
        this.s3KeyAdded = true;
      }
    },
    addS3ObjectToPayload(key, value) {
      this.runExperimentPayload.s3[key] = value;
    },
    addRunTimePolicyKeyToPayload() {
      if (!this.runtimePolicyKeyAdded) {
        this.runExperimentPayload["runtimePolicy"] = {};
        this.runtimePolicyKeyAdded = true;
      }
    },
    addRuntimePolicyNameToPayload(key, value) {
      this.runExperimentPayload.runtimePolicy[key] = value;
    },
    addRuntimePolicyConfigToPayload(key1, key2, value) {
      this.runExperimentPayload.runtimePolicy[key1] = {};
      this.runExperimentPayload.runtimePolicy[key1][key2] = value;
    },
    addS3StoreKeyToPayload() {
      if (!this.s3StoreKeyAdded) {
        this.runExperimentPayload["s3Store"] = {};
        this.s3StoreKeyAdded = true;
      }
    },
    addS3StoreObjectToPayload(key, value) {
      this.runExperimentPayload.s3Store[key] = value;
    },
    addS3StoreCredentialsToPayload(key, value) {
      if (!this.s3StoreCredentialsKeyAdded) {
        this.runExperimentPayload.s3Store["credentials"] = {};
        this.s3StoreCredentialsKeyAdded = true;
      }
      this.runExperimentPayload.s3Store.credentials[key] = value;
    },
    emitRunExperimentPayload() {
      this.$emit("post-experiment-run", this.runExperimentPayload);
    },
    addLightColorThemeToDropdown() {
      [...document.getElementsByClassName("dropdown")].forEach((dropdown) => {
        dropdown.setAttribute("color-scheme", "light");
      });
    },
  },
  mounted() {
    this.addLightColorThemeToDropdown();
  },
};
</script>

<style scoped>
.tab-panels {
  padding-top: 1rem;
}
bx-tabs {
  overflow: hidden !important;
}
</style>
