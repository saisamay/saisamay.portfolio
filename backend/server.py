from fastapi import FastAPI, HTTPException, Depends, Header, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
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

# Load environment variables from a .env file if present
load_dotenv()

app = FastAPI()

# CORS configuration - Allows your React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, you can change this to your Vercel/Netlify domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client['portfolio_db']
users_collection = db['users']
portfolio_collection = db['portfolio']

# Email configuration defaults updated to your specifications
GMAIL_USER = os.getenv('GMAIL_USER', 'amritacampus.companion@gmail.com')
GMAIL_APP_PASSWORD = os.getenv('GMAIL_APP_PASSWORD', 'jszzuovpyeaekqzp') 
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'saisamaysilla@gmail.com')

# Pydantic models for data validation
class EmailRequest(BaseModel):
    email: EmailStr

class OTPVerification(BaseModel):
    email: EmailStr
    otp: str

class AboutContent(BaseModel):
    title: str
    description: str
    image: Optional[str] = ""
    skills: List[str] = []

class Project(BaseModel):
    title: str
    description: str
    images: List[str] = []
    videos: List[str] = []
    github_link: Optional[str] = ""
    deployed_link: Optional[str] = ""
    technologies: List[str] = []

class Education(BaseModel):
    institution: str
    degree: str
    period: str
    description: str

class Achievement(BaseModel):
    title: str
    description: str
    date: str
    image: Optional[str] = ""

class Hobby(BaseModel):
    title: str
    description: str
    image: Optional[str] = ""

# Helper functions
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def generate_session_token():
    return str(uuid.uuid4())

def send_email(to_email, subject, body):
    """Send email using Gmail SMTP"""
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        print("Gmail credentials not configured. Please check your .env file.")
        return False
    
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
        print(f"Error sending email: {e}")
        return False

def verify_session(authorization: Optional[str] = Header(None)):
    """Verify user session token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = users_collection.find_one({"session_token": token})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user

def verify_admin(user: dict = Depends(verify_session)):
    """Verify if user is admin"""
    if user.get('email') != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Initialize default portfolio content in MongoDB
def init_portfolio():
    if portfolio_collection.count_documents({}) == 0:
        portfolio_collection.insert_one({
            "about": {
                "title": "Welcome to My Portfolio",
                "description": "This is a placeholder. Admin can edit this content.",
                "image": "",
                "skills": ["Flutter", "Python", "Node.js"]
            },
            "projects": [],
            "education": [],
            "achievements": [],
            "hobbies": []
        })

init_portfolio()

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/send-otp")
async def send_otp(request: EmailRequest):
    """Send OTP to user's email"""
    email = request.email
    otp = generate_otp()
    expiry = datetime.now() + timedelta(minutes=10)
    
    # Store or update user with OTP
    users_collection.update_one(
        {"email": email},
        {"$set": {
            "email": email,
            "otp": otp,
            "otp_expiry": expiry,
            "is_admin": email == ADMIN_EMAIL
        }},
        upsert=True
    )
    
    # Send OTP email
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
    
    email_sent = send_email(email, subject, body)
    
    # Notify admin if a visitor is logging in
    if email != ADMIN_EMAIL and email_sent:
        admin_subject = "🕷️ New Visitor Alert: Samay's-Portfolio"
        admin_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #E31837;">New Portfolio Access Detected</h2>
                <p>Someone just requested an OTP to view your portfolio:</p>
                <p><strong>Visitor Email:</strong> {email}</p>
                <p><strong>Timestamp:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </body>
        </html>
        """
        send_email(ADMIN_EMAIL, admin_subject, admin_body)
    
    return {"message": "OTP sent successfully", "email": email}

@app.post("/api/auth/verify-otp")
async def verify_otp(request: OTPVerification):
    """Verify OTP and create session"""
    user = users_collection.find_one({"email": request.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user['otp'] != request.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    if datetime.now() > user['otp_expiry']:
        raise HTTPException(status_code=401, detail="OTP expired")
    
    # Generate session token
    session_token = generate_session_token()
    
    users_collection.update_one(
        {"email": request.email},
        {"$set": {
            "session_token": session_token,
            "last_login": datetime.now()
        }}
    )
    
    return {
        "message": "Authentication successful",
        "session_token": session_token,
        "is_admin": user.get('is_admin', False),
        "email": request.email
    }

@app.get("/api/auth/check-session")
async def check_session(user: dict = Depends(verify_session)):
    """Check if session is valid"""
    return {
        "email": user['email'],
        "is_admin": user.get('is_admin', False)
    }

@app.post("/api/auth/logout")
async def logout(user: dict = Depends(verify_session)):
    """Logout user"""
    users_collection.update_one(
        {"email": user['email']},
        {"$unset": {"session_token": ""}}
    )
    return {"message": "Logged out successfully"}

# ==================== CONTENT ENDPOINTS ====================

# About Section
@app.get("/api/content/about")
async def get_about(user: dict = Depends(verify_session)):
    portfolio = portfolio_collection.find_one()
    return portfolio.get('about', {})

@app.put("/api/content/about")
async def update_about(content: AboutContent, user: dict = Depends(verify_admin)):
    portfolio_collection.update_one({}, {"$set": {"about": content.model_dump()}})
    return {"message": "About section updated successfully"}

# Projects
@app.get("/api/content/projects")
async def get_projects(user: dict = Depends(verify_session)):
    portfolio = portfolio_collection.find_one()
    return portfolio.get('projects', [])

@app.post("/api/content/projects")
async def add_project(project: Project, user: dict = Depends(verify_admin)):
    project_data = project.model_dump()
    project_data['id'] = str(uuid.uuid4())
    portfolio_collection.update_one({}, {"$push": {"projects": project_data}})
    return {"message": "Project added successfully", "id": project_data['id']}

@app.put("/api/content/projects/{project_id}")
async def update_project(project_id: str, project: Project, user: dict = Depends(verify_admin)):
    project_data = project.model_dump()
    project_data['id'] = project_id
    portfolio_collection.update_one({"projects.id": project_id}, {"$set": {"projects.$": project_data}})
    return {"message": "Project updated successfully"}

@app.delete("/api/content/projects/{project_id}")
async def delete_project(project_id: str, user: dict = Depends(verify_admin)):
    portfolio_collection.update_one({}, {"$pull": {"projects": {"id": project_id}}})
    return {"message": "Project deleted successfully"}

# Education
@app.get("/api/content/education")
async def get_education(user: dict = Depends(verify_session)):
    portfolio = portfolio_collection.find_one()
    return portfolio.get('education', [])

@app.post("/api/content/education")
async def add_education(education: Education, user: dict = Depends(verify_admin)):
    education_data = education.model_dump()
    education_data['id'] = str(uuid.uuid4())
    portfolio_collection.update_one({}, {"$push": {"education": education_data}})
    return {"message": "Education added successfully", "id": education_data['id']}

@app.put("/api/content/education/{education_id}")
async def update_education(education_id: str, education: Education, user: dict = Depends(verify_admin)):
    education_data = education.model_dump()
    education_data['id'] = education_id
    portfolio_collection.update_one({"education.id": education_id}, {"$set": {"education.$": education_data}})
    return {"message": "Education updated successfully"}

@app.delete("/api/content/education/{education_id}")
async def delete_education(education_id: str, user: dict = Depends(verify_admin)):
    portfolio_collection.update_one({}, {"$pull": {"education": {"id": education_id}}})
    return {"message": "Education deleted successfully"}

# Achievements
@app.get("/api/content/achievements")
async def get_achievements(user: dict = Depends(verify_session)):
    portfolio = portfolio_collection.find_one()
    return portfolio.get('achievements', [])

@app.post("/api/content/achievements")
async def add_achievement(achievement: Achievement, user: dict = Depends(verify_admin)):
    achievement_data = achievement.model_dump()
    achievement_data['id'] = str(uuid.uuid4())
    portfolio_collection.update_one({}, {"$push": {"achievements": achievement_data}})
    return {"message": "Achievement added successfully", "id": achievement_data['id']}

@app.put("/api/content/achievements/{achievement_id}")
async def update_achievement(achievement_id: str, achievement: Achievement, user: dict = Depends(verify_admin)):
    achievement_data = achievement.model_dump()
    achievement_data['id'] = achievement_id
    portfolio_collection.update_one({"achievements.id": achievement_id}, {"$set": {"achievements.$": achievement_data}})
    return {"message": "Achievement updated successfully"}

@app.delete("/api/content/achievements/{achievement_id}")
async def delete_achievement(achievement_id: str, user: dict = Depends(verify_admin)):
    portfolio_collection.update_one({}, {"$pull": {"achievements": {"id": achievement_id}}})
    return {"message": "Achievement deleted successfully"}

# Hobbies
@app.get("/api/content/hobbies")
async def get_hobbies(user: dict = Depends(verify_session)):
    portfolio = portfolio_collection.find_one()
    return portfolio.get('hobbies', [])

@app.post("/api/content/hobbies")
async def add_hobby(hobby: Hobby, user: dict = Depends(verify_admin)):
    hobby_data = hobby.model_dump()
    hobby_data['id'] = str(uuid.uuid4())
    portfolio_collection.update_one({}, {"$push": {"hobbies": hobby_data}})
    return {"message": "Hobby added successfully", "id": hobby_data['id']}

@app.put("/api/content/hobbies/{hobby_id}")
async def update_hobby(hobby_id: str, hobby: Hobby, user: dict = Depends(verify_admin)):
    hobby_data = hobby.model_dump()
    hobby_data['id'] = hobby_id
    portfolio_collection.update_one({"hobbies.id": hobby_id}, {"$set": {"hobbies.$": hobby_data}})
    return {"message": "Hobby updated successfully"}

@app.delete("/api/content/hobbies/{hobby_id}")
async def delete_hobby(hobby_id: str, user: dict = Depends(verify_admin)):
    portfolio_collection.update_one({}, {"$pull": {"hobbies": {"id": hobby_id}}})
    return {"message": "Hobby deleted successfully"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Spider-Portfolio API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)