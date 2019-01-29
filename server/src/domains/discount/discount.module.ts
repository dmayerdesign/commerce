import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Discount } from '@qb/common/domains/discount/discount'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { AttributeModule } from '../attribute/attribute.module'
import { CartModule } from '../cart/cart.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { OrderModule } from '../order/order.module'
import { OrganizationModule } from '../organization/organization.module'
import { ProductModule } from '../product/product.module'
import { TaxonomyTermModule } from '../taxonomy-term/taxonomy-term.module'
import { TaxonomyModule } from '../taxonomy/taxonomy.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { DiscountController } from './discount.controller'
import { DiscountRepository } from './discount.repository'

@Module({
  imports: [
    forwardRef(() => AttributeModule),
    forwardRef(() => AttributeValueModule),
    forwardRef(() => CartModule),
    forwardRef(() => DomainEventModule),
    forwardRef(() => OrderModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => TaxonomyModule),
    forwardRef(() => TaxonomyTermModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ Discount ]),
  ],
  providers: [ DiscountRepository ],
  controllers: [ DiscountController ],
  exports: [ DiscountRepository ],
})
export class DiscountModule { }
