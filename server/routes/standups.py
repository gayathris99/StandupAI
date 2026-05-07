from fastapi import APIRouter

router = APIRouter()

@router.post('/submit')
def submit_standup():
    return {"message": "Standup submitted successfully"}

@router.get('/all')
def get_all_standups():
    return {"message": "Standup history retrieved successfully"}
