import { NgrxAction, NgrxMessage } from '@qb/common/models/ui/ngrx-action'

export abstract class ShopMessage<PayloadType = any> extends NgrxMessage<PayloadType> { }
export abstract class ShopAction extends NgrxAction { }
