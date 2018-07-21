# lint web
cd web
./lint.sh
if [ $? -ne 0 ]
then
  echo "Lint Web Failed" >&2
  exit 1
fi
cd ..

# lint api
cd api
./lint.sh
if [ $? -ne 0 ]
then
  echo "Lint API Failed" >&2
  exit 1
fi
cd ..
