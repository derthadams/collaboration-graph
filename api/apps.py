"""
Derth Adams
CS 406
June 5, 2020

File name:      api/apps.py
Description:    Creates the ApiConfig class, which represents the api app
                and its configuration.
"""
from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'
