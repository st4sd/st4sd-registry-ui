<template>
  <div id="toast-notification-container">
    <bx-toast-notification
      v-if="loadingError.statusText != ''"
      kind="error"
      style="min-width: fit-content"
      :title="loadingError.description"
      :caption="
        loadingError.statusText + ' (error ' + loadingError.statusCode + ')'
      "
      timeout="5000"
    >
    </bx-toast-notification>
    <bx-toast-notification
      v-for="toastNotification in postRequestToastNotifications"
      :key="toastNotification.kind"
      :kind="toastNotification.kind"
      :title="toastNotification.description"
      :caption="
        toastNotification.statusText +
        ' (code ' +
        toastNotification.statusCode +
        ')'
      "
      timeout="5000"
    >
    </bx-toast-notification>
  </div>
  <St4sdBreadcrumb
    :breadcrumbs="[
      { name: 'Virtual Experiments', path: '/' },
      {
        name: 'Build Canvas',
        path: `/build-canvas`,
      },
      {
        name: 'Global Registry Library',
        path: `/build-canvas/global-registry-library`,
      },
    ]"
  />
  <dds-content-block>
    <dds-content-block-heading>
      Global Registry Library
    </dds-content-block-heading>
  </dds-content-block>

  <div class="cds--row">
    <div class="cds--col-lg-13 cds--col-md-5">
      <div id="loadingContainer" v-if="loading">
        <bx-loading id="loadingWheel" type="overlay"></bx-loading>
      </div>
      <HttpErrorEmptyState
        v-else-if="loadingError.statusText != ''"
        class="full-height-empty-state"
        :errorDescription="loadingError.description"
        :errorStatusText="loadingError.statusText"
        :errorCode="loadingError.statusCode"
      />
      <NoDataEmptyState
        v-else-if="components.length == 0"
        class="full-height-empty-state"
        :title="NoDataEmptyStateText.title"
        :message="NoDataEmptyStateText.message"
      />
      <div class="cds--row" v-else>
        <div
          class="cds--col-lg-5 cds--col-md-8"
          id="card-container"
          v-for="(component, idx) in components"
          :key="idx"
        >
          <dds-card color-scheme="light" border id="card">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <dds-card-eyebrow slot="eyebrow" id="card-eyebrow">{{
              component["graph"]["entrypoint"]["entry-instance"]
            }}</dds-card-eyebrow>
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute  -->
            <p id="card-description">
              {{
                component["graph"]["workflows"][
                  component["workflowEntryIndex"]
                ]["signature"]["description"]
              }}
            </p>
            <div class="tag-group-container">
              <cds-tag
                v-for="(parameter, idx) in component['graph']['workflows'][
                  component['workflowEntryIndex']
                ]['signature']['parameters']"
                :key="idx"
                type="gray"
              >
                {{ parameter.name }}
              </cds-tag>
            </div>
            <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
            <dds-card-footer
              slot="footer"
              id="card-footer"
              @click="addComponent(component)"
            >
              Add Component
              <img
                id="white-svg"
                width="20"
                height="20"
                src="@/assets/shopping--cart.svg"
              />
            </dds-card-footer>
          </dds-card>
          <br />
        </div>
      </div>
    </div>
    <div class="cds--col-lg-3 cds--col-md-3" id="basket">
      <h4 id="basket-title">Components to Import</h4>
      <div id="basket-items">
        <bx-clickable-tile
          @click="removeComponent(component)"
          id="item"
          v-for="(component, idx) in componentsToImport"
          :key="idx"
        >
          <div id="item-content">
            {{ component["graph"]["entrypoint"]["entry-instance"] }}
            <img
              id="white-svg"
              width="16"
              height="16"
              src="@/assets/subtract--alt.svg"
            />
          </div>
        </bx-clickable-tile>
      </div>
      <bx-btn
        @click="postComponents"
        id="basket-button"
        icon-layout
        v-if="componentsToImport.length != 0"
        ><img
          class="white-svg"
          width="16"
          height="16"
          src="@/assets/plus.svg"
        />Import To Local Library</bx-btn
      >
    </div>
  </div>
</template>

<script>
import St4sdBreadcrumb from "@/components/St4sdBreadcrumb/St4sdBreadcrumb.vue";
import HttpErrorEmptyState from "@/components/EmptyState/HttpError.vue";
import NoDataEmptyState from "@/components/EmptyState/NoDataEmptyState.vue";

import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/button.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/tile.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/loading.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v1.42.0/notification.min.js";
import "https://1.www.s81c.com/common/carbon-for-ibm-dotcom/version/v1.42.0/card.min.js";
import "https://1.www.s81c.com/common/carbon-for-ibm-dotcom/version/v1.42.0/content-block.min.js";
import "@carbon/web-components/es/components/tag/index.js";

import axios from "axios";

import { getDeploymentEndpoint } from "@/functions/public_path";

export default {
  name: "GlobalRegistryLibraryView",
  components: {
    St4sdBreadcrumb,
    HttpErrorEmptyState,
    NoDataEmptyState,
  },
  data() {
    return {
      componentsToImport: [],
      components: [],
      loadingError: {
        statusText: "",
        statusCode: "",
        description: "Unable to load components",
      },
      postRequestToastNotifications: [],
      NoDataEmptyStateText: {
        title: "That's it",
        message: "You have added all the components",
      },
      loading: true,
    };
  },
  mounted() {
    axios
      .get(
        `${getDeploymentEndpoint()}registry-ui/backend/canvas/graphs-library`,
      )
      .then((response) => {
        this.components = response.data.entries;
        if (this.components.length == 0) {
          this.NoDataEmptyStateText.title = "No data available";
          this.NoDataEmptyStateText.message =
            "There are no components available";
        }
      })
      .catch((error) => {
        this.loadingError.statusText = error.response.statusText;
        this.loadingError.statusCode = error.response.status;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    async postComponents() {
      axios
        .post(
          window.location.origin + "/registry-ui/backend/canvas/components",
          this.componentsToImport,
        )
        .then((response) => {
          this.componentsToImport = [];
          let notificationParameters = {
            kind: "success",
            statusText:
              "Your selected components are now available in your local Template Workspace",
            statusCode: response.status,
            description: "Components imported successfully",
          };
          this.postRequestToastNotifications.push(notificationParameters);
        })
        .catch((error) => {
          let notificationParameters = {
            kind: "error",
            statusText: error.response.statusText,
            statusCode: error.response.status,
            description: "Unable to import components",
          };
          this.postRequestToastNotifications.push(notificationParameters);
        });
    },
    addComponent(component) {
      this.componentsToImport.push(component);
      let index = this.components.indexOf(component);
      this.components.splice(index, 1);
    },
    removeComponent(component) {
      this.components.unshift(component);
      let index = this.componentsToImport.indexOf(component);
      this.componentsToImport.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@carbon/layout";
@use "@/styles/cds-tag-styles.scss";
@use "@/styles/svg.scss";
@use "@/styles/toast-notification-styles.scss";
@use "@/styles/empty_state_styles.scss";

.cds--col-lg-13 {
  height: fit-content;
}

#card-container {
  margin-top: 1rem;
}

#card-description,
#card-footer,
#card-eyebrow {
  margin-bottom: 0.5rem;
}

#card-footer {
  cursor: pointer;
}

#add-icon {
  vertical-align: text-bottom;
}

#card-footer:hover #add-icon,
#remove-icon:hover {
  filter: brightness(0.8);
}

#basket {
  margin-top: 1rem;
  background: #f4f4f4;
  height: fit-content;
}

@media screen and (max-width: 671px) {
  #basket {
    max-width: 300px;
    margin-left: 1rem;
  }
}

#basket-title {
  font-size: var(--cds-heading-01-font-size, 0.875rem);
  font-weight: var(--cds-heading-01-font-weight, 600);
  letter-spacing: var(--cds-heading-01-letter-spacing, 0.16px);
  line-height: var(--cds-heading-01-line-height, 1.42857);
  padding: 1rem 0;
  text-align: center;
}

bx-clickable-tile {
  display: inline-block;
  width: 100%;
  cursor: pointer;

  &::part(link) {
    width: 100%;
  }

  &:first-child {
    border-top: 1px solid var(--cds-ui-03, #e0e0e0);
  }

  &:last-child {
    border-bottom: 1px solid var(--cds-ui-03, #e0e0e0);
  }
}

#item-content {
  width: 100%;
  position: relative;
  padding-right: 20px;
}

#remove-icon {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  right: 0;
}

#basket-button {
  display: grid;
  place-content: center;
  padding: 1rem 0;
}

#loadingContainer {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#loadingWheel {
  display: inline-block;
  animation: none;
}
</style>
