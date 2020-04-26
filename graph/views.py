# Create your views here.


# def index(request):
    # template = loader.get_template('graph/index.html')
    # context = {}
    # return HttpResponse("Hello, world. You're at the graph index.")
    # return HttpResponse(template.render(context, request))
    # return render(request, 'graph/index.html')

# def index(request):
#     name_list = []
#     neo_driver = open_neo4j_session()
#     with neo_driver.session() as session:
#         results = session.read_transaction(get_crew_list, 'Person')
#         for result in results:
#             name_list.append(result['p.fullName'])
#         for name in name_list:
#             print(name)
#     session.close()
#     template = loader.get_template('graph/index.html')
#     context = {
#         'name_list': name_list,
#     }
#     return HttpResponse(template.render(context, request))
