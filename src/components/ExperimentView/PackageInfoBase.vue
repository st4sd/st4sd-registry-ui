<template>
  <div class="cds--row pad1">
    <ExperimentViewContentBlock title="Base" />
    <div class="cds--col-sm-4 cds--col-md-6 cds--col-lg-12">
      <div
        class="pad1"
        v-for="(basePackage, idx) in filterBasePackages(
          experiment.base.packages,
          'git',
        )"
        :key="idx"
      >
        <cds-structured-list>
          <cds-structured-list-head
            style="background-color: var(--cds-ui-03, #e0e0e0)"
          >
            <cds-structured-list-header-row>
              <cds-structured-list-header-cell>
                {{ basePackage.name }}
              </cds-structured-list-header-cell>
              <cds-structured-list-header-cell />
            </cds-structured-list-header-row>
          </cds-structured-list-head>
          <cds-structured-list-body>
            <cds-structured-list-row>
              <cds-structured-list-cell class="cds--col-sm-1"
                >Source</cds-structured-list-cell
              ><cds-structured-list-cell class="cds--col-sm-3">
                <cds-link :href="getUrl(basePackage.source.git)"
                  >{{ getUrl(basePackage.source.git) }}
                </cds-link>
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-if="basePackage.source.git.location.commit != null"
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Version</cds-structured-list-cell
              ><cds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.commit }}</code>
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row
              v-else-if="basePackage.source.git.location.branch != null"
            >
              <cds-structured-list-cell class="cds--col-sm-1"
                >Branch</cds-structured-list-cell
              ><cds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.branch }}</code>
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row v-else>
              <cds-structured-list-cell class="cds--col-sm-1"
                >Tag</cds-structured-list-cell
              ><cds-structured-list-cell class="cds--col-sm-3">
                <code>{{ basePackage.source.git.location.tag }}</code>
              </cds-structured-list-cell>
            </cds-structured-list-row>
            <cds-structured-list-row>
              <cds-structured-list-cell class="cds--col-sm-1"
                >Report a problem</cds-structured-list-cell
              ><cds-structured-list-cell class="cds--col-sm-3 pad1">
                <cds-link
                  :href="
                    createIssueForGitPackage(experiment, basePackage.source.git)
                  "
                  >Open new issue &nbsp;
                  <!-- eslint-disable -->
                  <!-- linting disabled for web component slot attribute - can't use "eslint-disable-next-line vue/no-deprecated-slot-attribute" as it's multiline-->
                  <img
                    slot="icon"
                    width="20"
                    height="20"
                    class="arrow-link"
                    src="../../assets/arrow--right.svg"
                  />
                  <!-- eslint-enable -->
                </cds-link>
              </cds-structured-list-cell>
            </cds-structured-list-row>
          </cds-structured-list-body>
        </cds-structured-list>
      </div>
    </div>
  </div>
</template>

<script>
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/structured-list.min.js";
import "https://1.www.s81c.com/common/carbon/web-components/version/v2.8.0/link.min.js";

import ExperimentViewContentBlock from "./ExperimentViewContentBlock.vue";

export default {
  name: "PackageInfoBase",
  props: {
    experiment: Object,
  },
  components: {
    ExperimentViewContentBlock,
  },
  methods: {
    filterBasePackages(basePackages, sourceFilter) {
      var filtered = [];
      for (var i = 0; i < basePackages.length; i++) {
        if (sourceFilter in basePackages[i].source)
          filtered.push(basePackages[i]);
      }
      return filtered;
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
      } else if (gitEntry.location.tag != null) {
        url += "/tree/" + gitEntry.location.tag;
      }

      return url;
    },
    createIssueForGitPackage(parameterisedPackage, gitPackage) {
      var title = "Issue report".replaceAll(" ", "+");
      var labels = "bug,parameterised-package-issue";
      var repoReference = "";
      if (gitPackage.location.commit != null) {
        repoReference = "%0A%0AReference commit: " + gitPackage.location.commit;
      } else if (gitPackage.location.branch != null) {
        repoReference = "%0A%0AReference branch: " + gitPackage.location.branch;
      } else {
        repoReference = "%0A%0AReference tag: " + gitPackage.location.tag;
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
  },
};
</script>
<style
  lang="css"
  scoped
  src="@/styles/structured-list-grid-column-styles.css"
></style>
