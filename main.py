from typing import Annotated
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, APIRouter, Form, Response, status, Request
from auth import AdminAuthzMiddleware, AdminSessionMiddleware, authenticate_admin, delete_admin_session
from config import settings
from test_index import ask

app =FastAPI()
router = APIRouter()

app.add_middleware(AdminAuthzMiddleware)
app.add_middleware(AdminSessionMiddleware)

@router.get("/health")
def get_health():
    return {"Health": "OK"}

class AdminLoginForm(BaseModel):
   username : str
   password : str

@router.post("/admin-login")
async def admin_login(response: Response, admin_login_form: Annotated[AdminLoginForm, Form()]):
   auth_response = authenticate_admin(admin_login_form.username, admin_login_form.password)
   if auth_response is not None:
      secure = settings.PRODUCTION
      cookie_value = response.set_cookie(key="admin_session", value=auth_response, httponly=True, secure=secure, samesite="Lax")
      return {"message": "Come to the dark side, we have cookies", "auth_response": auth_response}
   else:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

@router.post("/admin-logout")
async def admin_login(request: Request, response: Response):
    delete_admin_session(request.cookies.get("admin_session"))
    secure = settings.PRODUCTION
    response.delete_cookie(key="admin_session", httponly=True, secure=secure, samesite="lax")
    return {}

class RagInput(BaseModel):
   question: str

@router.post("/AI_response")
async def get_AI_response(output: RagInput):
   try:
      response = ask(output.question)
      return response
   except Exception as e:
      raise HTTPException(status_code=500, detail=f"The error occured because of this {e}")
   
app.include_router(router=router, prefix="/api")