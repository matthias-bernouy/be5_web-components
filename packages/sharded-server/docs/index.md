# Folder Replica
Use to transfer data between

# Folder Transfer
Logic of a transfer 

# Folder Vote
How to manage the consensus : 
Maybe all nodes transfer a random number, the higher get the responsability ? 
IF node have too much responsabilities, he can send a number "0".
But the vote have 5 levels : 
If nobody wants the responsability, we upgrade level and maybe nodes is ok at this level
If level 5, all nodes should send a random number

# Event Loop
All cores works together, but network requests are in a priority higher than respond to the user

# Setup a retry system
Like 4 retry each 100ms
4 retry each 500ms

# Setup a compared storage
A replica ask to it's master "what is your fingerprint for your datas"
We should find what datas are missing
Maybe with logs (easy to implement i think, what about performance ?): 
[ 0001 ] ADD 5 to ...
[ 0002 ] ...
[ 0003 ] ...

The replica ask, i'm at the point 256, what's your point ? 
I'm 260, here are 257,258,259

Each like... 250 000 logs -> ask to replica "are you at 250 000 ?" if all say yes, delete logs before 250 000 and save objects states.

If a new replica is set to the master, he take all objects states and run all logs.

This is for User Data (The dev which create an application)

What about the system ?
It's impossible to have two server for managing data from Shard#25556 for example.

Flow : 
Server#25 is responsable of Shard#25556
Server#36 is controller of Shard#25556

Server#36 ask to Server#25 : Stop to be responsable of Shard#25556, i'm waiting until you have finished your operations on this shard
When Server#25 end operations, he send datas to the replicas and he stop his responsability and ask to Server#36 : Hey it's ok i have finished, and all replicates are ok
Server#36 select a replica : the Server#47 : hey, you are the new responsable of Shard#25556
Server#36 now send to all other servers : hey, the responsable of Shard#25556 is Server#47
Server#36 wait the response of all server
Server#36 send to Server#47 : ok, all servers know you are the new responsable
If after 5s Server#36 doesn't send to Server#47, Server#47 send to Server#36 : hey you are die ? if no is respond, he wait 15s more
If after 15s Server#36 doesn't send to Server#47

if Server#36 crash and only like 15% servers know the Server#47 is the new 

# Folder Controller
Use to store the logic of controller : 
    - when to attribute a new replica, 
    - when to transfer a responsability...