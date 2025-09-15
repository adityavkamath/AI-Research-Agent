try:
    from langchain_community.document_loaders import ArxivLoader, WikipediaLoader
    from langchain_community.tools import DuckDuckGoSearchResults
    IMPORTS_AVAILABLE = True
except ImportError as e:
    IMPORTS_AVAILABLE = False
    IMPORT_ERROR = str(e)


def fetch_from_arxiv(query: str, max_results: int = 3):
    if not IMPORTS_AVAILABLE:
        return [f"ArXiv access unavailable. Missing dependencies: {IMPORT_ERROR}. Install with: pip install arxiv"]
    
    try:
        loader = ArxivLoader(query=query, max_results=max_results)
        docs = loader.load()
        return [d.page_content for d in docs]
    except Exception as e:
        return [f"Error fetching from ArXiv: {str(e)}"]


def fetch_from_wikipedia(query: str, lang: str = "en"):
    if not IMPORTS_AVAILABLE:
        return [f"Wikipedia access unavailable. Missing dependencies: {IMPORT_ERROR}. Install with: pip install wikipedia"]
    
    try:
        loader = WikipediaLoader(query=query, lang=lang)
        docs = loader.load()
        return [d.page_content for d in docs]
    except Exception as e:
        return [f"Error fetching from Wikipedia: {str(e)}"]


def fetch_from_web(query: str, max_results: int = 3):
    if not IMPORTS_AVAILABLE:
        return [f"Web search unavailable. Missing dependencies: {IMPORT_ERROR}. Install with: pip install duckduckgo-search"]
    
    try:
        search = DuckDuckGoSearchResults()
        results = search.run(query, max_results=max_results)
        return results
    except Exception as e:
        return [f"Error fetching from web: {str(e)}"]


def retrieve_from_sources(query: str, sources: list[str] = ["arxiv", "wikipedia"]):
    """
    Retrieve information from multiple sources based on the query.
    
    Args:
        query: The search query
        sources: List of sources to search from. Supported: "arxiv", "wikipedia", "web"
    
    Returns:
        Dictionary with results from each source
    """
    results = {}
    
    for source in sources:
        try:
            if source == "arxiv":
                results[source] = fetch_from_arxiv(query)
            elif source == "wikipedia":
                results[source] = fetch_from_wikipedia(query)
            elif source == "web":
                results[source] = fetch_from_web(query)
            else:
                results[source] = f"Unknown source: {source}"
        except Exception as e:
            results[source] = f"Error retrieving from {source}: {str(e)}"
    
    return results
