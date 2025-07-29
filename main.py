from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# FastAPI app setup
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Serve index.html
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Define input schema
class Question(BaseModel):
    message: str

# Handle chat requests
@app.post("/chat")
async def chat(q: Question):
    try:
        # Fastest model currently: gemini-2.5-flash
        model = genai.GenerativeModel("models/gemini-2.5-flash")

        prompt = f"Reply concisely and clearly:\n\n{q.message}"
        response = model.generate_content(prompt)

        reply_text = getattr(response, "text", None)

        if not reply_text:
            raise ValueError("Gemini API did not return any text.")

        return JSONResponse(content={"reply": reply_text})

    except Exception as e:
        print("Chat error:", e)
        raise HTTPException(status_code=500, detail="Something went wrong with Gemini.")
