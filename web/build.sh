

# install node modules
NG_CLI_ANALYTICS=ci npm install

# install angular cli
NG_CLI_ANALYTICS=ci sudo npm install -g @angular/cli

# build project
ng build --prod --base-href /