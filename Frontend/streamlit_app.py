import os
import time
import requests
import streamlit as st

st.set_page_config(
    page_title="AI Research Orchestrator",
    page_icon="🧠",
    layout="wide",
)

st.markdown(
    """
    <style>
        .bubble { padding: 12px 14px; border-radius: 14px; margin: 6px 0; max-width: 900px; line-height: 1.4; }
        .user    { background: #1f6feb; color: white; border-top-right-radius: 4px; }
        .assistant { background: #0d1117; border: 1px solid #30363d; color: #c9d1d9; border-top-left-radius: 4px; }
        .meta { font-size: 12px; color: #8b949e; margin-top: 2px; }
        .divider { border-top: 1px solid #30363d; margin: 10px 0 14px 0; }
        .pill { display:inline-block; padding: 3px 8px; border-radius: 999px; border: 1px solid #30363d; color:#8b949e; font-size:12px; margin-right:6px; }
        .card { border: 1px solid #30363d; background:#0d1117; padding: 14px; border-radius: 12px; }
        .muted { color:#8b949e; }
        .hrow { display:flex; gap:12px; align-items:center; }
    </style>
    """,
    unsafe_allow_html=True,
)

DEFAULT_API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000")
DEFAULT_USER_ID = int(os.getenv("UI_USER_ID", "1"))

if "api_base" not in st.session_state:
    st.session_state.api_base = DEFAULT_API_BASE
if "user_id" not in st.session_state:
    st.session_state.user_id = DEFAULT_USER_ID
if "history" not in st.session_state:
    st.session_state.history = []
if "selected_session_id" not in st.session_state:
    st.session_state.selected_session_id = None
if "busy" not in st.session_state:
    st.session_state.busy = False


def api_base() -> str:
    return st.session_state.api_base.rstrip("/")


def get_history(user_id: int):
    try:
        url = f"{api_base()}/api/history/{user_id}"
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        st.error(f"Failed to load history: {e}")
        return []


def post_chat(user_id: int, query: str):
    try:
        url = f"{api_base()}/api/chat"
        payload = {"user_id": user_id, "query": query}
        resp = requests.post(url, json=payload, timeout=120)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        st.error(f"Chat request failed: {e}")
        return None


def refresh_history_and_select(session_id=None):
    st.session_state.history = get_history(st.session_state.user_id)
    if session_id is None:
        if st.session_state.history:
            st.session_state.selected_session_id = st.session_state.history[0][
                "session_id"
            ]
        else:
            st.session_state.selected_session_id = None
    else:
        st.session_state.selected_session_id = session_id


with st.sidebar:
    st.markdown("## ⚙️ settings")
    st.session_state.api_base = st.text_input(
        "Backend base URL", st.session_state.api_base
    )
    st.session_state.user_id = st.number_input(
        "User ID", value=st.session_state.user_id, min_value=1, step=1
    )
    colA, colB = st.columns(2)
    with colA:
        if st.button("🔄 Refresh history"):
            refresh_history_and_select(st.session_state.selected_session_id)
    with colB:
        if st.button("🧹 Clear selection"):
            st.session_state.selected_session_id = None

    st.markdown("---")
    st.markdown("## 📚 Sessions")

    if not st.session_state.history:
        refresh_history_and_select()

    if not st.session_state.history:
        st.caption("No sessions yet. Run your first query from the input bar below.")
    else:
        for sess in st.session_state.history:
            sid = sess["session_id"]
            is_sel = sid == st.session_state.selected_session_id
            label = f"#{sid} • {sess['created_at']}"

            btn = st.button(("✅ " if is_sel else "🗂️ ") + label, key=f"sess_{sid}")
            if btn:
                st.session_state.selected_session_id = sid

st.title("🧠 AI Research Orchestrator")
st.caption(
    "LangChain + LangGraph • Retrieval → Summarization → Critic • Postgres persistence"
)

k1, k2, k3 = st.columns(3)
with k1:
    st.markdown(
        f"<div class='card'><div class='muted'>Active user</div><h3>#{st.session_state.user_id}</h3></div>",
        unsafe_allow_html=True,
    )
with k2:
    total_sessions = len(st.session_state.history)
    st.markdown(
        f"<div class='card'><div class='muted'>Total sessions</div><h3>{total_sessions}</h3></div>",
        unsafe_allow_html=True,
    )
with k3:
    last_url = st.session_state.api_base
    st.markdown(
        f"<div class='card'><div class='muted'>Backend</div><div>{last_url}</div></div>",
        unsafe_allow_html=True,
    )

st.markdown("<div class='divider'></div>", unsafe_allow_html=True)

left, right = st.columns([7, 5])

with left:
    st.subheader("🗨️ Chat")
    selected = None
    for sess in st.session_state.history:
        if sess["session_id"] == st.session_state.selected_session_id:
            selected = sess
            break

    if selected is None and st.session_state.history:
        selected = st.session_state.history[0]
        st.session_state.selected_session_id = selected["session_id"]

    if selected:
        msgs = selected.get("messages", [])
        if not msgs:
            st.info("No messages in this session yet.")
        else:
            msgs = sorted(msgs, key=lambda m: m.get("timestamp", ""))

            for m in msgs:
                role = m.get("role", "assistant")
                content = m.get("content", "")
                timestamp = m.get("timestamp", "")

                bubble_cls = "assistant"
                who = "Assistant"
                if role.lower() in ["user", "retriever", "critic"]:
                    bubble_cls = "user" if role.lower() == "user" else "assistant"
                    who = role.capitalize()

                st.markdown(
                    f"<div class='bubble {bubble_cls}'><b>{who}</b><br/>{content}</div>"
                    f"<div class='meta'>{timestamp}</div>",
                    unsafe_allow_html=True,
                )
    else:
        st.info("No session selected. Submit a query to start.")

with right:
    st.subheader("📌 Session summary")
    if selected:
        final = None
        for m in reversed(selected.get("messages", [])):
            if m.get("role") == "assistant":
                final = m.get("content")
                break
        if final:
            st.markdown(final)
        else:
            st.caption("No assistant summary saved yet.")

    st.markdown("<div class='divider'></div>", unsafe_allow_html=True)
    st.subheader("🔎 Tips")
    st.caption(
        '• Ask focused research questions\n• Try: *"State of the art LLM routing techniques 2024"*'
    )

st.markdown("<div class='divider'></div>", unsafe_allow_html=True)
with st.form("chat_form", clear_on_submit=True):
    query = st.text_input(
        "Type your research query",
        placeholder="e.g., Applications of graph RAG in healthcare",
    )
    submitted = st.form_submit_button("Run research 🚀", use_container_width=True)

    if submitted and query.strip():
        st.session_state.busy = True
        with st.spinner("Running LangGraph workflow…"):
            res = post_chat(st.session_state.user_id, query.strip())
            time.sleep(0.2)
            if res and "session_id" in res:
                refresh_history_and_select(session_id=res["session_id"])
            else:
                refresh_history_and_select()
        st.session_state.busy = False
        st.rerun()
