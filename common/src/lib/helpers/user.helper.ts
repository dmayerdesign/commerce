import { User } from '../api/entities/user'

export class UserHelper {
    public static getFullName(user: { firstName: string, lastName: string }): string {
        if (user.firstName && !user.lastName) {
            return user.firstName
        }
        else if (user.lastName && !user.firstName) {
            return user.lastName
        }
        return `${user.firstName} ${user.lastName}`
    }

    public static cleanUser(user: User): User {
        delete user.role
        delete user.password

        // Delete JWT properties.
        delete (user as any).iat
        delete (user as any).exp

        return user
    }

    public static cleanUserForJwt(user: User): User {
        return JSON.parse(JSON.stringify(user))
    }
}
