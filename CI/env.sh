#!/bin/ash
APP="notificas"
FOLDER=""
ENVIRONMENT=""

if [[ $CI_COMMIT_REF_NAME == "master" ]]; then
  FOLDER="app/production"
  ENVIRONMENT="production"
  API="https://15cbaeaij4.execute-api.us-east-1.amazonaws.com/production/"
elif [[ $CI_COMMIT_REF_NAME == "1-createcicd-pipeline-in-gitlab" ]]; then
  FOLDER="app/production"
  ENVIRONMENT="production"
  API="https://15cbaeaij4.execute-api.us-east-1.amazonaws.com/production/"
elif [[ $CI_COMMIT_REF_NAME == "staging" ]]; then
  FOLDER="app/staging"
  ENVIRONMENT="staging"
  API="https://9lh6ez2ztd.execute-api.us-east-1.amazonaws.com/staging"
else
  FOLDER="app/staging"
  ENVIRONMENT="staging"
  API="https://9lh6ez2ztd.execute-api.us-east-1.amazonaws.com/staging"
fi
#astros/astros-app/src/app/services/global.service.ts
echo export FOLDER=$FOLDER;
echo export ENVIRONMENT=$ENVIRONMENT;
echo export APP=$APP;
echo export API=$API;