import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '@qb/common/domains/order/order'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { AttributeModule } from '../attribute/attribute.module'
import { CartModule } from '../cart/cart.module'
import { DiscountModule } from '../discount/discount.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { EmailService } from '../email/email.service'
import { OrganizationModule } from '../organization/organization.module'
import { OrganizationService } from '../organization/organization.service'
import { ProductModule } from '../product/product.module'
import { TaxonomyTermModule } from '../taxonomy-term/taxonomy-term.module'
import { TaxonomyModule } from '../taxonomy/taxonomy.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { OrderController } from './order.controller'
import { OrderRepository } from './order.repository'
import { OrderService } from './order.service'
import { StripeCustomerService } from './stripe/stripe-customer.service'
import { StripeOrderActionsService } from './stripe/stripe-order-actions.service'
import { StripeOrderService } from './stripe/stripe-order.service'
import { StripeProductService } from './stripe/stripe-product.service'

@Module({
  imports: [
    forwardRef(() => AttributeModule),
    forwardRef(() => AttributeValueModule),
    forwardRef(() => CartModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => DomainEventModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => TaxonomyModule),
    forwardRef(() => TaxonomyTermModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ Order ]),
  ],
  providers: [
    OrderRepository,
    OrderService,
    EmailService,
    StripeCustomerService,
    StripeOrderService,
    StripeOrderActionsService,
    StripeProductService,
    OrganizationService
  ],
  controllers: [ OrderController ],
  exports: [
    OrderRepository,
    OrderService,
  ],
})
export class OrderModule { }
