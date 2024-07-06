<template lang="pug">
q-page
  .row.q-col-gutter-md
    .col-3
      q-card(flat)
        q-list
          q-item(v-for="container in containers" clickable :to="`/containers/${container.Id}`")
            q-item-section(avatar)
              q-icon(name="mdi-cube" :color="state(container)")
            q-item-section
              div.text-body2(v-text="container.Names[0]")
    .col
      nuxt-page
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const containers = ref<any[]>([])

const { data } = await useHttp<any>('/docker/containers')
containers.value = data.value.data

function state(container: any) {
  switch (container.State) {
    case 'running':
      return 'green'
    case 'exited':
      return 'red'
    default:
      return 'grey'
  }
}
</script>
