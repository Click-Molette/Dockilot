export function useRouteQueries(payload?: { queryHandler?: (url: URL, data?: {}) => void }) {
  const $route = useRoute()

  // Default query handler
  if (!payload) payload = {}
  if (!payload?.queryHandler) {
    payload.queryHandler = (url: URL, data?: object) => {
      if (!data) return

      for (const [key, value] of Object.entries(data)) {
        if (value) {
          url.searchParams.set(key, value)
        } else {
          url.searchParams.delete(key)
        }
      }
    }
  }

  const toPathWithQueries = (path = '/', data?: {}) => {
    const url = new URL(`${path}`, window.location.origin)

    for (const key in $route.query) {
      url.searchParams.set(key, `${$route.query[key]}`)
    }

    if (payload?.queryHandler) payload?.queryHandler(url, data)

    return url.pathname + url.search
  }

  return {
    toPathWithQueries,
  }
}
