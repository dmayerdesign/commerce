import { AttributeValueModule } from './domains/attribute-value/attribute-value.module'
import { AttributeModule } from './domains/attribute/attribute.module'
import { CartModule } from './domains/cart/cart.module'
import { DiscountModule } from './domains/discount/discount.module'
import { DomainEventModule } from './domains/domain-event/domain-event.module'
import { OrderModule } from './domains/order/order.module'
import { OrganizationModule } from './domains/organization/organization.module'
import { ProductModule } from './domains/product/product.module'
import { TaxonomyTermModule } from './domains/taxonomy-term/taxonomy-term.module'
import { TaxonomyModule } from './domains/taxonomy/taxonomy.module'
import { UserModule } from './domains/user/user.module'
import { WishlistModule } from './domains/wishlist/wishlist.module'

export const domainModules = [
  AttributeModule,
  AttributeValueModule,
  CartModule,
  DiscountModule,
  DomainEventModule,
  OrderModule,
  OrganizationModule,
  ProductModule,
  TaxonomyModule,
  TaxonomyTermModule,
  UserModule,
  WishlistModule,
]
