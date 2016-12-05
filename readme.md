## Jack Tidbury Recipe Api

This is the repository for my Web Api Coursework for part of my Computing BSC at Coventry University.

#### ENDPOINTS

##### /
Returns a simple resonse to check if server is working.

##### /search (GET)
Acceps a query as /search?q=query and returns the ID title and Time to cook of the first 20 recpies

##### /recipe/:id (GET)

Accepts an ID as a query in the form of /recipe/id and returns more indepth responce, including ingredients and steps to cook. This is the information that will be stored in the SQL server when the user marks this recipie as a favorite

##### /adduser (POST)

POST to this address to add a user to the system. email and password are send via basic auth and the name is sent as a header. The system checks if the user is already in the system using the email; and only adds the user if it has not been found  x.

##### /validate/:email?q=verificationCode (GET)

This is the endpoint that verfies the user in the database, allowing them to accsess restricted areas of the site. This is where the user verification ends up

##### /profile (DEL)

Using the Delete route, via the Delete method allows the user to remove thier account from the service. This requires the user to pass a valid Authorisation header upon the request

##### /profile (GET)
Returns current information about the user, exluding password

##### /favorites (GET)
When logged in and verified, this endpoint gets the favorites array from the users document in the database and then generates the correct URL (http://localhost:8080/recipe/id) and then makes multiple async calls (one for each ID stored in the array) and then returns all the results in one responce.

##### /favorites/:id (PUT)
When logged in and verified, allows users to store the given ID into the favorites array. Checks before adding to ensure no dulpicates are stores in the array

##### /favorites/:id (DEL)
When logged in and verified, allows users to remove the given ID from thier favorites array
