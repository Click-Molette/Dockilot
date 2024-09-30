<template lang="pug">
q-card(flat)
  q-toolbar
    q-toolbar-title Labels
  q-card-section.q-pt-none
    q-markup-table(v-if='Object.keys(labels || {}).length' flat)
      thead
        tr
          th Name
          th Value
      tbody
        tr(v-for='(Label, key) in labels' :key='key')
          td(v-text='key')
          td(v-text='Label')
    div(v-else)
      small No labels found
</template>

<script lang="ts">
export default {
  name: 'CommonLabelsComponent',
  props: {
    labels: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
