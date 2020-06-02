"""
Derth Adams
CS 406
June 5, 2020

File name:      api/views.py
Description:    Contains the View classes for the api app
"""
from django.views.generic import View
from django.http import JsonResponse
from .cypher import *

"""
Class name:     NeighborsAPIView
Description:    When the client-side graph app ends a GET request to the API 
                endpoint /api/neighbors/ as the result of a node being expanded,
                the get() function is called, which passes the uuid of the node 
                to a function which runs a Neo4j database query and returns
                a Python dict containing the results. Get() then uses the
                JsonResponse function to convert the dict to JSON, and
                sends the JSON data back to the browser.
"""


class NeighborsAPIView(View):
    def get(self, request, *args, **kwargs):
        uuid = self.request.GET.get('uuid')
        elements = parse_neighbor_results(uuid)
        return JsonResponse(elements)


"""
Class name:     ListAPIView
Description:    When the autocomplete search box sends a GET request to the API
                endpoint /api/list/, the get() function is called, which passes
                the search term to a function which runs a Neo4j database
                query and returns a Python dict containing the results.
                Get() then uses the JsonResponse function to convert the dict
                to JSON, and sends the JSON data back to the browser.
"""


class ListAPIView(View):
    def get(self, request, *args, **kwargs):
        term = self.request.GET.get('term')
        name_list = parse_name_list(term)
        return JsonResponse(name_list)
