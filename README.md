# grub-dash-project

## Overview:
The GrubDash project uses an API using Express for a food delivery service company to list all of the dishes and orders, find individual dishes and orders requested by users, create new dishes and orders, update specific dishes and orders, and terminate certain orders depending on the order's status.

## Technology

### Built with:
  * Express
  * JavaScript ES6
  * Jest and SuperTest used for testing


## app.js
Contains the Express application.


## server.js
Contains the server code.


## orders folder

### orders.controller.js
Contains the middleware functions and route handlers to list every order or a specific order, place a new order, update a certain order, and delete a specific order depending on the order's status. The middleware functions checks the data being sent using specific conditionals. Either a specific error message or the requested data is sent back to users based on the conditionals.

### orders.router.js
Attatches the middleware functions and route handlers from the 'orders.controller.js' file and the 'methodNotAllowed' route handler to the '/orders' and '/orders/:orderId' paths.


## dishes folder

### dishes.controller.js
Contains the middleware functions and route handlers to list every dish or a specific dish, place a new dish, and update a certain dish. The middleware functions checks the data being sent using specific conditionals. Either a specific error message or the requested data is sent back to users based on the conditionals.

### dishes.router.js
Attatches the middleware functions and route handlers from the 'dishes.controller.js' file and the 'methodNotAllowed' route handler to the '/dishes' and '/dishes/:dishId' paths.


## errors folder

### errorHandler.js
Contains the 'errorHandler' 'route handler' to display error messages to users.

### methodNotAllowed.js
Contains the 'methodNotAllowed' 'route handler' which displays an error message if users use the wrong HTTP request.

### notFound.js
Contains the 'notFound' 'route handler' which displays an error message if users a nonexistent URL path.


## data folder

### dishes-data.js
Contains the 'dishes' data.

### orders-data.js
Contains the 'orders' data.


## utils folder

### nextId.js 
Contains the 'nextId' 'route handler' which assigns a new 'id' to new dishes and orders.


## test folder

### dishes.router.test.js
Tests for the dishes router.

### orders-router-test.js
Tests for the orders router.

### make-test-app.js
Tests for the app.js file.
