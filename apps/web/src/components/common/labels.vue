<template lang="pug">
q-card(flat)
  q-toolbar
    q-toolbar-title
      | Labels &nbsp;
      q-badge(color='blue' align='middle' v-text='Object.keys(filteredLabels).length')
    q-input(v-model='search' label='Search' :debounce='300' clearable borderless dense)
  q-card-section.q-pt-none.q-gutter-xs
    q-chip.q-px-none.overflow-hidden(
      v-for='(label, key) in filteredLabels' :key='key'
      :ripple='false' square dense
    )
      q-chip.q-ma-none.q-custom-chip-left.cursor-cell(
        @click='clipboardCopy(key)'
        :style='{ backgroundColor: randomBlue() }'
        text-color='white'
        square dense clickable
      )
        q-icon.q-mr-xs(name='mdi-tag')
        span(v-text='key')
      q-chip.q-ma-none.q-custom-chip-right.cursor-cell(
        @click='clipboardCopy(label)'
        text-color='white' color='grey-7'
        square dense clickable
      )
        span &quot;{{ label }}&quot;
        q-tooltip.text-body2(:delay="500" v-text='label')
    small(v-if='Object.keys(filteredLabels).length === 0') No labels found
</template>

<script lang="ts">
export default {
  name: 'CommonLabelsComponent',
  props: {
    labels: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      search: null,
    }
  },
  setup() {
    const $q = useQuasar()
    const { clipboardCopy } = useClipboardManager($q)

    return {
      clipboardCopy,
    }
  },
  computed: {
    filteredLabels() {
      return Object.fromEntries(
        Object.entries(this.labels || []).filter(([key, value]) => {
          const search = `${this.search || ''}`.trim().toLocaleLowerCase()

          return key.toLowerCase().includes(search) || value.toLowerCase().includes(search)
        }),
      )
    },
  },
  methods: {
    randomBlue() {
      const r = Math.floor(Math.random() * 30)
      const g = Math.floor(Math.random() * 100)
      const b = Math.floor(150 + Math.random() * 106)

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    },
  },
}
</script>
