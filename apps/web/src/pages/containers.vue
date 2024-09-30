<template lang="pug">
q-page.flex.column
  q-custom-twopan.col(
    :simple='false'
    :loading='pending'
    :rows='containers.data'
    :total='containers.total'
    :columns='columns'
    :targetId='targetId'
    row-key='Id'
  )
    template(#top-table)
      q-card-section.q-pa-none
        q-input(v-model='filters' label='Search' fill dense)
    template(v-slot:body-cell-state='props')
      q-td(:props='props')
        q-icon(name='mdi-cube' size='sm' :color='getContainerStateColor(props.row)')
    template(v-slot:row-actions='{ row }')
      q-btn(:to='toPathWithQueries(`/containers/${row.Id}`)' color='primary' icon='mdi-eye' size='md' flat round dense)
      q-btn(:to='toPathWithQueries(`/containers/${row.Id}/console`)' color='gray' icon='mdi-console' size='md' flat round dense)
      q-btn(:to='toPathWithQueries(`/containers/${row.Id}/logs`)' color='gray' icon='mdi-file-outline' size='md' flat round dense)
      q-btn(:to='toPathWithQueries(`/containers/${row.Id}/stats`)' color='gray' icon='mdi-chart-areaspline' size='md' flat round dense)
    template(#after-content)
      nuxt-page(ref='page')
</template>

<script lang="ts">
import type { QTableProps } from 'quasar'
import Page from './containers/[id].vue'
import type { LocationQueryValue } from 'vue-router'

export default {
  name: 'ContainersPage',
  data() {
    return {
      columns: [
        {
          name: 'state',
          required: true,
          align: 'center',
          label: 'State',
          field: 'state',
          sortable: true,
        },
        {
          name: 'Names',
          required: true,
          align: 'left',
          label: 'Container',
          field: (row) => row.Names,
          format: (val) => `${val[0]}`,
          sortable: true,
        },
        {
          name: 'Image',
          required: true,
          align: 'left',
          label: 'Image',
          field: 'Image',
          sortable: true,
        },
      ] as QTableProps['columns'],
    }
  },
  async setup() {
    const page = ref<typeof Page | null>(null)
    const $route = useRoute()
    const $appConfig = useAppConfig()
    const { getDefaults } = usePagination()
    const { toPathWithQueries } = useRouteQueries()

    const computedQuery = computed(() => {
      return {
        ...getDefaults(),
        ...$route.query,
      }
    })
    const queryDebounced = refDebounced(computedQuery, 700)

    const {
      data: containers,
      error,
      pending,
      refresh,
    } = await useHttp('/docker/containers', {
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

    // const { data: eventSourceContainers, close } = useEventSource(`${$appConfig?.api?.url}/docker/containers/global-state`, [], {
    //   autoReconnect: true,
    // })

    // watch(eventSourceContainers, (data) => {
    //   try {
    //     const container = JSON.parse(data as string)

    //     switch (container.Action) {
    //       case 'start':
    //       case 'stop':
    //         refresh()
    //         page.value?.refreshAction()
    //         break
    //     }
    //   } catch (e) {
    //     console.error(e)
    //   }
    // })

    return {
      page,
      containers,
      pending,
      toPathWithQueries,
    }
  },
  computed: {
    targetId(): LocationQueryValue[] | string {
      return this.$route.params.id || ''
    },
    filters: {
      get(): LocationQueryValue[] | string {
        return this.$route.query['filters[name]'] || ''
      },
      set(v: string): void {
        this.$router.replace({
          query: {
            ...this.$route.query,
            'filters[name]': v ? `${v}` : undefined,
          },
        })
      },
    },
  },
  methods: {
    getContainerStateColor(row) {
      switch (row.State) {
        case 'running':
          return 'positive'

        case 'exited':
          return 'negative'

        case 'paused':
          return 'warning'

        default:
          return 'grey'
      }
    },
  },
}
</script>
