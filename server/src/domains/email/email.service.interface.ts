import { EmailOptions, EmailServiceOptions, OrderEmailOptions } from '@qb/common/api/interfaces/email-options'

export interface EmailService {
  sendEmail(options: EmailOptions): Promise<any>
  sendReceipt(options: OrderEmailOptions): Promise<any>
  sendShippingNotification(options: OrderEmailOptions): Promise<any>
  sendEmailVerification(options: EmailServiceOptions): Promise<any>
  reportError(error: Error): Promise<any>
}
