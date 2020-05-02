from neo4j import GraphDatabase, basic_auth
from .neo_config import *


def open_neo4j_session():
    neo_driver = GraphDatabase.driver \
        (neo4j_host, auth=basic_auth(neo4j_username, neo4j_password))
    return neo_driver


def get_name_index(tx, term):
    return tx.run("MATCH (p:Person) WHERE p.fullName CONTAINS $term "
                  "RETURN p.fullName, p.uuid, p.jobTitle, p.season_list ",
                  term=term)


def get_initial_node(tx, uuid):
    return tx.run("MATCH (p:Person) WHERE p.uuid = $uuid "
                  "RETURN p.fullName, p.uuid, p.jobTitle, p.season_list ",
                  uuid=uuid)


def get_first_neighbors(tx, uuid, parent_uuid):
    return tx.run("MATCH(p:Person {uuid: $uuid})-"
                  "     [r:WORKED_WITH]-(q:Person) "
                  "WHERE NOT q.uuid = $parent_uuid AND "
                  "     r.endDate >= date('2015-01-01') "
                  "RETURN r.uuid, r.startDate, r.endDate, "
                  "     r.seasons_in_common, r.season_list, q.uuid, "
                  "     q.fullName, q.season_list, q.jobTitle ",
                  uuid=uuid, parent_uuid=parent_uuid)


def parse_neighbor_results(uuid, parent_uuid):
    results = []
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_first_neighbors,
                                           uuid, parent_uuid)
    session.close()

    # nodes = []
    # edges = []
    # for result in results:
    #     rel = {
    #         'data': {
    #             'id': result['r.uuid'],
    #             'source': uuid,
    #             'target': result['q.uuid'],
    #             'start_date': result['r.startDate'].to_native().strftime("%Y"),
    #             'end_date': result['r.endDate'].to_native().strftime("%Y"),
    #             'count': result['r.seasons_in_common'],
    #             'season_list': result['r.season_list'],
    #         },
    #
    #     }
    #     edges.append(rel)
    #
    #     node = {
    #         'data': {
    #             'id': result['q.uuid'],
    #             'parent': uuid,
    #             'full_name': result['q.fullName'],
    #             'job_title': result['q.jobTitle'],
    #             'season_list': result['q.season_list']
    #         }
    #     }
    #     nodes.append(node)
    # elements = {
    #     'nodes': nodes,
    #     'edges': edges
    # }
    # return elements

    elements = []
    for result in results:
        rel = {
            'group': 'edges',
            'data': {
                'id': result['r.uuid'],
                'source': uuid,
                'target': result['q.uuid'],
                'start_date': result['r.startDate'].to_native().strftime("%Y"),
                'end_date': result['r.endDate'].to_native().strftime("%Y"),
                'count': result['r.seasons_in_common'],
                'season_list': result['r.season_list'],
            },

        }
        elements.append(rel)

        node = {
            'group': 'nodes',
            'data': {
                'id': result['q.uuid'],
                'par': uuid,
                'full_name': result['q.fullName'],
                'job_title': result['q.jobTitle'],
                'season_list': result['q.season_list']
            }
        }
        elements.append(node)
    response = {
        'elements': elements
    }
    return response


def parse_name_list(term):
    results = []
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_name_index, term)
    session.close()

    name_list = []
    for result in results:
        person = {
            'value': result['p.uuid'],
            'label': result['p.fullName'],
            'job_title': result['p.jobTitle'],
            'season_list': result['p.season_list']
        }
        name_list.append(person)
    elements = {
        'name_list': name_list
    }
    return elements


def parse_initial_node(uuid):
    nodes = []
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_initial_node, uuid)
    session.close()

    # for result in results:
    #     node = {
    #         'data': {
    #             'id': result['p.uuid'],
    #             # 'parent': None,
    #             'full_name': result['p.fullName'],
    #             'job_title': result['p.jobTitle'],
    #             'season_list': result['p.season_list']
    #         }
    #     }
    #     nodes.append(node)
    # elements = {
    #     'nodes': nodes
    # }
    # elements = []
    for result in results:
        node = {
            'group': 'nodes',
            'data': {
                'id': result['p.uuid'],
                'par': '0',
                'full_name': result['p.fullName'],
                'job_title': result['p.jobTitle'],
                'season_list': result['p.season_list']
            }
        }
        nodes.append(node)
    elements = {
        'nodes': nodes
    }

    return elements
