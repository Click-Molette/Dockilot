<template lang="pug">
q-select.q-custom-no-readonly-style(
  v-model="service.environment"
  label="Environment" input-debounce="0"
  use-input multiple hide-dropdown-icon dense filled clearable readonly
)
  template(#append)
    q-icon.cursor-pointer(@click="create" name="mdi-plus")
  template(#selected)
    q-chip(
      v-for="(value, key) in service.environment"
      @click="update(value)"
      @remove="service.environment.splice(key, 1)"
      :key="key" :label="value"
      removable dense clickable
    )
</template>

<script lang="ts">
import Selector from './dialog-selector.vue'

export default {
  name: 'PageStacksServiceSelectEnvironmentComponent',
  props: {
    service: {
      type: Object,
      required: true,
    },
  },
  methods: {
    create() {
      this.$q
        .dialog({
          component: Selector,
          componentProps: {
            title: 'Create Environment Variable',
            keyLabel: 'Key',
            valueLabel: 'Value',
          },
        })
        .onOk(({ key, value }: { key: string; value: string }) => {
          if (!Array.isArray(this.service.environment)) {
            this.service.environment = []
          }
          this.service.environment.push(`${key}=${value}`)
        })
    },
    update(line: string) {
      const [key, value] = line.split('=')

      this.$q
        .dialog({
          component: Selector,
          componentProps: {
            title: 'Update Environment Variable',
            keyLabel: 'Key',
            valueLabel: 'Value',
            defaultForm: {
              key: key,
              value: value,
            },
          },
        })
        .onOk(({ key, value }: { key: string; value: string }) => {
          if (!Array.isArray(this.service.environment)) {
            this.service.environment = []
          }
          this.service.environment.push(`${key}=${value}`)
        })
    },
  },
}
</script>
