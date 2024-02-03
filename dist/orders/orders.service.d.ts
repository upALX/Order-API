import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
export declare class OrdersService {
    private orderRepo;
    private productRepo;
    private amqpConnection;
    constructor(orderRepo: Repository<Order>, productRepo: Repository<Product>, amqpConnection: AmqpConnection);
    create(createOrderDto: CreateOrderDto & {
        client_id: number;
    }): Promise<Order>;
    findAll(client_id: number): any;
    findOne(id: string, client_id: number): any;
    pay(id: string): Promise<any>;
    fail(id: string): Promise<any>;
}
