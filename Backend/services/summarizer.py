from langchain_openai import ChatOpenAI
from core.config import get_settings

settings = get_settings()
llm = ChatOpenAI(openai_api_key=settings.OPENAI_API_KEY, temperature=0)


def chunk_text(text: str, max_chunk_size: int = 10000) -> list[str]:
    """Split text into chunks to fit within token limits."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        word_length = len(word) + 1
        if current_length + word_length > max_chunk_size and current_chunk:
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = word_length
        else:
            current_chunk.append(word)
            current_length += word_length
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    
    return chunks


def summarize_text(text: str, max_length: int = 200) -> str:
    """Summarize text, handling large texts by chunking."""
    if not text.strip():
        return "No content to summarize."

    if len(text) < 8000:
        prompt = f"Summarize the following text in under {max_length} words:\n\n{text}"
        try:
            response = llm.invoke(prompt)
            return response.content.strip()
        except Exception as e:
            return f"Error summarizing text: {str(e)}"

    chunks = chunk_text(text, max_chunk_size=8000)
    chunk_summaries = []
    
    for i, chunk in enumerate(chunks):
        prompt = f"Summarize the following text (part {i+1} of {len(chunks)}):\n\n{chunk}"
        try:
            response = llm.invoke(prompt)
            chunk_summaries.append(response.content.strip())
        except Exception as e:
            chunk_summaries.append(f"Error summarizing chunk {i+1}: {str(e)}")

    combined_summaries = "\n\n".join(chunk_summaries)
    final_prompt = f"Create a comprehensive summary in under {max_length} words from these partial summaries:\n\n{combined_summaries}"
    
    try:
        response = llm.invoke(final_prompt)
        return response.content.strip()
    except Exception as e:
        return f"Error creating final summary: {str(e)}"
