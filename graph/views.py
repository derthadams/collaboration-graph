"""
Derth Adams
CS 406
June 5, 2020

File name:      graph/views.py
Description:    Contains the View function for the graph app
"""
from django.http import HttpResponse
from django.template import loader

"""
Function name:      index(request)
Description:        Takes in a GET request to the root URL of the web app,
                    renders the HTML template for the Network View page,
                    and sends it back as an HTTP response.
"""


def index(request):
    template = loader.get_template('graph/index.html')
    context = {}
    return HttpResponse(template.render(context, request))

