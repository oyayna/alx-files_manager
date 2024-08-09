import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    
    this.client.on('error', (err) => {
      console.error('Failed to connect to Redis client:', err.message || err.toString());
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the client's connection to the Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value of a specified key.
   * @param {String} key The key to retrieve the value for.
   * @returns {String | Object}
   */
  async get(key) {
    const getAsync = promisify(this.client.GET).bind(this.client);
    return getAsync(key);
  }

  /**
   * Stores a key-value pair with an expiration time.
   * @param {String} key The key to store.
   * @param {String | Number | Boolean} value The value to store.
   * @param {Number} duration The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setexAsync = promisify(this.client.SETEX).bind(this.client);
    await setexAsync(key, duration, value);
  }

  /**
   * Deletes the value of a specified key.
   * @param {String} key The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.DEL).bind(this.client);
    await delAsync(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;

