export function useRouteQueries(payload?: { queryHandler?: Function }) {
  const $route = useRoute()

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
