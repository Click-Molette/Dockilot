<template lang="pug">
div.fit
  q-splitter.fit(
    v-model="splitterModel"
    :limits="splitterLimits"
  )
    template(#before)
      q-list(v-if='modeModel !== "edit"')
        q-expansion-item.bg-secondary.full-width.text-white(
          icon='mdi-server' label='Services'
          default-opened
        )
          q-list
            q-custom-page-stacks-service(
              v-for='(service, index) in stack.compose.services' :key='index'
              :name='index' :service='service'
            )
    template(#separator)
      q-avatar(v-if='!isSimple && modeModel !== "edit"' size="sm" color="primary" icon="mdi-unfold-more-vertical" class="text-white")
    template(#after)
      .column.fit.no-wrap
        q-bar.bg-secondary.q-pr-none.text-white(flat)
          q-toolbar-title
            q-icon(left name='mdi-code-braces' size='sm')
            span(v-text='stack.name')
          q-btn-toggle(
            v-if='!isSimple'
            v-model="modeModel"
            :options="[{ icon: 'mdi-eye', value: 'view' }, { icon: 'mdi-dishwasher-off', value: 'diff' }, { icon: 'mdi-pencil', value: 'edit' }]"
            toggle-color="orange"
            flat stretch dense
          )
        div(style="height: calc(100% - 32px);")
          keep-alive
            component(
              :is="modeComponent"
              :original="stack.raw"
              v-model="stackModel"
              lang="yaml"
              :options="monacoOptions"
              :style="{ width: '100%', height: '100%' }"
            )
</template>

<script lang="ts">
import { is } from 'quasar'
import { stringify, parseDocument } from 'yaml'

export default {
  name: 'StackNamePage',
  props: {
    stack: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      stackData: '',
    }
  },
  setup() {
    const $q = useQuasar()
    const $route = useRoute()
    const MonacoEditor = resolveComponent('MonacoEditor')
    const MonacoDiffEditor = resolveComponent('MonacoDiffEditor')

    const isSimple = computed(() => {
      if ($q.screen.gt.sm) return false
      return true
    })

    let splitterValue = 0
    const mode = $route.query['mode'] || 'view'
    if (mode !== 'edit' && isSimple.value) {
      splitterValue = 100
    } else if (mode === 'edit') {
      splitterValue = 0
    } else {
      splitterValue = 60
    }

    const splitterModel = ref(splitterValue)

    return {
      isSimple,
      splitterModel,
      MonacoEditor,
      MonacoDiffEditor,
    }
  },
  watch: {
    isSimple(v) {
      if (this.modeModel === 'edit') {
        this.splitterModel = v ? 0 : 40
        this.splitterLimits = v ? [0, 0] : [40, 70]
      } else {
        this.splitterModel = v ? 100 : 40
        this.splitterLimits = v ? [0, 100] : [40, 70]
      }
    },
  },
  computed: {
    isDark() {
      return this.$q.dark.isActive
    },
    monacoOptions() {
      return {
        theme: this.isDark ? 'vs-dark' : 'vs-light',
        readOnly: this.modeModel !== 'edit',
        minimap: {
          enabled: false,
        },
      }
    },
    splitterLimits() {
      if (this.isSimple) return [0, 100]
      if (this.modeModel === 'edit') return [0, 0]

      return [40, 70]
    },
    modeComponent() {
      return this.modeModel === 'diff' ? this.MonacoDiffEditor : this.MonacoEditor
    },
    modeModel: {
      get() {
        return this.$route.query['mode'] || 'view'
      },
      set(mode) {
        const old = this.$route.query['mode'] || 'view'

        if (mode === 'edit' || old === 'edit') {
          this.$q
            .dialog({
              title: 'Change Mode',
              message: `Are you sure you want to switch to ${mode} mode? You will lose any unsaved changes.`,
              ok: true,
              cancel: true,
            })
            .onOk(() => {
              this.$router.push({
                query: {
                  ...this.$route.query,
                  mode,
                },
              })
            })
        } else {
          this.$router.push({
            query: {
              ...this.$route.query,
              mode,
            },
          })
        }
      },
    },
    stackModel: {
      get() {
        // if (this.stackData) {
        //   return this.stackData
        // }

        return stringify(this.stack.compose, {
          indent: 2,
        })
      },
      set(value) {
        try {
          const parsed = parseDocument(value, {
            prettyErrors: true,
            strict: false,
          })
          replaceNullWithUndefined(parsed)
          this.stack.compose = parsed.toJSON()
          // this.stackData = parsed.toJSON()
        } catch (e) {
          console.error(e)
        }
      },
    },
  },
}

function replaceNullWithUndefined(obj) {
  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = undefined
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceNullWithUndefined(obj[key])
    }
  }
}
</script>
