"""
Derth Adams
CS 406
June 5, 2020

File name:      api/urls.py
Description:    Sets urlpatterns, which is a list of URL regex patterns along
                with the corresponding View classes that should be invoked when
                the user enters a URL matching that pattern.

                Routes the URL /neighbors/ to the class NeighborsAPIView and the
                URL /list/ to the class ListAPIView.
"""
from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^neighbors/$', views.NeighborsAPIView.as_view(),
            name='neighbors'),
    re_path(r'^list/$', views.ListAPIView.as_view(), name='list'),
]
