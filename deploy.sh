# deploy web
cd web
./deploy.sh
if [ $? -ne 0 ]
then
  echo "Deploy Web Failed" >&2
  exit 1
fi
cd ..

# deploy api
cd api
./deploy.sh
if [ $? -ne 0 ]
then
  echo "Deploy API Failed" >&2
  exit 1
fi
cd ..