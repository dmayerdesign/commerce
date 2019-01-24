import { Controller, Get, Inject } from '@nestjs/common'
import { Organization } from '@qb/common/api/entities/organization'
import { organizations } from '@qb/common/constants/api-endpoints'
import { QbController } from '../../shared/controller/controller';
import { OrganizationRepository } from './organization.repository'
import { OrganizationService } from './organization.service'

@Controller(organizations)
export class OrganizationController extends QbController<Organization> {
  constructor(
    @Inject(OrganizationRepository) protected readonly _repository: OrganizationRepository,
    @Inject(OrganizationService) protected readonly _organizationService: OrganizationService,
  ) { super() }

  @Get('primary')
  public getPrimary(): Promise<Organization> {
    return this._organizationService.getOrganization()
  }
}
