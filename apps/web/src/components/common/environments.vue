<template lang="pug">
q-card(flat)
  q-toolbar
    q-toolbar-title Environments
  q-card-section.q-pt-none
    q-markup-table(v-if='Envs.length' flat)
      thead
        tr
          th Name
          th Value
      tbody
        tr(v-for='(Env, key) in Envs' :key='key')
          td(v-text='Env.key')
          td(v-text='Env.value')
    div(v-else)
      small No environments found
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
  computed: {
    Envs(): { key: string; value: string }[] {
      return (
        this.environments.map((env: string) => {
          const [key, value] = env.split('=')
          return { key, value }
        }) || []
      )
    },
  },
}
</script>
