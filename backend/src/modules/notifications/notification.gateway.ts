import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  notify_user(userId: string, message: any) {
    this.server.to(userId).emit("notification", message);
  }

  handleConnection(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId);
      console.log(`Client connected to room: ${userId}`);
    }
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
