<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <cds-side-panel
    open
    size="lg"
    includeOverlay="true"
    :title="this.title"
    @cds-side-panel-closed="$emit('closeSidePanel')"
    selectorInitialFocus="#firstAccordionItem"
  >
    <cds-accordion>
      <cds-accordion-item id="firstAccordionItem" open title="Overview">
        <cds-structured-list>
          <cds-structured-list-body>
            <cds-structured-list-row v-if="componentName != undefined">
              <cds-structured-list-cell>Name</cds-structured-list-cell>
              <cds-structured-list-cell>{{
                componentName
              }}</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row v-if="componentDescription != undefined">
              <cds-structured-list-cell>Description</cds-structured-list-cell>
              <cds-structured-list-cell>{{
                componentDescription
              }}</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row v-if="componentStage != undefined">
              <cds-structured-list-cell>Stage</cds-structured-list-cell>
              <cds-structured-list-cell>{{
                String(componentStage)
              }}</cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentVariables != undefined &&
                Object.keys(componentVariables).length > 0
              "
            >
              <cds-structured-list-cell>Variables</cds-structured-list-cell>
              <cds-structured-list-cell>
                <cds-structured-list>
                  <cds-structured-list-head>
                    <cds-structured-list-header-row>
                      <cds-structured-list-header-cell
                        >Name</cds-structured-list-header-cell
                      >
                      <cds-structured-list-header-cell
                        >Value</cds-structured-list-header-cell
                      >
                    </cds-structured-list-header-row>
                  </cds-structured-list-head>
                  <cds-structured-list-body>
                    <cds-structured-list-row
                      v-for="(key, idx) in Object.keys(componentVariables)"
                      :key="idx"
                    >
                      <cds-structured-list-cell>{{
                        key
                      }}</cds-structured-list-cell>
                      <cds-structured-list-cell>{{
                        Object.values(componentVariables)[idx]
                      }}</cds-structured-list-cell>
                    </cds-structured-list-row>
                  </cds-structured-list-body>
                </cds-structured-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row v-if="componentReferences[0] != undefined">
              <cds-structured-list-cell>References</cds-structured-list-cell>
              <cds-structured-list-cell>
                <cds-unordered-list
                  v-for="(reference, i) in componentReferences"
                  :key="i"
                >
                  <cds-list-item>References</cds-list-item>
                  <cds-list-item>{{ String(reference) }}</cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentSignature.parameters.length > 0"
            >
              <cds-structured-list-cell>Parameters</cds-structured-list-cell>

              <cds-structured-list-cell>
                <cds-structured-list>
                  <cds-structured-list-head>
                    <cds-structured-list-header-row>
                      <cds-structured-list-header-cell
                        >Name</cds-structured-list-header-cell
                      >
                      <cds-structured-list-header-cell
                        >Definition</cds-structured-list-header-cell
                      >
                    </cds-structured-list-header-row>
                  </cds-structured-list-head>
                  <cds-structured-list-body>
                    <cds-structured-list-row
                      v-for="(param, i) in componentSignature.parameters"
                      :key="i"
                    >
                      <cds-structured-list-cell>{{
                        param.name
                      }}</cds-structured-list-cell>
                      <cds-structured-list-cell
                        v-if="getParameterValue(param.name) != undefined"
                      >
                        {{ getParameterValue(param.name) }}
                      </cds-structured-list-cell>
                      <template v-else>
                        <cds-structured-list-cell
                          v-if="param.default != undefined"
                          >{{ param.default }}</cds-structured-list-cell
                        >
                        <cds-structured-list-cell
                          v-else
                        ></cds-structured-list-cell
                      ></template>
                    </cds-structured-list-row>
                  </cds-structured-list-body>
                </cds-structured-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentCommand.executable != undefined"
            >
              <cds-structured-list-cell>Executable</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentCommand.executable }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentCommand.arguments != undefined"
            >
              <cds-structured-list-cell>Arguments</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentCommand.arguments }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentCommand.expandArguments != undefined"
            >
              <cds-structured-list-cell
                >Expand Arguments</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentCommand.expandArguments }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentCommand.environment != undefined"
            >
              <cds-structured-list-cell>Environment</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentCommand.environment }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>
      <cds-accordion-item title="Workflow Attributes">
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Definition</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-if="componentWFAttributes.replicate != undefined"
            >
              <cds-structured-list-cell>Replicate</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.replicate }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.aggregate != undefined"
            >
              <cds-structured-list-cell>Aggregate</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.aggregate }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.isMigratable != undefined"
            >
              <cds-structured-list-cell>Migratable</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.isMigratable }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.isMigrated != undefined"
            >
              <cds-structured-list-cell>Migrated</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.isMigrated }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.isRepeat != undefined"
            >
              <cds-structured-list-cell>Repeat</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.isRepeat }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.restartHookFile != undefined"
            >
              <cds-structured-list-cell
                >Restart Hook File</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.restartHookFile }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.restartHookOn.length != 0"
            >
              <cds-structured-list-cell>
                >>Restart Hooks
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.restartHookOn.length != 0"
            >
              <cds-structured-list-cell
                >Restart Hook On</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                <cds-unordered-list
                  v-for="(hook, i) in componentWFAttributes.restartHookOn"
                  :key="i"
                >
                  <cds-list-item>{{ hook }}</cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.memoization.disable.fuzzy != undefined ||
                componentWFAttributes.memoization.disable.strong != undefined ||
                componentWFAttributes.memoization.embeddingFunction != undefined
              "
            >
              <cds-structured-list-cell>
                >>Memoization
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.memoization.disable.fuzzy != undefined ||
                componentWFAttributes.memoization.disable.strong != undefined
              "
            >
              <cds-structured-list-cell> >>Disable </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.memoization.disable.fuzzy != undefined
              "
            >
              <cds-structured-list-cell>Fuzzy</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.memoization.disable.fuzzy }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.memoization.disable.strong != undefined
              "
            >
              <cds-structured-list-cell>Strong</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.memoization.disable.strong }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.memoization.embeddingFunction != undefined
              "
            >
              <cds-structured-list-cell
                >Embedding Function
              </cds-structured-list-cell>
              <cds-structured-list-cell
                >{{ componentWFAttributes.memoization.embeddingFunction }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentWFAttributes.optimizer.disable != undefined ||
                componentWFAttributes.optimizer.exploitChance != undefined ||
                componentWFAttributes.optimizer.exploitTarget != undefined ||
                componentWFAttributes.optimizer.exploitTargetHigh !=
                  undefined ||
                componentWFAttributes.optimizer.exploitTargetLow != undefined
              "
            >
              <cds-structured-list-cell> >>Optimizer </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.optimizer.disable != undefined"
            >
              <cds-structured-list-cell>Disable</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.optimizer.disable }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.optimizer.exploitChance != undefined"
            >
              <cds-structured-list-cell
                >Exploit Chance</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.optimizer.exploitChance }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.optimizer.exploitTarget != undefined"
            >
              <cds-structured-list-cell
                >Exploit Target</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.optimizer.exploitTarget }}
              </cds-structured-list-cell> </cds-structured-list-row
            ><cds-structured-list-row
              v-if="
                componentWFAttributes.optimizer.exploitTargetHigh != undefined
              "
            >
              <cds-structured-list-cell
                >Exploit Target High</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.optimizer.exploitTargetHigh }}
              </cds-structured-list-cell> </cds-structured-list-row
            ><cds-structured-list-row
              v-if="
                componentWFAttributes.optimizer.exploitTargetLow != undefined
              "
            >
              <cds-structured-list-cell
                >Exploit Target Low</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.optimizer.exploitTargetLow }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.repeatInterval != undefined"
            >
              <cds-structured-list-cell
                >Repeat Interval</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.repeatInterval }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.repeatRetries != undefined"
            >
              <cds-structured-list-cell
                >Repeat Retries</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentWFAttributes.repeatRetries }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.maxRestarts != undefined"
            >
              <cds-structured-list-cell>Max Restarts</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentWFAttributes.maxRestarts }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentWFAttributes.shutdownOn.length != 0"
            >
              <cds-structured-list-cell>
                >>Shutdown Hooks
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentWFAttributes.shutdownOn.length != 0"
            >
              <cds-structured-list-cell>Shutdown On</cds-structured-list-cell>
              <cds-structured-list-cell>
                <cds-unordered-list
                  v-for="(hook, i) in componentWFAttributes.shutdownOn"
                  :key="i"
                >
                  <cds-list-item>{{ hook }}</cds-list-item>
                </cds-unordered-list>
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>
      <cds-accordion-item
        v-if="
          componentResourceManager.config.backend != undefined ||
          componentResourceManager.config.walltime != undefined ||
          componentResourceManager.lsf.statusRequestInterval != undefined ||
          componentResourceManager.lsf.queue != undefined ||
          componentResourceManager.lsf.reservation != undefined ||
          componentResourceManager.lsf.resourceString != undefined ||
          componentResourceManager.lsf.dockerImage != undefined ||
          componentResourceManager.lsf.dockerProfileApp != undefined ||
          componentResourceManager.kubernetes.image != undefined ||
          componentResourceManager.kubernetes.imagePullSecret != undefined ||
          componentResourceManager.kubernetes.gracePeriod != undefined ||
          componentResourceManager.kubernetes.podSpec != undefined ||
          componentResourceManager.kubernetes.apiKeyVar != undefined ||
          componentResourceManager.kubernetes.host != undefined ||
          componentResourceManager.kubernetes.namespace != undefined
        "
        title="Resource Manager"
      >
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Definition</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-if="
                componentResourceManager.config.backend != undefined ||
                componentResourceManager.config.walltime != undefined
              "
            >
              <cds-structured-list-cell>>>Config</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.config.backend != undefined"
            >
              <cds-structured-list-cell>Backend</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.config.backend }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.config.walltime != undefined"
            >
              <cds-structured-list-cell>Walltime</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.config.walltime }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentResourceManager.docker.image != undefined ||
                componentResourceManager.docker.imagePullPolicy != undefined ||
                componentResourceManager.docker.platform != undefined
              "
            >
              <cds-structured-list-cell>>>Docker</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.docker.image != undefined"
            >
              <cds-structured-list-cell>Image</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.docker.image }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.docker.imagePullPolicy != undefined
              "
            >
              <cds-structured-list-cell
                >Image Pull Policy</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.docker.imagePullPolicy }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.docker.platform != undefined"
            >
              <cds-structured-list-cell>Platform</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.docker.platform }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.lsf.statusRequestInterval !=
                  undefined ||
                componentResourceManager.lsf.queue != undefined ||
                componentResourceManager.lsf.reservation != undefined ||
                componentResourceManager.lsf.resourceString != undefined ||
                componentResourceManager.lsf.dockerImage != undefined ||
                componentResourceManager.lsf.dockerProfileApp != undefined
              "
            >
              <cds-structured-list-cell>>>LSF</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.lsf.statusRequestInterval != undefined
              "
            >
              <cds-structured-list-cell
                >Request Interval</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.statusRequestInterval }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.queue != undefined"
            >
              <cds-structured-list-cell>Queue</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.queue }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.reservation != undefined"
            >
              <cds-structured-list-cell>Reservation</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.reservation }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.resourceString != undefined"
            >
              <cds-structured-list-cell
                >Resource String</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.resourceString }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.dockerImage != undefined"
            >
              <cds-structured-list-cell>Docker Image</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.dockerImage }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.dockerProfileApp != undefined"
            >
              <cds-structured-list-cell
                >Docker Profile App</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.dockerProfileApp }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.lsf.dockerOption != undefined"
            >
              <cds-structured-list-cell>Docker Option</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.lsf.dockerOption }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.kubernetes.image != undefined ||
                componentResourceManager.kubernetes.imagePullSecret !=
                  undefined ||
                componentResourceManager.kubernetes.gracePeriod != undefined ||
                componentResourceManager.kubernetes.podSpec != undefined ||
                componentResourceManager.kubernetes.apiKeyVar != undefined ||
                componentResourceManager.kubernetes.host != undefined ||
                componentResourceManager.kubernetes.namespace != undefined
              "
            >
              <cds-structured-list-cell>>>Kubernetes</cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.kubernetes.image != undefined"
            >
              <cds-structured-list-cell>Image</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.image }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.kubernetes.imagePullSecret != undefined
              "
            >
              <cds-structured-list-cell
                >Image Pull Secret</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.imagePullSecret }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="
                componentResourceManager.kubernetes.gracePeriod != undefined
              "
            >
              <cds-structured-list-cell>Grace Period</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.gracePeriod }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentResourceManager.kubernetes.podSpec != undefined"
            >
              <cds-structured-list-cell>Pod Spec</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.podSpec }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentResourceManager.kubernetes.apiKeyVar != undefined"
            >
              <cds-structured-list-cell>Api Key Var</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.apiKeyVar }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="!componentResourceManager.kubernetes.host == undefined"
            >
              <cds-structured-list-cell>Host</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.host }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceManager.kubernetes.namespace != undefined"
            >
              <cds-structured-list-cell>Namespace</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.namespace }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="
                componentResourceManager.kubernetes.cpuUnitsPerCore != undefined
              "
            >
              <cds-structured-list-cell
                >Cpu Units per Core</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceManager.kubernetes.cpuUnitsPerCore }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>
      <cds-accordion-item
        v-if="
          componentResourceRequest.numberProcesses != undefined ||
          componentResourceRequest.numberThreads != undefined ||
          componentResourceRequest.ranksPerNode != undefined ||
          componentResourceRequest.threadsPerCore != undefined ||
          componentResourceRequest.memory != undefined ||
          componentResourceRequest.gpus != undefined
        "
        title="Resource Request"
      >
        <cds-structured-list>
          <cds-structured-list-head>
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell
                >Name</cds-structured-list-header-cell
              >
              <cds-structured-list-header-cell
                >Definition</cds-structured-list-header-cell
              >
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row
              v-if="componentResourceRequest.numberProcesses != undefined"
            >
              <cds-structured-list-cell
                >Number of Processes</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceRequest.numberProcesses }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentResourceRequest.numberThreads != undefined"
            >
              <cds-structured-list-cell
                >Number of Threads</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceRequest.numberThreads }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentResourceRequest.ranksPerNode != undefined"
            >
              <cds-structured-list-cell
                >Ranks per Node</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceRequest.ranksPerNode }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceRequest.threadsPerCore != undefined"
            >
              <cds-structured-list-cell
                >Threads per Core</cds-structured-list-cell
              >
              <cds-structured-list-cell>
                {{ componentResourceRequest.threadsPerCore }}
              </cds-structured-list-cell>
            </cds-structured-list-row>

            <cds-structured-list-row
              v-if="componentResourceRequest.memory != undefined"
            >
              <cds-structured-list-cell>Memory</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceRequest.memory }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="componentResourceRequest.gpus != undefined"
            >
              <cds-structured-list-cell>GPUs</cds-structured-list-cell>
              <cds-structured-list-cell>
                {{ componentResourceRequest.gpus }}
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </cds-accordion-item>
    </cds-accordion>
    <div class="cds--subgrid--narrow">
      <cds-button
        class="cds--css-grid-column"
        kind="danger"
        v-if="shareAndDeleteButtonsAvailable"
        @click="deleteComponent"
        :disabled="requestInProgress"
        title="Delete this template"
      >
        Delete &nbsp;
        <img
          slot="icon"
          class="white-svg"
          height="18"
          width="18"
          src="@/assets/trash-can.svg"
        />
      </cds-button>
      <cds-button
        class="cds--css-grid-column"
        kind="primary"
        v-if="shareAndDeleteButtonsAvailable"
        @click="shareComponent"
        :disabled="requestInProgress || !shareEnabled"
        :title="
          shareEnabled
            ? 'Store this Template in the persistent Graph Library and make it available to all experiments'
            : 'The persistent Graph Library already contains a template with the same name'
        "
      >
        Share &nbsp;
        <img
          slot="icon"
          class="white-svg"
          height="15"
          width="15"
          src="@/assets/launch.svg"
        />
      </cds-button>
    </div>
    <div v-if="requestInProgress" id="loading-wheel">
      <cds-inline-loading status="active">
        Request in progress ...
      </cds-inline-loading>
    </div>
  </cds-side-panel>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/side-panel.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/button.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/accordion.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/inline-loading.min.js";
export default {
  props: {
    title: String,
    node: Object,
    inputingEdges: Array,
    shareEnabled: Boolean,
    requestInProgress: Boolean,
    shareAndDeleteButtonsAvailable: Boolean,
  },
  data() {
    return {
      componentName: null,
      componentDescription: null,
      currentDefinition: {},
      componentStage: null,
      componentReferences: [],
      componentVariables: null,

      componentSignature: {
        name: null,
        parameters: [{ name: null, default: null }],
      },

      componentCommand: {
        executable: null,
        arguments: null,
        expandArguments: null,
        environment: null,
      },

      componentWFAttributes: {
        replicate: null,
        aggregate: null,
        isMigratable: null,
        isMigrated: null,
        isRepeat: null,
        restartHookFile: null,
        memoization: {
          disable: { fuzzy: null, strong: null },
          embeddingFunction: null,
        },
        optimizer: {
          disable: null,
          exploitChance: null,
          exploitTarget: null,
          exploitTargetHigh: null,
          exploitTargetLow: null,
        },
        restartHookOn: ["ResourceExhausted"],
        repeatInterval: null,
        repeatRetries: null,
        maxRestarts: null,
        shutdownOn: [],
      },

      componentResourceManager: {
        config: { backend: null, walltime: null },
        lsf: {
          statusRequestInterval: null,
          queue: null,
          reservation: null,
          resourceString: null,
          dockerImage: null,
          dockerProfileApp: null,
          dockerOption: null,
        },
        docker: {
          image: null,
          imagePullPolicy: null,
          platform: null,
        },
        kubernetes: {
          image: null,
          imagePullSecret: null,
          gracePeriod: null,
          podSpec: null,
          apiKeyVar: null,
          host: null,
          namespace: null,
          cpuUnitsPerCore: null,
        },
      },

      componentResourceRequest: {
        numberProcesses: null,
        numberThreads: null,
        ranksPerNode: null,
        threadsPerCore: null,
        memory: null,
        gpus: null,
      },
    };
  },
  mounted() {
    if (this.node.definition.signature.name) {
      this.componentName = this.node.definition.signature.name;
    }
    if (this.node.definition.signature.description) {
      this.componentDescription = this.node.definition.signature.description;
    }
    if (this.node.definition.stage) {
      this.componentStage = this.node.definition.stage;
    }
    if (this.node.definition.variables) {
      this.componentVariables = this.node.definition.variables;
    }
    this.componentReferences.push(this.node.definition.references);
    Object.assign(this.componentSignature, this.node.definition.signature);
    Object.assign(this.componentCommand, this.node.definition.command);
    Object.assign(
      this.componentWFAttributes,
      this.node.definition.workflowAttributes,
    );
    Object.assign(
      this.componentResourceManager,
      this.node.definition.resourceManager,
    );
    Object.assign(
      this.componentResourceRequest,
      this.node.definition.resourceRequest,
    );
  },
  methods: {
    getParameterValue(paramName) {
      for (var edge of this.inputingEdges) {
        if (edge.definition[paramName] != undefined) {
          return edge.definition[paramName];
        }
      }
    },
    shareComponent() {
      this.$emit("shareComponent", this.node);
    },
    deleteComponent() {
      this.$emit("deleteComponent", this.node);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/svg.scss";
@import "@/styles/inline-loading-style.css";
</style>
