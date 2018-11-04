import { Address } from '../api/interfaces/address'

export class UserBuilder {
  public email: string
  public username?: string
  public password?: string
  public role?: string

  public lastName?: string
  public firstName?: string
  public avatar?: {
    large: string;
    thumbnail: string;
  }
  public address?: Address
  public phoneNumber?: string

  public profile?: {
    age?: number;
    gender?: string;
    bio?: string;
  }
  public facebookId?: string

  constructor(user?: any, includePassword?: boolean) {
    if (user) {
      this.email = user.email
      this.username = user.username
      this.lastName = user.lastName
      this.firstName = user.firstName
      this.avatar = user.avatar
      this.address = user.address
      this.phoneNumber = user.phoneNumber
      this.profile = user.profile
      this.facebookId = user.facebookId

      if (includePassword) {
        this.password = user.password
      }
    }
  }
}
