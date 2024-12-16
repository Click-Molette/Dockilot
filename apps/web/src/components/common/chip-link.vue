<template lang="pug">
q-chip(
  @click='clipboardCopy(raw || text)'
  color='grey'
  clickable dense
)
  q-icon.q-mr-xs(name='mdi-image')
  span(v-text='text')
</template>

<script lang="ts">
export default {
  name: 'CommonChipLinkComponent',
  props: {
    text: {
      type: String,
      default: '',
    },
    raw: {
      type: String,
      default: '',
    },
  },
  setup() {
    const $q = useQuasar()
    const { clipboardCopy } = useClipboardManager($q)

    return {
      clipboardCopy,
    }
  },
}
</script>
