# WHEELWORLD

## My project number #2

# Web application for tire storing system

https://wheelworld.herokuapp.com/

## Testing:

* Company name: Wheels
* Password: aaa
## Using the app
* First login or create an account
* After login user needs to add clients.
  * Enter firstname
  * Enter lastname 
  * Enter a licenceplate number
* Then the user needs to create a storage. Max size is 10 x 10
  * Enter a name for your storage. Characters like "ÄÖÅ..." are not allowed.
  * Enter width and length, depending on your setup.
* Then the user can add client tires to the system.
  * Enter clients licenceplate number
  * Enter Storage name
  * EnterStorage slot where you want to add tires
  * Choose the tire type
  * Choose the condition of the tires

* Storage slots are numbered like A1,A2,.. B1,B2.. Depending of the width of the storage.
  * Ex. 3 x 3 storage:

    A1, A2,A3 

    B1, B2, B3

    C1, C2, C3

* In the Client table user can check if the client tires are already stored in the system.

* User can search clients by licenceplate.

* In the Tires table user can see all the tires in the system.

* User may order tables by columns by clicking the column name.

* User can click a storage name to inspect a certain storage slot.

* User can delete the whole storage and everything in it by clicking X. (This is a bit brutal..)

* User can delete clients by clicking X.

* User can logout by cliking logout on top of the users company name.


#TODO:
* Remove JS for fixing storage names in HTML. It slows the app down a lot.
* Add clients profile page with additional information; Billing, vehicles, etc..
* Add a warning when deleting the storage that it will delete also everything inside of it.
* Add more options for search.
* Refactor code, get rid of boilerplate.
* Refactor .css and fix some UI issues
* 
