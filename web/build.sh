# install node modules
npm install

# install angular cli
NG_CLI_ANALYTICS=ci sudo npm install -g @angular/cli

# build project
ng build --prod --base-href /