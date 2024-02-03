import { OrderStatus } from './entities/order.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OrdersService } from './orders.service';
export declare class OrderConsumer {
    private orderService;
    private amqpConnection;
    constructor(orderService: OrdersService, amqpConnection: AmqpConnection);
    consume(msg: {
        order_id: string;
        status: OrderStatus;
    }): Promise<any>;
}
