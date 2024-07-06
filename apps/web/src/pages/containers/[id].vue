<template lang="pug">
div
  q-card(flat)
    q-toolbar.bg-primary.q-pa-none(style="height:48px")
      q-btn.icon(stretch icon='mdi-arrow-left' flat :to='`/containers`')
      q-separator.q-mr-sm(vertical)
      q-toolbar-title.q-pa-none
        q-icon(left name='mdi-cube' :color='stateColor' size='md')
        span(v-text='container.Name')
      q-space
      q-btn.icon(flat :to='`/containers/${container.Id}/console`' icon='mdi-console' round)
      q-btn.icon(flat :to='`/containers/${container.Id}/logs`' icon='mdi-file-document' round)
      q-btn.icon(flat :to='`/containers/${container.Id}/stats`' icon='mdi-chart-areaspline' round)
      q-separator.q-ml-sm(vertical)
      q-btn.icon(flat @click="action" :icon='stateIcon' stretch)

    nuxt-page

    q-expansion-item.bg-blue-grey-10(v-if='debug' label='Debug' icon='mdi-bug' dark dense)
      q-card.overflow-auto.bg-blue-grey-8.text-white(:style='{maxHeight: "250px", height: "250px"}')
        q-card-section.q-pa-xs
          pre.q-ma-none(v-html='JSON.stringify(container, null, 2)')
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const $route = useRoute()
const { debug } = useDebug()
const container = ref<any>({})

const { data } = await useHttp<any>(`/docker/containers/` + $route.params.id)
container.value = data.value.data

const stateColor = computed(() => {
  switch (container.value.State.Status) {
    case 'running':
      return 'green'

    case 'exited':
      return 'red'

    default:
      return 'grey'
  }
})

const stateIcon = computed(() => {
  switch (container.value.State.Status) {
    case 'running':
      return 'mdi-stop'
    case 'exited':
      return 'mdi-play'
    default:
      return 'mdi-pause'
  }
})

async function action() {
  const action = container.value.State.Status === 'running' ? 'stop' : 'start'

  await useHttp<any>(`/docker/containers/${container.value.Id}/${action}`, { method: 'POST' })
}
</script>
