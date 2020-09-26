# Homaway 

HomeAway is a short term listing platform built with node.js using Express and MongoDB.

This project aims to build a full-stack express application that performs:
* CRUD actions following  RESTFUL  routing
* integrates third-party APIs
* stores user-generated content in a database. 
* User authentication
* User authorization 
* Data association 
* modern and responsive and user-friendly design. 

## demo ##
https://homeaway-home.herokuapp.com/listings

**Authentication**

* Create a new user with username and password(display error if the process was unsuccessful).

* log in existing user only if username and password are correct.

**Authorization**

* only logged in users can add and modify listings and reviews. 

* post and reviews are associated with the user. The user can only edit and delete content associated with their account. 

**Future inprovements**

* filter listings based on price and location

* Regenerate password

* User profile

## Stack  

**Back-end**

* Node.js

* MongoDB

* Mongoose 

**Front-end**

* javaScript

* HTML

* CSS (flexbox, grid, media queries)

* Semantic Ui

* Bootstrap



**Dependencies**

* express

* mongoose

* passport

* passport-local

* flash 

* session 

* geocoder 

* method-ovveride 

* body-parser 

* cloudinary 



