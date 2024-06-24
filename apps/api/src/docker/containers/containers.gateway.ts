import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { Observable, from, map } from 'rxjs'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ContainersGateway {
  @WebSocketServer()
  private server: Server

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })))
  }
}
