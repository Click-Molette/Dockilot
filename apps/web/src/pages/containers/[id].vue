<template lang="pug">
q-card.flex.column(flat dark)
  q-toolbar.bg-primary.q-pa-none(style="height:48px")
    q-btn.icon(stretch icon='mdi-arrow-left' flat :to='`/containers`')
    q-separator.q-mr-sm(vertical)
    q-toolbar-title.q-pa-none.cursor-pointer(@click='$router.push(`/containers/${container.Id}`)')
      q-icon(left name='mdi-cube' :color='stateColor' size='md')
      span(v-text='container.Name')
    div
      q-btn.icon(flat :to='`/containers/${container.Id}/console`' icon='mdi-console' round)
      q-btn.icon(flat :to='`/containers/${container.Id}/logs`' icon='mdi-file-document' round)
      q-btn.icon(flat :to='`/containers/${container.Id}/stats`' icon='mdi-chart-areaspline' round)
    q-separator.q-ml-sm(vertical)
    //- q-btn.icon(flat @click="action" :icon='stateIcon' stretch)
    q-btn-dropdown(
      @click="action" :icon='stateIcon' :loading='pendingState'
      split flat stretch
    )
      q-list
        q-item(:disabled='container.State.Status === "exited"' clickable :to='`/containers/${container.Id}/stop`')
          q-item-section
            q-item-label Stop
          q-item-section
            q-icon(name='mdi-stop')
        q-item(:disabled='container.State.Status === "exited"' clickable :to='`/containers/${container.Id}/kill`')
          q-item-section
            q-item-label Kill
          q-item-section
            q-icon(name='mdi-close')
        q-item(:disabled='container.State.Status === "running"' :to='`/containers/${container.Id}/start`')
          q-item-section
            q-item-label Start
          q-item-section
            q-icon(name='mdi-play')
        q-item(clickable :to='`/containers/${container.Id}/restart`')
          q-item-section
            q-item-label Restart
          q-item-section
            q-icon(name='mdi-restart')
        q-item(clickable :to='`/containers/${container.Id}/pause`')
          q-item-section
            q-item-label Pause
          q-item-section
            q-icon(name='mdi-pause')
        q-item(clickable :to='`/containers/${container.Id}/unpause`')
          q-item-section
            q-item-label Unpause
          q-item-section
            q-icon(name='mdi-play')
        q-item(clickable :to='`/containers/${container.Id}/delete`')
          q-item-section
            q-item-label Pull Image
          q-item-section
            q-icon(name='mdi-download')
        q-item(clickable :to='`/containers/${container.Id}/delete`')
          q-item-section
            q-item-label Delete
          q-item-section
            q-icon(name='mdi-delete')
  q-card-section.col.q-pa-none
    nuxt-page(:container='container' ref='page')
</template>

<script lang="ts" setup>
const $route = useRoute()
const $router = useRouter()
const $appConfig = useAppConfig()

const {
  data: container,
  error,
  refresh,
} = await useHttp<any>(`/docker/containers/` + $route.params.id, {
  method: 'get',
  transform: (result) => {
    return result?.data
  },
})
if (error.value) {
  console.error(error.value)
  throw showError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

// const { data: eventSourceData, close } = useEventSource(`${$appConfig.api.url}/docker/containers/global-state`, [], {
//   autoReconnect: true,
// })

// const updateContainer = async (container: any) => {
//   console.log('container', container)
//   //TODO: fix this
//   switch (container.Action) {
//     case 'start':
//     case 'stop':
//       refresh()
//       break
//   }
// }

// watch(eventSourceData, (data) => {
//   const container = JSON.parse(data as string)
//   updateContainer(container)
// })

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

const pendingState = ref(false)

async function action() {
  const action = container.value.State.Status === 'running' ? 'stop' : 'start'

  pendingState.value = true
  await useHttp<any>(`/docker/containers/${container.value.Id}/${action}`, { method: 'POST' })
  pendingState.value = false
  // refresh()
}

function refreshAction() {
  console.log('refreshAction')
  // refresh()
}

defineExpose({
  refreshAction,
  // refresh,
})
</script>
