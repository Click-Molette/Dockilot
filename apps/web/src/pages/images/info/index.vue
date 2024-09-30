<template lang="pug">
section
  q-card(flat)
    q-card-section.q-pa-xs
      q-chip(
        v-for='(RepoTag, key) in imageTags' :key='key'
        @click='clipboardImageWithTag(RepoTag)'
        color='grey'
        clickable dense
      )
        q-icon.q-mr-xs(name='mdi-image')
        span(v-text='RepoTag')

  q-card(flat)
    q-toolbar
      q-toolbar-title Informations
    q-card-section.q-pt-none
      q-markup-table(flat)
        thead
          tr
            th Image OS
            th Image Architecture
            th Image size
        tbody
          tr
            td(v-text='image.Os')
            td(v-text='image.Architecture')
            td(v-text='Size')

  q-custom-common-volumes(:volumes='image?.Config?.Volumes')
  q-custom-common-labels(:labels='image?.Config?.Labels')
  q-custom-common-environments(:environments='image?.Config?.Env')
</template>

<script lang="ts">
import { useClipboard } from '@vueuse/core'

export default {
  name: 'ImagesInfoIndexPage',
  props: {
    image: Object,
  },
  methods: {
    async clipboardImageWithTag(source: string) {
      const { copy } = useClipboard()

      await copy(source)

      this.$q.notify({
        message: 'Copied to clipboard',
        color: 'positive',
        icon: 'mdi-check',
      })
    },
  },
  computed: {
    Size(): string {
      const size = this.image?.Size || 0

      if (size < 1024) return `${size} B`
      if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

      return `${Math.round(size / 1024 / 1024)} MB`
    },
    imageTags(): string[] {
      return this.image?.RepoTags || []
    },
  },
}
</script>
