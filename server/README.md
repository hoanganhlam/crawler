# API Example with Nodejs and MongoDB
* * *
## System requirement
- Nodejs >= 8.*
- mongoose

## Folder structure
/controllers	: controller for api
/cores			: do not change any thing in this folder
/helpers		: function for helping other
/models			: model for working with ORM (mongoose) DB
/routes			: route of api

## Config
- Create a config file as name: '.env.development' (FOR DEVELOPMENT) or '.env.production' (FOR PRODUCTION) has contents like the contents of .env.example file
which contains all configs of the project.

- Run command install package:
> npm install
        
## Run server
1. For dev
> npm run dev

2. For prod
> npm run prod

## Test api
You must import "api-example.postman_collection.json" to Postman application to test api.

[
    {
        ""
    }
]
