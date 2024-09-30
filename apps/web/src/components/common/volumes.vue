<template lang="pug">
q-card(flat)
  q-toolbar
    q-toolbar-title Volumes
  q-card-section.q-pt-none
    q-markup-table(v-if='Object.keys(volumes || {}).length' flat)
      thead
        tr
          th Name
          th Value
      tbody
        tr(v-for='(Volume, key) in volumes' :key='key')
          td(v-text='key')
          td(v-text='Volume')
    div(v-else)
      small No volumes found
</template>

<script lang="ts">
export default {
  name: 'CommonVolumesComponent',
  props: {
    volumes: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
