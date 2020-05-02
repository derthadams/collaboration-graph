// import { cyPrefs, cxtMenuPrefs } from "./cy_config.js";

let cyPrefs = {
    container: document.getElementById('graph'),
    // autounselectify: true,
    boxSelectionEnabled: false,
    maxZoom: 100,
    minZoom: 0.5,
    zoom: 1,

    elements: [],

    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'width': 40,
                'height': 40,
                'text-halign': 'center',
                'text-valign': 'center',
                'text-wrap': 'wrap',
                'font-size': 8,
                'text-max-width': 40,
                'background-color': '#F2F4F4',
                'border-width': 3,
                'border-color': '#666',
                'label': 'data(full_name)'
            }
        },

        {
            selector: 'node:selected',
            style: {
                // 'width': 10,
                // 'height': 10,
                'background-color': '#F2F4F4',
                'border-width': 3,
                'border-color': '#F5B041',
                // 'label': 'data(full_name)'
            }
        },

        {
            selector: 'node:active',
            style: {
                'overlay-opacity': 0
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                // 'target-arrow-shape': 'triangle',
                // 'curve-style': 'bezier'
                'curve-style': 'unbundled-bezier'
            }
        }
    ],

    layout: {
        name: 'cola',
        convergenceThreshold: 100, // end layout sooner, may be a bit lower quality
        animate: false
    }

};

const cy = cytoscape(cyPrefs);
const layoutPrefs = {
    name: 'cola'
    // name: 'cose'
};
let graphLayout = cy.layout(layoutPrefs);
const infoPanel = document.getElementById('info-panel');
const nameHeading = document.getElementById('name-heading');
const jobHeading = document.getElementById('job-heading');
const jobList = document.getElementById('job-list');

let cxtMenuPrefs = {
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
                console.log( ele.id() );
            }
        },

        {
            content: '<span><img src="" id="delete" alt="Delete" style="width:70%"></span>',
            select: function(ele){
                console.log( ele.data('name') );
            },
            // enabled: false
        },

        {
            content: '<span><img src="" id="expand" alt="Expand"style="width:100%"></span>',
            select: function(ele){
                // console.log( ele.position() );
                fetch('/api/neighbors/?uuid=' + ele.data('id') +
                    '&parent_uuid=' + ele.data('par'))
                    .then(response => response.json())
                    .then((data) => {
                        let elements = data.elements;
                        cy.add(elements);
                        graphLayout = cy.layout(layoutPrefs);
                        graphLayout.run();
                    })
            }
        }
    ]
};


cy.cxtmenu(cxtMenuPrefs);


window.addEventListener('DOMContentLoaded', function() {
   fetch('/api/root/?uuid=75e33b3f-19b1-4c18-9e36-abd124656be7')
       .then(response => response.json())
       .then((data) => {
           let elements = data.nodes;
           console.log(elements);
           loadCy(elements);
           }
       );
});

function loadCy(elements) {
    cy.add(elements);
    cy.maxZoom(1);
    graphLayout.run();

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

        }
    });

    cy.on('tap', 'node', function(evt){
        let node = evt.target;
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
        // setContextMenus();
        // node.select();
        // node.json({ selected: true });
        console.log( 'tapped ' + node.id() );
        console.log( node.data('full_name'));
        console.log( node.data('id'));
        console.log(node.selected());
        console.log(cy.zoom())
});
}