from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter
from test_index import ask

app =FastAPI()
router = APIRouter()

@router.get("/health")
def get_health():
    return {"Health": "OK"}

class RagInput(BaseModel):
   question: str

@router.post("/chat")
async def chat_response(output: RagInput):
   try:
      response = ask(output.question)
      return response
   except Exception as e:
      raise HTTPException(status_code=500, detail=f"The error occured because of this {e}")
   
app.include_router(router=router, prefix="/api")