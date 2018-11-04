import { AppConfig } from '../../app-config'
import { Organization } from '../api/entities/organization'
import { EmailOptions, EmailServiceOptions, EmailStyleOptions } from '../api/interfaces/email-options'
import { Order } from '../api/interfaces/order'

export class EmailBuilder {

    private _options: EmailOptions = {
        fromEmail: AppConfig.organization_email,
        fromName: AppConfig.brand_name,
        toEmail: null,
        toName: null,
        subject: null,
        preheader: null,
    }

    private html: string

    private styles: EmailStyleOptions = {
        mastheadBgColor: '#00b0ff',
        accentColor: '#ff3c7c',
        fontFamily: 'Montserrat',
        innerBgColor: '#fdfdfd',
    }

    private _commonData: {
        order?: Order
        organization?: Organization
    } = {
        order: null,
        organization: null,
    }

    private customData: any = {}

    public setOptions<T extends EmailOptions | EmailServiceOptions>(options?: T): this {
        const commonDataKeys = Object.keys(this._commonData)
        if (options) {
            Object.keys(options)
                .filter((key) => commonDataKeys.indexOf(key) === -1)
                .forEach((key) => {
                    if (typeof options[key] !== 'undefined') {
                        this._options[key] = options[key]
                    }
                })

            Object.keys(this._commonData)
                .forEach((key) => {
                    if (typeof options[key] !== 'undefined') {
                        this._commonData[key] = options[key]
                    }
                })
        }
        return this
    }

    public setCustomData(data: any): this {
        this.customData = data
        return this
    }

    public setHtml(pugModule: (options: EmailOptions) => string): this {
        this.html = pugModule(this.createEmailOptions)
        return this
    }

    private get createEmailOptions(): any {
        return {
            ...this._options,
            ...this.styles,
            ...this._commonData,
            ...this.customData,
        }
    }

    public get sendEmailOptions(): EmailOptions {
        return {
            ...this._options,
            html: this.html,
        }
    }
}
