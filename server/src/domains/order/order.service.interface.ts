import { Order } from '@qb/common/domains/order/order.interface'

export interface OrderService {
    place(newOrder: Partial<Order>): Promise<Order>
}
