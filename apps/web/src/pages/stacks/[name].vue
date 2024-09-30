<template lang="pug">
q-card.flex.column(flat dark)
  q-toolbar.bg-primary.q-pa-none(style="height:48px")
    q-btn.icon(stretch icon='mdi-arrow-left' flat :to='`/stacks`')
    q-separator.q-mr-sm(vertical)
    q-toolbar-title.q-pa-none.cursor-pointer(@click='$router.push(`/stacks/${stack.name}`)')
      q-icon(left name='mdi-cube' :color='stateColor' size='md')
      span(v-text='stack.name')
  q-card-section.col.q-pa-none
    nuxt-page(:container='container' ref='page')
</template>

<script lang="ts" setup>
const $route = useRoute()
const $router = useRouter()
const $appConfig = useAppConfig()

const {
  data: stack,
  error,
  refresh,
} = await useHttp<any>(`/docker/stacks/` + $route.params.name, {
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
</script>
