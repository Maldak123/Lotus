from langchain_voyageai.embeddings import VoyageAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings

from ..config.config import config


class Embeddings:
    voyage_embeddings = VoyageAIEmbeddings(
        model="voyage-3.5", api_key=config.VOYAGE_API_KEY, output_dimension=1024
    )

    gemini_embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001", api_key=config.GOOGLE_API_KEY
    )

    bge_embedder = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


embeddings = Embeddings()
