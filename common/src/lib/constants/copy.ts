export const ErrorMessages = {
    // Data access
    DOCUMENTS_NOT_FOUND: 'The document(s) could not be found.',
    DOCUMENT_NOT_FOUND: 'The document could not be found.',
    DOCUMENTS_NOT_CREATED: 'The document(s) could not be created.',
    DOCUMENT_NOT_CREATED: 'The document could not be created.',
    DOCUMENTS_NOT_UPDATED: 'The document(s) could not be updated.',
    DOCUMENT_NOT_UPDATED: 'The document could not be updated.',

    // Organization
    FIND_ORGANIZATION_ERROR: 'Failed to look up the organization.',
    ORGANIZATION_NOT_FOUND: 'The organization could not be found.',

    // Order
    FIND_ORDER_ERROR: 'Failed to look up the order.',
    INVALID_ORDER: 'Not a valid order.',
    PRODUCT_OUT_OF_STOCK_ERROR: 'Oh no — one of your chosen products is out of stock!',

    // Product
    PRODUCTS_NOT_FOUND: 'The products could not be found.',

    // User
    EMAIL_NOT_VERIFIED: 'Your email hasn\'t yet been verified. Follow the link in the email we sent you to verify your account.',
    INVALID_PASSWORD: 'Wrong password. Try again.',
    USER_EMAIL_EXISTS: 'Looks like there\'s already an account with that email. Try logging in!',
    USERNAME_EXISTS: 'Looks like there\'s already an account with that username. Try logging in!',
    USER_NOT_AUTHENTICATED: 'You\'re not logged in.',
    USER_NOT_AUTHORIZED: 'You don\'t have permission to do that. Sorry!',
    USER_NOT_FOUND: 'We couldn\'t find a user with that email address.',

    // Generic
    GENERIC: 'Oops! Something went wrong. Please refresh the page and try again.',
    SERVER_WARNING: 'Something\'s not quite right. You might experience better performance if you refresh the page.',
    SERVER_ERROR: 'Oops — something went wrong. Try refreshing the page.',
}

export const FormErrors = {
    fieldError: {
        EMAIL: 'Invalid email.',
        REQUIRED: 'This field is required.'
    }
}

export const Warnings = {
    USER_NOT_LOGGED_IN: 'You\'re not logged in.',
}

export const Actions = {
    CANCEL: 'Cancel',
}

export const DAYS_OF_THE_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
