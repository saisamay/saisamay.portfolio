from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, JSON, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from jose import JWTError, jwt
import os
from datetime import datetime, timedelta
from typing import Optional
import uuid

# Load env
load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://saisamay.me",
        "https://www.saisamay.me"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= DATABASE =================

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise Exception("DATABASE_URL not set")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    is_admin = Column(Boolean, default=False)
    last_login = Column(DateTime)

class PortfolioContent(Base):
    __tablename__ = "portfolio_content"
    id = Column(String, primary_key=True, index=True)
    section = Column(String, index=True)
    data = Column(JSON)

@app.on_event("startup")
def startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"DB INIT ERROR: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= CONFIG =================

ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
SECRET_KEY = os.getenv("SECRET_KEY")

if not ADMIN_EMAIL or not ADMIN_PASSWORD or not SECRET_KEY:
    raise Exception("Missing required environment variables")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# ================= MODELS =================

class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = None

# ================= JWT =================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_session(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        is_admin = payload.get("is_admin")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"email": email, "is_admin": is_admin}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def verify_admin(user: dict = Depends(verify_session)):
    if not user["is_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ================= AUTH =================

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        valid = validate_email(request.email, check_deliverability=False)
        email = valid.normalized
    except EmailNotValidError as e:
        raise HTTPException(status_code=400, detail=str(e))

    is_admin = (email == ADMIN_EMAIL)

    if is_admin:
        if request.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Admin password incorrect")

    # Optional DB tracking
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, is_admin=is_admin)
        db.add(user)

    user.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token({
        "sub": email,
        "is_admin": is_admin
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_admin": is_admin,
        "email": email
    }

@app.get("/api/auth/check-session")
async def check_session(user: dict = Depends(verify_session)):
    return user

# ================= CONTENT =================

@app.get("/api/content/{section}")
async def get_content(section: str, db: Session = Depends(get_db), user: dict = Depends(verify_session)):
    items = db.query(PortfolioContent).filter(PortfolioContent.section == section).all()
    data_list = [item.data for item in items]

    if section == "about":
        return data_list[0] if data_list else {
            "title": "Welcome",
            "description": "Edit in Admin Panel",
            "skills": []
        }

    return data_list

@app.post("/api/content/{section}")
async def add_content(section: str, data: dict, db: Session = Depends(get_db), user: dict = Depends(verify_admin)):
    item_id = str(uuid.uuid4())
    data['id'] = item_id

    new_item = PortfolioContent(id=item_id, section=section, data=data)
    db.add(new_item)
    db.commit()

    return {"message": "Added successfully", "id": item_id}

@app.put("/api/content/{section}/{item_id}")
async def update_content(section: str, item_id: str, data: dict, db: Session = Depends(get_db), user: dict = Depends(verify_admin)):
    item = db.query(PortfolioContent).filter(PortfolioContent.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404)

    data['id'] = item_id
    item.data = data
    db.commit()

    return {"message": "Updated successfully"}

@app.delete("/api/content/{section}/{item_id}")
async def delete_content(section: str, item_id: str, db: Session = Depends(get_db), user: dict = Depends(verify_admin)):
    item = db.query(PortfolioContent).filter(PortfolioContent.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404)

    db.delete(item)
    db.commit()

    return {"message": "Deleted successfully"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}