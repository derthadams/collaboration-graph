"""
Derth Adams
CS 406
June 5, 2020

File name:      fcg/urls.py
Description:    Sets urlpatterns, which is a list of URL regex patterns and
                the destinations those urls should be routed to. Routes the
                root url graph.unscripted.camera/ to the urls specified in the
                graph app, and the /api/ url to the urls specified in the
                api app.

Auto-generated docstring starts below the line
--------------------------------------------
fcg URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import include, path, re_path

urlpatterns = [
    path('', include('graph.urls')),
    re_path(r'^api/', include('api.urls')),
]
