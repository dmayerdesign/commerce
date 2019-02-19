import { Environment } from "@qb/common/constants/enums/environment";

declare module 'environment' {
  export function environment(): {
    ENVIRONMENT: Environment
    PORT: string
    DOMAIN: string
    ADMIN_URL: string
    CLIENT_URL: string
    MAILGUN_DOMAIN: string
    // Database.
    // MONGODB_URI: string
    MONGODB_URI_TEST: string

    // API Keys.
    ADMIN_KEY: string
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_ACCESS_KEY: string
    EASYPOST_API_KEY: string
    FACEBOOK_APP_ID: string
    FACEBOOK_APP_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    INSTAGRAM_ACCESS_TOKEN: string
    // INSTAGRAM_ACCESS_TOKEN_PRODUCTION: string
    MAILGUN_API_KEY: string
    STRIPE_SECRET_KEY: string
    STRIPE_PUBLISHABLE_KEY: string

    // Passwords
    GIT_PERSONAL_ACCESS_TOKEN: string
    JWT_SECRET: string

    // Other secrets.
    PW_ENCRYPTION_KEY: string
    SESSION_SECRET: string
  }
}
