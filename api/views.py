from django.views.generic import View
from django.shortcuts import render
from django.http import JsonResponse
from .cypher import *

# Create your views here.


class NeighborsAPIView(View):
    def get(self, request, *args, **kwargs):
        uuid = self.request.GET.get('uuid')
        # parent_uuid = self.request.GET.get('parent_uuid')
        # elements = parse_neighbor_results(uuid, parent_uuid)
        elements = parse_neighbor_results(uuid)
        return JsonResponse(elements)


class ListAPIView(View):
    def get(self, request, *args, **kwargs):
        term = self.request.GET.get('term')
        name_list = parse_name_list(term)
        return JsonResponse(name_list)


class RootAPIView(View):
    def get(self, request, *args, **kwargs):
        uuid = self.request.GET.get('uuid')
        elements = parse_initial_node(uuid)
        return JsonResponse(elements)
