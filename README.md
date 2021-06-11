# API

BaseURL localhost:5000/api

- /register
- /login
- /history
- /text

Status code:

- 200: OK

- 400: data error

- 500: server error

POST: /register
--- 
---

``` bash
localhost:5000/api/register
```
Type: **POST**

Body:

-  **login**: String, required
  
- **password**: String, required

POST: /login
---
---

``` bash
localhost:5000/api/login
```

Type: **POST**

-  **login**: String, required

- **password**: String, required

Response:

- JWT token

POST: /text
---
---

``` bash
localhost:5000/api/text
```

Description: create text

Type: **POST**

Body:

-  **name**: String, required

PUT: /text
---
---

``` bash
localhost:5000/api/text
```

Description: edit text 

Type: **PUT**

Body:

-  **id**: String, required
   
-  **name**: String
   
-  **text**: String
   
-  **time**: Number

Response:

- **text**: Object

DELETE: /text
---
---

``` bash
localhost:5000/api/text
```

Description: delete text

Type: **DELETE**

Body:

-  **id**: String, required

GET: /text
---
---

``` bash
localhost:5000/api/text
```

Description: get all text

Type: **GET**

Response:

- **text**: Array

GET: /text/:id
---
---

``` bash
localhost:5000/api/text/:id
```

Description: get text by id

Type: **GET**

Response:

- **text**: Object

POST: /history
---
---

``` bash
localhost:5000/api/history
```

Description: create history

Type: **POST**

Body:

-  **name**: String, required
   
-  **err**: Number, required
   
-  **idText**: String, required
   
-  **time**: Number, required
   
-  **litters**: Number, required

DELETE: /history
---
---

``` bash
localhost:5000/api/history
```

Description: delete history

Type: **DELETE**

Body:

-  **id**: String, required

GET: /history
---
---

``` bash
localhost:5000/api/history
```

Description: get history

Type: **GET**

Query params:

-  **size**: Number, required
-  **page**: Number, required
