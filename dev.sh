./lint.sh
((cd ./api && ./dev.sh) & (cd ./web && ./dev.sh) & wait)