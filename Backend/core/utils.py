import logging
import time
from functools import wraps
from loguru import logger
import tiktoken

logging.basicConfig(level=logging.INFO)
logger.add("logs/app.log", rotation="1 MB", retention="7 days", level="INFO")


def count_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Count tokens in a text for cost estimation.
    """
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))


def retry(max_retries=3, delay=2, backoff=2):
    """
    Retry decorator with exponential backoff.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries, wait = 0, delay
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logger.warning(f"Error: {e}. Retrying in {wait}s...")
                    time.sleep(wait)
                    retries += 1
                    wait *= backoff
            raise RuntimeError(f"Function {func.__name__} failed after {max_retries} retries")
        return wrapper
    return decorator
