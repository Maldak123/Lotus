import redis as r

from rq import Worker, Queue
from rq.worker_pool import WorkerPool

from .app.core.redis_client import get_redis


listen = ["task-queue"]

redis_pool = get_redis().get_redis_pool()
redis_conn = r.Redis(connection_pool=redis_pool)

if __name__ == "__main__":
    queues = [Queue(name, connection=redis_conn) for name in listen]
    worker_pool = WorkerPool(queues, connection=redis_conn, num_workers=5)
    worker_pool.start()
