import { Logger } from '@nestjs/common'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ContainersStreamService } from './containers-stream.service'
import { isArray } from 'radash'

@WebSocketGateway({
  namespace: 'console',
  cors: {
    origin: '*',
  },
})
export class ContainersGateway {
  @WebSocketServer() public server: Server

  protected readonly logger = new Logger(ContainersGateway.name)

  public constructor(private readonly service: ContainersStreamService) { }

  public afterInit(server: Server) {
    // console.log('SocketGateway afterInit')
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
    this.service.execStreamFinalize(client.id, `${client.handshake.query.id}`)
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    console.log('args', args)
    console.log('client', client.handshake.query.id)
    this.logger.debug(`Client connected: ${client.id}`)
    client.emit('events', '\n')

    const observable = this.service.execStream(client.id, `${client.handshake.query.id}`)

    // const interval = setInterval(() => {
    //   this.service.execStreamAlive(`${client.handshake.query.id}`)
    // }, 1_000)

    observable.subscribe({
      next: (data) => {
        for (const d of isArray(data) ? data : [data]) {
          console.log('<-', JSON.stringify(d))
          client.emit('events', d.toString())
        }
      },
      error: (error) => {
        this.logger.error(`Error in observable for client ${client.id}: ${error.message}`)
        client.emit('error', 'An error occurred while processing the stream.')
      },
      complete: () => {
        this.logger.debug(`Observable for client ${client.id} completed`)
        client.emit('events', '\n')
        // clearInterval(interval)
      },
    })
  }

  @SubscribeMessage('events')
  handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    console.log('->', JSON.stringify(data))
    this.service.execStreamCmd(client.id, `${client.handshake.query.id}`, data)
  }
}
