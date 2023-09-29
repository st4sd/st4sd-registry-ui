<template>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: id,
        path: `/experiment/${id}`,
      },
      {
        name: 'Parameterisation Options',
        path: `/experiment/${id}/parameterisation-options`,
      },
    ]"
  />
  <div v-if="parameterisationOptionsLoading" id="loading-container">
    <bx-loading type="overlay"></bx-loading>
  </div>

  <div v-else>
    <div class="cds--row white-background" id="margin-right">
      <div class="cds--col">
        <h1>Parameterisation Options</h1>
      </div>
    </div>
    <div class="cds--row background" id="padding-top" v-if="editOptions">
      <div class="cds--col">
        <h3>Editing {{ tabSelector }} properties</h3>
      </div>
      <div class="cds--col">
        <div class="buttons-container">
          <bx-btn
            id="cancel-button"
            kind="secondary"
            @click="handleCancel"
            :disabled="cancelDisabled"
          >
            Cancel
          </bx-btn>
          <bx-btn
            id="save-button"
            @click="togglePostParameterisationPayload"
            :disabled="saveDisabled"
          >
            Save
          </bx-btn>
        </div>
      </div>
    </div>
    <div class="cds--row background">
      <div class="background margin height" id="left-navigation-tab-container">
        <bx-side-nav id="side-nav" aria-label="Side navigation" expanded>
          <bx-side-nav-items class="background">
            <bx-side-nav-menu-item
              href="#"
              @click="setTabSelector('platforms')"
              :active="tabSelector == 'platforms'"
            >
              Platform
            </bx-side-nav-menu-item>
            <bx-side-nav-menu-item
              href="#"
              @click="setTabSelector('variables')"
              :active="tabSelector == 'variables'"
            >
              Variables
            </bx-side-nav-menu-item>
            <bx-side-nav-menu-item
              href="#"
              @click="setTabSelector('data')"
              :active="tabSelector == 'data'"
            >
              Data Files
            </bx-side-nav-menu-item>
            <bx-side-nav-menu-item
              href="#"
              @click="setTabSelector('input')"
              :active="tabSelector == 'input'"
            >
              Input Files
            </bx-side-nav-menu-item>
            <bx-side-nav-menu-item
              href="#"
              @click="setTabSelector('runtime')"
              :active="tabSelector == 'runtime'"
            >
              Runtime
            </bx-side-nav-menu-item>
          </bx-side-nav-items>
        </bx-side-nav>
      </div>
      <div
        class="cds--col margin background height"
        id="right-content-container"
      >
        <div
          id="margin-right"
          class="height"
          :class="{ 'white-background': !editOptions }"
        >
          <div class="cds--col" id="padding-right">
            <bx-btn
              kind="secondary"
              id="edit-button"
              iconLayout
              @click="toggleEditOptions"
              v-if="!editOptions"
            >
              Edit
              <img width="16" heigth="16" src="@/assets/edit.svg" />
            </bx-btn>
          </div>
          <ReadParameterisationOptions
            v-if="!editOptions"
            :inputs="inputs"
            :parameterisation="parameterisation"
            :tabSelector="tabSelector"
            :variables="variables"
            :dataOptionsProp="dataOptions"
            :dataExecutionOptionsProp="dataExecutionOptions"
            :runtimeArgs="runtimeArgs"
            :orchestratorResources="orchestratorResources"
            :executionOptionsDefaults="executionOptionsDefaults"
          />
          <EditParameterisationOptions
            v-else
            :cancelNotificationOpen="cancelNotificationOpen"
            :id="id"
            :inputs="inputs"
            :parameterisation="parameterisation"
            :entryProp="entry"
            :platformOptionsProp="platformOptions"
            :tabSelector="tabSelector"
            :postParameterisationOptions="postParameterisationPayload"
            :variablesProp="variables"
            :dataProp="dataExecutionOptions"
            :dataOptionsProp="dataOptions"
            :runtimeArgsProp="runtimeArgs"
            :runtimeArgsInvalidProp="runtimeArgsInvalid"
            :orchestratorResourcesProp="orchestratorResources"
            :orchestratorResourcesInvalidProp="orchestratorResourcesInvalid"
            :executionOptionsDefaults="executionOptionsDefaults"
            @dataInvalid="dataInvalid"
            @dataValid="dataValid"
            @postNewParameterisation="
              dataInvalid();
              disableCancel();
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import ReadParameterisationOptions from "@/components/ParameterisationView/ReadParameterisationOptions.vue";
import EditParameterisationOptions from "@/components/ParameterisationView/EditParameterisationOptions.vue";

import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/button/index.js";

import axios from "axios";

export default {
  name: "ExperimentView",
  components: {
    St4sdBreadcrumb,
    ReadParameterisationOptions,
    EditParameterisationOptions,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabSelector: "platforms",
      platformTabSelector: null,
      initialParameterisation: null,
      initialParameterisationSet: false,
      parameterisation: null,
      inputs: null,
      parameterisationOptionsLoading: true,
      editOptions: false,
      postParameterisationPayload: false,
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
      cancelNotificationOpen: false,
      cancelCounter: 0,
      invalidData: {
        variablePresets: false,
        variableExecutionOptions: false,
        orchestratorResources: false,
        runtimeArgs: false,
      },
      saveDisabled: false,
      cancelDisabled: false,
    };
  },
  watch: {
    invalidData: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        console.log(
          Object.values(this.invalidData).some((data) => data == true),
        );
        if (Object.values(this.invalidData).some((data) => data == true)) {
          this.saveDisabled = true;
        } else if (
          Object.values(this.invalidData).every((data) => data == false)
        ) {
          this.saveDisabled = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    setTabSelector(option) {
      this.tabSelector = option;
    },
    toggleEditOptions() {
      this.editOptions = !this.editOptions;
    },
    getParameterisationOptions() {
      axios
        .get(
          window.location.origin +
            "/registry-ui/backend/experiments/" +
            this.id +
            "/parameterisation",
        )
        .then((response) => {
          if (this.initialParameterisationSet != true) {
            this.initialParameterisation = JSON.parse(
              JSON.stringify(response.data.entry.parameterisation),
            );
          }
          this.initialParameterisationSet = true;
          this.entry = response.data.entry;
          this.executionOptionsDefaults =
            response.data.entry.metadata.registry.executionOptionsDefaults;
          this.platformOptions = this.entry.metadata.registry.platforms;
          this.dataOptions = response.data.entry.metadata.registry.data;
          this.dataExecutionOptions =
            response.data.entry.parameterisation.executionOptions.data;
          this.parameterisation = response.data.entry.parameterisation;
          this.inputs = response.data.entry.metadata.registry.inputs;
          this.parameterisationOptionsLoading = false;
          this.setVariables();
          this.setRuntimeArgs();
          this.setOrchestratorResources();
        });
    },
    setVariables() {
      let presetsVariables = [];
      let executionOptionsVariables = [];
      let defaultVariables = [];
      this.parameterisation.presets.variables.forEach((variable) => {
        if (variable.value == undefined) {
          presetsVariables.push({
            name: variable.name,
            type: "presets",
          });
        } else {
          presetsVariables.push({
            name: variable.name,
            value: variable.value,
            type: "presets",
          });
        }
      });
      this.parameterisation.executionOptions.variables.forEach((variable) => {
        if (variable.value == undefined && variable.valueFrom == undefined) {
          executionOptionsVariables.push({
            name: variable.name,
            value: "",
            type: "executionOptions",
          });
          variable.value = "";
        } else if (variable.valueFrom != undefined) {
          executionOptionsVariables.push({
            name: variable.name,
            valueFrom: variable.valueFrom,
            type: "executionOptions",
          });
        } else {
          executionOptionsVariables.push({
            name: variable.name,
            value: variable.value,
            type: "executionOptions",
          });
        }
      });
      let setVariables = presetsVariables.concat(executionOptionsVariables);
      let setVariableNames = setVariables.map((variable) => variable.name);
      let allVariableOptions = this.executionOptionsDefaults.variables.map(
        (variable) => variable.name,
      );
      let defaultVariableNames = allVariableOptions.filter((variable) => {
        return setVariableNames.indexOf(variable) == -1;
      });
      defaultVariableNames.forEach((variable) =>
        defaultVariables.push({ name: variable, type: "default" }),
      );
      this.variables = presetsVariables.concat(
        executionOptionsVariables,
        defaultVariables,
      );
      this.variables.sort(function (a, b) {
        return a.name[0].localeCompare(b.name[0]);
      });
    },
    setRuntimeArgs() {
      this.runtimeArgs = this.parameterisation.presets.runtime.args.concat(
        this.parameterisation.executionOptions.runtime.args,
      );
      this.runtimeArgs.forEach((arg) => {
        if (arg != "") {
          this.runtimeArgsInvalid.push(false);
        } else {
          this.runtimeArgsInvalid.push(true);
        }
      });
      console.log(this.runtimeArgsInvalid);
    },
    setOrchestratorResources() {
      if (this.parameterisation.presets.runtime.resources != undefined) {
        this.orchestratorResources =
          this.parameterisation.presets.runtime.resources;
      }
      if (
        this.parameterisation.executionOptions.runtime.resources != undefined
      ) {
        this.orchestratorResources =
          this.parameterisation.executionOptions.runtime.resources;
      }
      if (this.orchestratorResources.cpu == "") {
        this.orchestratorResourcesInvalid[0] = true;
      } else {
        this.orchestratorResourcesInvalid[0] = false;
      }
      if (this.orchestratorResources.memory == "") {
        this.orchestratorResourcesInvalid[1] = true;
      } else {
        this.orchestratorResourcesInvalid[1] = false;
      }
    },
    togglePostParameterisationPayload() {
      this.postParameterisationPayload = !this.postParameterisationPayload;
    },
    handleCancel() {
      let timer;
      this.cancelCounter++;
      if (this.cancelCounter < 2) {
        this.cancelNotificationOpen = true;
        timer = setTimeout(this.resetCancelCounter, 10000);
      } else {
        clearTimeout(timer);
        this.resetCancelCounter();
        this.toggleEditOptions();
        this.resetParameterisation();
      }
    },
    resetCancelCounter() {
      this.cancelCounter = 0;
      this.cancelNotificationOpen = false;
    },
    dataInvalid(key) {
      console.log(key);
      this.invalidData[key] = true;
      console.log(this.invalidData);
    },
    dataValid(key) {
      console.log(key);
      this.invalidData[key] = false;
      console.log(this.invalidData);
    },
    disableCancel() {
      this.cancelDisabled = true;
    },
    resetParameterisation() {
      this.parameterisation = JSON.parse(
        JSON.stringify(this.initialParameterisation),
      );
      this.dataExecutionOptions = this.parameterisation.executionOptions.data;
      this.setVariables();
      this.setRuntimeArgs();
      this.setOrchestratorResources();
    },
  },
  mounted() {
    this.getParameterisationOptions();
  },
};
</script>

<style scoped lang="scss">
@use "@carbon/layout";
h1 {
  padding-bottom: layout.$spacing-07;
}

h5 {
  padding: 0 0 1rem 1rem;
}

#left-navigation-tab-container {
  padding-left: 0;
  padding-right: layout.$spacing-07;
}

#right-content-container {
  padding-left: 0;
  padding-right: layout.$spacing-06;
}

bx-side-nav-items {
  padding-top: 0;
}

#loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#main-content {
  margin-left: 0 !important;
}

#side-nav {
  position: relative;
  top: 0px;
}
#edit-button {
  position: relative;
  width: 8rem;
  left: calc(100% - 8rem);
}
.buttons-container {
  position: relative;
  left: calc(100% - 16.5rem);
  width: 16.5rem;
}
#cancel-button {
  width: 8rem;
  margin-right: 0.5rem;
}
#save-button {
  width: 8rem;
}
.margin {
  margin-top: layout.$spacing-05;
}
#padding-top {
  padding-top: 1rem;
}
#padding {
  padding-left: 2rem;
}
.background {
  background-color: #f4f4f4;
}

.white-background {
  background-color: white !important;
}
.height {
  min-height: 80vh;
}
#margin-right {
  margin-right: 0;
}
#padding-right {
  padding-right: 0 !important;
}
</style>
