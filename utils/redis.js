import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Redis client handler.
 */
class RedisClient {
  /**
   * Initializes a new instance of RedisClient.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    this.client.on('error', (err) => {
      console.error('Failed to connect to Redis:', err.message || err.toString());
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Determines if the Redis client is connected.
   * @returns {boolean} Connection status.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value associated with the specified key.
   * @param {String} key The key to look up.
   * @returns {String | Object} The value of the key.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} duration Expiration time in seconds.
   * @returns {Promise<void>} Promise indicating the operation result.
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes the value associated with the specified key.
   * @param {String} key The key to delete.
   * @returns {Promise<void>} Promise indicating the operation result.
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;

