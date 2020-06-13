/*******************************************************************************
* Derth Adams
* CS 406
* June 5, 2020
*
* File name:        graph.js
* Description:      Contains all the logic for the client-side graph app
*******************************************************************************/
import { cyPrefs, layoutPrefs } from "./cy_config.js";

// cy is the cytoscape graph object which uses the div id=graph as a container
const cy = cytoscape(cyPrefs);
const graph = document.getElementById('graph');

// graphLayout is the force-directed layout object attached to cy
let graphLayout = cy.layout(layoutPrefs);

// Select interface elements and assign to variables for later use
const searchBox = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const expandAllBtn = document.getElementById('expand-all');
const clearGraphBtn = document.getElementById('clear-graph');
const infoPanel = document.getElementById('info-panel');
const nameHeading = document.getElementById('name-heading');
const jobHeading = document.getElementById('job-heading');
const jobList = document.getElementById('job-list');

// Constant which represents the maximum number of nodes for which the
// "Expand all" button is active
const MAX_NODES_EXPAND_ALL = 5;

/*******************************************************************************
* Function name:    refreshGraph()
* Description:      Redraws the graph and runs the force-directed layout.
*                   Used to update the graph after nodes are added.
* Receives/Returns: None
*******************************************************************************/

function refreshGraph() {
    cy.maxZoom(1);
    graphLayout = cy.layout(layoutPrefs);
    graphLayout.run();
    graph.classList.add('visible');
}

/*******************************************************************************
* Function name:    selectEdges(nodeID)
* Description:      Selects all edges incident on a given node.
* Receives:         nodeID  (string) uuid of the cytoscape node object
*******************************************************************************/

function selectEdges(nodeID) {
    let edges = cy.elements('edge[source = "' + nodeID + '"], ' +
        'edge[target = "' + nodeID + '"]');
    edges.addClass('selected-edge');
}

/*******************************************************************************
* Function name:    unselectEdges()
* Description:      Unselects all selected edges.
*******************************************************************************/

function unselectEdges() {
    let selected_edges = cy.$('.selected-edge');
    selected_edges.removeClass('selected-edge');
}

/*******************************************************************************
* Function name:    makeNodeSelected(node)
* Description:      Takes a cytoscape node object and makes it selected.
* Receives:         node    A cytoscape node object
*******************************************************************************/

function makeNodeSelected(node) {
    let selected = cy.$('node:selected');
    selected.unselect();
    node.select();
    unselectEdges();
    selectEdges(node.id());
}

/*******************************************************************************
* Function name:    activateInfoPanel(node)
* Description:      Deletes the previously-active info panel and creates and
*                   displays a new info panel for the node passed as an
*                   argument.
* Receives:         node    A cytoscape node object
*******************************************************************************/

function activateInfoPanel(node) {
    nameHeading.innerText = node.data('full_name');
    jobHeading.innerText = node.data('job_title');
    while(jobList.firstChild) {
            jobList.removeChild(jobList.firstChild);
        }
    node.data('season_list').forEach( function(job) {
        let jobCard = document.createElement('li');
        jobCard.classList.add('list-group-item');
        jobCard.innerText = job;
        jobList.appendChild(jobCard);
    });
    infoPanel.classList.add('visible');
}

/*******************************************************************************
* Function name:    enableButtons()
* Description:      Enables both the "Clear graph" and "Expand all" buttons
*******************************************************************************/

function enableButtons() {
    clearGraphBtn.removeAttribute('disabled');
    expandAllBtn.removeAttribute('disabled');
}

/*******************************************************************************
* Function name:    disableButtons()
* Description:      Disables both the "Clear graph" and "Expand all" buttons
*******************************************************************************/

function disableButtons() {
    clearGraphBtn.setAttribute('disabled', 'true');
    expandAllBtn.setAttribute('disabled', 'true');
}

/*******************************************************************************
* Function name:    addNode(nodeJSON)
* Description:      Takes a JSON object representing a node and passes is to
*                   the cy object, which creates a node object inside the
*                   graph model.
* Receives:         nodeJSON    A JSON object representing node data
*******************************************************************************/

function addNode(nodeJSON) {
    let node = cy.getElementById(nodeJSON.data.id);
    // Node is already in graph
    if(node.length) {
        makeNodeSelected(node);
        activateInfoPanel(node);
    }
    // Node is not already in graph
    else {
        cy.add(nodeJSON);
        let node = cy.getElementById(nodeJSON.data.id);
        makeNodeSelected(node);
        activateInfoPanel(node);
        refreshGraph();
    }
}

/*******************************************************************************
* Function name:    clearGraph()
* Description:      Deletes all nodes from the graph, disables buttons,
*                   and hides the info panel.
*******************************************************************************/

function clearGraph() {
    cy.nodes().remove();
    disableButtons();
    infoPanel.classList.remove('visible');
}

/*******************************************************************************
* Function name:    expandAll()
* Description:      Expands the first neighbors of all nodes on the graph
*                   by calling expandNode() on each one.
*******************************************************************************/

function expandAll() {
    for(let node of cy.nodes()) {
        if (node.data('expanded') === 'false') {
            expandNode(node);
        }
    }
    refreshGraph();
}

/*******************************************************************************
* Function name:    expandNode(ele)
* Description:      Expands the first neighbors of the node passed as an
*                   argument. Makes a GET request to the API endpoint
*                   /api/neighbors/ and adds the resulting collection of
*                   nodes to cy.
* Receives:         node     A cytoscape node object
*******************************************************************************/

function expandNode(node) {
    fetch('/api/neighbors/?uuid=' + node.data('id'))
        .then(response => response.json())
        .then((data) => {
            node.data('expanded', 'true');
            let elements = data.elements;
            cy.add(elements);
            refreshGraph();
            makeNodeSelected(node);
            activateInfoPanel(node);
        });
}

// Preferences for the Context Menu attached to the cytoscape object
const cxtMenuPrefs = {
    selector: 'node',
    menuRadius: 100,
    activePadding: 20, // additional size in pixels for the active command
    indicatorSize: 18, // the size in pixels of the pointer to the active command
    separatorWidth: 3, // the empty spacing in pixels between successive commands
    spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    minSpotlightRadius: 8, // the minimum radius in pixels of the spotlight
    maxSpotlightRadius: 60, // the maximum radius in pixels of the spotlight
    fillColor: '#CCD1D1', // the background colour of the menu
    activeFillColor: '#99A3A4', // the colour used to indicate the selected command

    // Contains html content for the menu options, as well as callback functions
    // to execute when each one is selected.
    commands: [
        {
            content: '<span><img src="/static/graph/img/node_collapse_sm.png" id="collapse" alt="Collapse" style="width:100%"></span>',
            // Selects and deletes the children of the selected node
            select: function(ele){
                ele.data('expanded', 'false');
                const children = cy.elements('node[par = "' + ele.id() + '"][expanded = "false"]');
                cy.remove(children);
                refreshGraph();
            }
        },

        {
            content: '<span><img src="/static/graph/img/delete_sm.png" id="delete" alt="Delete" style="width:100%"></span>',
            // Deletes the selected node
            select: function(ele){
                cy.remove(ele);
                infoPanel.classList.remove('visible');
                refreshGraph();
            },
        },

        {
            content: '<span><img src="/static/graph/img/expanded_sm.png" id="expand" alt="Expand" style="width:100%"></span>',
            // Expands the first children of the selected node
            select: function(ele) {
                expandNode(ele);
            }
        }
    ]
};

// Attach the Context Menu to cy using the context menu preferences
cy.cxtmenu(cxtMenuPrefs);

// Once all DOM content is loaded, initialize cy by running loadCy with no
// elements.
window.addEventListener('DOMContentLoaded', function() {
    let elements = [];
    loadCy(elements);
});

/*******************************************************************************
* Event:    submit
* Target:   searchForm
* Callback: Prevents the page from reloading if the user hits enter
*******************************************************************************/
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
});

/*******************************************************************************
* Event:    click
* Target:   clearGraphBtn
* Callback: Calls clearGraph() when "Clear graph" button is clicked.
*******************************************************************************/
clearGraphBtn.addEventListener('click', () => {
    clearGraph();
});

/*******************************************************************************
* Event:    click
* Target:   expandAllBtn
* Callback: Calls expandAll() when "Expand all" button is clicked.
*******************************************************************************/
expandAllBtn.addEventListener('click', () => {
    expandAll();
});

/*******************************************************************************
* Selects the search-input element and converts it to a JQuery Autocomplete
* widget, with an object containing preferences for the widget.
*******************************************************************************/
$("#search-input").autocomplete({
    delay: 10,      // Delay 10 ms before making GET request with term
    minLength: 3,   // User must type in at least 3 characters

    // Sets the source of the suggestion list data as the result of a GET
    // request to the endpoint /api/list/ with the search term.
    source: function(request, response) {
        fetch('/api/list/?term=' + request.term)
            .then(res => res.json())
            .then((data) => {
                response(data.name_list);
            })
    },
    // Prevents the search box from filling in with the uuid of the result
    // the user has focused on.
    focus: function (event, ui) {
        event.preventDefault();
    },
    // When the user selects a search result, callback function creates an
    // object from that search result's data and adds it to the graph
    // with addNode().
    select: function(event, ui) {
        // Prevents the search box from filling in with the uuid of the
        // selected result
        event.preventDefault();
        searchBox.value = '';
        const node = {
            group: 'nodes',
            data: {
                id: ui.item.value,
                par: 0,
                expanded: 'false',
                full_name: ui.item.label,
                job_title: ui.item.job_title,
                season_list: ui.item.season_list
            }
        };
        addNode(node);
    }
});

/*******************************************************************************
* Function name:    loadCy(elements)
* Description:      Takes an object representing nodes and edges and adds it
*                   to cy (the cytoscape object). Attaches a series of event
*                   listeners to objects inside cy.
* Receives:         elements    An object representing nodes and edges
*******************************************************************************/

function loadCy(elements) {
    cy.add(elements);
    refreshGraph();

    /***************************************************************************
    * Event:    tap
    * Target:   Background of the graph visualization
    * Callback: Disables the info panel and unselects any selected edges if the
    *           user clicks/taps on the background.
    ***************************************************************************/
    cy.on('tap', function(evt) {
        if (evt.target === cy)
        {
            infoPanel.classList.remove('visible');
            unselectEdges();
        }
    });

    /***************************************************************************
    * Event:    tap
    * Target:   Node
    * Callback: Unselects all edges, selects edges incident on the node
    *           that was tapped, activates info panel for node that was
    *           tapped.
    ***************************************************************************/
    cy.on('tap', 'node', function(evt){
        let node = evt.target;
        unselectEdges();
        selectEdges(node.id());

        activateInfoPanel(node);
    });

    /***************************************************************************
    * Event:    layoutstop
    * Target:   cy.layout
    * Callback: Resizes layout to fit window, checks size of graph to
    *           determine which buttons should be active, and then activates
    *           or deactivates the necessary buttons.
    ***************************************************************************/
    cy.on('layoutstop', function() {
        cy.fit();
        cy.maxZoom(2);
        if(!cy.nodes().size()) {
            disableButtons();
        }
        else if(cy.nodes().size() <= MAX_NODES_EXPAND_ALL) {
            enableButtons();
        }
        else {
            clearGraphBtn.removeAttribute('disabled');
            expandAllBtn.setAttribute('disabled', 'true');
        }
    });
}