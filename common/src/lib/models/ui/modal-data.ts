import { TemplateRef } from '@angular/core'

import { ModalType } from '../../constants/enums/modal-type'

export interface ModalData {
    title: string
    type: ModalType
    form?: {
        subtitle?: string
        formObject?: object
        onSubmit?(event?: Event): void
    }
    banner?: {
        subtitle?: string
        formObject?: object
        cta?: {
            text: string
            onClick(event?: Event): void
        }
        onSubmit?(args?: any): void
    }
    footer?: {
        okText?: string
        cancelText?: string
        onOk(event?: Event): void
        onCancel(event?: Event): void
    }
    template: TemplateRef<any>
    context: object
}
