# Backend IFenisha/Parabot RESTFull API

##  Description
Backend aplication for service IFenisha/Parabot, this aplication is made using Node.js and Express.Js

## Built With
![Node](https://img.shields.io/badge/Node-v14.19.3-green?style=flat)
![Express](https://img.shields.io/badge/Express-v4.18.1-blue?style=flat)

## Requirements
1. NodeJs
2. Postman
3. Posgree SQL
4. DB management
5. Clodinary

## Run App
1. Clone this Repositories
2. Type `npm install` in tour terminal
3. Set up your ENV
4. Open Postman
5. You also can access app in https://fw9-parabot-backend-mkkn.vercel.app/

## Set Up ENV
```
DATABASE_URL={YOUR DATABASE}
PORT={YOUR PORT}
LIMIT_DATA={LIMIT}
APP_SECRET={YOUR APP SECRET}
CLOUDINARY_URL={YOUR URL CLOUDINARY}
CLOUD_NAME = {YOUR CLOUD NAME}
API_KEY = {YOUR API KEY}
API_SECRET = {YOUR API SECRET}
```

## Main End Point
|url|method|desc|
|---|------|----|
|/login|POST|login user|
|/register|POST|register new user|
|/authenticated-seller/profile/seller|GET|get info profile seller|
|/authenticated-seller/profile/seller|PATCH|edit profile seller|
|/authenticated-seller/profile/email|PATCH|edit email seller|
|/authenticated-seller/myProducts|GET|Get All Product Seller|
|/authenticated-seller/products/:id|GET|Get details product by id for seller|
|/authenticated-seller/products|POST|add product seller|
|/authenticated-seller/products/:id|PATCH|edit product seller|
|/authenticated-seller/products/:id|DELETE|delete product seller|
|/authenticated-customer/profile/customer/|GET|get info profile customer|
|/authenticated-customer/profile/customer/|PATCH|edit profile customer|
|/authenticated-customer/profile/customer/email/|PATCH|edit email customer|
|/cart-all|GET|get all cart customer|
|/cartUser/idProduct|GET|get detail cart customer|
|/cart|POST|add cart customer|
|/cart/:id|PATCH|edit item cart customer|
|/cart/:id/quantity/:idProduct|PATCH|edit quantity item cart customer|
|/cart/:id|DELETE|delete item cart customer|



