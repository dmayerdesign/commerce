import { inject, injectable } from 'inversify'
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN })

import { AppConfig } from '@mte/app-config'
import { EmailOptions, EmailServiceOptions, OrderEmailOptions } from '@mte/common/api/interfaces/email-options'
import { EmailBuilder } from '@mte/common/builders/email.builder'
import { Types } from '@mte/common/constants/inversify/types'
import { OrderHelper } from '../helpers/order.helper'
import { EmailService as IEmailService } from '../interfaces/email-service'

const receipt = require('@mte/common/emails/templates/receipt')
const shippingNotification = require('@mte/common/emails/templates/shippingNotification')
const emailVerification = require('@mte/common/emails/templates/emailVerification')

/**
 * Send emails with Mailgun
 */
@injectable()
export class EmailService implements IEmailService {
    constructor(
        @inject(Types.OrderHelper) private orderHelper: OrderHelper,
    ) {}

    /**
     * Send an email
     *
     * @param {EmailOptions} options
     */
    public sendEmail(options: EmailOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            const mailOptions: any = {
                to: options.toEmail,
                from: `${options.fromName} <${options.fromEmail}>`,
                subject: options.subject,
            }

            if (options.html) {
                mailOptions.html = options.html
            }
            else if (options.text) {
                mailOptions.text = options.text
            }

            mailgun.messages().send(mailOptions, (err, body) => {
                if (err) {
                    return reject(err)
                }
                resolve(body)
            })
        })
    }

    /**
     * Send a receipt for an order
     *
     * @param {OrderEmailOptions} options
     */
    public sendReceipt(options: OrderEmailOptions): Promise<void> {
        const emailBuilder = new EmailBuilder()
            .setOptions<OrderEmailOptions>({
                ...options,
                subject: `Your receipt | ${options.organization.branding.displayName}`,
                preheader: `View your receipt from your recent order`,
            })
            .setHtml(receipt)

        return this.sendEmail(emailBuilder.sendEmailOptions)
    }

    /**
     * Send a shipping notification
     *
     * @param {OrderEmailOptions} options
     */
    public sendShippingNotification(options: OrderEmailOptions): Promise<any> {
        const emailBuilder = new EmailBuilder()
            .setOptions({
                ...options,
                subject: `Your ${options.organization.branding.displayName} order has been shipped`,
                preheader: `It's on the way! View the shipping details from your recent order`,
            })
            .setCustomData({
                estArrivalDate: this.orderHelper.calculateEstArrival(options.order.estDeliveryDays),
            })
            .setHtml(shippingNotification)

        return this.sendEmail(emailBuilder.sendEmailOptions)
    }

    /**
     * Send an email verification
     *
     * @param {Email} options
     * @param {User} options.user
     * @param {string} options.verificationCode
     */
    public sendEmailVerification(options: EmailServiceOptions): Promise<any> {
        const emailBuilder = new EmailBuilder()
            .setOptions({
                ...options,
                subject: `Verify your new ${options.organization.name} account`,
                preheader: `One click, and your account will be verified`,
            })
            .setHtml(emailVerification)

        return this.sendEmail(emailBuilder.sendEmailOptions)
    }

    /**
     * Report an error
     *
     * @param {Error} error
     */
    public reportError(error: Error): Promise<any> {
        const options: EmailOptions = {
            toEmail: AppConfig.developer_email,
            fromName: AppConfig.brand_name,
            fromEmail: AppConfig.organization_email,
            subject: `New error from ${AppConfig.brand_name}: ${error.message}`,
            text: error.message + '\n\n' + error.toString()
        }
        return this.sendEmail(options)
    }

}
