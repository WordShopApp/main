# WordShop

[![CircleCI](https://circleci.com/gh/WordShopApp/main/tree/master.svg?style=svg&circle-token=62aa93b79fc559a39add5f170f19c7bbc173f5d7)](https://circleci.com/gh/WordShopApp/main/tree/master)

WordShop is a tool for workshopping your writing projects. With it you can exchange thoughtful critiques of works-in-progress with  fellow authors and readers. Any kind of writing is welcome, whether non-fiction or fiction, blogpost or poetry, ad copy or novel. As long as it's made with words you can workshop it here.


## Development Setup

### Prerequisites

First, ensure you have the correct version of [NodeJS](https://nodejs.org/en/) installed via [NVM](https://github.com/creationix/nvm). The version you should install is found in ```~/main/.nvmrc```. Then follow the instructions for API and Web below.

#### API

```
$ cd ~/main/api
```

Install Node Modules for API

```
$ npm install
```

Install Serverless globally

```
$ npm install -g serverless
```

Install DynamoDb local

```
$ sls dynamodb install
```

Install DynamoDb admin globally

```
$ npm install -g dynamodb-admin
```

#### Web

```
$ cd ~/main/web
```

Install Node Modules for Web

```
$ npm install
```

Install Angular CLI globally

```
$ npm install -g @angular/cli
```


### Startup

To startup the local development environment, run the following:

```
$ cd ~/main
$ ./dev.sh
```

- Web: ```http://localhost:4200```
- API: ```http://localhost:3000```
- DynamoDb Admin: ```http://localhost:8001```
- DynamoDb Shell: ```http://localhost:8000/shell```



### Shutdown

To shutdown the local development environment, enter ```Ctrl+C```.
