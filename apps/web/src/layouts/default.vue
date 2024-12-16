<template lang="pug">
q-layout(view="hHh Lpr lff")
  q-custom-layout-default-header
  q-custom-layout-default-drawer
  q-page-container.q-mx-md
    nuxt-page
  q-custom-layout-default-footer
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const drawer = ref($q.screen.width > 700)

provide('drawer', drawer)
</script>
