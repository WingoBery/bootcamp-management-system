from fastapi import APIRouter, Depends
from schemas.activity_schema import ActivityCreate,ActivityResponse
from database.session import get_db
from sqlalchemy.orm import Session
from services import activity_service 


router = APIRouter(prefix="/activity")

# Create Activity
@router.post("/", response_model= ActivityResponse)
def create_activity(activity:ActivityCreate, db: Session = Depends(get_db)):
    return activity_service.create_activity(activity,db)

# Update Activity
@router.put("/{id}",  response_model= ActivityResponse)
def modify_activity(id: int, activity: ActivityCreate, db: Session = Depends(get_db)):
    return activity_service.update_activity(id, activity, db)

# Get All Activities
@router.get("/", response_model= ActivityResponse)
def list_activities(db: Session = Depends(get_db)):
    return activity_service.list_activities(db)

# Get Specific Activity 
@router.get("/{id}",  response_model= ActivityResponse)
def get_specific_activity(id: int, db: Session = Depends(get_db)):
    return activity_service.unique_activity(id, db)

# Delete Item 
@router.delete("/{id}")
def remove_Activity(id: int, db: Session = Depends(get_db)):
    return activity_service.delete_activity(id,db)
