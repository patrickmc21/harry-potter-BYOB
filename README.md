# HarryPotterDB

[![Build Status](https://travis-ci.org/patrickmc21/harry-potter-BYOB.svg?branch=master)](https://travis-ci.org/patrickmc21/harry-potter-BYOB)

## Contributors

* [Ngoc Phan](https://github.com/nphan24)
* [Patrick McLaughlin](https://github.com/patrickmc21)

## Introduction

This API contains information about the Hogwarts Houses and characters from the Harry Potter Universe. 

### Response formats

The default format is JSON `application/json`

### Authentication

The API requires a JSON Web token which can be acquired [here](https://potter-db.herokuapp.com/) or by sending a request to `POST https://potter-db.herokuapp.com/authenticate`. Request body should supply `email`  and `appName`.

All requests should deliver token in the request header `Authorization': token`

All write (POST/PUT/DELETE) requests require Admin status.

### All Routes

All routes should be prefixed with `https://potter-db.herokuapp.com/api/v1`

#### Houses Route

`GET /houses`

Gets all Hogwarts houses

Response example: 
``` 
[
    {
        "id": 1,
        "name": "Gryffindor",
        "founder": "Godric Gryffindor",
        "house_head": "Minerva McGonagall (? - 1998)",
        "colors": "Scarlet and gold",
        "ghost": "Nearly Headless Nick",
        "common_room": "Gryffindor Tower",
        "created_at": "2018-05-17T21:30:39.834Z",
        "updated_at": "2018-05-17T21:30:39.834Z"
    },
     {
        "id": 2,
        "name": "Hufflepuff",
        "founder": "Helga Hufflepuff",
        "house_head": "Pomona Sprout (? - before 2017)",
        "colors": "Yellow and black",
        "ghost": "Fat Friar",
        "common_room": "Hufflepuff Basement",
        "created_at": "2018-05-17T21:30:39.868Z",
        "updated_at": "2018-05-17T21:30:39.868Z"
    }
]
```

---

`GET /houses/:id`

Returns single Hogwarts House

Response example:
```
{
        "id": 1,
        "name": "Gryffindor",
        "founder": "Godric Gryffindor",
        "house_head": "Minerva McGonagall (? - 1998)",
        "colors": "Scarlet and gold",
        "ghost": "Nearly Headless Nick",
        "common_room": "Gryffindor Tower",
        "created_at": "2018-05-17T21:30:39.834Z",
        "updated_at": "2018-05-17T21:30:39.834Z"
}
```
---

`POST /houses`

  ```
  body: {
    name: 'string',
    founder: 'string'
    house_head: 'string',
    colors: 'string',
    ghost: 'string',
    common_room: 'string'
    }
```

Response body contains id.

---

`PUT /houses/:id`

```
body: { id[, name, founder, house_head, colors, ghost, common_room]}
```

House id is required for successful PUT request.

---

`DELETE /houses`


  ```
  body: {
   id: 'number'
    }
```
---

#### Characters Route

`GET /characters`

Gets all Hogwarts characters from API

Response example: 
``` 
[
    {
        "id": 1,
        "name": "Justin Finch-Fletchley",
        "birthday": "c.1980",
        "patronus": "NA",
        "parents": "Both Muggles",
        "skills": "NA",
        "hobbies": "NA",
        "blood": "NA",
        "wand": "NA",
        "image": "https://images.pottermore.com/bxd3o8b291gf/5AXc4ygT7O6gKciE6QaSS8/68e08d31990cdabaf54f35ab5b636459/Justin.jpg?w=320&h=320&fit=thumb&f=center&q=85",
        "house": "Hufflepuff",
        "house_id": 2,
        "created_at": "2018-05-17T21:30:39.917Z",
        "updated_at": "2018-05-17T21:30:39.917Z"
    },
    {
        "id": 2,
        "name": "Pomona Sprout",
        "birthday": "15 May",
        "patronus": "NA",
        "parents": "NA",
        "skills": "Herbology",
        "hobbies": "NA",
        "blood": "NA",
        "wand": "NA",
        "image": "https://images.pottermore.com/bxd3o8b291gf/6XPsCMy3sIqUcE8kgGEa80/bacb0ef3c39f257298ea1cf3d616cc77/PomonaSprout_WB_F1_PomonaSproutCharacterIllustration_Illust_080615_Port.jpg?w=320&h=320&fit=thumb&f=top&q=85",
        "house": "Hufflepuff",
        "house_id": 2,
        "created_at": "2018-05-17T21:30:39.929Z",
        "updated_at": "2018-05-17T21:30:39.929Z"
    }
]
```

Query Parameter
* house
   - Retrieves all characters in given house  
   - `/characters?house=Ravenclaw`
   

---

`GET /characters/:id`

Returns single Hogwarts Character

Response example:
```
{
        "id": 1,
        "name": "Justin Finch-Fletchley",
        "birthday": "c.1980",
        "patronus": "NA",
        "parents": "Both Muggles",
        "skills": "NA",
        "hobbies": "NA",
        "blood": "NA",
        "wand": "NA",
        "image": "https://images.pottermore.com/bxd3o8b291gf/5AXc4ygT7O6gKciE6QaSS8/68e08d31990cdabaf54f35ab5b636459/Justin.jpg?w=320&h=320&fit=thumb&f=center&q=85",
        "house": "Hufflepuff",
        "house_id": 2,
        "created_at": "2018-05-17T21:30:39.917Z",
        "updated_at": "2018-05-17T21:30:39.917Z"
}
```
---

`POST /characters`

  ```
  body: {
    name: 'string',
    birthday: 'string',
    patronus: 'string',
    parents: 'string',
    skills: 'string',
    hobbies: 'string',
    blood: 'string',
    wand: 'string',
    image: 'string',
    house: 'string',
    house_id: 'number'
    }
```

Response body contains id.

---

`PUT /characters/:id`

```
body: { id[, name, birthday, patronus, parents, skills, hobbies, blood, wand, image, house]}
```

Character id is required for successful PUT request.

---

`DELETE /characters`


  ```
  body: {
   id: 'number'
    }
```
---
