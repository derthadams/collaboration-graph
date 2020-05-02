export const cyPrefs = {
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
                // 'width': 10,
                // 'height': 10,
                'background-color': '#F2F4F4',
                // 'border-width': 3,
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

export const layoutPrefs = {
    name: 'cola'
    // name: 'cose'
};