import { Controller, Get, Inject } from '@nestjs/common'
import { Organization } from '@qb/common/api/entities/organization'
import { Organization as IOrganization } from '@qb/common/api/interfaces/organization'
import { QbController } from '../../shared/controller/controller'
import { QbRepository } from '../../shared/data-access/repository'
import { OrganizationService } from './organization.service'

@Controller('api/organizations')
export class OrganizationController extends QbController<IOrganization> {
  constructor(
    @Inject(QbRepository) protected readonly _repository: QbRepository<IOrganization>,
    @Inject(QbRepository) protected readonly _organizationService: OrganizationService,
  ) {
    super()
    this._repository.configureForGoosetypeEntity(Organization)
  }

  @Get('primary')
  public getPrimary(): Promise<IOrganization> {
    return this._organizationService.getOrganization()
  }
}
