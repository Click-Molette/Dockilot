<template lang="pug">
q-card-section
  div(ref="terminal")
</template>

<script lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { io } from 'socket.io-client'

// import 'xterm/lib/addons/fullscreen/fullscreen.css'
import 'xterm/css/xterm.css'


// const bindTerminalResize = (term, websocket) => {
//   const onTermResize = (size) => {
//     // websocket.send('2' + Base64.encode(size.rows + ':' + size.cols))
//   }

//   term.on('resize', onTermResize)
//   websocket.addEventListener('close', function () {
//     term.off('resize', onTermResize)
//   })
// }

// const bindTerminal = (term, websocket, bidirectional, bufferedTime) => {
//   term.socket = websocket
//   let messageBuffer = ''

//   const handleWebSocketMessage = function (ev) {
//     if (bufferedTime && bufferedTime > 0) {
//       if (messageBuffer) {
//         messageBuffer += ev.data
//       } else {
//         messageBuffer = ev.data
//         setTimeout(function () {
//           term.write(messageBuffer)
//         }, bufferedTime)
//       }
//     } else {
//       term.write(ev.data)
//     }
//   }

//   const handleTerminalData = function (data) {
//     // websocket.send('0' + Base64.encode(data))
//   }

//   websocket.onmessage = handleWebSocketMessage

//   if (bidirectional) {
//     term.on('data', handleTerminalData)
//   }

//   const heartBeatTimer = setInterval(function () {
//     websocket.send('1')
//   }, 20 * 1_000)

//   websocket.addEventListener('close', function () {
//     websocket.removeEventListener('message', handleWebSocketMessage)
//     term.off('data', handleTerminalData)

//     delete term.socket

//     clearInterval(heartBeatTimer)
//   })
// }

export default {
  name: 'Console',
  props: { obj: { type: Object, require: true }, visible: Boolean },
  data() {
    return {
      isFullScreen: false,
      searchKey: '',
      v: this.visible,
      ws: null,
      term: null,
      thisV: this.visible,
      rows: 20,
      cols: 75
    }
  },
  computed: {
    wsUrl() {
      return `ws://${window.location.host}/docker/containers/${this.obj.Id}/console/ws`
    },
  },
  watch: {
    visible(val) {
      this.v = val
    },
  },
  methods: {
    onWindowResize() {
      this.term.fit()
    },
    doClose() {
      window.removeEventListener('resize', this.onWindowResize)
      if (this.ws) {
        this.ws.close()
      }
      if (this.term) {
        this.term.dispose()
      }
      this.$emit('pclose', false)
    },
    doOpen() {

    },
    doOpened() {
      this.term = new Terminal({
        // rendererType: 'canvas',
        rows: this.rows,
        cols: this.cols,
        convertEol: true,
        scrollback: 10,
        disableStdin: false,
        fontSize: 18,
        cursorBlink: true,
        cursorStyle: 'bar',
        // bellStyle: 'sound',
        // theme: defaultTheme,
      })

      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)
      this.term.focus()
      fitAddon.fit()

      const socket = io('http://localhost:4000', {
        reconnection: true,
      })

      socket.connect()

      socket.on('connect', () => {
        console.log('connected')
      })

      socket.on('events', (data) => {
        this.term.write(data)
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
      })

      this.term.onData((data) => {
        console.log(data)
        socket.emit('events', data)
      })

      socket.on('data', (data: string | Uint8Array) => {
        this.term.write(data)
      })

      // this.term._initialized = true
      // this.term.prompt = () => {
      //   this.term.write('\r\n')
      // }

      // this.term.writeln('Welcome to \x1B[1;3;31mxterm.js\x1B[0m')
      // this.term.writeln('This is a local terminal emulation, without a real terminal in the back-end.')
      // this.term.writeln('Type some keys and commands to play around.')
      // this.term.prompt()

      // this.term.on('key', function (key, ev) {
      //   console.log(key, ev, ev.keyCode)
      // })

      this.term.open(this.$refs.terminal)
      // this.term.webLinksInit(this.doLink)

      // this.term.on('resize', this.onWindowResize)

      // window.addEventListener('resize', this.onWindowResize)
      // this.term.fit()

      // this.ws = new WebSocket('ws://127.0.0.1:8888/api/ws/ping5')
      // this.ws.onerror = () => {
      //   this.$message.error('ws has no token, please login first')
      //   this.$router.push({ name: 'login' })
      // }
      // this.ws.onclose = () => {
      //   this.term.setOption('cursorBlink', false)
      //   this.$message('console.web_socket_disconnect')
      // }

      // bindTerminal(this.term, this.ws, true, -1)
      // bindTerminalResize(this.term, this.ws)
    },
  },
  mounted() {
    this.doOpened()
  },
}
</script>
