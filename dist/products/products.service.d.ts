import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productRepo;
    constructor(productRepo: Repository<Product>);
    create(createProductDto: CreateProductDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateProductDto: UpdateProductDto): any;
    remove(id: string): any;
}
