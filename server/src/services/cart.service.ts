import { CartItem } from '@qb/common/api/interfaces/cart-item'
import { GetCartItemsFromIdsRequest } from '@qb/common/api/requests/get-cart-items-from-ids.request'
import { ApiErrorResponse } from '@qb/common/api/responses/api-error.response'
import { ApiResponse } from '@qb/common/api/responses/api.response'
import { Types } from '@qb/common/constants/inversify/types'
import { inject, injectable } from 'inversify'
import { ProductService } from './product.service'

@injectable()
export class CartService {
    constructor(
        @inject(Types.ProductService) private _productService: ProductService
    ) { }

    public async refresh(request: GetCartItemsFromIdsRequest): Promise<ApiResponse<CartItem[]>> {
        try {
            const getProductsResponse = await this._productService.getIds(request)
            const products = getProductsResponse.body
            return new ApiResponse<CartItem[]>(products)
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
    }

    public async getItem(id: string): Promise<ApiResponse<CartItem>> {
        let item: CartItem = null
        try {
            const getProductResponse = await this._productService.getOne(id)
            item = getProductResponse.body
        }
        catch (error) {
            throw new ApiErrorResponse(error)
        }
        return new ApiResponse<CartItem>(item)
    }
}
