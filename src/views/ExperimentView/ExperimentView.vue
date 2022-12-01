<!-- 
  Copyright IBM Inc. All Rights Reserved.
  SPDX-License-Identifier: Apache-2.0

  Author: Alessandro Pomponio
-->
<template>
  <div class="cds--grid cds--grid--full-width">
    <!-- Show something while we're loading -->
    <template v-if="loading != 0">
      <div class="breadcrumb">
        <bx-breadcrumb>
          <bx-breadcrumb-item>
            <router-link to="/">Virtual Experiments</router-link>
          </bx-breadcrumb-item>
          <bx-breadcrumb-item>
            <bx-skeleton-text></bx-skeleton-text>
          </bx-breadcrumb-item>
        </bx-breadcrumb>
      </div>
      <div class="cds--row pad1">
        <div class="cds--col-lg-10">
          <p style="padding: 64px"></p>
          <bx-skeleton-text type="heading"></bx-skeleton-text>
          <p style="padding: 10px; margin: 10px"></p>
          <bx-skeleton-text type="line"></bx-skeleton-text>
          <bx-skeleton-text type="line"></bx-skeleton-text>
        </div>
        <div class="cds--col" style="padding: 64px">
          <bx-progress-indicator-skeleton
            class="ve-progress-indicator"
            vertical
          >
            <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
            <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
            <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
            <bx-progress-step-skeleton vertical></bx-progress-step-skeleton>
          </bx-progress-indicator-skeleton>
        </div>
      </div>
    </template>

    <!-- Actual content -->
    <template v-else>
      <!-- Navigation breadcrumb -->
      <div class="breadcrumb">
        <bx-breadcrumb>
          <bx-breadcrumb-item>
            <router-link to="/">Virtual Experiments</router-link>
          </bx-breadcrumb-item>
          <bx-breadcrumb-item>
            <bx-breadcrumb-link aria-current="page">{{
              experiment.metadata.package.name
            }}</bx-breadcrumb-link>
          </bx-breadcrumb-item>
        </bx-breadcrumb>
      </div>

      <!-- Experiment header -->
      <div class="cds--row pad1">
        <!-- Left column  -->
        <div class="cds--col-lg-10">
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
                v-for="option in getAvailablePlatforms()"
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

            <!-- Call to action -->
            <dds-text-cta
              slot="footer"
              cta-type="local"
              v-if="!isGlobalRegistry"
            >
              <bx-link :href="`${getDeploymentEndpoint()}experiment/${id}/runs`"
                >View Runs</bx-link
              >
            </dds-text-cta>
          </dds-content-block>
        </div>

        <!-- Right column -->
        <div class="cds--col">
          <!-- Progress indicator -->
          <St4sdBestPracticesProgressIndicator
            :loading="loading"
            :experiment="experiment"
          ></St4sdBestPracticesProgressIndicator>
        </div>
      </div>

      <!-- Interface information -->
      <div>
        <!-- Experiment propertySpec -->
        <div v-if="checkVeInterfaceIsPresent(experiment)" class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Virtual-experiment interface</dds-content-block-heading
              >
              <div class="ve-copy">
                {{ experiment.metadata.registry.interface.description }}
              </div>
            </dds-content-block>
          </div>
          <div class="cds--col">
            <dds-structured-list>
              <dds-structured-list-head>
                <dds-structured-list-header-row>
                  <dds-structured-list-header-cell
                    >Property name</dds-structured-list-header-cell
                  >
                  <dds-structured-list-header-cell
                    >Property description</dds-structured-list-header-cell
                  >
                </dds-structured-list-header-row>
              </dds-structured-list-head>
              <dds-structured-list-body>
                <dds-structured-list-row
                  v-for="property in experiment.metadata.registry.interface
                    .propertiesSpec"
                  :key="property.name"
                >
                  <dds-structured-list-cell>{{
                    property.name
                  }}</dds-structured-list-cell>
                  <dds-structured-list-cell>
                    {{ property.description }}
                  </dds-structured-list-cell>
                </dds-structured-list-row>
              </dds-structured-list-body>
            </dds-structured-list>
          </div>
        </div>
      </div>

      <div class="cds--row pad1">
        <div class="cds--col-lg-4">
          <dds-content-block class="ve-content-block">
            <dds-content-block-heading class="ve-heading"
              >Inputs</dds-content-block-heading
            >
          </dds-content-block>
        </div>
        <div class="cds--col">
          <dds-structured-list>
            <dds-structured-list-head>
              <dds-structured-list-header-row>
                <dds-structured-list-header-cell
                  >Names</dds-structured-list-header-cell
                >
              </dds-structured-list-header-row>
            </dds-structured-list-head>
            <dds-structured-list-body>
              <dds-structured-list-row>
                <dds-structured-list-cell>
                  <bx-unordered-list>
                    <bx-list-item
                      v-if="experiment.metadata.registry.inputs.length == 0"
                    >
                      No inputs
                    </bx-list-item>
                    <bx-list-item
                      v-else
                      v-for="(input, idx) in experiment.metadata.registry
                        .inputs"
                      :key="idx"
                    >
                      <code>{{ input.name }}</code>
                    </bx-list-item>
                  </bx-unordered-list>
                </dds-structured-list-cell>
              </dds-structured-list-row>
            </dds-structured-list-body>
          </dds-structured-list>
        </div>
      </div>

      <!-- Execution Details -->
      <div>
        <div
          @mouseover="showElement('execution-details')"
          @mouseleave="hideElement('execution-details')"
        >
          <h2>
            Parameterisation
            <a
              id="execution-details"
              hidden
              :href="`/experiment/${id}#execution-details`"
            >
              <img width="20" heigth="20" src="../../assets/link.svg" />
            </a>
          </h2>
          <dds-hr class="horizontal-line-spacing"></dds-hr>
        </div>

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
                    experiment.parameterisation.executionOptions.data.length !=
                    0
                  "
                >
                  <dds-structured-list-cell
                    >Data files</dds-structured-list-cell
                  >
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
                    experiment.parameterisation.executionOptions.platform
                      .length != 0
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
                        v-for="arg in experiment.parameterisation
                          .executionOptions.runtime.args"
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
                      experiment.parameterisation.executionOptions.runtime
                        .resources
                    ).length != 0
                  "
                  ><dds-structured-list-cell
                    >Runtime resources (CPU/Memory)</dds-structured-list-cell
                  >
                  <dds-structured-list-cell>
                    {{
                      experiment.parameterisation.executionOptions.runtime
                        .resources.cpu
                    }}
                    CPUs,
                    {{
                      experiment.parameterisation.executionOptions.runtime
                        .resources.memory
                    }}
                    RAM
                  </dds-structured-list-cell></dds-structured-list-row
                >

                <!-- Variables -->
                <dds-structured-list-row
                  v-if="
                    experiment.parameterisation.executionOptions.variables
                      .length != 0
                  "
                  ><dds-structured-list-cell
                    >Variables</dds-structured-list-cell
                  >
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
                  experiment.parameterisation.executionOptions.platform
                    .length == 0
                "
              >
                <dds-structured-list-cell>Platform</dds-structured-list-cell>
                <dds-structured-list-cell
                  v-if="experiment.parameterisation.presets.platform != null"
                >
                  <code>{{
                    experiment.parameterisation.presets.platform
                  }}</code>
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
                  {{
                    experiment.parameterisation.presets.runtime.resources.cpu
                  }}
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

      <!-- Package history and information -->
      <div>
        <div
          @mouseover="showElement('package-information')"
          @mouseleave="hideElement('package-information')"
        >
          <h2>
            Package information
            <a
              id="package-information"
              hidden
              :href="`/experiment/${id}#package-information`"
            >
              <img width="20" heigth="20" src="../../assets/link.svg" />
            </a>
          </h2>
          <dds-hr class="horizontal-line-spacing"></dds-hr>
        </div>

        <!-- Base packages -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Base</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col">
            <dds-structured-list>
              <dds-structured-list-body>
                <dds-structured-list-group
                  v-for="(basePackage, idx) in filterBasePackages(
                    experiment.base.packages,
                    'git'
                  )"
                  :key="idx"
                  :title="basePackage.name"
                >
                  <dds-structured-list-row>
                    <dds-structured-list-cell>Source</dds-structured-list-cell
                    ><dds-structured-list-cell>
                      <bx-link :href="getUrl(basePackage.source.git)"
                        >{{ getUrl(basePackage.source.git) }}
                      </bx-link>
                    </dds-structured-list-cell>
                  </dds-structured-list-row>
                  <dds-structured-list-row
                    v-if="basePackage.source.git.location.commit != null"
                  >
                    <dds-structured-list-cell>Version</dds-structured-list-cell
                    ><dds-structured-list-cell>
                      <code>{{ basePackage.source.git.location.commit }}</code>
                    </dds-structured-list-cell>
                  </dds-structured-list-row>
                  <dds-structured-list-row v-else>
                    <dds-structured-list-cell>Branch</dds-structured-list-cell
                    ><dds-structured-list-cell>
                      <code>{{ basePackage.source.git.location.branch }}</code>
                    </dds-structured-list-cell>
                  </dds-structured-list-row>
                  <dds-structured-list-row>
                    <dds-structured-list-cell
                      >Report a problem</dds-structured-list-cell
                    ><dds-structured-list-cell>
                      <bx-link
                        :href="
                          createIssueForGitPackage(
                            experiment,
                            basePackage.source.git
                          )
                        "
                        >Open new issue
                        <img
                          slot="icon"
                          width="20"
                          height="20"
                          class="arrow-link"
                          src="../../assets/arrow--right.svg"
                        />
                      </bx-link>
                    </dds-structured-list-cell>
                  </dds-structured-list-row>
                </dds-structured-list-group>
              </dds-structured-list-body>
            </dds-structured-list>
          </div>
        </div>

        <!-- Container images -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Container images</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col">
            <dds-structured-list>
              <dds-structured-list-head>
                <dds-structured-list-header-row>
                  <dds-structured-list-header-cell
                    >Image name</dds-structured-list-header-cell
                  >
                </dds-structured-list-header-row>
              </dds-structured-list-head>
              <dds-structured-list-body>
                <dds-structured-list-row
                  v-for="(containerImage, idx) in experiment.metadata.registry
                    .containerImages"
                  :key="idx"
                >
                  <dds-structured-list-cell>{{
                    containerImage.name
                  }}</dds-structured-list-cell>
                </dds-structured-list-row>
              </dds-structured-list-body>
            </dds-structured-list>
          </div>
        </div>

        <!-- Experiment metadata -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Metadata</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col">
            <dds-structured-list>
              <dds-structured-list-body>
                <dds-structured-list-row>
                  <dds-structured-list-cell
                    tooltip="Contributed experiments have been developed or accepted by the core ST4SD team"
                    >Contributed</dds-structured-list-cell
                  ><dds-structured-list-cell
                    v-if="checkExperimentIsContributed(experiment)"
                    ><img
                      width="20"
                      height="20"
                      class="success-green"
                      src="../../assets/checkmark--filled.svg"
                  /></dds-structured-list-cell>
                  <dds-structured-list-cell v-else
                    ><img
                      width="20"
                      height="20"
                      class="fail-red"
                      src="../../assets/misuse.svg"
                  /></dds-structured-list-cell>
                </dds-structured-list-row>
                <dds-structured-list-row>
                  <dds-structured-list-cell>License</dds-structured-list-cell
                  ><dds-structured-list-cell
                    v-if="experiment.metadata.package.license == null"
                    tooltip="Reach out to the maintainer"
                  >
                    Not available
                  </dds-structured-list-cell>
                  <dds-structured-list-cell v-else>
                    {{ experiment.metadata.package.license }}
                  </dds-structured-list-cell>
                </dds-structured-list-row>
                <dds-structured-list-row>
                  <dds-structured-list-cell>Maintainer</dds-structured-list-cell
                  ><dds-structured-list-cell>
                    {{ experiment.metadata.package.maintainer }}
                  </dds-structured-list-cell>
                </dds-structured-list-row>
                <dds-structured-list-row>
                  <dds-structured-list-cell>
                    Available tags
                  </dds-structured-list-cell>
                  <dds-structured-list-cell
                    :tags="tags"
                  ></dds-structured-list-cell>
                </dds-structured-list-row>
                <dds-structured-list-row>
                  <dds-structured-list-cell>
                    Available platforms
                  </dds-structured-list-cell>
                  <dds-structured-list-cell
                    :tags="getAvailablePlatforms()"
                  ></dds-structured-list-cell>
                </dds-structured-list-row>
                <dds-structured-list-row>
                  <dds-structured-list-cell>Keywords</dds-structured-list-cell>
                  <dds-structured-list-cell
                    :tags="experiment.metadata.package.keywords"
                  >
                  </dds-structured-list-cell>
                </dds-structured-list-row>
              </dds-structured-list-body>
            </dds-structured-list>
          </div>
        </div>

        <!-- Experiment history -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >History</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col no-padding">
            <bx-table
              sort
              @bx-table-header-cell-sort="handleTableHeaderCellSort"
            >
              <bx-table-head>
                <!-- <bx-table-toolbar-search></bx-table-toolbar-search> -->
                <bx-table-header-row>
                  <bx-table-header-cell
                    sort-direction="descending"
                    data-column-id="tag"
                    >Tag</bx-table-header-cell
                  >
                  <bx-table-header-cell
                    sort-direction="none"
                    data-column-id="digest"
                    >Digest</bx-table-header-cell
                  >
                  <!-- <bx-table-header-cell>Times executed</bx-table-header-cell> -->
                  <bx-table-header-cell
                    sort-direction="none"
                    data-column-id="originalTag"
                    >Previous tag</bx-table-header-cell
                  >
                  <bx-table-header-cell
                    sort-direction="none"
                    data-column-id="createdOn"
                    >Creation date</bx-table-header-cell
                  >
                </bx-table-header-row>
              </bx-table-head>
              <bx-table-body>
                <!-- Tagged entries -->
                <bx-table-row
                  v-for="(entry, entryIdx) in getTableSlice"
                  :key="entryIdx"
                >
                  <bx-table-cell
                    ><bx-link
                      :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                        id
                      )}:${entry.tag}`"
                    >
                      {{ entry.tag }}
                    </bx-link></bx-table-cell
                  >
                  <bx-table-cell
                    ><bx-link
                      :href="`${getDeploymentEndpoint()}experiment/${getPackageName(
                        id
                      )}@${entry.digest}`"
                    >
                      {{ entry.digest }}
                    </bx-link></bx-table-cell
                  >
                  <!-- <bx-table-cell>Placeholder</bx-table-cell> -->
                  <bx-table-cell>{{ entry.originalTag }}</bx-table-cell>
                  <bx-table-cell>{{
                    new Date(Date.parse(entry.createdOn))
                  }}</bx-table-cell>
                </bx-table-row>
              </bx-table-body>
            </bx-table>
            <bx-pagination
              :page-size="elementsToShow"
              :start="firstElement"
              :total="history.tags.length + history.untagged.length"
              @bx-pages-select-changed="handleTablePagesSelectChanged"
              @bx-pagination-changed-current="
                handleTablePaginationChangedCurrent
              "
              @bx-page-sizes-select-changed="handleTablePageSizesSelectChanged"
            >
              <bx-page-sizes-select slot="page-sizes-select">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </bx-page-sizes-select>
              <bx-pages-select></bx-pages-select>
            </bx-pagination>
          </div>
        </div>

        <!-- Python oneliner to add package -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Get this package</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col">
            <div class="cds--row">
              <bx-code-snippet language="python">
                api.api_experiment_push({{ exp_python }})
              </bx-code-snippet>
            </div>
          </div>
        </div>

        <!-- Experiment JSON -->
        <div class="cds--row pad1">
          <div class="cds--col-lg-4">
            <dds-content-block class="ve-content-block">
              <dds-content-block-heading class="ve-heading"
                >Description</dds-content-block-heading
              >
            </dds-content-block>
          </div>
          <div class="cds--col">
            <div class="cds--row">
              <bx-code-snippet language="json" type="multi">
                {{ JSON.stringify(exp_no_interface, null, 2) }}
              </bx-code-snippet>
            </div>
            <div class="cds--row">
              <bx-btn
                class="bx--btn--primary"
                type="button"
                @click="download()"
              >
                Download JSON&nbsp;
                <img class="download-icon" src="../../assets/download.svg"
              /></bx-btn>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import "carbon-web-components/es/components/code-snippet/index.js";
import "@carbon/ibmdotcom-web-components/es/components/content-block/index.js";
import "@carbon/ibmdotcom-web-components/es/components/tag-group/index.js";
import "@carbon/ibmdotcom-web-components/es/components/structured-list/index.js";
import "@carbon/ibmdotcom-web-components/es/components/cta/text-cta.js";
import "carbon-web-components/es/components/tag/index.js";
import "carbon-web-components/es/components/button/index.js";
import "carbon-web-components/es/components/progress-indicator/index.js";
import "carbon-web-components/es/components/data-table/index.js";
import "carbon-web-components/es/components/list/index.js";
import "@carbon/ibmdotcom-web-components/es/components/content-item/index.js";
import "@carbon/ibmdotcom-web-components/es/components/horizontal-rule/index.js";
import "@carbon/ibmdotcom-web-components/es/components/link-list/index.js";
import "carbon-web-components/es/components/pagination/index.js";
import "carbon-web-components/es/components/loading/index.js";
import "carbon-web-components/es/components/skeleton-text/index.js";
import "carbon-web-components/es/components/progress-indicator/index.js";

import {
  checkContainerImagesHaveTagOtherThanLatest,
  checkBasePackagesHaveCommit,
  getStrongVersioningScore,
} from "@/functions/strong_versioning.js";

import {
  checkParameterisedPackageHasDescription,
  checkParameterisedPackageHasLicense,
  checkParameterisedPackageHasMaintainer,
  checkParameterisedPackageHasTagOtherThanLatest,
  getDeveloperMetadataScore,
  checkParameterisedPackageListsInputs,
} from "@/functions/developer_metadata.js";
import { checkVeInterfaceIsPresent } from "@/functions/ve_interface";
import { getBestPracticesScore } from "@/functions/best_practices";
import { checkExperimentIsContributed } from "@/functions/origin_checks";
import { getDeploymentEndpoint } from "@/functions/public_path";

import St4sdBestPracticesProgressIndicator from "@/components/St4sdBestPracticesProgressIndicator";

import axios from "axios";

export default {
  name: "ExperimentView",
  components: { St4sdBestPracticesProgressIndicator },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      experiment: null,
      exp_no_interface: null,
      history: null,
      tags: null,
      exp_python: null,
      loading: 5,
      data: null,
      firstElement: 0,
      elementsToShow: 10,
      sortDirection: undefined,
      sortColumnId: "",
      collator: new Intl.Collator("en"),
      isGlobalRegistry: false,
    };
  },
  mounted() {
    // Fetch experiment
    axios
      .get(
        window.location.origin + "/registry-ui/backend/experiments/" + this.id
      )
      .then((response) => {
        this.experiment = response.data.entry;
        this.loading--;
      });

    // Fetch experiment without interface
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.id +
          "?outputFormat=json&hideMetadataRegistry=y&hideNone=y&hideBeta=y"
      )
      .then((response) => {
        this.exp_no_interface = response.data.entry;
        for (var i = 0; i < this.exp_no_interface.base.packages.length; i++) {
          if ("git" in this.exp_no_interface.base.packages[i].source) {
            delete this.exp_no_interface.base.packages[i].source.git.version;
          }
        }
        this.loading--;
      });

    // Fetch history
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.getPackageName(this.id) +
          "/history"
      )
      .then((response) => {
        this.history = response.data;
        this.tags = response.data.tags.map((entry) => entry.tag);
        this.data = response.data.tags
          .map((entry) => ({
            createdOn: entry.createdOn,
            digest: entry.head,
            tag: entry.tag,
            timesExecuted: entry.timesExecuted,
          }))
          .concat(
            response.data.untagged.map((entry) => ({
              createdOn: entry.createdOn,
              digest: entry.digest,
              originalTag: entry.originalTag,
              timesExecuted: entry.timesExecuted,
            }))
          );
        this.loading--;
      });

    // Fetch python-version of the experiment
    axios
      .get(
        window.location.origin +
          "/registry-ui/backend/experiments/" +
          this.id +
          "?outputFormat=python&hideMetadataRegistry=y&hideNone=y"
      )
      .then((response) => {
        this.exp_python = response.data.entry;
        this.loading--;
      });

    // Fetch settings
    axios
      .get(window.location.origin + "/registry-ui/backend/settings/")
      .then((response) => {
        if (
          "ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL" in response.data &&
          response.data["ST4SD_REGISTRY_UI_SETTINGS_IS_GLOBAL"] == "yes"
        )
          this.isGlobalRegistry = true;
        this.loading--;
      });
  },
  computed: {
    getSortedElements() {
      if (this.sortDirection == undefined || this.sortDirection == "none")
        return this.data;

      return this.data.slice().sort((lhs, rhs) => {
        const lhsValue = lhs[this.sortColumnId];
        const rhsValue = rhs[this.sortColumnId];
        return (
          (this.sortDirection === "ascending" ? 1 : -1) *
          this.collator.compare(lhsValue, rhsValue)
        );
      });
    },
    getTableSlice() {
      return this.getSortedElements.slice(
        this.firstElement,
        this.firstElement + this.elementsToShow
      );
    },
  },
  methods: {
    download() {
      // Create a fictitious anchor to download JSON
      let jsonData = encodeURIComponent(
        JSON.stringify(this.exp_no_interface, null, 2)
      );
      var element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + jsonData);
      element.setAttribute(
        "download",
        "experiment-" + this.experiment.metadata.package.name + ".json"
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    getAvailablePlatforms() {
      var platforms = null;
      if (this.experiment.parameterisation.presets.platform != null) {
        platforms = [this.experiment.parameterisation.presets.platform];
      } else if (
        this.experiment.parameterisation.executionOptions.platform != null &&
        this.experiment.parameterisation.executionOptions.platform.length != 0
      ) {
        platforms = this.experiment.parameterisation.executionOptions.platform;
      } else {
        platforms = ["default"];
      }

      return platforms;
    },
    getUrl(gitEntry) {
      var url = gitEntry.location.url;
      if (gitEntry.location.url.endsWith(".git")) {
        url = gitEntry.location.url.slice(0, -4);
      }

      if (gitEntry.location.commit != null) {
        url += "/tree/" + gitEntry.location.commit;
      } else if (gitEntry.location.branch != null) {
        url += "/tree/" + gitEntry.location.branch;
      }

      return url;
    },
    getPackageName(id) {
      var index = -1;
      if (id.includes(":")) {
        index = id.indexOf(":");
      } else if (id.includes("@")) {
        index = id.indexOf("@");
      }

      if (index == -1) return id;

      return id.substring(0, index);
    },
    createIssueForGitPackage(parameterisedPackage, gitPackage) {
      var title = "Issue report".replaceAll(" ", "+");
      var labels = "bug,parameterised-package-issue";
      var repoReference = "";
      if (gitPackage.location.commit != null) {
        repoReference = "%0A%0AReference commit: " + gitPackage.location.commit;
      } else {
        repoReference = "%0A%0AReference branch: " + gitPackage.location.branch;
      }

      var body = `Describe the problem
      ${repoReference}
      %0AParameterised package reference: ${
        parameterisedPackage.metadata.registry.digest
      }
      %0ALink: ${
        window.location.origin +
        this.$route.path +
        "@" +
        parameterisedPackage.metadata.registry.digest
      }
      `.replaceAll(" ", "+");

      var url = gitPackage.location.url;
      if (gitPackage.location.url.endsWith(".git")) {
        url = gitPackage.location.url.slice(0, -4);
      }
      url += "/issues/new?";
      url += "title=" + title + "&";
      url += "labels=" + labels + "&";
      url += "body=" + body;
      return url;
    },
    allPlatformHaveSameValue(defaultValues) {
      let currentValue = defaultValues[0].value;
      for (let i = 0; i < defaultValues.length; i++) {
        if (defaultValues[i].value != currentValue) {
          return false;
        }
      }
      return true;
    },
    checkContainerImagesHaveTagOtherThanLatest,
    checkBasePackagesHaveCommit,
    getStrongVersioningScore,
    checkVeInterfaceIsPresent,
    checkParameterisedPackageHasDescription,
    checkParameterisedPackageHasLicense,
    checkParameterisedPackageHasMaintainer,
    checkParameterisedPackageHasTagOtherThanLatest,
    getDeveloperMetadataScore,
    getBestPracticesScore,
    checkExperimentIsContributed,
    checkParameterisedPackageListsInputs,
    getDeploymentEndpoint,
    filterBasePackages(basePackages, sourceFilter) {
      var filtered = [];
      for (var i = 0; i < basePackages.length; i++) {
        if (sourceFilter in basePackages[i].source)
          filtered.push(basePackages[i]);
      }
      return filtered;
    },
    openModal(id) {
      document.getElementById(id).open = true;
    },
    showElement(id) {
      document.getElementById(id).hidden = false;
    },
    hideElement(id) {
      document.getElementById(id).hidden = true;
    },
    handleTablePaginationChangedCurrent(event) {
      this.firstElement = event.detail.start;
    },
    handleTablePagesSelectChanged(event) {
      this.firstElement = event.detail.value * this.elementsToShow;
    },
    handleTablePageSizesSelectChanged(event) {
      this.firstElement = 0;
      this.elementsToShow = event.detail.value;
    },
    handleTableHeaderCellSort(event) {
      this.sortColumnId = event.target.getAttribute("data-column-id");
      this.sortDirection = event.detail.sortDirection;

      // Reset sorting state for others
      let headers = document.getElementsByTagName("bx-table-header-cell");
      for (let i = 0; i < headers.length; i++) {
        if (
          headers[i].getAttribute("data-column-id") !=
            event.target.getAttribute("data-column-id") &&
          headers[i].sortDirection != undefined
        )
          headers[i].sortDirection = "none";
      }
    },
  },
};
</script>

<style lang="scss">
@use "@carbon/grid";
@use "@carbon/layout";
@use "@carbon/colors";

.download-icon {
  height: 16px;
  width: 16px;
  filter: invert(100);
}

.ve-progress-indicator {
  margin-top: 64px;
}

.ve-content-block {
  padding: 0;
}

.ve-heading {
  font-size: 1.5em;
}

.ve-copy {
  font-size: 1.2em;
  margin-left: 16px;
  margin-right: 16px;
}

.bx--btn--primary {
  margin-top: layout.$spacing-05;
}

.pad1 {
  padding-bottom: layout.$spacing-08;
}

.horizontal-line-spacing {
  margin-bottom: layout.$spacing-08;
}

.no-padding {
  padding: 0;
}

.arrow-link {
  // Simulate color of IBM links
  // Source: https://codepen.io/sosuke/pen/Pjoqqp
  // Input: #0f62fe
  filter: invert(30%) sepia(94%) saturate(4587%) hue-rotate(218deg)
    brightness(104%) contrast(103%);
}
</style>
