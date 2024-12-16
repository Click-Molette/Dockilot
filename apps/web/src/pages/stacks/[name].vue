<template lang="pug">
q-card.flex.column.fit(flat style="position:absolute")
  q-toolbar.bg-primary.q-pa-none.text-white(style="height:48px")
    q-btn.icon(stretch icon='mdi-arrow-left' flat :to='`/stacks`')
    q-separator.q-mr-sm(vertical)
    q-toolbar-title.q-pa-none
      q-icon(left name='mdi-layers-outline' size='md')
      span(v-text='$route.params.name')
    q-space
    //q-btn.q-px-sm(:to='`/containers/${$route.params.name}/debug`' color='orange' icon='mdi-bug' flat stretch dense)
  q-card-section.col.q-pa-none
    nuxt-page(:stack='stack' ref='page')
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
