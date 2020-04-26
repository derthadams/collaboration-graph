from neo4j import GraphDatabase, basic_auth
from .neo_config import *
import pprint


def open_neo4j_session():
    neo_driver = GraphDatabase.driver \
        (neo4j_host, auth=basic_auth(neo4j_username, neo4j_password))
    return neo_driver


# def get_crew_list(tx, label):
#     return tx.run("MATCH (p) WHERE $label IN labels(p) "
#                   "RETURN p.fullName ",
#                   label=label)


def get_name_index(tx, query):
    return tx.run("MATCH (p:Person) WHERE p.fullName CONTAINS $query "
                  "RETURN p.fullName, p.uuid, p.jobTitle, p.season_list ",
                  query=query)


def get_initial_node(tx, uuid):
    return tx.run("MATCH (p:Person) WHERE p.uuid is $uuid "
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


def parse_neighbor_results(parent_uuid, results):
    nodes = []
    edges = []
    for result in results:
        rel = {
            'data': {
                'id': result['r.uuid'],
                'source': parent_uuid,
                'target': result['q.uuid'],
                'startDate': result['r.startDate'].to_native().strftime("%Y"),
                'endDate': result['r.endDate'].to_native().strftime("%Y"),
                'count': result['r.seasons_in_common'],
                'season_list': result['r.season_list'],
            },

        }
        edges.append(rel)

        node = {
            'data': {
                'id': result['q.uuid'],
                'parent': parent_uuid,
                'fullName': result['q.fullName'],
                'jobTitle': result['q.jobTitle'],
                'season_list': result['q.season_list']
            }
        }
        nodes.append(node)
    elements = {
        'nodes': nodes,
        'edges': edges
    }
    return elements


def parse_name_list_results(results):
    name_list = []
    for result in results:
        person = {
            'value': result['p.uuid'],
            'label': result['p.fullName'],
            'jobTitle': result['p.jobTitle']
        }
        name_list.append(person)
    return name_list


def test_neighbors():
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_first_neighbors, "75e33b3f-19b1-4c18-9e36-abd124656be7", "0")
        elements = parse_neighbor_results("75e33b3f-19b1-4c18-9e36-abd124656be7", results)
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(elements)
    session.close()


def test_name_list():
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_name_index, "er")
        name_list = parse_name_list_results(results)
        for name in name_list:
            print(name)
    session.close()


# test_name_list()
test_neighbors()
