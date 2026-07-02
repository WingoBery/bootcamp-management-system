from models.activity_model import Activity

# Create Activity
def create_activity(activity, db):
    new_activity = Activity(**activity.model_dump())
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity

# Update Activity
def update_activity(id, activity, db):
    record = db.query(Activity).filter(Activity.id == id).first() 
    try:
        #confirm record actually exist in data base
        if not record:
            raise ValueError (f"Record with {id} not found in the database")
        
        #The "exclude_unset" argument enables us to only update exist and also please remember this returns a dictionary
        update_data = activity.model_dump(exclude_unset = True)
        
        for key, value in update_data.items():
            
            if hasattr(record,key):
                setattr(record,key, value)

        db.commit()
        db.refresh(record)
        return record
    except Exception as e:
        db.rollback()
        return "Record with id,{id} not found in the database"
    
# List all activities 
def list_activities(db):
    total_activities = db.query(Activity).all()
    return total_activities

# Return Specific activity
def unique_activity(id, db):
    record = db.query(Activity).filter(Activity.id == id).first()
    return record

# Delete Activity 
def delete_activity(id,db):
    try: 
        record = db.query(Activity).filter(Activity.id == id).first()
        if not record:
            raise ValueError(f"Activity with {id} not found in database")
        db.delete(record)
        db.commit()
        return {"message": f"Activity with id {id}, deleted succesfully!"}
    except Exception as e:
        db.rollback()
        return "Activity with id {id} not found!"
       
