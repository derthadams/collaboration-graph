from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.


def index(request):
    # template = loader.get_template('graph/index.html')
    # context = {}
    # return HttpResponse("Hello, world. You're at the graph index.")
    # return HttpResponse(template.render(context, request))
    return render(request, 'graph/index.html')
