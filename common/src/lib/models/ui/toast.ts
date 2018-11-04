import { ToastType } from '../../constants/enums/toast-type'

export interface Toast {
    type: ToastType
    message: string
   timeout: number
}
