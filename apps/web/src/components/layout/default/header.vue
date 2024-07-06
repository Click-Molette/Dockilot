<template lang="pug">
q-header.q-pa-md.bg-white(:style="{background: $q.dark.isActive ? 'var(--q-dark-page) !important' : '', border: $q.dark.isActive ? '1px solid var(--q-dark-page) !important' : ''}")
  .row
    q-card.bg-primary.q-mr-md(v-if="$q.screen.width <= 700 && !drawer" flat)
      q-toolbar.q-px-none
        q-btn.rounded-borders(icon="mdi-docker" color="white" flat stretch)
    .col
      q-card.bg-primary(flat)
        .row.no-wrap
          q-toolbar
            q-toolbar-title(v-if="$q.screen.width > 700") Dockilot
            q-btn(v-else icon="mdi-menu" color="white" @click="drawer = !drawer" flat dense)
            q-space
          q-toolbar
            //- q-input.block.full-width(
            //-   v-model="search"
            //-   placeholder="Rechercher un personnage, un item, ..." color="white"
            //-   dense filled
            //- )
          q-toolbar.q-gutter-sm
            q-space
            q-btn(icon="mdi-theme-light-dark" @click="$q.dark.toggle()" flat dense)
            q-btn(icon="mdi-account" flat dense)
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const drawer = inject('drawer')
</script>
