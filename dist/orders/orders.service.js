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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
let OrdersService = class OrdersService {
    constructor(orderRepo, productRepo, amqpConnection) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.amqpConnection = amqpConnection;
    }
    async create(createOrderDto) {
        const productIds = createOrderDto.items.map((item) => item.product_id);
        const uniqueProductIds = [...new Set(productIds)];
        const products = await this.productRepo.findBy({
            id: (0, typeorm_2.In)(uniqueProductIds),
        });
        if (products.length !== uniqueProductIds.length) {
            throw new Error(`Algum produto não existe. Produtos passados ${productIds}, produtos encontrados ${products.map((product) => product.id)}`);
        }
        const order = order_entity_1.Order.create({
            client_id: createOrderDto.client_id,
            items: createOrderDto.items.map((item) => {
                const product = products.find((product) => product.id === item.product_id);
                return {
                    price: product.price,
                    product_id: item.product_id,
                    quantity: item.quantity,
                };
            }),
        });
        await this.orderRepo.save(order);
        await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
            order_id: order.id,
            card_hash: createOrderDto.card_hash,
            total: order.total,
        });
        return order;
    }
    findAll(client_id) {
        return this.orderRepo.find({
            where: {
                client_id,
            },
            order: {
                created_at: 'DESC',
            },
        });
    }
    findOne(id, client_id) {
        return this.orderRepo.findOneByOrFail({
            id,
            client_id,
        });
    }
    async pay(id) {
        const order = await this.orderRepo.findOneByOrFail({
            id,
        });
        order.pay();
        await this.orderRepo.save(order);
        return order;
    }
    async fail(id) {
        const order = await this.orderRepo.findOneByOrFail({
            id,
        });
        order.fail();
        await this.orderRepo.save(order);
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof nestjs_rabbitmq_1.AmqpConnection !== "undefined" && nestjs_rabbitmq_1.AmqpConnection) === "function" ? _c : Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map