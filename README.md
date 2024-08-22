

# Structure

This repository includes code for a Docker setup with 3 containers:
* App: This is the React dev server and runs on http://localhost:3000. The code for this resides in src/app directory.
* API: This is the backend container that run a Django instance on http://localhost:8000. 
* Mongo: This is a DB instance running on port 27017. Django views already have code written to connect to this instance of Mongo.


# Setup

1. Change into the cloned directory and set the environment variable for the code path. Replace `path_to_repository` appropriately.
```
export ADBREW_CODEBASE_PATH="{path_to_repository}/test/src"
```
2. Build container (you only need to build containers for the first time or if you change image definition, i.e., `Dockerfile`). This step will take a good amount of time.
```
docker-compose build
```
3. Once the build is completed, start the containers:
```
docker-compose up -d
```
4. Once complete, `docker ps` should output something like this:
```
CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS         PORTS                      NAMES
e445be7efa61   tickit_api     "bash -c 'cd /src/re…"   3 minutes ago   Up 2 seconds   0.0.0.0:8000->8000/tcp     api
0fd203f12d8a   tickit_app     "bash -c 'cd /src/ap…"   4 minutes ago   Up 3 minutes   0.0.0.0:3000->3000/tcp     app
884cb9296791   tickit_mongo   "/usr/bin/mongod --b…"   4 minutes ago   Up 3 minutes   0.0.0.0:27017->27017/tcp   mongo
```
6. Check that you are able to access http://localhost:3000 and http://localhost:8000/todos
7. You can stop the containers using `docker-compose down`



# Tips
1. Once containers are up and running, you can view container logs by executing `docker logs -f --tail=100 {container_name}` Replace `container_name` with `app` or `api`(output of `docker ps`)
2. You can enter the container and inspect it by executing `docker exec -it {container_name} bash` Replace `{container_name}` with `app` or `api` (output of `docker ps`)
3. Shut all containers using `docker-compose down`
4. Restart a container using `docker restart {container_name}`


