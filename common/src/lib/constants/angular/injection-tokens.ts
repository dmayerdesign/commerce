import { InjectionToken } from '@angular/core'
import { Preboot } from '@qb/common/models/ui/preboot'

export const BOOT_CONDITIONS = new InjectionToken<Preboot[]>('BOOT_CONDITIONS')
