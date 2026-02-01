import redis from '../config/redis.config';

// sudo service redis-server start
// redis-cli ping

export class BatchApproveService {
    private readonly BATCH_PREFIX = 'batch_approve';

    // ADD: Adds single request ID to admin's batch (no DB write yet)
    async addToBatch(userId: string, requestId: string): Promise<void> {
        const key = `${this.BATCH_PREFIX}:${userId}`;

        // HSET stores requestId -> 'pending' (idempotent, overwrites if exists)
        await redis.hset(key, requestId, 'pending');
        // Optional: Set 2hr TTL to cleanup abandoned sessions
        await redis.expire(key, 7200);
    }

    // GET: Returns array of request IDs currently in batch
    async getBatch(userId: string): Promise<string[]> {
        const key = `${this.BATCH_PREFIX}:${userId}`;

        // HKEYS returns all field names (request IDs)
        const requestIds = await redis.hkeys(key);

        return requestIds.map(id => id.toString());
    }

    // REMOVE: Removes single request from batch
    async removeFromBatch(userId: string, requestId: string): Promise<void> {
        const key = `${this.BATCH_PREFIX}:${userId}`;
        await redis.hdel(key, requestId);
    }

    // CLEAR: Deletes entire batch after successful submission
    async clearBatch(userId: string): Promise<void> {
        const key = `${this.BATCH_PREFIX}:${userId}`;
        await redis.del(key);
    }

    // COUNT: Quick count of items in batch (for UI badge)
    async getBatchCount(userId: string): Promise<number> {
        const key = `${this.BATCH_PREFIX}:${userId}`;

        return await redis.hlen(key);
    }
}

export default new BatchApproveService();