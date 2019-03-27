
<template>
  <div>

    <b-row id="tableHeaderRow">

      <b-col sm="3">
        <h2>Search NIEM Rules</h2>
      </b-col>

      <b-col sm="9">
        <div class="form-group form-inline" id="selectedNIEMGroup">
          <label for="selectNIEM" class="selectLabel">NIEM release: </label>
          <b-form-select id="selectNIEM" size="sm"
            v-model="selectedRelease"
            :options="ruleMetadata.availableReleases"
          />

          <label for="selectSpec" class="selectLabel">Specification: </label>
          <b-form-select id="selectSpec" size="sm"
            v-model="selectedSpec"
            :options="compatibleSpecs"
          />

          <label for="selectTarget" class="selectLabel">Target: </label>
          <b-form-select id="selectTarget" size="sm"
            v-model="selectedTarget"
            :options="compatibleTargets"
          />

          <label for="selectExclusive" class="selectLabel"
            title="Check box for an exclusive match on the conformance target, e.g., 'EXT' rules only. Uncheck if results can also match additional conformance targets, e.g., 'REF' and 'EXT'."
            >Exclusive?
          </label>
          <input id="selectExclusive" type="checkbox" v-model="selectedExclusive"/>
          <!-- <b-form-checkbox id="selectExclusive" size="sm"
            v-model="selectedExclusive" value="true" unchecked-value="false"
            title="Check box for an exclusive match on the conformance target, e.g., 'EXT' rules only. Uncheck if results can also match additional conformance targets, e.g., 'REF' and 'EXT'."
            >
            Exclusive?
          </b-form-checkbox> -->
        </div>
      </b-col>
    </b-row>

    <b-row>
      <small>Results: {{ resultRules.length }}</small>
    </b-row>


    <vue-good-table
      :columns="columns"
      :rows="resultRules"
      :fixed-header="true"
      :search-options="{
        enabled: true,
        skipDiacritics: true,
        placeholder: 'Search'
      }"
      :sort-options="{
        enabled: true
      }"
      >
    </vue-good-table>

  </div>
</template>

<script>

import * as data from "../scripts/data.js";
import { NIEMRuleType,  NIEMRule} from "../assets/typedefs/index.js";

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
      allRules: data.rules,
      ruleMetadata: data.ruleMetadata,
      selectedRelease: "4.1",
      selectedSpec: "NDR",
      selectedTarget: "(all)",
      selectedExclusive: false,
      columns: [
        { label: "Spec", field: "specification.version" },
        { label: "Rule", field: "number", sortFn: sortRuleNumber },
        { label: "Target", field: "applicability", formatFn: formatApplicability },
        { label: "Title", field: "title" },
        // "Details"
      ]
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

    /**
     * NIEM rules compatible with the user-selected release, spec, conformance target, and search terms.
    */
    resultRules () {
      return this.targetRules;
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

</style>

