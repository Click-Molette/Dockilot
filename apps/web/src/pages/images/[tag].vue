<template lang="pug">
q-card.flex.column.fit.absolute(flat)
  component.bg-primary.q-pa-none.text-white(:is='isSmall ? "q-bar" : "q-toolbar"')
    q-btn.icon(:to='`/images`' icon='mdi-arrow-left' stretch flat)
    q-separator.q-mr-sm(vertical)
    q-toolbar-title.q-pa-none
      q-icon(name='mdi-image-text' size='md' left)
      span.text-white(v-text='getImageFirstName(image)')
    q-tabs(:model-value='tab')
      q-tab.q-px-none(@click='$router.replace(toPathWithQueries(`/images/${image.Id}`))' name="index" icon="mdi-information")
        q-tooltip.text-body2(:delay="200") Information
      q-tab.q-px-none(@click='$router.replace(toPathWithQueries(`/images/${image.Id}/debug`))' name="debug" content-class="text-orange" icon="mdi-bug")
        q-tooltip.text-body2(:delay="200" class='bg-orange-8') Debug
  q-card-section.col.q-pa-none.overflow-auto
    nuxt-page(:image='image' ref='page')
</template>

<script lang="ts">
import { QBar, QToolbar } from 'quasar'

export default {
  name: 'ImagesTagPage',
  props: {
    getImageFirstName: {
      type: Function,
      default: () => '',
    },
  },
  components: {
    QToolbar,
    QBar,
  },
  async setup() {
    const $route = useRoute()
    const { toPathWithQueries } = useRouteQueries()

    const {
      data: image,
      error,
      refresh,
    } = await useHttp<any>('/docker/images/inspect/' + $route.params.tag, {
      method: 'get',
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
      toPathWithQueries,
    }
  },
  computed: {
    tab(): string {
      return this.$route.path.split('/')[3] || 'index'
    },
    isSmall(): boolean {
      return this.$q.screen.lt.md
    },
  },
}
</script>
