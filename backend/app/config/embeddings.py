from langchain_voyageai.embeddings import VoyageAIEmbeddings

from ..config.config import config


class Embeddings:
    voyage_embeddings = VoyageAIEmbeddings(
        model="voyage-3.5", api_key=config.VOYAGE_API_KEY, output_dimension=1024
    )


embeddings = Embeddings()
