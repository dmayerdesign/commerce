import { Order } from '@qb/common/api/interfaces/order'

export interface OrderService {
    place(newOrder: Partial<Order>): Promise<Order>
}
