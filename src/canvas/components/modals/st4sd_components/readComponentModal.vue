<template>
  <bx-modal open class="no-transform">
    <bx-modal-header>
      <bx-modal-close-button></bx-modal-close-button>
      <bx-modal-heading>{{ title }}</bx-modal-heading>
    </bx-modal-header>
    <bx-modal-body>
      <bx-accordion>
        <bx-accordion-item open data-modal-primary-focus title-text="Overview">
          <bx-structured-list>
            <bx-structured-list-body>
              <bx-structured-list-row v-if="componentName != undefined">
                <bx-structured-list-cell>Name</bx-structured-list-cell>
                <bx-structured-list-cell>{{
                  componentName
                }}</bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row v-if="componentStage != undefined">
                <bx-structured-list-cell>Stage</bx-structured-list-cell>
                <bx-structured-list-cell>{{
                  String(componentStage)
                }}</bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row v-if="componentVariables != undefined">
                <bx-structured-list-cell>Variables</bx-structured-list-cell>
                <bx-structured-list-cell>{{
                  componentVariables
                }}</bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentReferences[0] != undefined"
              >
                <bx-structured-list-cell>References</bx-structured-list-cell>
                <bx-structured-list-cell>
                  <bx-unordered-list
                    v-for="(reference, i) in componentReferences"
                    :key="i"
                  >
                    <bx-list-item>References</bx-list-item>
                    <bx-list-item>{{ String(reference) }}</bx-list-item>
                  </bx-unordered-list>
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentSignature.parameters.length > 0"
              >
                <bx-structured-list-cell>Parameters</bx-structured-list-cell>

                <bx-structured-list-cell>
                  <bx-structured-list>
                    <bx-structured-list-head>
                      <bx-structured-list-header-row>
                        <bx-structured-list-header-cell
                          >Name</bx-structured-list-header-cell
                        >
                        <bx-structured-list-header-cell
                          >Definition</bx-structured-list-header-cell
                        >
                      </bx-structured-list-header-row>
                    </bx-structured-list-head>
                    <bx-structured-list-body>
                      <bx-structured-list-row
                        v-for="(param, i) in componentSignature.parameters"
                        :key="i"
                      >
                        <bx-structured-list-cell>{{
                          param.name
                        }}</bx-structured-list-cell>
                        <bx-structured-list-cell
                          v-if="getParameterValue(param.name) != undefined"
                        >
                          {{ getParameterValue(param.name) }}
                        </bx-structured-list-cell>
                        <template v-else>
                          <bx-structured-list-cell
                            v-if="param.default != undefined"
                            >{{ param.default }}</bx-structured-list-cell
                          >
                          <bx-structured-list-cell
                            v-else
                          ></bx-structured-list-cell
                        ></template>
                      </bx-structured-list-row>
                    </bx-structured-list-body>
                  </bx-structured-list>
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentCommand.executable != undefined"
              >
                <bx-structured-list-cell>Executable</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentCommand.executable }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentCommand.arguments != undefined"
              >
                <bx-structured-list-cell>Arguments</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentCommand.arguments }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentCommand.expandArguments != undefined"
              >
                <bx-structured-list-cell
                  >Expand Arguments</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentCommand.expandArguments }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentCommand.environment != undefined"
              >
                <bx-structured-list-cell>Environment</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentCommand.environment }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>
        <bx-accordion-item title-text="Workflow Attributes">
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Definition</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-if="componentWFAttributes.replicate != undefined"
              >
                <bx-structured-list-cell>Replicate</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.replicate }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.aggregate != undefined"
              >
                <bx-structured-list-cell>Aggregate</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.aggregate }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.isMigratable != undefined"
              >
                <bx-structured-list-cell>Migratable</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.isMigratable }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.isMigrated != undefined"
              >
                <bx-structured-list-cell>Migrated</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.isMigrated }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.isRepeat != undefined"
              >
                <bx-structured-list-cell>Repeat</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.isRepeat }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.restartHookFile != undefined"
              >
                <bx-structured-list-cell
                  >Restart Hook File</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.restartHookFile }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.restartHookOn.length != 0"
              >
                <bx-structured-list-cell>
                  >>Restart Hooks
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentWFAttributes.restartHookOn.length != 0"
              >
                <bx-structured-list-cell
                  >Restart Hook On</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  <bx-unordered-list
                    v-for="(hook, i) in componentWFAttributes.restartHookOn"
                    :key="i"
                  >
                    <bx-list-item>{{ hook }}</bx-list-item>
                  </bx-unordered-list>
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.memoization.disable.fuzzy !=
                    undefined ||
                  componentWFAttributes.memoization.disable.strong !=
                    undefined ||
                  componentWFAttributes.memoization.embeddingFunction !=
                    undefined
                "
              >
                <bx-structured-list-cell>
                  >>Memoization
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.memoization.disable.fuzzy !=
                    undefined ||
                  componentWFAttributes.memoization.disable.strong != undefined
                "
              >
                <bx-structured-list-cell> >>Disable </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.memoization.disable.fuzzy != undefined
                "
              >
                <bx-structured-list-cell>Fuzzy</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.memoization.disable.fuzzy }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.memoization.disable.strong != undefined
                "
              >
                <bx-structured-list-cell>Strong</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.memoization.disable.strong }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.memoization.embeddingFunction !=
                  undefined
                "
              >
                <bx-structured-list-cell
                  >Embedding Function
                </bx-structured-list-cell>
                <bx-structured-list-cell
                  >{{ componentWFAttributes.memoization.embeddingFunction }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.optimizer.disable != undefined ||
                  componentWFAttributes.optimizer.exploitChance != undefined ||
                  componentWFAttributes.optimizer.exploitTarget != undefined ||
                  componentWFAttributes.optimizer.exploitTargetHigh !=
                    undefined ||
                  componentWFAttributes.optimizer.exploitTargetLow != undefined
                "
              >
                <bx-structured-list-cell> >>Optimizer </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentWFAttributes.optimizer.disable != undefined"
              >
                <bx-structured-list-cell>Disable</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.optimizer.disable }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.optimizer.exploitChance != undefined
                "
              >
                <bx-structured-list-cell
                  >Exploit Chance</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.optimizer.exploitChance }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentWFAttributes.optimizer.exploitTarget != undefined
                "
              >
                <bx-structured-list-cell
                  >Exploit Target</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.optimizer.exploitTarget }}
                </bx-structured-list-cell> </bx-structured-list-row
              ><bx-structured-list-row
                v-if="
                  componentWFAttributes.optimizer.exploitTargetHigh != undefined
                "
              >
                <bx-structured-list-cell
                  >Exploit Target High</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.optimizer.exploitTargetHigh }}
                </bx-structured-list-cell> </bx-structured-list-row
              ><bx-structured-list-row
                v-if="
                  componentWFAttributes.optimizer.exploitTargetLow != undefined
                "
              >
                <bx-structured-list-cell
                  >Exploit Target Low</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.optimizer.exploitTargetLow }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentWFAttributes.repeatInterval != undefined"
              >
                <bx-structured-list-cell
                  >Repeat Interval</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.repeatInterval }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.repeatRetries != undefined"
              >
                <bx-structured-list-cell
                  >Repeat Retries</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentWFAttributes.repeatRetries }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.maxRestarts != undefined"
              >
                <bx-structured-list-cell>Max Restarts</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentWFAttributes.maxRestarts }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentWFAttributes.shutdownOn.length != 0"
              >
                <bx-structured-list-cell>
                  >>Shutdown Hooks
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentWFAttributes.shutdownOn.length != 0"
              >
                <bx-structured-list-cell>Shutdown On</bx-structured-list-cell>
                <bx-structured-list-cell>
                  <bx-unordered-list
                    v-for="(hook, i) in componentWFAttributes.shutdownOn"
                    :key="i"
                  >
                    <bx-list-item>{{ hook }}</bx-list-item>
                  </bx-unordered-list>
                </bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>
        <bx-accordion-item
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
          title-text="Resource Manager"
        >
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Definition</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.config.backend != undefined ||
                  componentResourceManager.config.walltime != undefined
                "
              >
                <bx-structured-list-cell>>>Config</bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.config.backend != undefined"
              >
                <bx-structured-list-cell>Backend</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.config.backend }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.config.walltime != undefined"
              >
                <bx-structured-list-cell>Walltime</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.config.walltime }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentResourceManager.docker.image != undefined ||
                  componentResourceManager.docker.imagePullPolicy !=
                    undefined ||
                  componentResourceManager.docker.platform != undefined
                "
              >
                <bx-structured-list-cell>>>Docker</bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.docker.image != undefined"
              >
                <bx-structured-list-cell>Image</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.docker.image }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.docker.imagePullPolicy != undefined
                "
              >
                <bx-structured-list-cell
                  >Image Pull Policy</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.docker.imagePullPolicy }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.docker.platform != undefined"
              >
                <bx-structured-list-cell>Platform</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.docker.platform }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
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
                <bx-structured-list-cell>>>LSF</bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.lsf.statusRequestInterval !=
                  undefined
                "
              >
                <bx-structured-list-cell
                  >Request Interval</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.statusRequestInterval }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.lsf.queue != undefined"
              >
                <bx-structured-list-cell>Queue</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.queue }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.lsf.reservation != undefined"
              >
                <bx-structured-list-cell>Reservation</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.reservation }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.lsf.resourceString != undefined"
              >
                <bx-structured-list-cell
                  >Resource String</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.resourceString }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.lsf.dockerImage != undefined"
              >
                <bx-structured-list-cell>Docker Image</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.dockerImage }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.lsf.dockerProfileApp != undefined
                "
              >
                <bx-structured-list-cell
                  >Docker Profile App</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.dockerProfileApp }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.lsf.dockerOption != undefined"
              >
                <bx-structured-list-cell>Docker Option</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.lsf.dockerOption }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.image != undefined ||
                  componentResourceManager.kubernetes.imagePullSecret !=
                    undefined ||
                  componentResourceManager.kubernetes.gracePeriod !=
                    undefined ||
                  componentResourceManager.kubernetes.podSpec != undefined ||
                  componentResourceManager.kubernetes.apiKeyVar != undefined ||
                  componentResourceManager.kubernetes.host != undefined ||
                  componentResourceManager.kubernetes.namespace != undefined
                "
              >
                <bx-structured-list-cell>>>Kubernetes</bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceManager.kubernetes.image != undefined"
              >
                <bx-structured-list-cell>Image</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.image }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.imagePullSecret !=
                  undefined
                "
              >
                <bx-structured-list-cell
                  >Image Pull Secret</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.imagePullSecret }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.gracePeriod != undefined
                "
              >
                <bx-structured-list-cell>Grace Period</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.gracePeriod }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentResourceManager.kubernetes.podSpec != undefined"
              >
                <bx-structured-list-cell>Pod Spec</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.podSpec }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.apiKeyVar != undefined
                "
              >
                <bx-structured-list-cell>Api Key Var</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.apiKeyVar }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="!componentResourceManager.kubernetes.host == undefined"
              >
                <bx-structured-list-cell>Host</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.host }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.namespace != undefined
                "
              >
                <bx-structured-list-cell>Namespace</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.namespace }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="
                  componentResourceManager.kubernetes.cpuUnitsPerCore !=
                  undefined
                "
              >
                <bx-structured-list-cell
                  >Cpu Units per Core</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceManager.kubernetes.cpuUnitsPerCore }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>
        <bx-accordion-item
          v-if="
            componentResourceRequest.numberProcesses != undefined ||
            componentResourceRequest.numberThreads != undefined ||
            componentResourceRequest.ranksPerNode != undefined ||
            componentResourceRequest.threadsPerCore != undefined ||
            componentResourceRequest.memory != undefined ||
            componentResourceRequest.gpus != undefined
          "
          title-text="Resource Request"
        >
          <bx-structured-list>
            <bx-structured-list-head>
              <bx-structured-list-header-row>
                <bx-structured-list-header-cell
                  >Name</bx-structured-list-header-cell
                >
                <bx-structured-list-header-cell
                  >Definition</bx-structured-list-header-cell
                >
              </bx-structured-list-header-row>
            </bx-structured-list-head>
            <bx-structured-list-body>
              <bx-structured-list-row
                v-if="componentResourceRequest.numberProcesses != undefined"
              >
                <bx-structured-list-cell
                  >Number of Processes</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceRequest.numberProcesses }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentResourceRequest.numberThreads != undefined"
              >
                <bx-structured-list-cell
                  >Number of Threads</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceRequest.numberThreads }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentResourceRequest.ranksPerNode != undefined"
              >
                <bx-structured-list-cell
                  >Ranks per Node</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceRequest.ranksPerNode }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceRequest.threadsPerCore != undefined"
              >
                <bx-structured-list-cell
                  >Threads per Core</bx-structured-list-cell
                >
                <bx-structured-list-cell>
                  {{ componentResourceRequest.threadsPerCore }}
                </bx-structured-list-cell>
              </bx-structured-list-row>

              <bx-structured-list-row
                v-if="componentResourceRequest.memory != undefined"
              >
                <bx-structured-list-cell>Memory</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceRequest.memory }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
              <bx-structured-list-row
                v-if="componentResourceRequest.gpus != undefined"
              >
                <bx-structured-list-cell>GPUs</bx-structured-list-cell>
                <bx-structured-list-cell>
                  {{ componentResourceRequest.gpus }}
                </bx-structured-list-cell>
              </bx-structured-list-row>
            </bx-structured-list-body>
          </bx-structured-list>
        </bx-accordion-item>
      </bx-accordion>
    </bx-modal-body>
  </bx-modal>
</template>

<script>
export default {
  props: {
    title: String,
    node: Object,
    inputingEdges: Array,
  },
  data() {
    return {
      componentName: null,
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
    this.componentName = this.node.definition.signature.name;
    this.componentStage = this.node.definition.stage;
    this.componentVariables = this.node.definition.variables;
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
  },
};
</script>
<style lang="css" scoped>
@import "@/styles/bx-accordion-styles.css";
@import "@/styles/bx-modal-styles.css";
</style>
