<template lang="pug">
q-expansion-item.bg-accent.full-width.text-white(
  icon='mdi-cube' :label='serviceName'
  dense default-opened
)
  q-card.overflow-auto
    q-card-section.q-pa-sm
      .row.q-col-gutter-sm.q-mb-sm
        .col-12.col-sm-8
          q-input(
            v-model="service.container_name"
            label="Container Name" debounce="300"
            dense filled clearable
          )
        .col-12.col-sm-4
          q-select(
            v-model="service.restart"
            :options="['no', 'always', 'unless-stopped', 'on-failure']"
            label="Restart Policy" debounce="300"
            dense filled clearable
          )
      .row.q-col-gutter-sm.q-mb-sm
        .col-12
          q-custom-page-stacks-service-select-environment(
            :service="service"
          )
</template>

<script lang="ts">
export default {
  name: 'PageStacksServiceComponent',
  props: {
    name: {
      type: String,
      required: true,
    },
    service: {
      type: Object,
      required: true,
    },
  },
  computed: {
    serviceName(): string {
      let name = this.name

      if (this.service.container_name) {
        name += ` (${this.service.container_name})`
      }

      return name
    },
  },
}
</script>
