import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attribute } from '@qb/common/api/entities/attribute'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { CartModule } from '../cart/cart.module'
import { DiscountModule } from '../discount/discount.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { OrderModule } from '../order/order.module'
import { OrganizationModule } from '../organization/organization.module'
import { ProductModule } from '../product/product.module'
import { TaxonomyTermModule } from '../taxonomy-term/taxonomy-term.module'
import { TaxonomyModule } from '../taxonomy/taxonomy.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { AttributeController } from './attribute.controller'
import { AttributeRepository } from './attribute.repository'

@Module({
  imports: [
    forwardRef(() => AttributeValueModule),
    forwardRef(() => CartModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => DomainEventModule),
    forwardRef(() => OrderModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => TaxonomyModule),
    forwardRef(() => TaxonomyTermModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ Attribute ]),
  ],
  providers: [ AttributeRepository ],
  controllers: [ AttributeController ],
  exports: [ AttributeRepository ],
})
export class AttributeModule { }
