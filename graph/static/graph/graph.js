import { cyPrefs, layoutPrefs } from "./cy_config.js";

const cy = cytoscape(cyPrefs);
const graph = document.getElementById('graph');
let graphLayout = cy.layout(layoutPrefs);

const searchBox = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const infoPanel = document.getElementById('info-panel');
const nameHeading = document.getElementById('name-heading');
const jobHeading = document.getElementById('job-heading');
const jobList = document.getElementById('job-list');

function refreshGraph() {
    cy.maxZoom(1);
    graphLayout = cy.layout(layoutPrefs);
    graphLayout.run();
    graph.classList.add('visible');
}

function selectEdges(nodeID) {
    let edges = cy.elements('edge[source = "' + nodeID + '"], edge[target = "' + nodeID + '"]');
    edges.addClass('selected-edge');
}

function unselectEdges() {
    let selected_edges = cy.$('.selected-edge');
    selected_edges.removeClass('selected-edge');
}

function makeNodeSelected(node) {
    let selected = cy.$('node:selected');
    selected.unselect();
    node.select();
    unselectEdges();
    selectEdges(node.id());
}

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

function addNode(nodeJSON) {
    console.log("Adding:", nodeJSON.data.id);
    let node = cy.getElementById(nodeJSON.data.id);
    // Node already exists
    if(node.length) {
        makeNodeSelected(node);
        activateInfoPanel(node);
    }
    else {
        console.log("No cyNode");
        console.log(node);
        cy.add(nodeJSON);
        console.log("cy.nodes.size()", cy.nodes().size());
        if (cy.nodes().size()) {
            let node = cy.getElementById(nodeJSON.data.id);
            makeNodeSelected(node);
            activateInfoPanel(node);
        }
        refreshGraph();
    }
}


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

    commands: [
        {
            content: '<span><img src="" id="collapse" alt="Collapse" style="width:100%"></span>',
            select: function(ele){
                ele.data('expanded', 'false');
                // const children = cy.elements('node[par = "' + ele.id() + '"][expanded = "false"], edge[source = "' + ele.id() + '"]');
                const children = cy.elements('node[par = "' + ele.id() + '"][expanded = "false"]');
                for (let edge of cy.elements('edge[source = "' + ele.id() + '"]')) {
                    console.log(edge.data('source'), edge.data('target'));
                }
                cy.remove(children);
                refreshGraph();
            }
        },

        {
            content: '<span><img src="" id="delete" alt="Delete" style="width:70%"></span>',
            select: function(ele){
                cy.remove(ele);
                infoPanel.classList.remove('visible');
                refreshGraph();
            },
        },

        {
            content: '<span><img src="" id="expand" alt="Expand"style="width:100%"></span>',
            select: function(ele){
                fetch('/api/neighbors/?uuid=' + ele.data('id'))
                    .then(response => response.json())
                    .then((data) => {
                        ele.data('expanded', 'true');
                        let elements = data.elements;
                        cy.add(elements);
                        refreshGraph();
                        makeNodeSelected(ele);
                        activateInfoPanel(ele);
                        // let selected = cy.$('node:selected');
                        // selected.unselect();
                        // ele.select();
                        // unselectEdges();
                        // selectEdges(ele.id())
                    })
            }
        }
    ]
};

cy.cxtmenu(cxtMenuPrefs);

window.addEventListener('DOMContentLoaded', function() {
    let elements = [];
    loadCy(elements);
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
});

$("#search-input").autocomplete({
    delay: 10,
    minLength: 3,
    source: function(request, response) {
        fetch('/api/list/?term=' + request.term)
            .then(res => res.json())
            .then((data) => {
                response(data.name_list);
                // console.log(data.name_list);
            })
    },
    select: function(event, ui) {
        event.preventDefault();
        searchBox.value = '';
        console.log(ui);
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
        // const elements = [node];
        // loadCy(elements);
        addNode(node);
    }
});

// const searchBox = new Awesomplete(input, )

// const searchBox = new autoComplete({
//     selector: 'input[id="search-input"]',
//     source: function(term, response) {
//         fetch('/api/list/?term=' + term)
//             .then(res => res.json())
//             .then((data) =>{
//                 response(data);
//             })
//     }
//     }
// );



function loadCy(elements) {
    cy.add(elements);
    cy.maxZoom(1);
    refreshGraph();
    // graphLayout.run();

    cy.on('layoutstop', function() {
        cy.fit();
        cy.maxZoom(2);
    });

    cy.on('mousedown', 'node', function() {
        console.log('mousedown');
        setTimeout(function() {
            document.getElementById('collapse').src = img_url + "node_collapse_sm.png";
            document.getElementById('delete').src = img_url + "delete_sm.png";
            document.getElementById('expand').src = img_url + "expanded_sm.png";
        }, 510);
    });

    cy.on('tap', function(evt) {
        if (evt.target === cy)
        {
            infoPanel.classList.remove('visible');
            unselectEdges();
        }
    });

    cy.on('tap', 'node', function(evt){
        let node = evt.target;
        console.log('You just clicked ' + node.id());
        unselectEdges();
        selectEdges(node.id());


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

});
}