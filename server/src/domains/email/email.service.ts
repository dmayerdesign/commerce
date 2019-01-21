import { Injectable } from '@nestjs/common'
import { AppConfig } from '@qb/app-config'
import { EmailOptions, OrderEmailOptions } from '@qb/common/api/interfaces/email-options'
import { EmailBuilder } from '@qb/common/builders/email.builder'
import { resolve as _resolve } from 'path'
import * as pug from 'pug'
import { calculateEstArrival } from '../order/order.helpers'
import { EmailService as IEmailService } from './email.service.interface'

// const _receipt = (_: any) => '' // require('@qb/common/emails/templates/receipt.pug')
// const _shippingNotification = (_: any) => '' // require('@qb/common/emails/templates/shippingNotification.pug')
// const _emailVerification = (_: any) => '' // require('@qb/common/emails/templates/emailVerification.pug')
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
})

const receipt = pug.compileFile(
    _resolve(__dirname, '../../../../common/src/lib/emails/templates/receipt.pug'),
)
const shippingNotification = pug.compileFile(
    _resolve(__dirname, '../../../../common/src/lib/emails/templates/shippingNotification.pug'),
)
const emailVerification = pug.compileFile(
    _resolve(__dirname, '../../../../common/src/lib/emails/templates/emailVerification.pug'),
)

// pug.render(_receipt)
/**
 * Send emails with Mailgun
 */
@Injectable()
export class EmailService implements IEmailService {
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
    public sendReceipt(options: Partial<OrderEmailOptions>): Promise<void> {
        if (!options.organization) {
            throw new Error(`Invalid options passed to EmailService#sendReceipt: ${options}`)
        }
        const emailBuilder = new EmailBuilder()
            .setOptions({
                ...options,
                subject: `Your receipt | ${options.organization.branding.displayName}`,
                preheader: `View your receipt from your recent order`,
            } as OrderEmailOptions)
            .setHtml(receipt)

        return this.sendEmail(emailBuilder.sendEmailOptions)
    }

    /**
     * Send a shipping notification
     *
     * @param {OrderEmailOptions} options
     */
    public sendShippingNotification(options: OrderEmailOptions): Promise<any> {
        if (!options.organization) {
            throw new Error(`Invalid options passed to EmailService#sendReceipt: ${options}`)
        }
        const emailBuilder = new EmailBuilder()
            .setOptions({
                ...options,
                subject: `Your ${options.organization.branding.displayName} order has been shipped`,
                preheader: `It's on the way! View the shipping details from your recent order`,
            } as OrderEmailOptions)
            .setCustomData({
                estArrivalDate: calculateEstArrival(options.order.estDeliveryDays || 0),
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
    public sendEmailVerification(options: EmailOptions): Promise<any> {
        const emailBuilder = new EmailBuilder()
            .setOptions({
                ...options,
                subject: `Verify your new ${options.organization.name} account`,
                preheader: `One click, and your account will be verified`,
            } as EmailOptions)
            .setHtml(emailVerification)

        return this.sendEmail(emailBuilder.sendEmailOptions)
    }

    /**
     * Report an error
     *
     * @param {Error} error
     */
    public reportError(error: Error): Promise<any> {
        const options = {
            toEmail: AppConfig.developer_email,
            fromName: AppConfig.brand_name,
            fromEmail: AppConfig.organization_email,
            subject: `New error from ${AppConfig.brand_name}: ${error.message}`,
            text: error.message + '\n\n' + error.toString()
        } as EmailOptions
        return this.sendEmail(options)
    }

}
