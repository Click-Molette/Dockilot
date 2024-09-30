<template lang="pug">
div#terminal(ref="terminal")
</template>

<script lang="ts">
import { io } from 'socket.io-client'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SerializeAddon } from '@xterm/addon-serialize'
import { Unicode11Addon } from '@xterm/addon-unicode11'
import '@xterm/xterm/css/xterm.css'

export default {
  name: 'ConsolePage',
  props: {
    cols: {
      type: Number,
      default: 80,
    },
    rows: {
      type: Number,
      default: 24,
    },
  },
  setup(props) {
    const $route = useRoute()
    const $appConfig = useAppConfig()

    const term = new Terminal({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      cursorBlink: true,
      cols: props.cols,
      rows: props.rows,
      screenReaderMode: true,
      allowProposedApi: true,
      convertEol: true,
    })

    const terminalFitAddOn = new FitAddon()
    term.loadAddon(terminalFitAddOn)
    terminalFitAddOn.fit()

    const serializeAddon = new SerializeAddon()
    term.loadAddon(serializeAddon)
    serializeAddon.serialize()

    const unicode11Addon = new Unicode11Addon()
    term.loadAddon(unicode11Addon)
    term.unicode.activeVersion = '11'

    const socket = io(`${$appConfig.api.url}/console`, {
      reconnection: true,
      query: {
        id: $route.params.id,
      },
    })

    return {
      term,
      terminalFitAddOn,
      socket,
    }
  },
  methods: {
    onResizeEvent() {
      this.terminalFitAddOn.fit()
      console.debug('Resize terminal')
    },
    onKey(e) {
      console.log('->', JSON.stringify(e.key))
      this.socket.emit('events', e.key)
    },
    onMessage(data: string | Uint8Array) {
      console.log('<-', JSON.stringify(data.toString()))
      this.term.write(data.toString())
    },
  },
  created() {
    this.term.onKey(this.onKey)
    this.socket.on('events', this.onMessage)
  },
  mounted() {
    window.addEventListener('resize', this.onResizeEvent)
    this.term.open(this.$refs.terminal as HTMLElement)
    this.term.focus()
    this.terminalFitAddOn.fit()
  },
  unmounted() {
    window.removeEventListener('resize', this.onResizeEvent)
    this.term.dispose()
    this.socket.disconnect()
  },
}
</script>
