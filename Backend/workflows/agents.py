from services.retriever import retrieve_from_sources
from services.summarizer import summarize_text

class RetrieverAgent:
    def run(self, query: str, sources: list[str] = ["arxiv", "wikipedia"]):
        return retrieve_from_sources(query, sources)

class SummarizerAgent:
    def run(self, text: str):
        return summarize_text(text)

class CriticAgent:
    def run(self, text: str) -> dict:
        """
        Evaluates quality of the summary.
        Returns {"ok": bool, "reason": str}
        """
        if "lorem ipsum" in text.lower():
            return {"ok": False, "reason": "Hallucination detected (nonsense text)"}
        return {"ok": True, "reason": "Looks fine"}
