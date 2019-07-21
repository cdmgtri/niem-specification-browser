
<template>
    <b-row>
      <b-col sm="3">
        <h2>Search NIEM Rules</h2>

        <!-- Choose NIEM release -->
        <!-- <div class="form-group form-inline" id="selectedNIEMGroup"> -->
          <label for="selectNIEM" id="selectedNIEMLabel">NIEM release:</label>
          <b-form-select
            id="selectNIEM" size="sm"
            v-model="selectedNIEM"
            :options="availableNIEM"
          />
        <!-- </div> -->

        <!-- Choose Spec -->
        <label for="selectSpec">Specification:</label>
        <b-form-select id="selectSpec" v-model="selectedSpec" :options="compatibleSpecVersions" :select-size="compatibleSpecVersions.length"/>

        <!-- Choose Applicability -->
        <label for="selectTarget">Conformance Target:</label>
        <b-form-select id="selectTarget" v-model="selectedTarget" :options="compatibleApplicability" :select-size="compatibleApplicability.length"/>



      </b-col>
      <b-col sm="9">
        <h2>Results</h2>
      <b-table
        striped hover
        :items="compatibleRules"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        />
      </b-col>
    </b-row>

    <!-- <b-table
      striped hover
      :items="compatibleRules"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"

      >

      <template slot="details" slot-scope="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
      </template>

      <template slot="details" slot-scope="row">
        <p>{{ row.title }}</p>
      </template>
    </b-table> -->


    <!-- Pagination -->
    <!-- <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" align="center"/> -->

</template>

<script>

import vkbeautify from "vkbeautify";
import * as data from "../scripts/data.js";

function formatApplicability(arr) {
  return arr.join(", ");
}

function sortRuleNumber(num1, num2) {
  let x = parseFloat(num1.replace("-", "."));
  let y = parseFloat(num2.replace("-", "."));
  return (x < y) ? -1 : 1;
}

export default {
  name: "Rules",

  data() {
    return {
      selectedSpec:  "",
      specs: [
        "NDR", "MPD", "CodeLists"
      ],
      selectedTarget: "",
      allRules: data.getRules(),
      availableNIEM: data.getRulesAvailableNIEM(),
      selectedNIEM: "4.1",
      fields: [
        { label: "Spec", key: "specification.version", sortable: true },
        { label: "Number", key: "number", sortable: true },
        { label: "Applicability", key: "applicability", sortable: true },
        { label: "Title", key: "title", sortable: true },
        "details"
      ],
      // currentPage: 1,
      // perPage: 50,
      // totalRows: this.compatibleRules.length
    }
  },
  computed: {
    /**
     * NIEM rules compatible with the user-selected release.
     */
    releaseRules() {
      return this.allRules.filter( rule => rule.specification.niem.includes(this.selectedRelease));
    },

    /**
     * NIEM specification IDs (e.g., "NDR") compatible with the user-selected release.
     */
    compatibleSpecs() {
      let specs = this.releaseRules.map( rule => rule.specification.id );
      return [...new Set(specs)];
    },

    /**
     * NIEM specification versions (e.g., "NDR-4.0") compatible with the user-selected release.
     */
    compatibleSpecVersions() {
      let specs = this.compatibleRules.map( rule => rule.specification.version );
      return [...new Set(specs)];
    },

    /**
     * NIEM rules compatible with the user-selected release and specification.
     */
    specRules() {
      return this.releaseRules.filter( rule => rule.specification.id === this.selectedSpec );
    },

    /**
     * NIEM conformance targets compatible with the user-selected release and specification.
     */
    compatibleTargets() {
      let targets = ["(all)"];
      this.specRules.forEach( rule => targets.push(...rule.applicability));
      return [...new Set(targets)].sort();
    },

    /**
     * NIEM rules compatible with the user-selected release, spec, and conformance target.
     *
     * Note: If exclusive is selected, then the results will contain only those rules with that one and only conformance target (e.g., EXT only).  Otherwise, the results will contain rules that include the selected conformance target, along with additional possible conformance targets (e.g., REF, EXT).
     */
    targetRules() {
      if (this.selectedTarget === "(all)") {
        return this.specRules;
      }

      if (this.selectedExclusive == true) {
        return this.specRules.filter( rule => rule.applicability == this.selectedTarget );
      }

      return this.specRules.filter( rule => rule.applicability.includes(this.selectedTarget));
    },

    compatibleStyles() {
      let styles = [];
      this.targetRules.forEach( rule => styles.push(rule.style) );
      return [...new Set(styles)].sort();
    },

    /**
     * NIEM rules compatible with the user-selected release, spec, conformance target, and search terms.
    */
    resultRules() {
      if (this.selectedStyle === "(all)" || this.selectedStyle ==="" ) {
        return this.targetRules;
      }
      return this.targetRules.filter( rule => rule.style === this.selectedStyle);
    },

    keywords() {
      if (! this.selectedKeywords) {
        return [];
      }
      return this.selectedKeywords.split(" ");
    },

    filteredRules() {
      if (! this.keywords) {
        return this.resultRules();
      }
      return this.resultRules.filter( rule => {
        return this.keywords.every( keyword => rule.title.includes(keyword));
      });
    }
  },
  methods: {
    formatXML: (schematron) => {
      return vkbeautify.xml(schematron, 2);
    }
  },
  created() {

  }

}
</script>

<style scoped>

.selectLabel {
  float: right;
  padding-left: 15px;
  padding-right: 15px;
}

#selectedNIEM {
  margin: 0;
}

#selectedNIEMGroup {
  margin: 0;
  float: right;
}

#tableHeaderRow {
  margin-bottom: 15px;
  margin-left: 0;
  margin-right: 0;
  align-items: center;
}

#tableHeaderRow div {
  padding: 0;
}

h2, select {
  margin: 0;
}

small {
  padding-left: 20px;
}

input[type="checkbox"] {
  vertical-align:middle;
}

pre {
  border: 1px solid gainsboro;
  padding: 10px;

  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

.tooltip-inner {
  white-space: pre-line;
}

</style>

