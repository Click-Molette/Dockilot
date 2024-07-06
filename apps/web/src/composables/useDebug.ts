export function useDebug() {
  const route = useRoute()
  const debug = process.env.NODE_ENV === 'development' || /yes|true|1|on/.test(`${route.query.debug}`)

  return { debug }
}
