from django.views.generic import View
from django.http import JsonResponse
from .cypher import *


class NeighborsAPIView(View):
    def get(self, request, *args, **kwargs):
        uuid = self.request.GET.get('uuid')
        elements = parse_neighbor_results(uuid)
        return JsonResponse(elements)


class ListAPIView(View):
    def get(self, request, *args, **kwargs):
        term = self.request.GET.get('term')
        name_list = parse_name_list(term)
        return JsonResponse(name_list)
