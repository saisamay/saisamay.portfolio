from fastapi import FastAPI, HTTPException, Depends, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, JSON, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional, List
import uuid

load_dotenv()

app = FastAPI()

# Updated CORS for Global Deployment
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

# --- Database Configuration ---
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://samay:eWMb6FHcGSrOWTocYtisb4u0wcxqNXGq@dpg-d7baochr0fns73f00mkg-a/portfolio_db_0sqt')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Database Models ---
class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    otp = Column(String)
    otp_expiry = Column(DateTime)
    session_token = Column(String, unique=True, index=True)
    is_admin = Column(Boolean, default=False)
    last_login = Column(DateTime)

class PortfolioContent(Base):
    __tablename__ = "portfolio_content"
    id = Column(String, primary_key=True, index=True)
    section = Column(String, index=True) # 'about', 'projects', 'education', etc.
    data = Column(JSON) # Stores the full object

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Configuration & Pydantic Models ---
GMAIL_USER = os.getenv('GMAIL_USER', 'amritacampus.companion@gmail.com')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', 'jszzuovpyeaekqzp') 
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'saisamaysilla@gmail.com')

class EmailRequest(BaseModel):
    email: EmailStr

class OTPVerification(BaseModel):
    email: EmailStr
    otp: str

# --- Helper Functions ---
def send_email(to_email, subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

def verify_session(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = db.query(User).filter(User.session_token == token).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user

def verify_admin(user: User = Depends(verify_session)):
    if user.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/send-otp")
async def send_otp(request: EmailRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    email = request.email
    otp = ''.join(random.choices(string.digits, k=6))
    expiry = datetime.now() + timedelta(minutes=10)
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, is_admin=(email == ADMIN_EMAIL))
        db.add(user)
    
    user.otp = otp
    user.otp_expiry = expiry
    db.commit()
    
    subject = "Samay's-Portfolio OTP"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: white; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 10px; border: 1px solid #e31837;">
                <h2 style="color: #E31837; text-align: center;">🕷️ Authentication Required</h2>
                <p style="color: #cbd5e1; text-align: center;">Use the following OTP to access the portfolio:</p>
                <h1 style="color: #38bdf8; font-size: 40px; letter-spacing: 8px; text-align: center; background-color: #0f172a; padding: 15px; border-radius: 5px;">{otp}</h1>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">This code expires in 10 minutes. Do not share it with anyone.</p>
            </div>
        </body>
    </html>
    """
    
    # Send the OTP email in the background
    background_tasks.add_task(send_email, email, subject, body)
    
    if email != ADMIN_EMAIL:
        admin_subject = "🕷️ New Visitor Alert"
        admin_body = f"Visitor email: {email} at {datetime.now()}"
        # Send the admin alert in the background
        background_tasks.add_task(send_email, ADMIN_EMAIL, admin_subject, admin_body)
    
    return {"message": "OTP sent successfully"}
@app.post("/api/auth/verify-otp")
async def verify_otp(request: OTPVerification, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or user.otp != request.otp or datetime.now() > user.otp_expiry:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    
    session_token = str(uuid.uuid4())
    user.session_token = session_token
    user.last_login = datetime.now()
    db.commit()
    
    return {
        "session_token": session_token,
        "is_admin": user.is_admin,
        "email": user.email
    }

@app.get("/api/auth/check-session")
async def check_session(user: User = Depends(verify_session)):
    return {"email": user.email, "is_admin": user.is_admin}

# ==================== CONTENT ENDPOINTS ====================

@app.get("/api/content/{section}")
async def get_content(section: str, db: Session = Depends(get_db), user: User = Depends(verify_session)):
    items = db.query(PortfolioContent).filter(PortfolioContent.section == section).all()
    data_list = [item.data for item in items]
    
    if section == "about":
        return data_list[0] if data_list else {"title": "Welcome", "description": "Edit in Admin Panel", "skills": []}
    return data_list

@app.post("/api/content/{section}")
async def add_content(section: str, data: dict, db: Session = Depends(get_db), user: User = Depends(verify_admin)):
    item_id = str(uuid.uuid4())
    data['id'] = item_id
    new_item = PortfolioContent(id=item_id, section=section, data=data)
    db.add(new_item)
    db.commit()
    return {"message": "Added successfully", "id": item_id}

@app.put("/api/content/{section}/{item_id}")
async def update_content(section: str, item_id: str, data: dict, db: Session = Depends(get_db), user: User = Depends(verify_admin)):
    item = db.query(PortfolioContent).filter(PortfolioContent.id == item_id).first()
    if not item: raise HTTPException(status_code=404)
    data['id'] = item_id
    item.data = data
    db.commit()
    return {"message": "Updated successfully"}

@app.delete("/api/content/{section}/{item_id}")
async def delete_content(section: str, item_id: str, db: Session = Depends(get_db), user: User = Depends(verify_admin)):
    item = db.query(PortfolioContent).filter(PortfolioContent.id == item_id).first()
    if not item: raise HTTPException(status_code=404)
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Spider-Portfolio API is active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)