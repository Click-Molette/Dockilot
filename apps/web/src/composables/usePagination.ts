interface Pagination {
  sortBy?: string | null
  descending?: boolean
  page?: number
  rowsPerPage?: number
  rowsNumber?: number
}

export function usePagination() {
  const $route = useRoute()
  const $router = useRouter()

  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 14

  const pagination = ref({
    rowsNumber: 0,
    page: DEFAULT_PAGE,
    rowsPerPage: DEFAULT_LIMIT,
    sortBy: 'id',
    descending: true,
  })

  const initializePagination = async (total: number = 0) => {
    if (!pagination.value) return

    pagination.value.rowsNumber = total
    pagination.value.page = parseInt($route.query.page as string) || DEFAULT_PAGE
    pagination.value.rowsPerPage = parseInt($route.query.limit as string) || DEFAULT_LIMIT

    await paginationQuery()
  }

  const onRequest = async (props: { pagination: Pagination, filter: any, getCellValue: any }, total: number) => {
    if (!pagination.value) return

    const { page, rowsPerPage } = props.pagination

    pagination.value.rowsNumber = total
    pagination.value.page = page || DEFAULT_PAGE
    pagination.value.rowsPerPage = rowsPerPage || DEFAULT_LIMIT



    await paginationQuery()
  }

  const paginationQuery = async () => {
    $router.replace({
      query: {
        ...$route.query,
        page: pagination.value.page,
        limit: pagination.value.rowsPerPage,
      },
    })
  }

  const getDefaults = () => {
    return {
      page: parseInt($route.query.page as string) || DEFAULT_PAGE,
      limit: parseInt($route.query.limit as string) || DEFAULT_LIMIT,
    }
  }

  return {
    pagination,

    initializePagination,
    onRequest,
    paginationQuery,
    getDefaults,
  }
}
