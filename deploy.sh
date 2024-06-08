GOOGLE_PROJECT_ID=vetlink-425416
CLOUD_RUN_SERVICE=vetlink-be-service
PORT=8000
SECRETKEY=
HOST=
PASS=
SALT=7


gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
 --project=$GOOGLE_PROJECT_ID

gcloud run deploy $CLOUD_RUN_SERVICE \
 --image gcr.io/$GOOGLE_PROJECT_ID/$CLOUD_RUN_SERVICE \
 --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
 --update-env-vars  PORT=$PORT, SECRETKEY=$SECRETKEY, HOST=$HOST, PASS=$PASS, SALT=$SALT\
 --platform managed \
 --region asia-southeast2 \
 --allow-unauthenticated \
 --project=$GOOGLE_PROJECT_ID