import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ContainersStreamService } from './containers-stream.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ContainersGateway {
  @WebSocketServer() public server: Server

  private readonly logger = new Logger(ContainersGateway.name)

  public constructor(private readonly service: ContainersStreamService) { }

  public afterInit(server: Server) {
    console.log('SocketGateway afterInit')
  }

  public handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(`Client connected: ${client.id}`)
    try {
      const observable = this.service.execStream('a10a79a5ec1010e705a8912e88676d3cd27ab2f34b2cb182e6ba852eb1f3b27a')
      // const lastValueFrom$ = await lastValueFrom(observable)
      // console.log('lastValueFrom$', lastValueFrom$)
      // lastValueFrom$.then((data) => {
      //   console.log('data', data.toString())
      // })
      // observable.pipe().subscribe((data) => {
      //   console.log('data', data.toString())
      //   client.emit('events', data.toString())
      // })
      observable.subscribe((data) => {
        console.log('data', data.toString())
        client.emit('events', data.toString())
      })
    } catch (error) {
      console.error(error)
    }
  }

  @SubscribeMessage('events')
  handleEvent(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    // console.log('events', data, client)
    // this.observable
    this.service.execStreamCmd('a10a79a5ec1010e705a8912e88676d3cd27ab2f34b2cb182e6ba852eb1f3b27a', data)
    client.emit('events', data)
  }
}
