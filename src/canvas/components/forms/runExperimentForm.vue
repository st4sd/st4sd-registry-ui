<template>
  <bx-tabs trigger-content="Select an item" value="inputs">
    <bx-tab id="tab-inputs" target="panel-inputs" value="inputs">Inputs</bx-tab>
    <bx-tab id="tab-options" target="panel-options" value="options"
      >Options</bx-tab
    >
    <bx-tab id="tab-outputs" target="panel-outputs" value="oututs"
      >Store Outputs</bx-tab
    >
  </bx-tabs>
  <div class="bx-ce-demo-devenv--tab-panels">
    <div
      id="panel-inputs"
      role="tabpanel"
      aria-labelledby="tab-inputs"
      hidden
      class="tab-panels"
    >
      <h4>Inputs</h4>
      <p>Choose the input type:</p>
      <bx-tabs trigger-content="Select an item" value="file">
        <bx-tab id="tab-file" target="panel-file" value="file"
          >File Upload</bx-tab
        >
        <bx-tab id="tab-s3" target="panel-s3" value="s3">S3 Bucket</bx-tab>
        <bx-tab id="tab-datashim" target="panel-datashim" value="datashim"
          >Datashim</bx-tab
        >
      </bx-tabs>
      <div class="bx-ce-demo-devenv--tab-panels tab-panel">
        <div
          id="panel-file"
          role="tabpanel"
          aria-labelledby="tab-file"
          hidden
          class="tab-panels"
        >
          <div v-if="runExperimentPayload.inputs != undefined">
            <div v-for="(input, idx) in runExperimentPayload.inputs" :key="idx">
              <cds-text-input
                @input="input.filename = $event.target.value"
                :value="input.filename"
                label="Filename"
                class="cds-theme-zone-g10"
              />
              <bx-textarea
                rows="4"
                cols="50"
                @input="input.content = $event.target.value"
                :value="input.content"
                label-text="File contents"
              ></bx-textarea>
              <button @click="removeFromArray('inputs', idx)">X</button>
            </div>
          </div>
          <h4>Add Inputs</h4>
          <cds-text-input
            @input="input.filename = $event.target.value"
            :value="input.filename"
            label="Filename"
            class="cds-theme-zone-g10"
          />
          <bx-textarea
            rows="4"
            cols="50"
            @input="input.content = $event.target.value"
            :value="input.content"
            label-text="File contents"
            colorScheme="light"
          ></bx-textarea>
          <button
            @click.once="addKeyToPayload('inputs', [])"
            @click="addToPayloadArray('inputs', { ...input })"
          >
            Add
          </button>
          <h4>Data</h4>
          <p>
            Optional- overrides contents of data files, similarly to providing
            inputs is not allowed in cases where data is defined in
            parameterisation presets
          </p>
          <div
            v-for="(option, idx) in runExperimentPayload.data"
            v-bind:key="idx"
          >
            <cds-text-input
              @input="option.name = $event.target.value"
              :value="option.name"
              label="Filename"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              @input="option.value = $event.target.value"
              :value="option.value"
              label="Content"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromArray('data', idx)">X</button>
          </div>
          <br />
          <p>Add Data:</p>
          <cds-text-input
            @input="data.name = $event.target.value"
            :value="data.name"
            label="Filename"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            @input="data.value = $event.target.value"
            :value="data.value"
            label="Content"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('data', [])"
            @click="addToPayloadArray('data', { ...data })"
          >
            Add
          </button>
        </div>

        <div
          id="panel-s3"
          role="tabpanel"
          aria-labelledby="tab-s3"
          hidden
          class="tab-panels"
        >
          <h4>Inputs for S3</h4>
          <cds-text-input
            @input="
              s3.accessKey = $event.target.value;
              addS3KeyToPayload();
              addS3ObjectToPayload('accessKey', s3.accessKey);
            "
            :value="s3.accessKey"
            label="S3 accessKey"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            @input="
              s3.secretAccessKey = $event.target.value;
              addS3KeyToPayload();
              addS3ObjectToPayload('secretAccessKey', s3.secretAccessKey);
            "
            :value="s3.secretAccessKey"
            label="S3 secretAccessKey"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            @input="
              s3.bucket = $event.target.value;
              addS3KeyToPayload();
              addS3ObjectToPayload('bucket', s3.bucket);
            "
            :value="s3.bucket"
            label="S3 bucket"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            @input="
              s3.endpoint = $event.target.value;
              addS3KeyToPayload();
              addS3ObjectToPayload('endpoint', s3.endpoint);
            "
            :value="s3.endpoint"
            label="S3 endpoint"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            @input="
              s3.region = $event.target.value;
              addS3KeyToPayload();
              addS3ObjectToPayload('region', s3.region);
            "
            :value="s3.region"
            label="S3 region"
            class="cds-theme-zone-g10"
          />
          <h4>Data</h4>
          <p>The contents of this data fill will be read from S3</p>
          <div
            v-for="(option, idx) in runExperimentPayload.data"
            v-bind:key="idx"
          >
            <cds-text-input
              @input="option.name = $event.target.value"
              :value="option.name"
              label="Filename"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromArray('data', idx)">X</button>
          </div>
          <br />
          <p>Add Data:</p>
          <cds-text-input
            @input="data.name = $event.target.value"
            :value="data.name"
            label="Filename"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('data', [])"
            @click="addToPayloadArray('data', { ...data })"
          >
            Add
          </button>
        </div>
        <div
          id="panel-datashim"
          role="tabpanel"
          aria-labelledby="tab-datashim"
          hidden
          class="tab-panels"
        >
          <h4>Inputs for Datashim</h4>
          <cds-text-input
            @input="s3.dataset = $event.target.value"
            :value="s3.dataset"
            label="S3 dataset"
            class="cds-theme-zone-g10"
          />
          <div>
            <h4>Data</h4>
            The contents of this data fill will be read from the S3 bucket that
            the dataset proxies
            <div
              v-for="(option, idx) in runExperimentPayload.data"
              v-bind:key="idx"
            >
              <cds-text-input
                @input="option.name = $event.target.value"
                :value="option.name"
                label="Filename"
                class="cds-theme-zone-g10"
              />
              <button @click="removeFromArray('data', idx)">X</button>
            </div>
          </div>
          <br />
          <p>Add Data:</p>
          <cds-text-input
            @input="data.name = $event.target.value"
            :value="data.name"
            label="Filename"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('data', [])"
            @click="addToPayloadArray('data', { ...data })"
          >
            Add
          </button>
        </div>
      </div>
    </div>
    <div
      id="panel-options"
      role="tabpanel"
      aria-labelledby="tab-options"
      hidden
      class="tab-panels"
    >
      <h4>Options</h4>
      <bx-accordion>
        <bx-accordion-item title-text="Platform">
          <cds-text-input
            @input="
              platform = $event.target.value;
              addPlatformToPayload();
            "
            :value="platform"
            label="Platform Name"
            class="cds-theme-zone-g10"
          />
        </bx-accordion-item>
        <bx-accordion-item title-text="Variables">
          <div
            v-for="(variable, key, idx) in runExperimentPayload.variables"
            v-bind:key="idx"
          >
            <cds-text-input
              :value="key"
              @input="key = $event.target.value"
              label="Name"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              :value="variable"
              @input="variable = $event.target.value"
              label="Value"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromObject('variables', key)">X</button>
          </div>

          <p>Add Variable</p>
          <cds-text-input
            :value="variable.name"
            @input="variable.name = $event.target.value"
            label="Name"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="variable.value"
            @input="variable.value = $event.target.value"
            label="Value"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('variables', {})"
            @click="
              addObjectToPayload('variables', {
                ...variable,
              })
            "
          >
            Add
          </button>
        </bx-accordion-item>
        <bx-accordion-item title-text="Additional Options">
          <div
            v-for="(option, idx) in runExperimentPayload.additionalOptions"
            v-bind:key="idx"
          >
            <cds-text-input
              :value="runExperimentPayload.additionalOptions[idx]"
              @input="
                runExperimentPayload.additionalOptions[idx] =
                  $event.target.value
              "
              label="Option"
              class="cds-theme-zone-g10"
            />
            <button @click="removeString('additionalOptions', idx)">X</button>
          </div>
          <p>Add Option</p>
          <cds-text-input
            :value="additionalOption"
            @input="additionalOption = $event.target.value"
            label="Option"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('additionalOptions', [])"
            @click="addToPayloadArray('additionalOptions', additionalOption)"
          >
            Add
          </button>
        </bx-accordion-item>
        <bx-accordion-item title-text="Environmental Variables">
          <div
            v-for="(
              option, key, idx
            ) in runExperimentPayload.environmentalVariables"
            v-bind:key="idx"
            colorScheme="light"
          >
            <cds-text-input
              :value="key"
              @input="key = $event.target.value"
              label="Name"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              :value="option"
              @input="option = $event.target.value"
              label="Value"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromObject('environmentalVariables', key)">
              X
            </button>
          </div>
          <p>Add Config Key & Value</p>
          <cds-text-input
            :value="environmentalVariable.name"
            @input="environmentalVariable.name = $event.target.value"
            label="Key"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="environmentalVariable.value"
            @input="environmentalVariable.value = $event.target.value"
            label="Value"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('environmentalVariables', {})"
            @click="
              addObjectToPayload('environmentalVariables', {
                ...environmentalVariable,
              })
            "
          >
            Add
          </button>
        </bx-accordion-item>
        <bx-accordion-item title-text="Metadata">
          <div
            v-for="(metadata, key, idx) in runExperimentPayload.metadata"
            v-bind:key="idx"
          >
            <cds-text-input
              :value="key"
              @input="key = $event.target.value"
              label="Name"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              :value="metadata"
              @input="metadata = $event.target.value"
              label="Value"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromObject('metadata', key)">X</button>
          </div>
          <p>Add Metadata Name & Value</p>
          <cds-text-input
            :value="metadata.name"
            @input="metadata.name = $event.target.value"
            label="Name"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="metadata.value"
            @input="metadata.value = $event.target.value"
            label="Value"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('metadata', {})"
            @click="addObjectToPayload('metadata', { ...metadata })"
          >
            Add
          </button>
        </bx-accordion-item>
        <bx-accordion-item title-text="Runtime Policy">
          <cds-text-input
            @input="
              runtimePolicy.name = $event.target.value;
              addRunTimePolicyKeyToPayload();
              addRuntimePolicyNameToPayload('name', runtimePolicy.name);
            "
            :value="runtimePolicy.name"
            label="Name"
            class="cds-theme-zone-g10"
          />
          <p>Config</p>
          <div v-if="runExperimentPayload.runtimePolicy != undefined">
            <div v-if="runExperimentPayload.runtimePolicy.config != undefined">
              <div
                v-for="(value, key, idx) in runExperimentPayload.runtimePolicy
                  .config"
                v-bind:key="idx"
              >
                <cds-text-input
                  :value="key"
                  @input="key = $event.target.value"
                  label="Key"
                  class="cds-theme-zone-g10"
                />
                <cds-text-input
                  :value="value"
                  @input="value = $event.target.value"
                  label="Value"
                  class="cds-theme-zone-g10"
                />
                <button @click="removeFromObject('runtimePolicy.config', key)">
                  X
                </button>
              </div>
            </div>
          </div>
          <p>Add Config Key & Value</p>
          <cds-text-input
            :value="runtimePolicyConfigKey"
            @input="runtimePolicyConfigKey = $event.target.value"
            label="Key"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="runtimePolicyConfigValue"
            @input="runtimePolicyConfigValue = $event.target.value"
            label="Value"
            class="cds-theme-zone-g10"
          />
          <button
            @click="
              addRunTimePolicyKeyToPayload();
              addRuntimePolicyConfigToPayload(
                'config',
                runtimePolicyConfigKey,
                runtimePolicyConfigValue,
              );
            "
          >
            Add
          </button>
        </bx-accordion-item>
      </bx-accordion>
      <h4>Mount Kubernetes Objects</h4>
      <bx-accordion>
        <bx-accordion-item title-text="Volumes">
          <div
            v-for="(volume, idx) in runExperimentPayload.volumes"
            v-bind:key="idx"
          >
            <bx-dropdown
              value="persistentVolumeClaim"
              label-text="Volume Type"
              @bx-dropdown-selected="handleVolumeDropdownSelect"
              class="dropdown"
            >
              <bx-dropdown-item value="persistentVolumeClaim"
                >persistentVolumeClaim</bx-dropdown-item
              >
              <bx-dropdown-item value="dataset">dataset</bx-dropdown-item>
              <bx-dropdown-item value="configMap">configMap</bx-dropdown-item>
              <bx-dropdown-item value="secret">secret</bx-dropdown-item>
            </bx-dropdown>
            <cds-text-input
              :value="runExperimentPayload.volumes[idx].type[volumeTypeKey]"
              @input="
                runExperimentPayload.volumes[idx].type[volumeTypeKey] =
                  $event.target.value
              "
              label="Volume Type Value"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              :value="runExperimentPayload.volumes[idx].applicationDependency"
              @input="
                runExperimentPayload.volumes[idx].applicationDependency =
                  $event.target.value
              "
              label="Volume Application Dependancy"
              class="cds-theme-zone-g10"
            />
            <cds-text-input
              :value="runExperimentPayload.volumes[idx].subPath"
              @input="
                runExperimentPayload.volumes[idx].subPath = $event.target.value
              "
              label="Volume SubPath"
              class="cds-theme-zone-g10"
            />
            <button @click="removeFromArray('volumes', idx)">X</button>
          </div>
          <p>Add Volume</p>
          <bx-dropdown
            value="persistentVolumeClaim"
            label-text="Volume Type"
            @bx-dropdown-selected="handleVolumeDropdownSelect"
            class="dropdown"
          >
            <bx-dropdown-item value="persistentVolumeClaim"
              >persistentVolumeClaim</bx-dropdown-item
            >
            <bx-dropdown-item value="dataset">dataset</bx-dropdown-item>
            <bx-dropdown-item value="configMap">configMap</bx-dropdown-item>
            <bx-dropdown-item value="secret">secret</bx-dropdown-item>
          </bx-dropdown>
          <cds-text-input
            :value="volume.type[volumeTypeKey]"
            @input="volume.type[volumeTypeKey] = $event.target.value"
            label="Volume Type Value"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="volume.applicationDependency"
            @input="volume.applicationDependency = $event.target.value"
            label="Volume Application Dependancy"
            class="cds-theme-zone-g10"
          />
          <cds-text-input
            :value="volume.subPath"
            @input="volume.subPath = $event.target.value"
            label="Volume SubPath"
            class="cds-theme-zone-g10"
          />
          <button
            @click.once="addKeyToPayload('volumes', [])"
            @click="addToPayloadArray('volumes', { ...volume })"
          >
            Add
          </button>
        </bx-accordion-item>
      </bx-accordion>
    </div>
    <div
      id="panel-outputs"
      role="tabpanel"
      aria-labelledby="tab-outputs"
      hidden
      class="tab-panels"
    >
      <h4>Choose your output store</h4>
      <bx-toggle
        id="store-toggle"
        checked-text="S3"
        unchecked-text="Datashim"
        checked
        @bx-toggle-changed="handleStoreToggle(event)"
      ></bx-toggle>
      <div v-if="storeIns3Bucket">
        <cds-text-input
          @input="
            s3Store.bucketPath = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreObjectToPayload('bucketPath', s3Store.bucketPath);
          "
          :value="s3Store.bucketPath"
          label="Bucket Path"
          class="cds-theme-zone-g10"
        />
        <cds-text-input
          @input="
            s3Store.credentials.accessKey = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreCredentialsToPayload(
              'accessKey',
              s3Store.credentials.accessKey,
            );
          "
          :value="s3Store.credentials.accessKey"
          label="S3 accessKey"
          class="cds-theme-zone-g10"
        />
        <cds-text-input
          @input="
            s3Store.credentials.secretAccessKey = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreCredentialsToPayload(
              'secretAccessKey',
              s3Store.credentials.secretAccessKey,
            );
          "
          :value="s3Store.credentials.secretAccessKey"
          label="S3 secretAccessKey"
          class="cds-theme-zone-g10"
        />
        <cds-text-input
          @input="
            s3Store.credentials.bucket = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreCredentialsToPayload(
              'bucket',
              s3Store.credentials.bucket,
            );
          "
          :value="s3Store.credentials.bucket"
          label="S3 bucket"
          class="cds-theme-zone-g10"
        />
        <cds-text-input
          @input="
            s3Store.credentials.endpoint = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreCredentialsToPayload(
              'endpoint',
              s3Store.credentials.endpoint,
            );
          "
          :value="s3Store.credentials.endpoint"
          label="S3 endpoint"
          class="cds-theme-zone-g10"
        />
        <cds-text-input
          @input="
            s3Store.credentials.region = $event.target.value;
            addS3StoreKeyToPayload();
            addS3StoreCredentialsToPayload(
              'region',
              s3Store.credentials.region,
            );
          "
          :value="s3Store.credentials.region"
          label="S3 region"
          class="cds-theme-zone-g10"
        />
      </div>
      <cds-text-input
        v-else
        @input="
          s3Store.datasetStoreURI = $event.target.value;
          addS3StoreKeyToPayload();
          addS3StoreObjectToPayload('datasetStoreURI', s3Store.datasetStoreURI);
        "
        :value="s3Store.datasetStoreURI"
        label="Dataset Store URI"
        class="cds-theme-zone-g10"
      />
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/input/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";

export default {
  name: "RunExperimentForm",
  props: {
    formEmit: Boolean,
  },
  watch: {
    formEmit(newValue) {
      if (newValue == true) {
        this.emitRunExperimentPayload();
      }
    },
  },
  emits: ["postExperimentRun"],
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
      this.$emit("postExperimentRun", this.runExperimentPayload);
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

<style>
.tab-panels {
  padding-top: 1rem;
}
bx-tabs {
  overflow: hidden !important;
}
</style>
