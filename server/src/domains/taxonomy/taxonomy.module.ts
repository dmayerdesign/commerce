import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Taxonomy } from '@qb/common/api/entities/taxonomy'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { AttributeModule } from '../attribute/attribute.module'
import { CartModule } from '../cart/cart.module'
import { DiscountModule } from '../discount/discount.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { OrderModule } from '../order/order.module'
import { OrganizationModule } from '../organization/organization.module'
import { ProductModule } from '../product/product.module'
import { TaxonomyTermModule } from '../taxonomy-term/taxonomy-term.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { TaxonomyController } from './taxonomy.controller'
import { TaxonomyRepository } from './taxonomy.repository'

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
    forwardRef(() => TaxonomyTermModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ Taxonomy ]),
  ],
  providers: [ TaxonomyRepository ],
  controllers: [ TaxonomyController ],
  exports: [ TaxonomyRepository ],
})
export class TaxonomyModule { }
