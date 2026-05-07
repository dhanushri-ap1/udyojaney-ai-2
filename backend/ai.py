from groq import Groq
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_tasks(text):
    try:
        prompt = f"""You are a legal compliance assistant. Extract every actionable task from the court judgment below.

RULES:
- Return ONLY a valid JSON array. No explanation, no preamble, no markdown, no backticks.
- Start your response with [ and end with ]
- Each object must have exactly these keys: "title", "description", "deadline"
- If no deadline is mentioned, use "Not specified"
- If the judgment has no actionable tasks, return []

EXAMPLE OUTPUT:
[
  {{
    "title": "Submit compliance report",
    "description": "The Executive Engineer shall submit a compliance report to the District Court.",
    "deadline": "30 days from order date"
  }}
]

JUDGMENT TEXT:
{text}"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a JSON-only API. You must respond with a valid JSON array and nothing else. Never add explanations, markdown, or backticks."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if model still adds them
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        raw = raw.strip()

        # Extract JSON array even if model prefixes text
        match = re.search(r"\[.*\]", raw, re.DOTALL)
        if match:
            raw = match.group(0)

        # Validate it parses
        tasks = json.loads(raw)
        if not isinstance(tasks, list):
            return "[]"

        return json.dumps(tasks)

    except Exception as e:
        return f"AI ERROR: {str(e)}"