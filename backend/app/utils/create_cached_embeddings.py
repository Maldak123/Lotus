from langchain_classic.embeddings import CacheBackedEmbeddings
from langchain_community.storage import RedisStore


def create_cache_backed_embeddings(
    document_embedding_cache: RedisStore,
    underlying_embeddings,
    namespace: str,
    batch_size: int = 128,
    key_encoder: str = "sha256",
):
    return CacheBackedEmbeddings.from_bytes_store(
        underlying_embeddings=underlying_embeddings,
        document_embedding_cache=document_embedding_cache,
        namespace=namespace,
        key_encoder=key_encoder,
        batch_size=batch_size,
    )
