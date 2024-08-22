import logging
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient, errors
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException


class MongoDBConnectionError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to connect to the MongoDB database."
    default_code = "mongodb_connection_error"


class TodoRepository:
    def __init__(self):
        try:
            mongo_uri = settings.MONGO_URI
            client = MongoClient(mongo_uri)
            self.collection = client[settings.MONGO_DB_NAME]["todos"]
        except errors.ConnectionError as e:
            logging.error(f"Database connection error: {e}")
            raise MongoDBConnectionError()

    def find_all(self):
        try:
            todos = list(self.collection.find())
            for todo in todos:
                todo["_id"] = str(todo["_id"])
            return todos
        except Exception as e:
            logging.error(f"Error fetching todo items: {e}")
            raise APIException("Error fetching todo items.")

    def insert(self, todo_data):
        try:
            todo_data["created_at"] = datetime.now()
            result = self.collection.insert_one(todo_data)
            todo_data["_id"] = str(result.inserted_id)
            return todo_data
        except Exception as e:
            logging.error(f"Error inserting new todo item: {e}")
            raise APIException("Error inserting new todo item.")

    def update(self, _id, todo_data):
        try:
            todo_data["updated_at"] = datetime.now()
            result = self.collection.update_one(
                {"_id": ObjectId(_id)},
                {"$set": todo_data},
            )
            if result.matched_count == 0:
                raise APIException("Todo item not found.")
        except Exception as e:
            logging.error(f"Error updating todo item: {e}")
            raise APIException("Error updating todo item.")

    def delete(self, _id):
        try:
            result = self.collection.delete_one({"_id": ObjectId(_id)})
            if result.deleted_count == 0:
                raise APIException("Todo item not found.")
        except Exception as e:
            logging.error(f"Error deleting todo item: {e}")
            raise APIException("Error deleting todo item.")


class TodoListView(APIView):
    def __init__(self):
        self.repository = TodoRepository()

    def get(self, request):
        try:
            todos = self.repository.find_all()
            return Response(todos, status=status.HTTP_200_OK)
        except APIException as e:
            return Response({"error": str(e)}, status=e.status_code)

    def post(self, request):
        try:
            todo_data = request.data
            if "title" not in todo_data:
                return Response(
                    {"error": "Title is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            todo = self.repository.insert(todo_data)
            return Response(todo, status=status.HTTP_201_CREATED)
        except APIException as e:
            return Response({"error": str(e)}, status=e.status_code)

    def put(self, request, _id):
        try:
            todo_data = request.data
            if not _id:
                return Response(
                    {"error": "_id is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
                
            todo_data.pop("_id", None)
            todo_data.pop("created_at", None)
            self.repository.update(_id, todo_data)
            return Response(status=status.HTTP_200_OK)
        except APIException as e:
            return Response({"error": str(e)}, status=e.status_code)

    def delete(self, request, _id):
        try:
            if not _id:
                return Response(
                    {"error": "_id is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            self.repository.delete(_id)
            return Response(status=status.HTTP_200_OK)
        except APIException as e:
            return Response({"error": str(e)}, status=e.status_code)
