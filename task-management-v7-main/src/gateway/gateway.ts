import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from 'socket.io'
import {OnModuleInit} from "@nestjs/common";
@WebSocketGateway()
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server

    onModuleInit(): any {
        this.server.on('connection', (socket)=> {
            console.log(socket.id);
            console.log('Connected')
        })
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body)
        this.server.emit('onMessage', {
            msg: 'NewMessage',
            content: body

        })
    }
}