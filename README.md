# Blog Backend

## Blog Backend
is a backend project designed to create a REST API that facilitates the creation of blog for articles. Users are able to add new articles, view articles, update articles and delete articles.

## File ENV
Create a file named '.env' and fill it by referring to the contents of the '.env.example' file for configuration in config.js

# Endpoint Users

### Create Database
```cmd
npx sequelize db:create
```

### Migrate Database
```cmd
npx sequelize db:migrate
```

## Register Users
```js
localhost:3000/users/register
```

Body
```json
{
    "fullname": "string",
    "email": "string",
    "password": "string"
}
```

## Login Users
```js
localhost:3000/users/login
```

Body
```json
{
    "email": "string",
    "password": "string",
}
```

# Endpoint Article

## Add Article

POST

```js
localhost:3000/articles
```

Authorization
```js
<token>
```

Body
```json
{
    "title": "string",
    "description": "text",
    "image_url": "text",
}
```

## Get All Article

GET

```js
localhost:3000/articles
```

Authorization
```js
<token>
```

## Get Article By Id

GET

```js
localhost:3000/articles/:id
```

Authorization
```js
<token>
```

Params
```js
id = 'integer'
```

## Update Article

PUT or PATCH

```js
localhost:3000/articles/:id
```

Authorization
```js
<token>
```

Params
```js
id = 'integer'
```

Body
```json
{
    "title": "string",
    "description": "text",
    "image_url": "text"
}
```

## Delete Article

DELETE
```js
localhost:3000/articles/:id
```

Authorization
```js
<token>
```

Params
```js
id = 'integer'
```