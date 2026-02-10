import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ORDER_CREATED,
  ORDER_DISPATCHED,
  ORDER_STATUS_UPDATED,
} from '../events/events.constants';

@WebSocketGateway({
  namespace: '/kitchen/live',
  cors: { origin: '*' },
})
export class KitchenGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('KitchenGateway');

  afterInit() {
    this.logger.log('Kitchen WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-station')
  handleJoinStation(client: Socket, payload: { station: string }) {
    client.join(`station:${payload.station}`);
    this.logger.log(`Client ${client.id} joined station:${payload.station}`);
  }

  @SubscribeMessage('join-branch')
  handleJoinBranch(client: Socket, payload: { branchId: string }) {
    client.join(`branch:${payload.branchId}`);
    this.logger.log(`Client ${client.id} joined branch:${payload.branchId}`);
  }

  @OnEvent(ORDER_CREATED)
  handleOrderCreated(payload: any) {
    this.server
      .to(`branch:${payload.branchId}`)
      .emit('new-order', payload);
  }

  @OnEvent(ORDER_DISPATCHED)
  handleOrderDispatched(payload: any) {
    const items = payload.items || [];

    const kitchenItems = items.filter(
      (i: any) => i.stationType === 'kitchen' || i.stationType === 'dessert',
    );
    const barItems = items.filter(
      (i: any) => i.stationType === 'bar' || i.stationType === 'beverage',
    );

    if (kitchenItems.length > 0) {
      this.server.to('station:kitchen').emit('new-ticket', {
        orderId: payload.orderId,
        items: kitchenItems,
      });
    }

    if (barItems.length > 0) {
      this.server.to('station:bar').emit('new-ticket', {
        orderId: payload.orderId,
        items: barItems,
      });
    }

    this.server
      .to(`branch:${payload.branchId}`)
      .emit('order-dispatched', payload);
  }

  @OnEvent(ORDER_STATUS_UPDATED)
  handleOrderStatusUpdated(payload: any) {
    this.server
      .to(`branch:${payload.branchId}`)
      .emit('order-updated', payload);
  }
}
