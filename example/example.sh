#!/usr/bin/env bash

echo -------------------------------------------------
echo - fetching a missing object
echo -------------------------------------------------
curl -i http://localhost:3333/api/v1/task/9999 
echo
echo -------------------------------------------------
echo - posting a v2 obect
echo -------------------------------------------------
curl -i -X POST http://localhost:3333/api/v2/task/1111 --header "Content-Type: application/json"  --data '{"assignees":["tom","joe"]}' 
echo
echo -------------------------------------------------
echo - posting a v1 obect
echo -------------------------------------------------
curl -i -X POST http://localhost:3333/api/v1/task/2222 --header "Content-Type: application/json"  --data '{"assignee":"bob"}' 
echo
echo -------------------------------------------------
echo - getting the posted v2 object as a v1 object
echo -------------------------------------------------
curl -i http://localhost:3333/api/v1/task/1111 
echo
echo -------------------------------------------------
echo - getting the posted v1 object as a v2 object
echo -------------------------------------------------
curl -i http://localhost:3333/api/v2/task/2222 
echo
echo -------------------------------------------------
