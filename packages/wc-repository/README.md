# This "repository" combine CDN and API

In the future, it should be dissociate to an NGINX and API.
For the moment, no verification except the existence of the file.
Only one instance is accepted.

Ideally, we can create a cluster.
Add node easily and nodes distributes the responsability of each namespace.
Node communicate with the storage of CDN to add the new component.


# DO NOT FORGOT security checks because of javascript

# Some important features for the production : 
1.  Searches
2. Auth
3. Securities and Warnings