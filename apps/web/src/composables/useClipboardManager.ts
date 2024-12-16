import type { QNotifyCreateOptions, QVueGlobals } from 'quasar'

export function useClipboardManager($q: QVueGlobals) {
  const clipboardCopy = async (source: string, options?: QNotifyCreateOptions): Promise<void> => {
    const { copy } = useClipboard({ source })

    await copy(source)

    $q.notify({
      message: 'Copied to clipboard',
      color: 'positive',
      icon: 'mdi-check',
      ...options,
    })
  }

  return { clipboardCopy }
}

