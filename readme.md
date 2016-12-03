## Jack Tidbury Recipe Api

This is the repository for my Web Api Coursework for part of my Computing BSC at Coventry University.

#### ENDPOINTS

##### /
Returns a simple resonse to check if server is working.

##### /search
Acceps a query as /search?q=query and returns the ID title and Time to cook of the first 20 recpies

##### /recipe/:id

Accepts an ID as a query in the form of /recipe/id and returns more indepth responce, including ingredients and steps to cook. This is the information that will be stored in the SQL server when the user marks this recipie as a favorite

##### /adduser

POST to this address to add a user to the system. email and password are send via basic auth and the name is sent as a header. The system checks if the user is already in the system using the email; and only adds the user if it has not been found  x.

##### /validate/:email?q=verificationCode

This is the endpoint that verfies the user in the database, allowing them to accsess restricted areas of the site. This is where the user verification ends up

##### /delete

Using the Delete route, via the Delete method allows the user to remove thier account from the service. This requires the user to pass a valid Authorisation header upon the request
