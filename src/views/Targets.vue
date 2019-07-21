
<template>
  <div>
    <strong>NDR Conformance Targets (4.0):</strong>

    <b-table striped bordered :fields="fields" :items="ndrTargets"/>

  </div>
</template>

<script>

import targets from "../assets/data/niem-targets.json";

export default {
  name: "Targets",

  data() {
    return {
      fields: [
        { label: "ID", key: "id"},
        { label: "Name", key: "name"},
        { label: "Definition", key: "definition"},
      ],
      ndrTargets: targets.filter( target => target.specification.id === "NDR")
    };
  }


}
</script>

