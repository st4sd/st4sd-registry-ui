<template>
  <div class="cds--row white-background" id="margin-right">
    <div class="cds--col">
      <h1>Parameterisation Options</h1>
    </div>
  </div>
  <div class="cds--row background" id="padding-top" v-if="!readView">
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
        <bx-btn id="save-button" @click="emitSave" :disabled="saveDisabled">
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
    <div class="cds--col margin background height" id="right-content-container">
      <div
        id="margin-right"
        class="height"
        :class="{ 'white-background': readView }"
      >
        <div class="cds--col" id="padding-right">
          <bx-btn
            kind="secondary"
            id="edit-button"
            iconLayout
            @click="toggleEditOptions"
            v-if="readView"
          >
            Edit
            <img width="16" heigth="16" src="@/assets/edit.svg" />
          </bx-btn>
        </div>
        <ReadParameterisationOptions
          v-if="readView"
          :tabSelector="tabSelector"
          :pvep="pvep"
        />
        <EditParameterisationOptions
          v-else
          :cancelNotificationOpen="cancelNotificationOpen"
          :id="id"
          :tabSelector="tabSelector"
          :pvep="pvep"
          @dataInvalid="dataInvalid"
          @dataValid="dataValid"
          @setNewParameterisationOptions="setNewParameterisationOptions"
          @postNewParameterisation="
            dataInvalid();
            disableCancel();
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import ReadParameterisationOptions from "@/components/ParameterisationView/ReadParameterisationOptions.vue";
import EditParameterisationOptions from "@/components/ParameterisationView/EditParameterisationOptions.vue";

import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/tabs/index.js";
import "@carbon/web-components/es/components/toggle/index.js";
import "@carbon/web-components/es/components/button/index.js";

export default {
  name: "ParameterisationContainer",
  components: {
    ReadParameterisationOptions,
    EditParameterisationOptions,
  },
  props: {
    openInRead: Boolean,
    pvep: Object,
    id: String,
  },
  data() {
    return {
      tabSelector: "platforms",
      platformTabSelector: null,
      readView: null,
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
      newPvep: null,
    };
  },
  emits: {
    cancel: null,
    save: null,
  },
  watch: {
    invalidData: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
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
    openInRead: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.readView = val;
      },
    },
  },
  methods: {
    setTabSelector(option) {
      this.tabSelector = option;
    },
    toggleEditOptions() {
      this.readView = !this.readView;
    },
    setNewParameterisationOptions(pvep) {
      this.newPvep = pvep;
    },
    emitSave() {
      this.$emit("save", this.newPvep);
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
        this.$emit("cancel");
      }
    },
    resetCancelCounter() {
      this.cancelCounter = 0;
      this.cancelNotificationOpen = false;
    },
    dataInvalid(key) {
      this.invalidData[key] = true;
    },
    dataValid(key) {
      this.invalidData[key] = false;
    },
    disableCancel() {
      this.cancelDisabled = true;
    },
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
