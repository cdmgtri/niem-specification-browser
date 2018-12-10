
<template>
  <div class="container">
    <h2>Search rules and definitions from NIEM specifications.</h2>

    <p>The following specifications are currently supported:</p>

    <hr>

    <h3>NIEM Naming and Design Rules (NDR) Specification</h3>

    <p>Describes the architecture of the NIEM data model and its representation in XML. It specifies principles and enforceable rules for NIEM data components and schemas.</p>

    <ul>
      <li><a target="_blank" href="https://reference.niem.gov/niem/specification/naming-and-design-rules/3.0/niem-ndr-3.0.html">NDR 3.0</a></li>
      <li><a target="_blank" href="https://reference.niem.gov/niem/specification/naming-and-design-rules/4.0/niem-ndr-4.0.html">NDR 4.0</a></li>
    </ul>


    <h3>NIEM Model Package Description (MPD) Specification</h3>

    <p>Specifies normative rules and non-normative guidance for building NIEM information exchange messages. It defines IEPD artifacts like subset schemas, extension schemas, and MPD catalogs; and recommends how the package should be structured.</p>

    <ul>
      <li><a target="_blank" href="https://reference.niem.gov/niem/specification/model-package-description/3.0.1/model-package-description-3.0.1.html">MPD 3.0.1</a></li>
    </ul>

    <h3>NIEM Code Lists Specification</h3>

    <p>Enables enhanced functionality of code lists in NIEM beyond the basic enumerations and JSON schema provide. Key new features include the definition of codes in CSV files, dynamic code lists via run-time binding, and multi-column code table support.</p>

    <ul>
      <li><a target="_blank" href="https://reference.niem.gov/niem/specification/code-lists/4.0/niem-code-lists-4.0.html">Code Lists 4.0</a></li>
    </ul>
  </div>
</template>

<script>

export default {
  name: "Home"

}
</script>
