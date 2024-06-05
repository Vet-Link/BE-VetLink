GOOGLE_PROJECT_ID=vetlink-425416
CLOUD_RUN_SERVICE=vetlink-be-service
INSTANCE_CONNECTION_NAME=vetlink-425416:asia-southeast2:patient-db
DB_USER=program-user
DB_PASS=12345678
DB_NAME=userDB

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
 --project=$GOOGLE_PROJECT_ID

 gcloud run deploy $CLOUD_RUN_SERVICE \
  --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --update-env-vars INSTANCE_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,DB_PASS=$DB_PASS,DB_USER=$DB_USER,DB_NAME=$DB_NAME \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --project=$GOOGLE_PROJECT_ID