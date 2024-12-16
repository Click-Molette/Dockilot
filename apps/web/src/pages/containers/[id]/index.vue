<template lang="pug">
  q-custom-common-volumes(:volumes='props.container?.Config?.Volumes')
  q-custom-common-labels(:labels='props.container.Config.Labels')
  q-custom-common-environments(:environments='props.container.Config.Env')
  q-expansion-item.bg-blue-grey-10.full-width(v-if='debug' label='Debug' icon='mdi-bug' dark dense)
    q-card.overflow-auto.bg-blue-grey-8.text-white(:style='{maxHeight: "250px", height: "250px"}')
      q-card-section.q-pa-xs
        pre.q-ma-none(v-html='JSON.stringify(props.container, null, 2)')
</template>

<script lang="ts" setup>
const { debug } = useDebug()
const props = defineProps<{ container: any }>()
</script>
