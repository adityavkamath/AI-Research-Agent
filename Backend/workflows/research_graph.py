from langgraph.graph import StateGraph, END
from workflows import nodes

def build_research_graph(db, user_id: int, query: str):
    graph = StateGraph(dict)

    graph.add_node("fetch", nodes.fetch_papers_node)

    graph.add_node("summarize", nodes.summarize_node)

    graph.add_node("critic", nodes.critic_node)

    graph.add_node("persist", nodes.persistence_node)

    graph.set_entry_point("fetch")
    graph.add_edge("fetch", "summarize")
    graph.add_edge("summarize", "critic")

    def critic_condition(state: dict):
        review = state.get("critic_review", {})
        return "summarize" if not review.get("ok", True) else "persist"

    graph.add_conditional_edges(
        "critic",
        critic_condition,
        {"summarize": "summarize", "persist": "persist"}
    )

    graph.add_edge("persist", END)

    compiled_graph = graph.compile()

    initial_state = {
        "db": db,
        "user_id": user_id,
        "query": query,
        "session_id": None,
    }

    return compiled_graph, initial_state
