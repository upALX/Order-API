"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderConsumer = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("./entities/order.entity");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const orders_service_1 = require("./orders.service");
const typeorm_1 = require("typeorm");
let OrderConsumer = class OrderConsumer {
    constructor(orderService, amqpConnection) {
        this.orderService = orderService;
        this.amqpConnection = amqpConnection;
    }
    async consume(msg) {
        console.log('Message:', msg);
        try {
            if (msg.status === order_entity_1.OrderStatus.PAID) {
                await this.orderService.pay(msg.order_id);
            }
            if (msg.status === order_entity_1.OrderStatus.FAILED) {
                await this.orderService.fail(msg.order_id);
            }
            throw new InvalidStatusError('Invalid status');
        }
        catch (e) {
            if (e instanceof typeorm_1.EntityNotFoundError || e instanceof InvalidStatusError) {
                await this.amqpConnection.publish('amq.direct', 'fail', {
                    error: e.message,
                    order_id: msg.order_id,
                });
                return new nestjs_rabbitmq_1.Nack(false);
            }
            return new nestjs_rabbitmq_1.Nack(true);
        }
    }
};
exports.OrderConsumer = OrderConsumer;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitSubscribe)({
        exchange: 'amq.direct',
        routingKey: 'PaymentDone',
        queue: 'payments',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderConsumer.prototype, "consume", null);
exports.OrderConsumer = OrderConsumer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService, typeof (_a = typeof nestjs_rabbitmq_1.AmqpConnection !== "undefined" && nestjs_rabbitmq_1.AmqpConnection) === "function" ? _a : Object])
], OrderConsumer);
class InvalidStatusError extends Error {
    constructor(invalidStatus) {
        super(`Invalid status: ${invalidStatus}`);
    }
}
//# sourceMappingURL=order.consumer.js.map