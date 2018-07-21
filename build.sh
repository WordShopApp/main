# build web
cd ./web
./build.sh
if [ $? -ne 0 ]
then
  echo "Build Web Failed" >&2
  exit 1
fi
cd ..

# build api
cd api
./build.sh
if [ $? -ne 0 ]
then
  echo "Build API Failed" >&2
  exit 1
fi
cd ..