import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # loads GOOGLE_API_KEY from your .env file
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

models = genai.list_models()

for model in models:
    print(model.name, model.supported_generation_methods)
