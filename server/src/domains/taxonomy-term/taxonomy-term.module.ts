import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaxonomyTerm } from '@qb/common/api/entities/taxonomy-term'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { AttributeModule } from '../attribute/attribute.module'
import { CartModule } from '../cart/cart.module'
import { DiscountModule } from '../discount/discount.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { OrderModule } from '../order/order.module'
import { OrganizationModule } from '../organization/organization.module'
import { ProductModule } from '../product/product.module'
import { TaxonomyModule } from '../taxonomy/taxonomy.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { TaxonomyTermController } from './taxonomy-term.controller'
import { TaxonomyTermRepository } from './taxonomy-term.repository'

@Module({
  imports: [
    forwardRef(() => AttributeModule),
    forwardRef(() => AttributeValueModule),
    forwardRef(() => CartModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => DomainEventModule),
    forwardRef(() => OrderModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ProductModule),
    forwardRef(() => TaxonomyModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ TaxonomyTerm ]),
  ],
  providers: [ TaxonomyTermRepository ],
  controllers: [ TaxonomyTermController ],
  exports: [ TaxonomyTermRepository ],
})
export class TaxonomyTermModule { }
