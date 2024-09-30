<template lang="pug">
q-card.flex.column(flat)
  q-toolbar.bg-primary.q-pa-none(style="height: 48px")
    q-btn.icon(:to='`/images`' icon='mdi-arrow-left' stretch flat)
    q-separator.q-mr-sm(vertical)
    q-toolbar-title.q-pa-none
      q-icon(name='mdi-image-text' size='md' left)
      span.text-white(v-text='image.RepoTags[0]')
    div.desktop-only
      q-btn.icon(icon='mdi-delete' flat round)
  q-card-section.col.q-pa-none
    nuxt-page(:image='image' ref='page')
</template>

<script lang="ts">
export default {
  name: 'ImagesInfoPage',
  async setup() {
    const $route = useRoute()

    const {
      data: image,
      error,
      refresh,
    } = await useHttp<any>('/docker/images/inspect', {
      method: 'get',
      query: computed(() => {
        return {
          ...$route.query,
        }
      }),
      transform: (result): any => {
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

    return {
      image,
    }
  },
}
</script>
