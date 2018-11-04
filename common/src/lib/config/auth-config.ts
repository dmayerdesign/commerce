export class AuthConfig {
    public static PasswordSaltLen = 256
    public static CookieOptions = {
        maxAge: 315400000000, // 10 years
        httpOnly: true,
    }
    public static JwtOptions = { expiresIn: '7d' }
}
