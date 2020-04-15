from neo4j import GraphDatabase, basic_auth
from .neo_config import *


def open_neo4j_session():
    neo_driver = GraphDatabase.driver \
        (neo4j_host, auth=basic_auth(neo4j_username, neo4j_password))
    return neo_driver


def get_crew_list(tx, label):
    return tx.run("MATCH (p) WHERE $label IN labels(p) "
                  "RETURN p.fullName ",
                  label=label)


def get_name_index(tx, query):
    return tx.run("MATCH (p:Person) WHERE p.fullName CONTAINS $query "
                  "RETURN p.fullName, p.uuid ", query=query)


def get_first_neighbors(tx, uuid):
    return tx.run("MATCH(p:Person {uuid: $uuid})-[r:WORKED_WITH]-(q:Person) "
                  "return r.startDate, q.fullName) ", uuid=uuid)
