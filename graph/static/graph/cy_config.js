export let cyPrefs = {
    container: document.getElementById('graph'), // container to render in
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
                'curve-style': 'bezier'
            }
        }
    ],

    layout: {
        name: 'cola',
        convergenceThreshold: 100, // end layout sooner, may be a bit lower quality
        animate: false
    }

};

export let cxtMenuPrefs = {
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
            // content: '<span class="fa fa-compress-arrows-alt fa-2x"></span>',
            content: '<span id="collapse"> <img src="img/node_collapse_sm.png" alt="Collapse" ' +
                'style="width:100%"></span>',
            select: function(ele){
                console.log( ele.id() );
            }
        },

        {
            content: '<span id="delete"><img src="img/delete_sm.png" alt="Delete"' +
                ' style="width:70%"></span>',
            select: function(ele){
                console.log( ele.data('name') );
            },
            // enabled: false
        },

        {
            // content: '<span class="fa fa-expand-arrows-alt fa-2x"></span>',
            content: '<span id="expand"> <img src="img/expanded_sm.png" alt="Expand" style="width:100%">' +
                ' </span>',
            select: function(ele){
                console.log( ele.position() );
            }
        }
    ]
    };