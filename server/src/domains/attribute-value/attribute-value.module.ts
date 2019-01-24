import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeValue } from '@qb/common/api/entities/attribute-value'
import { AttributeModule } from '../attribute/attribute.module'
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
import { AttributeValueController } from './attribute-value.controller'
import { AttributeValueRepository } from './attribute-value.repository'

@Module({
  imports: [
    forwardRef(() => AttributeModule),
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
    TypeOrmModule.forFeature([ AttributeValue ]),
  ],
  providers: [ AttributeValueRepository ],
  controllers: [ AttributeValueController ],
  exports: [ AttributeValueRepository ],
})
export class AttributeValueModule { }
