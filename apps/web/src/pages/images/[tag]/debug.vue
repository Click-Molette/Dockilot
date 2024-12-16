<template lang="pug">
  .column.no-wrap.full-height
    keep-alive
      MonacoEditor.fit(
        :options='monacoOptions'
        language='ts'
        :model-value='JSON.stringify(image, null, 2)'
      )
</template>

<script lang="ts">
export default {
  name: 'ImagesTagDebugPage',
  props: {
    image: Object,
  },
  setup() {
    return {
      MonacoEditor: resolveComponent('MonacoEditor'),
    }
  },
  computed: {
    isDark(): boolean {
      return this.$q.dark.isActive
    },
    monacoOptions() {
      return {
        theme: this.isDark ? 'vs-dark' : 'vs-light',
        readOnly: true,
        minimap: {
          enabled: true,
        },
      }
    },
  },
}
</script>
