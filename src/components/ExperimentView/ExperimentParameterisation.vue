<template>
  <!-- Execution Details -->
  <div>
    <!-- Experiment execution options -->
    <div class="cds--row pad1">
      <ExperimentViewContentBlock
        title="Execution options"
        subTitle="These parameters can be overridden by the user"
      />
      <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell class="cds--col-sm-1"
                >Setting</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell class="cds--col-sm-3"
                >Value</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <!-- Data -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.data.length != 0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Data files</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="(entry, idx) in experiment.parameterisation
                      .executionOptions.data"
                    :key="idx"
                  >
                    <code>{{ entry.name }}</code>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Platform -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.platform.length !=
                0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Platforms</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="platform in experiment.parameterisation
                      .executionOptions.platform"
                    :key="platform"
                  >
                    <code>{{ platform }}</code>
                  </cds-list-item>
                </cds-unordered-list></cds-structured-list-cell
              ></cds-structured-list-row
            >

            <!-- Runtime args -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.runtime.args
                  .length != 0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Runtime arguments</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="arg in experiment.parameterisation.executionOptions
                      .runtime.args"
                    :key="arg"
                  >
                    <code>{{ arg }}</code>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Runtime resources -->
            <cds-structured-list-row
              v-if="
                Object.keys(
                  experiment.parameterisation.executionOptions.runtime
                    .resources,
                ).length != 0
              "
              ><cds-structured-list-cell class="cds--col-sm-1"
                >Runtime resources (CPU/Memory)</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                {{
                  experiment.parameterisation.executionOptions.runtime.resources
                    .cpu
                }}
                CPUs,
                {{
                  experiment.parameterisation.executionOptions.runtime.resources
                    .memory
                }}
                RAM
              </cds-structured-list-cell></cds-structured-list-row
            >

            <!-- Variables -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.variables.length !=
                0
              "
              ><cds-structured-list-cell class="cds--col-sm-1"
                >Variables</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="(entry, idx) in experiment.parameterisation
                      .executionOptions.variables"
                    :key="idx"
                  >
                    <code>{{ entry.name }}</code>
                    <template
                      v-if="
                        'executionOptionsDefaults' in
                          experiment.metadata.registry &&
                        experiment.metadata.registry.executionOptionsDefaults.variables.find(
                          (item) => item.name == entry.name,
                        ) != null &&
                        experiment.metadata.registry.executionOptionsDefaults.variables.find(
                          (item) => item.name == entry.name,
                        ).length != 0
                      "
                    >
                      <cds-unordered-list>
                        <cds-list-item
                          v-if="
                            allPlatformHaveSameValue(
                              experiment.metadata.registry.executionOptionsDefaults.variables.find(
                                (item) => item.name == entry.name,
                              ).valueFrom,
                            )
                          "
                        >
                          All platforms:
                          <code>{{
                            experiment.metadata.registry.executionOptionsDefaults.variables.find(
                              (item) => item.name == entry.name,
                            ).valueFrom[0].value
                          }}</code>
                        </cds-list-item>
                        <cds-list-item
                          v-else
                          v-for="(
                            option, optIdx
                          ) in experiment.metadata.registry.executionOptionsDefaults.variables.find(
                            (item) => item.name == entry.name,
                          ).valueFrom"
                          :key="optIdx"
                        >
                          <code>{{ option.platform }}</code
                          >: <code>{{ option.value }}</code>
                        </cds-list-item>
                      </cds-unordered-list>
                    </template>

                    <div v-if="'valueFrom' in entry">
                      <cds-unordered-list>
                        <cds-list-item
                          v-for="(option, optIdx) in entry.valueFrom"
                          :key="optIdx"
                        >
                          <code>{{ option.value }}</code>
                        </cds-list-item>
                      </cds-unordered-list>
                    </div>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell></cds-structured-list-row
            >
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
    <!-- Experiment presets -->
    <div class="cds--row pad1">
      <ExperimentViewContentBlock
        title="Preset parameters"
        subTitle="These parameters cannot be changed"
      />
      <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell class="cds--col-sm-1"
                >Setting</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell class="cds--col-sm-3"
                >Value</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <!-- Data -->
            <cds-structured-list-row
              v-if="experiment.parameterisation.presets.data.length != 0"
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Data files</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="entry in experiment.parameterisation.presets.data"
                    :key="entry"
                  >
                    {{ entry.name }}
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Platform -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.presets.platform != null ||
                experiment.parameterisation.executionOptions.platform.length ==
                  0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Platform</cds-structured-list-cell
              >
              <cds-structured-list-cell
                class="cds--col-sm-3"
                v-if="experiment.parameterisation.presets.platform != null"
              >
                <code>{{ experiment.parameterisation.presets.platform }}</code>
              </cds-structured-list-cell>
              <cds-structured-list-cell
                class="cds--col-sm-3"
                v-else-if="
                  experiment.parameterisation.executionOptions.platform
                    .length == 0
                "
              >
                <code>default</code>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Environment variables -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.presets.environmentVariables
                  .length != 0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Environment variables</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="(entry, idx) in experiment.parameterisation.presets
                      .environmentVariables"
                    :key="idx"
                  >
                    {{ entry.name }}
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Runtime args -->
            <cds-structured-list-row
              v-if="
                experiment.parameterisation.presets.runtime.args.length != 0
              "
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Runtime arguments</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="arg in experiment.parameterisation.presets.runtime
                      .args"
                    :key="arg"
                  >
                    <code>{{ arg }}</code>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <!-- Runtime resources -->
            <cds-structured-list-row
              v-if="
                Object.keys(
                  experiment.parameterisation.presets.runtime.resources,
                ).length != 0
              "
              ><cds-structured-list-cell class="cds--col-sm-1"
                >Runtime resources (CPU/Memory)</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                {{ experiment.parameterisation.presets.runtime.resources.cpu }}
                CPUs,
                {{
                  experiment.parameterisation.presets.runtime.resources.memory
                }}
                RAM
              </cds-structured-list-cell></cds-structured-list-row
            >

            <!-- Variables -->
            <cds-structured-list-row
              v-if="experiment.parameterisation.presets.variables.length != 0"
              ><cds-structured-list-cell class="cds--col-sm-1"
                >Variables</cds-structured-list-cell
              >
              <cds-structured-list-cell class="cds--col-sm-3">
                <cds-unordered-list>
                  <cds-list-item
                    v-for="(entry, idx) in experiment.parameterisation.presets
                      .variables"
                    :key="idx"
                  >
                    <code>{{ entry.name }}</code
                    >: <code>{{ entry.value }}</code>
                  </cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell></cds-structured-list-row
            >
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
import "@carbon/web-components/es/components/structured-list/index.js";
import "@carbon/web-components/es/components/list/index.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "ExperimentParameterisation",
  props: {
    experiment: Object,
    id: String,
  },
  components: {
    ExperimentViewContentBlock,
  },
  methods: {
    allPlatformHaveSameValue(defaultValues) {
      let currentValue = defaultValues[0].value;
      for (let i = 0; i < defaultValues.length; i++) {
        if (defaultValues[i].value != currentValue) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/styles/structured-list-grid-column-styles.css";
</style>
