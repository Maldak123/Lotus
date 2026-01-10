import redis

from langchain_community.storage import RedisStore
from ..config.config import config


def get_redis_client():
    return redis.Redis(
        host=config.REDIS_HOST_NAME,
        port=15841,
        decode_responses=False,
        username="default",
        password=config.REDIS_PASSWORD,
    )


def get_redis_store():
    client = get_redis_client()
    return RedisStore(client=client)
