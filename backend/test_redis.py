# Create a simple test file to verify Redis connection
import redis

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

# Test connection
try:
    r.ping()
    print("Connected to Redis successfully!")
    
    # Test setting and getting a value
    r.set('test_key', 'test_value')
    value = r.get('test_key')
    print(f"Retrieved test value: {value}")
    
    # Clean up
    r.delete('test_key')
except Exception as e:
    print(f"Redis connection failed: {e}")