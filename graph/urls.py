"""
File name:      graph/urls.py
Description:    Sets urlpatterns, which is a list of URL regex patterns along
                with the corresponding View functions that should be invoked
                when the user enters a URL matching that pattern.

                Routes the root URL to the function index().
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]