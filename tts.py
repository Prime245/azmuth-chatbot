# tts.py
from dotenv import load_dotenv
load_dotenv()  # ⬅️ Load .env file

import requests
import os

ELEVEN_API_KEY = "sk_8aa518d8bca2b7d70fb1380e1b9b1b7a0c13314e379c9df9"
VOICE_ID = "XoRW0lnqsRh57iNm2EDU"

def generate_audio(text, output_path="static/audio/azmuth.mp3"):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.35,
            "similarity_boost": 0.65
        }
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Azmuth voice saved to {output_path}")
    else:
        print("❌ ElevenLabs TTS failed:", response.status_code, response.text)
