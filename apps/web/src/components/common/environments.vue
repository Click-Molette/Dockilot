<template lang="pug">
q-card(flat)
  q-toolbar
    q-toolbar-title
      | Environments &nbsp;
      q-badge(color='green' align='middle' v-text='Object.keys(filteredEnvs).length')
    q-input(v-model='search' label='Search' :debounce='300' clearable borderless dense)
  q-card-section.q-pt-none.q-gutter-xs
    q-chip.q-px-none.overflow-hidden(
      v-for='(env, key) in filteredEnvs' :key='key'
      :ripple='false' square dense
    )
      q-chip.q-ma-none.q-custom-chip-left.cursor-cell(
        @click='clipboardCopy(env.key)'
        :style='{ backgroundColor: randomGreen() }'
        text-color='white'
        square dense clickable
      )
        q-icon.q-mr-xs(name='mdi-sprout')
        span(v-text='env.key')
      q-chip.q-ma-none.q-custom-chip-right.cursor-cell(
        @click='clipboardCopy(env.value)'
        text-color='white' color='grey-7'
        square dense clickable
      )
        span &quot;{{ env.value }}&quot;
        q-tooltip.text-body2(:delay="500" v-text='env.value')
    small(v-if='Object.keys(filteredEnvs).length === 0') No environments found
</template>

<script lang="ts">
export default {
  name: 'CommonEnvironmentsComponent',
  props: {
    environments: {
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
    filteredEnvs(): { key: string; value: string }[] {
      return (this.environments || [])
        .map((env: string) => {
          const [key, value] = env.split('=')

          return { key, value }
        })
        .filter(({ key, value }) => {
          const search = `${this.search || ''}`.trim().toLocaleLowerCase()

          return key.toLowerCase().includes(search) || value.toLowerCase().includes(search)
        })
    },
  },
  methods: {
    randomGreen() {
      const r = Math.floor(Math.random() * 50)
      const g = Math.floor(75 + Math.random() * 106)
      const b = Math.floor(Math.random() * 25)

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    },
  },
}
</script>
