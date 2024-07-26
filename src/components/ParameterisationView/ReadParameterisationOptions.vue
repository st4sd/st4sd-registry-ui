<template>
  <div class="cds--row tab" v-if="tabSelector == 'platforms'">
    <div
      class="cds--col-lg-14 cds--col-md-6"
      v-if="pvep.parameterisation.presets.platform != undefined"
    >
      <h3>Platform</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Type</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row>
            <cds-structured-list-cell>{{
              pvep.parameterisation.presets.platform
            }}</cds-structured-list-cell>
            <cds-structured-list-cell>Preset</cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div
      class="cds--col-lg-14 cds--col-md-6"
      v-else-if="pvep.parameterisation.executionOptions.platform.length != 0"
    >
      <h3>Platform</h3>
      <p v-if="pvep.parameterisation.executionOptions.platform.length < 2">
        When launching the workflow, the platform can be set to any value, with
        the default being:
      </p>
      <p v-else>
        When launching the workflow, the platform can be set to one of the
        following values:
      </p>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Type</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(platform, idx) in pvep.parameterisation.executionOptions
              .platform"
            :key="idx"
          >
            <cds-structured-list-cell class="list-spacing">{{
              platform
            }}</cds-structured-list-cell>
            <cds-structured-list-cell
              >Execution Option</cds-structured-list-cell
            >
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div v-else class="cds--col-lg-14 cds--col-md-6">
      <h3>Platform</h3>
      <p>
        When launching the workflow, the platform can be set to any value, with
        the default being:
      </p>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Type</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row>
            <cds-structured-list-cell class="list-spacing"
              >default</cds-structured-list-cell
            >
            <cds-structured-list-cell
              >Execution Option</cds-structured-list-cell
            >
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
  </div>
  <div v-if="tabSelector == 'variables'" class="cds--row tab">
    <div
      v-if="variables != undefined && variables.length != 0"
      class="cds--col-lg-14 cds--col-md-6"
    >
      <h3>Variables</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >Name</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Type</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Value</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(variable, idx) in variables"
            :key="idx"
          >
            <cds-structured-list-cell class="list-spacing">{{
              variable.name
            }}</cds-structured-list-cell>
            <cds-structured-list-cell>
              <span v-if="variable.type == 'presets'">Preset</span>
              <span v-else-if="variable.type == 'default'">Default</span>
              <span v-else>Execution Option</span>
            </cds-structured-list-cell>
            <cds-structured-list-cell>
              <p
                v-if="variable.value != undefined && variable.type == 'presets'"
              >
                {{ variable.value }}
              </p>
              <span
                v-else-if="
                  variable.type == 'executionOptions' && variable.value == ''
                "
              >
                <p>Any value accepted</p>
                <p>Default: set by platform</p>
              </span>
              <span
                v-else-if="
                  'value' in variable && variable.type == 'executionOptions'
                "
              >
                <p>Any value accepted</p>
                <p>Default: {{ variable.value }}</p>
              </span>
              <span
                v-else-if="
                  'valueFrom' in variable && variable.type == 'executionOptions'
                "
              >
                <p>Possible Values:</p>
                <p v-for="(value, idx) in variable.valueFrom" :key="idx">
                  -{{ value.value }}
                </p>
              </span>
              <span v-else-if="variable.type == 'default'">
                <span
                  v-if="
                    allPlatformHaveSameValue(
                      this.executionOptionsDefaults.variables.find(
                        (item) => item.name == variable.name,
                      ).valueFrom,
                    )
                  "
                >
                  <p>Set by platform:</p>
                  <p>
                    - All platforms:
                    {{
                      this.executionOptionsDefaults.variables.find(
                        (item) => item.name == variable.name,
                      ).valueFrom[0].value
                    }}
                  </p>
                </span>
                <span v-else>
                  <p>Set by platform:</p>
                  <p
                    v-for="(platform, index) in findPlatformValues(variable)"
                    :key="index"
                  >
                    -{{ platform.platform }}: {{ platform.value }}
                  </p>
                </span>
              </span>
            </cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
  </div>
  <div v-if="tabSelector == 'data'" class="cds--row tab">
    <div
      class="cds--col-lg-14 cds--col-md-6"
      v-if="dataOptions != undefined && dataOptions.length != 0"
    >
      <h3>Data Files</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >File</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Type</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row
            v-for="(file, idx) in dataOptions"
            :key="idx"
          >
            <cds-structured-list-cell class="list-spacing">{{
              file.name
            }}</cds-structured-list-cell>
            <cds-structured-list-cell v-if="file.type == 'presets'">
              Preset
            </cds-structured-list-cell>
            <cds-structured-list-cell v-else
              >Execution Option</cds-structured-list-cell
            >
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div v-else>
      <div class="cds--col-lg-16 cds--col-md-8">
        <h3>Data Files</h3>
        <p>No Data Files</p>
      </div>
    </div>
  </div>
  <div v-if="tabSelector == 'input'" class="cds--row tab">
    <div class="cds--col-lg-14 cds--col-md-6" v-if="inputs != undefined">
      <h3>Input Files</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >File</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row v-for="(input, idx) in inputs" :key="idx">
            <cds-structured-list-cell class="list-spacing">{{
              input.name
            }}</cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div v-else>
      <div class="cds--col-lg-16 cds--col-md-8">
        <h3>Input Files</h3>
        <p>No Input Files</p>
      </div>
    </div>
  </div>
  <div v-if="tabSelector == 'runtime'" class="cds--row tab">
    <div
      v-if="runtimeArgs != undefined && runtimeArgs.length != 0"
      class="cds--col-lg-14 cds--col-md-6"
    >
      <h3>Runtime Args</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >Name</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row v-for="(arg, idx) in runtimeArgs" :key="idx">
            <cds-structured-list-cell class="list-spacing">{{
              arg
            }}</cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div v-else>
      <div class="cds--col-lg-16 cds--col-md-8">
        <h3>Runtime Args</h3>
        <p>No Runtime Args</p>
      </div>
    </div>
    <div
      v-if="
        orchestratorResources != undefined &&
        Object.keys(orchestratorResources).length != 0
      "
      class="cds--col-lg-14 cds--col-md-6"
    >
      <h3 id="orchestrator-resources">Orchestrator Resources</h3>
      <cds-structured-list>
        <cds-structured-list-head>
          <cds-structured-list-header-row>
            <cds-structured-list-header-cell class="list-spacing"
              >Resource</cds-structured-list-header-cell
            >
            <cds-structured-list-header-cell
              >Value</cds-structured-list-header-cell
            >
          </cds-structured-list-header-row>
        </cds-structured-list-head>
        <cds-structured-list-body>
          <cds-structured-list-row>
            <cds-structured-list-cell class="list-spacing"
              >CPU</cds-structured-list-cell
            >
            <cds-structured-list-cell>{{
              orchestratorResources.cpu
            }}</cds-structured-list-cell>
          </cds-structured-list-row>
          <cds-structured-list-row>
            <cds-structured-list-cell class="list-spacing"
              >Memory</cds-structured-list-cell
            >
            <cds-structured-list-cell>{{
              orchestratorResources.memory
            }}</cds-structured-list-cell>
          </cds-structured-list-row>
        </cds-structured-list-body>
      </cds-structured-list>
    </div>
    <div v-else>
      <div class="cds--col-lg-16 cds--col-md-8">
        <h3 id="orchestrator-resources">Orchestrator Resources</h3>
        <p>No Orchestrator Resources</p>
      </div>
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import {
  setRuntimeArgs,
  setVariables,
  setOrchestratorResources,
  sortDataFiles,
} from "@/functions/setup_parameterisation_variables";

export default {
  name: "ReadParamterisationOptions",
  props: {
    tabSelector: String,
    pvep: Object,
  },
  data() {
    return {
      presetData: [],
      executionOptionsData: null,
      initialParameterisation: null,
      initialParameterisationSet: false,
      parameterisation: null,
      inputs: null,
      parameterisationOptionsLoading: true,
      variables: null,
      dataExecutionOptions: null,
      dataOptions: null,
      runtimeArgs: null,
      runtimeArgsInvalid: [],
      orchestratorResources: null,
      orchestratorResourcesInvalid: [],
      entry: null,
      platformOptions: null,
      executionOptionsDefaults: null,
    };
  },
  watch: {
    pvep: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.executionOptionsData = val.parameterisation.executionOptions.data;
        if (this.executionOptionsData.length == 0) {
          val.metadata.registry.data.forEach((option) =>
            this.presetData.push({ name: option.name, type: "presets" }),
          );
        } else {
          this.presetData = val.metadata.registry.data.filter(
            (option) =>
              this.executionOptionsData
                .map((file) => file.name)
                .indexOf(option.name) == -1,
          );
          this.presetData.forEach((option) => (option.type = "presets"));
        }
        this.executionOptionsDefaults =
          val.metadata.registry.executionOptionsDefaults;
        this.platformOptions = val.metadata.registry.platforms;
        this.dataOptions = this.presetData.concat(this.executionOptionsData);
        this.dataOptions = sortDataFiles(this.dataOptions);
        this.parameterisation = val.parameterisation;
        this.inputs = val.metadata.registry.inputs;
        this.parameterisationOptionsLoading = false;
        this.variables = setVariables(val);
        this.runtimeArgs = setRuntimeArgs(val);
        this.orchestratorResources = setOrchestratorResources(val);
      },
    },
  },
  methods: {
    allPlatformHaveSameValue(defaultValues) {
      return defaultValues.every(
        (value) => value.value == defaultValues[0].value,
      );
    },
    findPlatformValues(variable) {
      return this.pvep.metadata.registry.executionOptionsDefaults.variables.find(
        (item) => item.name == variable.name,
      ).valueFrom;
    },
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
p {
  font-size: 0.875rem;
}

h3 {
  padding-bottom: layout.$spacing-05;
}

.tab {
  margin-left: layout.$spacing-07;
  margin-right: layout.$spacing-07;
}
.execution-options-input {
  width: 100%;
}

.list-spacing {
  min-width: 12rem;
}

#orchestrator-resources {
  padding-top: layout.$spacing-05;
}
</style>
