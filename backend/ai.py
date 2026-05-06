from groq import Groq
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_tasks(text):
    try:
        prompt = f"""
You are a legal assistant.

Extract actionable tasks from this court judgment.

Return STRICT JSON like:
[
  {{
    "title": "",
    "description": "",
    "deadline": ""
  }}
]

TEXT:
{text}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"AI ERROR: {str(e)}"