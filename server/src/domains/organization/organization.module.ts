import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Organization } from '@qb/common/api/entities/organization'
import { AttributeValueModule } from '../attribute-value/attribute-value.module'
import { AttributeModule } from '../attribute/attribute.module'
import { CartModule } from '../cart/cart.module'
import { DiscountModule } from '../discount/discount.module'
import { DomainEventModule } from '../domain-event/domain-event.module'
import { OrderModule } from '../order/order.module'
import { ProductModule } from '../product/product.module'
import { TaxonomyTermModule } from '../taxonomy-term/taxonomy-term.module'
import { TaxonomyModule } from '../taxonomy/taxonomy.module'
import { UserModule } from '../user/user.module'
import { WishlistModule } from '../wishlist/wishlist.module'
import { OrganizationController } from './organization.controller'
import { OrganizationRepository } from './organization.repository'
import { OrganizationService } from './organization.service'

@Module({
  imports: [
    forwardRef(() => AttributeModule),
    forwardRef(() => AttributeValueModule),
    forwardRef(() => CartModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => DomainEventModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
    forwardRef(() => TaxonomyModule),
    forwardRef(() => TaxonomyTermModule),
    forwardRef(() => UserModule),
    forwardRef(() => WishlistModule),
    TypeOrmModule.forFeature([ Organization ]),
  ],
  providers: [ OrganizationRepository, OrganizationService ],
  controllers: [ OrganizationController ],
  exports: [ OrganizationRepository, OrganizationService ],
})
export class OrganizationModule { }
