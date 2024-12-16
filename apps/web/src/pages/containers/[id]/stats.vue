<template lang="pug">
q-card-section.q-pa-none
  q-card-section
    q-custom-page-containers-stats
  q-custom-debug-expansion(:data='props.container')
</template>

<script lang="ts" setup>
const props = defineProps<{ container: any }>()
</script>
