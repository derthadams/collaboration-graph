"""
File name:      cypher.py
Description:    Contains functions which interact with the Neo4j
                database using the Bolt protocol.
"""
from neo4j import GraphDatabase, basic_auth
from .neo_config import *

"""
Function name:  open_neo4j_session()
Description:    Opens a connection to the Neo4j database using credentials
                imported from .neo_config.
Returns:        A Neo4j driver object representing the database connection
"""


def open_neo4j_session():
    neo_driver = GraphDatabase.driver \
        (neo4j_host, auth=basic_auth(neo4j_username, neo4j_password))
    return neo_driver


"""
Function name:  get_name_index(tx, term)
Description:    Runs a database query that returns name search results
Receives:       tx      A Neo4j transaction object
                term    (string) The name search term
Returns:        A Neo4j result object containing the search results
"""


def get_name_index(tx, term):
    return tx.run("MATCH (p:Person) WHERE toLower(p.fullName) CONTAINS $term "
                  "RETURN p.fullName, p.uuid, p.jobTitle, p.season_list "
                  "LIMIT 15 ",
                  term=term)


"""
Function name:  get_first_neighbors(tx, uuid)
Description:    Runs a database query that returns the first neighbors of a
                Person node
Receives:       tx      A Neo4j transaction object
                uuid    (string) The uuid of the node
Returns:        A Neo4j result object containing the search results
"""


def get_first_neighbors(tx, uuid):
    return tx.run("MATCH(p:Person {uuid: $uuid})-"
                  "     [r:WORKED_WITH]-(q:Person) "
                  "WHERE r.endDate >= date('2015-01-01') "
                  "RETURN r.uuid, r.startDate, r.endDate, "
                  "     r.seasons_in_common, r.season_list, q.uuid, "
                  "     q.fullName, q.season_list, q.jobTitle ",
                  uuid=uuid)


"""
Function name:  parse_neighbor_results(uuid)
Description:    Takes the UUID of a root node being expanded to its first
                neighbors, runs a Neo4j query to find the first neighbors and
                the edges that connect them to the root, then parses the
                database result and writes the data to a Python dictionary
                so that it can be converted to JSON and imported to
                Cytoscape.js
Receives:       uuid    (string) The UUID of the root node being expanded to its
                        first neighbors
Returns:        A dict containing a list of dicts: each dict in the list
                represents either a node or an edge.
"""


def parse_neighbor_results(uuid):
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_first_neighbors, uuid)
    session.close()

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
                'expanded': 'false',
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


"""
Function name:  parse_name_list(term)
Description:    Takes a name search term, runs a Neo4j query to find matching
                nodes, then parses the query result into a Python list of
                dictionaries wrapped in a larger dictionary so that it can
                be converted to JSON and passed to the autocomplete
                search box.
Receives:       term    (string) The name search term    
Returns:        A dict containing a list of dicts, each one representing a
                Person node whose fullName field matched the search term.
"""


def parse_name_list(term):
    neo_driver = open_neo4j_session()
    with neo_driver.session() as session:
        results = session.read_transaction(get_name_index, term.lower())
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
