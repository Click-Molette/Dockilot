<template lang="pug">
q-expansion-item.bg-blue-grey-10.full-width(v-if='debug' label='Debug' icon='mdi-bug' dark dense)
  q-card.overflow-auto.bg-blue-grey-8.text-white(:style='{minHeight: "250px", height: "250px"}')
    q-card-section.q-pa-xs
      pre.q-ma-none(v-html='JSON.stringify(data, null, 2)')
</template>

<script lang="ts">
export default {
  name: 'DebugComponent',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { debug } = useDebug()

    return {
      debug,
    }
  },
}
</script>
