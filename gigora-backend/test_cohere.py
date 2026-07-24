import os
from dotenv import load_dotenv
from cohere import ClientV2

load_dotenv()

co = ClientV2(api_key=os.getenv("COHERE_API_KEY"))

response = co.chat(
    model="command-a-03-2025",
    messages=[
        {
            "role": "user",
            "content": "Write a short proposal for a website development project."
        }
    ]
)

print(response.message.content[0].text)
