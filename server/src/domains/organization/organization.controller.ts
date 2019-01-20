import { Controller, Get, Inject } from '@nestjs/common'
import { Organization } from '@qb/common/api/entities/organization'
import { organizations } from '@qb/common/constants/api-endpoints'
import { OrganizationController as OrganizationControllerGenerated } from './organization.controller.generated'
import { OrganizationRepository } from './organization.repository.generated'
import { OrganizationService } from './organization.service'

@Controller(organizations)
export class OrganizationController extends OrganizationControllerGenerated {
  constructor(
    @Inject(OrganizationRepository) protected readonly _repository: OrganizationRepository,
    @Inject(OrganizationService) protected readonly _organizationService: OrganizationService,
  ) { super(_repository) }

  @Get('primary')
  public getPrimary(): Promise<Organization> {
    return this._organizationService.getOrganization()
  }
}
