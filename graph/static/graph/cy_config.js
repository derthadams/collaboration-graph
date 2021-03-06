/*******************************************************************************
* Derth Adams
* CS 406
* June 5, 2020
*
* File name:        cy_config.js
* Description:      Contains preference objects for the cola force-directed
*                   layout and for the cytoscape object itself.
*******************************************************************************/

// Preferences for the cola force-directed layout
export const layoutPrefs = {
    name: 'cola',
    animate: true, // whether to show the layout as it's running
    refresh: 1, // number of ticks per frame; higher is faster but more jerky
    maxSimulationTime: 1000, // max length in ms to run the layout
    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
    fit: true, // on every layout reposition of nodes, fit the viewport
    padding: 30, // padding around the simulation
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

    // layout event callbacks
    ready: function(){}, // on layoutready
    stop: function(){}, // on layoutstop

    // positioning options
    randomize: false, // use random node positions at beginning of layout
    avoidOverlap: true, // if true, prevents overlap of node bounding boxes
    handleDisconnected: true, // if true, avoids disconnected components from overlapping
    convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
    nodeSpacing: function( node ){ return 10; }, // extra spacing around nodes
    flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
    alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
    gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

    // different methods of specifying edge length
    // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
    edgeLength: undefined, // sets edge length directly in simulation
    edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
    edgeJaccardLength: undefined, // jaccard edge length in simulation

    // iterations of cola algorithm; uses default values on undefined
    unconstrIter: undefined, // unconstrained initial layout iterations
    userConstIter: undefined, // initial layout iterations with user-specified constraints
    allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
};

// Preferences for the cytoscape object
export const cyPrefs = {
    container: document.getElementById('graph'),
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
                'font-size': 7,
                'text-max-width': 38,
                'background-color': '#F2F4F4',
                'border-width': 2,
                'border-color': '#666',
                'label': 'data(full_name)'
            }
        },

        {
            selector: 'node:selected',
            style: {
                'background-color': '#F2F4F4',
                'border-color': '#F5B041',
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
                'curve-style': 'bezier',
                'opacity': .8
            }
        },

        {
            selector: '.selected-edge',
            style: {
                'opacity': 1,
                'width': 2.5,
                'line-color': '#F5B041'
            }
        }
    ],

    layout: layoutPrefs

};