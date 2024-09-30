<template lang="pug">
q-chip(
  @click='clipboardImageWithTag'
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
  methods: {
    async clipboardImageWithTag(): void {
      const { copy } = useClipboard()

      await copy(this.raw || this.text)

      this.$q.notify({
        message: 'Copied to clipboard',
        color: 'positive',
        icon: 'mdi-check',
      })
    },
  },
}
</script>
