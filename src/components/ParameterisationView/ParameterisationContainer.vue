<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div id="parameterisation-hero" class="cds--row">
    <div class="cds--col">
      <h1>Parameterisation Options</h1>
    </div>
  </div>
  <div id="parameterisation-edit-title" class="cds--row" v-if="!readView">
    <div class="cds--col">
      <h3>Editing {{ tabSelector }} properties</h3>
    </div>
    <div class="cds--col">
      <div class="buttons-container">
        <cds-button
          class="cancel-button"
          kind="secondary"
          @click="handleCancel"
          :disabled="cancelDisabled"
        >
          Cancel
        </cds-button>
        <cds-button
          class="save-button"
          @click="emitSave"
          :disabled="saveDisabled"
        >
          Save
        </cds-button>
      </div>
    </div>
  </div>
  <div id="parameterisation-content" class="cds--row">
    <div id="parameterisation-left-column">
      <cds-side-nav
        id="side-nav"
        aria-label="Side navigation"
        expanded
        isNotChildOfHeader
      >
        <cds-side-nav-items>
          <cds-side-nav-menu-item
            id="side-nav-first-item"
            href="#"
            @click="setTabSelector('platforms')"
            :active="tabSelector == 'platforms'"
          >
            Platform
          </cds-side-nav-menu-item>
          <cds-side-nav-menu-item
            href="#"
            @click="setTabSelector('variables')"
            :active="tabSelector == 'variables'"
          >
            Variables
          </cds-side-nav-menu-item>
          <cds-side-nav-menu-item
            href="#"
            @click="setTabSelector('data')"
            :active="tabSelector == 'data'"
          >
            Data Files
          </cds-side-nav-menu-item>
          <cds-side-nav-menu-item
            href="#"
            @click="setTabSelector('input')"
            :active="tabSelector == 'input'"
          >
            Input Files
          </cds-side-nav-menu-item>
          <cds-side-nav-menu-item
            href="#"
            @click="setTabSelector('runtime')"
            :active="tabSelector == 'runtime'"
          >
            Runtime
          </cds-side-nav-menu-item>
        </cds-side-nav-items>
      </cds-side-nav>
    </div>
    <div
      id="parameterisation-right-column"
      class="cds--col right-content-container"
    >
      <div :class="{ 'white-background': readView }">
        <div
          id="parameterisation-read-view-edit-button-container"
          class="cds--col"
        >
          <cds-button
            kind="secondary"
            class="edit-button"
            @click="toggleEditOptions"
            v-if="readView"
          >
            Edit
            <img slot="icon" width="16" heigth="16" src="@/assets/edit.svg" />
          </cds-button>
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
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/skeleton-text/index.js";

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
  mounted() {
    this.$nextTick(() => {
      document
        .getElementById("side-nav")
        .shadowRoot.querySelector(".cds--side-nav__navigation").style.display =
        "contents";
    });
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

cds-button {
  width: 8rem;
}

.buttons-container {
  position: relative;
  left: calc(100% - 16.5rem);
  width: 16.5rem;
}

.edit-button {
  position: relative;
  left: calc(100% - 8rem);
}

.cancel-button {
  margin-right: 0.5rem;
}

.white-background {
  background-color: white;
}

#parameterisation-edit-title {
  padding-top: layout.$spacing-05;
  background-color: #f4f4f4;
}

#parameterisation-content {
  padding-top: layout.$spacing-05;
  background-color: #f4f4f4;

  div:not(#parameterisation-read-view-edit-button-container) {
    min-height: 80vh;
  }

  #parameterisation-read-view-edit-button-container {
    padding-right: 0;
  }
}

#parameterisation-left-column {
  width: 256px;
  padding-left: 0;
  padding-right: layout.$spacing-07;

  cds-side-nav {
    position: relative;
    top: 0px;
  }
}

#parameterisation-right-column {
  padding-left: 0;
}
</style>
