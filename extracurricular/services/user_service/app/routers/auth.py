from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.security import create_access_token
from database.session import get_db
from schemas.user_schema import TokenResponse, UserLogin, UserRegister, UserResponse
from services import user_service

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    return user_service.register_user(user, db)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = user_service.authenticate_user(credentials.email, credentials.password, db)
    token = create_access_token(user.id, user.role)
    return TokenResponse(access_token=token)
