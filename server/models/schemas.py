from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class StandupInput (BaseModel):
    raw_text: str

class BlockerItem(BaseModel):
    description: str,
    severity: str

class StandupOutput(BaseModel):
    id: Optional[str] = None
    engineer_name: str
    raw_text: str
    summary: str
    tasks_completed: List[str]
    tasks_planned: List[str]
    blockers: List[BlockerItem]
    has_blockers: bool
    created_at: Optional[datetime] = None
