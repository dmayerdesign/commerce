import { Controller as NestController, Get, Inject } from '@nestjs/common'
import { organizations } from '@qb/common/constants/api-endpoints'
import { Organization } from '@qb/common/domains/organization/organization'
import { Controller } from '../../shared/controller/controller'
import { OrganizationRepository } from './organization.repository'
import { OrganizationService } from './organization.service'

@NestController(organizations)
export class OrganizationController extends Controller<Organization> {
  constructor(
    @Inject(OrganizationRepository) protected readonly _repository: OrganizationRepository,
    @Inject(OrganizationService) protected readonly _organizationService: OrganizationService,
  ) { super() }

  @Get('primary')
  public getPrimary(): Promise<Organization> {
    return this._organizationService.getOrganization()
  }
}
