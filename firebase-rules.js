rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userID} {
    	allow read: if resource.data.is_doctor == true;
      allow read: if request.auth.uid == userID;
      allow update: if request.auth.uid == userID;
      allow create;
    }
    
    match /chat/{chatID} {
    	allow create: if request.auth.uid != null;
      // allow read,update: if request.auth.uid !=null;
    	allow read,update: if resource.data.patient_id == request.auth.uid;
      allow read,update: if resource.data.doctor_id == request.auth.uid; 
    }
    
    match /reports/{reportID} {
    	allow create: if request.auth.uid != null;
      // allow read,update: if request.auth.uid !=null;
    	allow read,update: if resource.data.patient_id == request.auth.uid;
    	allow read,update: if request.auth.uid in resource.data.allowed_doctors;  
    }
  }
}