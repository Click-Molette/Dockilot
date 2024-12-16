import { isEqual } from "radash"
import type { LocationQueryRaw } from "vue-router"

interface Pagination {
  sortBy?: string | null
  descending?: boolean
  page?: number
  rowsPerPage?: number
  rowsNumber?: number
}

export function usePagination(options?: { name?: string }) {
  options = {
    name: 'global',
    ...options,
  }

  const DEFAULT_PAGE = 1
  const DEFAULT_ROW_PIXEL_HEIGHT = 42

  const $route = useRoute()
  const $router = useRouter()

  const defLimit = useState(`pagination_default_limit_${options.name!}`, () => -1)
  const pagination = useState(`pagination_settings_${options.name!}`, () => <any>{})

  const initializePagination = async (options?: { internalInnerHeight?: number, rowPixelHeight?: number, globalOffset?: number }) => {
    options = {
      internalInnerHeight: window.innerHeight,
      globalOffset: 175,
      ...options,
    }

    const rowPixelHeight = options.rowPixelHeight || DEFAULT_ROW_PIXEL_HEIGHT
    defLimit.value = Math.floor((options.internalInnerHeight! - options.globalOffset!) / rowPixelHeight)

    pagination.value.page = parseInt($route.query.page as string) || DEFAULT_PAGE
    pagination.value.rowsPerPage = parseInt($route.query.limit as string) || defLimit.value

    await paginationQuery()
  }

  const onRequest = async (props: { pagination: Pagination, filter: any, getCellValue: any }) => {
    const { page, rowsPerPage } = props.pagination

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage

    await paginationQuery()
  }

  const paginationQuery = async () => {
    const newQuery = <LocationQueryRaw>{
      ...$route.query,
      page: `${pagination.value.page}`,
      limit: `${pagination.value.rowsPerPage}`,
    }

    if (isEqual($route.query, newQuery)) {
      return
    }

    $router.replace({
      query: newQuery,
    })
  }

  const updatePaginationData = (data: { total?: number }) => {
    if (data?.total) pagination.value.rowsNumber = data.total
  }

  const onUpdatePagination = (data) => {
    console.log('onUpdatePagination', data)
    return {}
  }

  const getDefaults = () => {
    console.log('getDefaults', defLimit.value)
    return {
      page: parseInt($route.query.page as string) || DEFAULT_PAGE,
      limit: parseInt($route.query.limit as string) || defLimit.value,
    }
  }

  return {
    pagination,

    initializePagination,
    onRequest,
    paginationQuery,
    onUpdatePagination,
    updatePaginationData,
    getDefaults,
  }
}
