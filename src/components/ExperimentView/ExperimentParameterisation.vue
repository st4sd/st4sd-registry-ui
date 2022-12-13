<template>
  <!-- Execution Details -->
  <div>
    <!-- Experiment execution options -->
    <div class="cds--row pad1">
      <div class="cds--col-lg-4">
        <dds-content-block class="ve-content-block">
          <dds-content-block-heading class="ve-heading"
            >Execution options</dds-content-block-heading
          >
          <div class="ve-copy">
            These parameters can be overridden by the user
          </div>
        </dds-content-block>
      </div>
      <div class="cds--col">
        <dds-structured-list>
          <dds-structured-list-head>
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Setting</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Value</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
          </dds-structured-list-head>
          <dds-structured-list-body>
            <!-- Data -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.data.length != 0
              "
            >
              <dds-structured-list-cell>Data files</dds-structured-list-cell>
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="(entry, idx) in experiment.parameterisation
                      .executionOptions.data"
                    :key="idx"
                  >
                    <code>{{ entry.name }}</code>
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Platform -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.platform.length !=
                0
              "
            >
              <dds-structured-list-cell>Platforms</dds-structured-list-cell>
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="platform in experiment.parameterisation
                      .executionOptions.platform"
                    :key="platform"
                  >
                    <code>{{ platform }}</code>
                  </bx-list-item>
                </bx-unordered-list></dds-structured-list-cell
              ></dds-structured-list-row
            >

            <!-- Runtime args -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.runtime.args
                  .length != 0
              "
            >
              <dds-structured-list-cell
                >Runtime arguments</dds-structured-list-cell
              >
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="arg in experiment.parameterisation.executionOptions
                      .runtime.args"
                    :key="arg"
                  >
                    <code>{{ arg }}</code>
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Runtime resources -->
            <dds-structured-list-row
              v-if="
                Object.keys(
                  experiment.parameterisation.executionOptions.runtime.resources
                ).length != 0
              "
              ><dds-structured-list-cell
                >Runtime resources (CPU/Memory)</dds-structured-list-cell
              >
              <dds-structured-list-cell>
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
              </dds-structured-list-cell></dds-structured-list-row
            >

            <!-- Variables -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.executionOptions.variables.length !=
                0
              "
              ><dds-structured-list-cell>Variables</dds-structured-list-cell>
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
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
                          (item) => item.name == entry.name
                        ) != null &&
                        experiment.metadata.registry.executionOptionsDefaults.variables.find(
                          (item) => item.name == entry.name
                        ).length != 0
                      "
                    >
                      <bx-unordered-list>
                        <bx-list-item
                          v-if="
                            allPlatformHaveSameValue(
                              experiment.metadata.registry.executionOptionsDefaults.variables.find(
                                (item) => item.name == entry.name
                              ).valueFrom
                            )
                          "
                        >
                          All platforms:
                          <code>{{
                            experiment.metadata.registry.executionOptionsDefaults.variables.find(
                              (item) => item.name == entry.name
                            ).valueFrom[0].value
                          }}</code>
                        </bx-list-item>
                        <bx-list-item
                          v-else
                          v-for="(
                            option, optIdx
                          ) in experiment.metadata.registry.executionOptionsDefaults.variables.find(
                            (item) => item.name == entry.name
                          ).valueFrom"
                          :key="optIdx"
                        >
                          <code>{{ option.platform }}</code
                          >: <code>{{ option.value }}</code>
                        </bx-list-item>
                      </bx-unordered-list>
                    </template>

                    <div v-if="'valueFrom' in entry">
                      <bx-unordered-list>
                        <bx-list-item
                          v-for="(option, optIdx) in entry.valueFrom"
                          :key="optIdx"
                        >
                          <code>{{ option.value }}</code>
                        </bx-list-item>
                      </bx-unordered-list>
                    </div>
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell></dds-structured-list-row
            >
          </dds-structured-list-body>
        </dds-structured-list>
      </div>
    </div>
    <!-- Experiment presets -->
    <div class="cds--row pad1">
      <div class="cds--col-lg-4">
        <dds-content-block class="ve-content-block">
          <dds-content-block-heading class="ve-heading"
            >Preset parameters</dds-content-block-heading
          >
          <div class="ve-copy">These parameters cannot be changed</div>
        </dds-content-block>
      </div>
      <div class="cds--col">
        <dds-structured-list>
          <dds-structured-list-head>
            <dds-structured-list-header-row>
              <dds-structured-list-header-cell
                >Setting</dds-structured-list-header-cell
              >
              <dds-structured-list-header-cell
                >Value</dds-structured-list-header-cell
              >
            </dds-structured-list-header-row>
          </dds-structured-list-head>
          <dds-structured-list-body>
            <!-- Data -->
            <dds-structured-list-row
              v-if="experiment.parameterisation.presets.data.length != 0"
            >
              <dds-structured-list-cell>Data files</dds-structured-list-cell>
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="entry in experiment.parameterisation.presets.data"
                    :key="entry"
                  >
                    {{ entry.name }}
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Platform -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.presets.platform != null ||
                experiment.parameterisation.executionOptions.platform.length ==
                  0
              "
            >
              <dds-structured-list-cell>Platform</dds-structured-list-cell>
              <dds-structured-list-cell
                v-if="experiment.parameterisation.presets.platform != null"
              >
                <code>{{ experiment.parameterisation.presets.platform }}</code>
              </dds-structured-list-cell>
              <dds-structured-list-cell
                v-else-if="
                  experiment.parameterisation.executionOptions.platform
                    .length == 0
                "
              >
                <code>default</code>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Environment variables -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.presets.environmentVariables
                  .length != 0
              "
            >
              <dds-structured-list-cell
                >Environment variables</dds-structured-list-cell
              >
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="(entry, idx) in experiment.parameterisation.presets
                      .environmentVariables"
                    :key="idx"
                  >
                    {{ entry.name }}
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Runtime args -->
            <dds-structured-list-row
              v-if="
                experiment.parameterisation.presets.runtime.args.length != 0
              "
            >
              <dds-structured-list-cell
                >Runtime arguments</dds-structured-list-cell
              >
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="arg in experiment.parameterisation.presets.runtime
                      .args"
                    :key="arg"
                  >
                    <code>{{ arg }}</code>
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell>
            </dds-structured-list-row>

            <!-- Runtime resources -->
            <dds-structured-list-row
              v-if="
                Object.keys(
                  experiment.parameterisation.presets.runtime.resources
                ).length != 0
              "
              ><dds-structured-list-cell
                >Runtime resources (CPU/Memory)</dds-structured-list-cell
              >
              <dds-structured-list-cell>
                {{ experiment.parameterisation.presets.runtime.resources.cpu }}
                CPUs,
                {{
                  experiment.parameterisation.presets.runtime.resources.memory
                }}
                RAM
              </dds-structured-list-cell></dds-structured-list-row
            >

            <!-- Variables -->
            <dds-structured-list-row
              v-if="experiment.parameterisation.presets.variables.length != 0"
              ><dds-structured-list-cell>Variables</dds-structured-list-cell>
              <dds-structured-list-cell>
                <bx-unordered-list>
                  <bx-list-item
                    v-for="(entry, idx) in experiment.parameterisation.presets
                      .variables"
                    :key="idx"
                  >
                    <code>{{ entry.name }}</code
                    >: <code>{{ entry.value }}</code>
                  </bx-list-item>
                </bx-unordered-list>
              </dds-structured-list-cell></dds-structured-list-row
            >
          </dds-structured-list-body>
        </dds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExperimentParameterisation",
  props: {
    experiment: Object,
    id: String,
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

<style></style>
