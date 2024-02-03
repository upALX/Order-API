import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateProductDto: UpdateProductDto): any;
    remove(id: string): any;
}
