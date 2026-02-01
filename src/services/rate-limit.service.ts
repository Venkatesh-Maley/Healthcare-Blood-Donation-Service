import redis from '../config/redis.config';

export class RateLimitService {
    private readonly LOGIN_PREFIX = 'login_attempts';
    private readonly MAX_ATTEMPTS = 3;
    private readonly LOCKOUT_DURATION = 3600; // 1 hour in seconds

    async isBlocked(email: string): Promise<boolean> {
        const key = `${this.LOGIN_PREFIX}:${email}`;
        const attempts = await redis.get(key);
        return attempts !== null && parseInt(attempts) >= this.MAX_ATTEMPTS;
    }

    async incrementAttempts(email: string): Promise<number> {
        const key = `${this.LOGIN_PREFIX}:${email}`;
        const attempts = await redis.incr(key);

        if (attempts === 1) {
            await redis.expire(key, this.LOCKOUT_DURATION);
        }

        return attempts;
    }

    async resetAttempts(email: string): Promise<void> {
        const key = `${this.LOGIN_PREFIX}:${email}`;
        await redis.del(key);
    }

    async getRemainingTime(email: string): Promise<number> {
        const key = `${this.LOGIN_PREFIX}:${email}`;
        const ttl = await redis.ttl(key);
        return ttl > 0 ? Math.ceil(ttl / 60) : 0; // returns minutes
    }
}

export default new RateLimitService();
