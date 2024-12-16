<template lang="pug">
q-page.grid
  q-custom-twopan.col(
    :simple='false'
    :loading='pending'
    :rows='images?.data || []'
    :total='images?.total || 0'
    :columns='columns'
    :refresh='refresh'
    :targetId='targetId'
    row-key='Id'
  )
    template(#before-top)
      q-input.col(v-model='filters' label='Search' dense outlined clearable autofocus)
    template(v-slot:body-cell-RepoTags='props')
      q-td.ellipsis(:props='props' style='max-width: 50px')
        span(v-text='getImageFirstName(props.row)')
        q-tooltip.text-body2(:delay="500" v-text='getImageFirstName(props.row)')
    template(v-slot:row-actions='{ row }')
      q-btn(
        :to='toPathWithQueries(`/images/${row.Id}`)'
        color='primary' icon='mdi-eye' size='sm'
        flat round dense
      )
      q-btn(color='gray' icon='mdi-delete' size='sm' flat round dense)
    template(#after-content)
      nuxt-page(ref='page' :getImageFirstName='getImageFirstName')
</template>

<script lang="ts">
import Page from './images/[tag].vue'
import type { QTableProps } from 'quasar'
import type { LocationQueryValue } from 'vue-router'

export default {
  name: 'ImagesPage',
  data() {
    return {
      selected: '',
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
        {
          name: 'Size',
          required: true,
          align: 'left',
          label: 'Size',
          field: (row) => row.Size,
          format: (val) => `${this.bytesToSize(val)}`,
          sortable: true,
        },
      ] as QTableProps['columns'],
    }
  },
  async setup() {
    const page = ref<typeof Page | null>(null)
    const $route = useRoute()
    const { getDefaults } = usePagination()
    const { bytesToSize } = useFormatters()

    const { toPathWithQueries } = useRouteQueries()

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
    } = await useLazyHttp('/docker/images/list', {
      method: 'get',
      query: queryDebounced,
      immediate: false,
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
      refresh,
      toPathWithQueries,
      bytesToSize,
    }
  },
  methods: {
    getImageFirstName(row: any): string | null {
      if (row.RepoTags.length > 0) {
        return row.RepoTags[0]
      }

      if (row.RepoDigests.length > 0) {
        const RepoDigest = row.RepoDigests[0]

        return RepoDigest
      }

      return row.Id
    },
  },
  computed: {
    targetId(): LocationQueryValue[] | string {
      return this.$route.params.tag || ''
    },
    filters: {
      get(): LocationQueryValue[] | string {
        const v = this.$route.query['filters[reference]'] || ''

        return `${v}`.replace(/^\*|\*$/g, '')
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
