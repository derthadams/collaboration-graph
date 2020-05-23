from django.urls import path, re_path

from . import views

urlpatterns = [
    re_path(r'^neighbors/$', views.NeighborsAPIView.as_view(),
            name='neighbors'),
    re_path(r'^list/$', views.ListAPIView.as_view(), name='list'),
]
