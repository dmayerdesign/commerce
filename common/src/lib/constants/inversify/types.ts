export class Types {
    // Middleware.
    public static isAuthenticated = Symbol('isAuthenticated')
    public static isOwner = Symbol('isOwner')
    public static Authenticate = Symbol('Authenticate')

    // Services.
    public static CartService = Symbol('CartService')
    public static DbClient = Symbol('DbClient')
    public static DiscountService = Symbol('DiscountService')
    public static Easypost = Symbol('Easypost')
    public static EasypostService = Symbol('EasypostService')
    public static EmailService = Symbol('EmailService')
    public static ErrorService = Symbol('ErrorService')
    public static InstagramService = Symbol('InstagramService')
    public static ModelBuilder = Symbol('ModelBuilder')
    public static OrganizationService = Symbol('OrganizationService')
    public static OrderHelper = Symbol('OrderHelper')
    public static OrderService = Symbol('OrderService')
    public static ProductSearchHelper = Symbol('ProductSearchHelper')
    public static ProductService = Symbol('ProductService')
    public static StripeCustomerService = Symbol('StripeCustomerService')
    public static StripeOrderActionsService = Symbol('StripeOrderActionsService')
    public static StripeOrderService = Symbol('StripeOrderService')
    public static StripeProductService = Symbol('StripeProductService')
    public static TaxonomyService = Symbol('TaxonomyService')
    public static TaxonomyTermService = Symbol('TaxonomyTermService')
    public static TimerService = Symbol('TimerService')
    public static UserService = Symbol('UserService')
    public static WishlistService = Symbol('WishlistService')
    public static WoocommerceMigrationService = Symbol('WoocommerceMigrationService')

    // Controllers.
    public static AppController = 'AppController'
    public static CartController = 'CartController'
    public static InstagramController = 'InstagramController'
    public static OrdersController = 'OrdersController'
    public static OrganizationController = 'OrganizationController'
    public static ProductsAdminController = 'ProductsAdminController'
    public static ProductsController = 'ProductsController'
    public static TaxonomyTermsController = 'TaxonomyTermsController'
    public static UserController = 'UserController'
}
