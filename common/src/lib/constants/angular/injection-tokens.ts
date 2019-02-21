import { InjectionToken } from '@angular/core'
import { Preboot } from '@qb/common/models/ui/preboot'

export const WINDOW_REF_SERVICE = new InjectionToken<any>('WINDOW_REF_SERVICE')
export const BOOT_CONDITIONS = new InjectionToken<Preboot[]>('BOOT_CONDITIONS')
