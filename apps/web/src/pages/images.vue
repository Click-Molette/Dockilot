<template lang="pug">
q-page.flex.column
  q-custom-twopan.col(
    :simple='false'
    :loading='pending'
    :rows='images.data'
    :total='images.total'
    :columns='columns'
    :targetId='targetId'
    :rowClassHandler='rowClassHandler'
    row-key='RepoTags'
  )
    template(#top-table)
      q-card-section.q-pa-none
        q-input(v-model='filters' label='Search' fill dense)
    template(v-slot:row-actions='{ row }')
      q-btn(
        v-if='getImageFirstName(row) !== null'
        :to='toPathWithQueries(`/images/info`, row)'
        color='primary' icon='mdi-eye' size='md'
        flat round dense
      )
    template(#after-content)
      nuxt-page(ref='page')
</template>

<script lang="ts">
import Page from './images/info.vue'
import type { QTableProps } from 'quasar'
import type { LocationQueryValue } from 'vue-router'

export default {
  name: 'ImagesPage',
  data() {
    return {
      columns: [
        {
          name: 'RepoTags',
          required: true,
          align: 'left',
          label: 'RepoTags',
          field: (row) => row,
          format: (val) => `${this.getImageFirstName(val)}`,
          sortable: true,
        },
      ] as QTableProps['columns'],
    }
  },
  async setup() {
    const page = ref<typeof Page | null>(null)
    const $route = useRoute()
    const { getDefaults } = usePagination()

    const getImageFirstName = (row: any): string | null => {
      if (row.RepoTags.length > 0) {
        return row.RepoTags[0]
      }

      if (row.RepoDigests.length > 0) {
        const RepoDigest = row.RepoDigests[0]
        return RepoDigest.split('@')[0]
      }

      return null
    }

    const queryHandler = (url: URL, row: any) => {
      const imageTag = getImageFirstName(row)
      url.searchParams.set('imageTag', imageTag)
    }

    const { toPathWithQueries } = useRouteQueries({ queryHandler })

    const computedQuery = computed(() => {
      return {
        ...getDefaults(),
        ...$route.query,
      }
    })
    const queryDebounced = refDebounced(computedQuery, 700)

    const {
      data: images,
      error,
      pending,
      refresh,
    } = await useHttp('/docker/images/list', {
      method: 'get',
      query: queryDebounced,
    })
    if (error.value) {
      console.error(error.value)
      throw showError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    return {
      page,
      images,
      pending,
      toPathWithQueries,
      getImageFirstName,
    }
  },
  methods: {
    rowClassHandler({ row, targetId, rowClassHighlight }) {
      if (this.getImageFirstName(row) === targetId) {
        return rowClassHighlight
      }

      return ''
    },
  },
  computed: {
    targetId(): LocationQueryValue[] | string {
      return this.$route.query['imageTag'] || ''
    },
    filters: {
      get(): LocationQueryValue[] | string {
        const v = this.$route.query['filters[reference]'] || ''
        return v.replace(/^\*|\*$/g, '')
      },
      set(v: string): void {
        this.$router.replace({
          query: {
            ...this.$route.query,
            'filters[reference]': v ? `*${v}*` : undefined,
          },
        })
      },
    },
  },
}
</script>
