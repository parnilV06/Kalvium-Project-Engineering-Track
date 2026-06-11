class CacheService {
  constructor(ttlSeconds = 60) {
    this.cache = new Map();
    this.ttlSeconds = ttlSeconds;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttl = this.ttlSeconds) {
    // Avoid caching null or undefined values
    if (value === null || value === undefined) return;
    
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new CacheService();
