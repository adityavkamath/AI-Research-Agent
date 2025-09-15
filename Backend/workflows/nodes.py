from services import persistence
from workflows.agents import RetrieverAgent, SummarizerAgent, CriticAgent

retriever = RetrieverAgent()
summarizer = SummarizerAgent()
critic = CriticAgent()

def fetch_papers_node(state: dict) -> dict:
    query = state["query"]
    try:
        results = retriever.run(query)
        return {**state, "retrieved_docs": results}
    except Exception as e:
        return {**state, "retrieved_docs": {"error": f"Failed to retrieve documents: {str(e)}"}}

def summarize_node(state: dict) -> dict:
    docs = state.get("retrieved_docs", {})
    combined_text = ""
    
    for source, content in docs.items():
        if isinstance(content, list):
            combined_text += f"\n--- {source.upper()} ---\n"
            combined_text += "\n".join(content)
        else:
            combined_text += f"\n--- {source.upper()} ---\n{content}"
    
    if combined_text.strip():
        try:
            summary = summarizer.run(combined_text)
        except Exception as e:
            summary = f"Error generating summary: {str(e)}"
    else:
        summary = "No content found to summarize."
    
    return {**state, "summary": summary}

def critic_node(state: dict) -> dict:
    summary = state.get("summary", "")
    review = critic.run(summary)
    return {**state, "critic_review": review}

def persistence_node(state: dict) -> dict:
    session_id = state["session_id"]

    try:
        persistence.save_message(
            session_id=session_id,
            content=state["query"],
            role="user"
        )

        if "summary" in state:
            persistence.save_message(
                session_id=session_id,
                content=state["summary"],
                role="assistant"
            )

            persistence.save_summary(
                session_id=session_id,
                summary=state["summary"]
            )

        return {**state, "saved": True}
    except Exception as e:
        return {**state, "saved": False, "error": f"Failed to save: {str(e)}"}
