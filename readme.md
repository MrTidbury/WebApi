## Jack Tidbury Recipe Api

This is the repository for my Web Api Coursework for part of my Computing BSC at Coventry University.

#### ENDPOINTS

##### /
Returns a simple resonse to check if server is working.

##### /search
Acceps a query as /search?q=query and returns the ID title and Time to cook of the first 20 recpies

##### /recipe/:id

Accepts an ID as a query in the form of /recipe/id and returns more indepth responce, including ingredients and steps to cook. This is the information that will be stored in the SQL server when the user marks this recipie as a favorite
