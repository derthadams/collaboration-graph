// export const layoutPrefs = {
//   name: 'euler',
//
//   // The ideal length of a spring
//   // - This acts as a hint for the edge length
//   // - The edge length can be longer or shorter if the forces are set to extreme values
//   springLength: edge => 80,
//
//   // Hooke's law coefficient
//   // - The value ranges on [0, 1]
//   // - Lower values give looser springs
//   // - Higher values give tighter springs
//   springCoeff: edge => 0.0008,
//
//   // The mass of the node in the physics simulation
//   // - The mass affects the gravity node repulsion/attraction
//   mass: node => 4,
//
//   // Coulomb's law coefficient
//   // - Makes the nodes repel each other for negative values
//   // - Makes the nodes attract each other for positive values
//   gravity: -1.2,
//
//   // A force that pulls nodes towards the origin (0, 0)
//   // Higher values keep the components less spread out
//   pull: 0.001,
//
//   // Theta coefficient from Barnes-Hut simulation
//   // - Value ranges on [0, 1]
//   // - Performance is better with smaller values
//   // - Very small values may not create enough force to give a good result
//   theta: 0.666,
//
//   // Friction / drag coefficient to make the system stabilise over time
//   dragCoeff: 0.02,
//
//   // When the total of the squared position deltas is less than this value, the simulation ends
//   movementThreshold: 1,
//
//   // The amount of time passed per tick
//   // - Larger values result in faster runtimes but might spread things out too far
//   // - Smaller values produce more accurate results
//   timeStep: 20,
//
//   // The number of ticks per frame for animate:true
//   // - A larger value reduces rendering cost but can be jerky
//   // - A smaller value increases rendering cost but is smoother
//   refresh: 10,
//
//   // Whether to animate the layout
//   // - true : Animate while the layout is running
//   // - false : Just show the end result
//   // - 'end' : Animate directly to the end result
//   animate: true,
//
//   // Animation duration used for animate:'end'
//   animationDuration: undefined,
//
//   // Easing for animate:'end'
//   animationEasing: undefined,
//
//   // Maximum iterations and time (in ms) before the layout will bail out
//   // - A large value may allow for a better result
//   // - A small value may make the layout end prematurely
//   // - The layout may stop before this if it has settled
//   maxIterations: 1000,
//   maxSimulationTime: 4000,
//
//   // Prevent the user grabbing nodes during the layout (usually with animate:true)
//   ungrabifyWhileSimulating: false,
//
//   // Whether to fit the viewport to the repositioned graph
//   // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
//   fit: true,
//
//   // Padding in rendered co-ordinates around the layout
//   padding: 30,
//
//   // Constrain layout bounds with one of
//   // - { x1, y1, x2, y2 }
//   // - { x1, y1, w, h }
//   // - undefined / null : Unconstrained
//   boundingBox: undefined,
//
//   // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
//   ready: function(){}, // on layoutready
//   stop: function(){}, // on layoutstop
//
//   // Whether to randomize the initial positions of the nodes
//   // true : Use random positions within the bounding box
//   // false : Use the current node positions as the initial positions
//   randomize: false
// };

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

// export const layoutPrefs = {
//     name: 'cose-bilkent',
//     // Called on `layoutready`
//     ready: function () {
//     },
//     // Called on `layoutstop`
//     stop: function () {
//     },
//     // 'draft', 'default' or 'proof"
//     // - 'draft' fast cooling rate
//     // - 'default' moderate cooling rate
//     // - "proof" slow cooling rate
//     // quality: 'default',
//     quality: 'proof',
//     // Whether to include labels in node dimensions. Useful for avoiding label overlap
//     nodeDimensionsIncludeLabels: false,
//     // number of ticks per frame; higher is faster but more jerky
//     refresh: 30,
//     // Whether to fit the network view after when done
//     // fit:false,
//     fit: true,
//     // Padding on fit
//     padding: 10,
//     // Whether to enable incremental mode
//     randomize: true,
//     // Node repulsion (non overlapping) multiplier
//     // nodeRepulsion: 4500,
//     nodeRepulsion: 10000,
//     // Ideal (intra-graph) edge length
//     idealEdgeLength: 50,
//     // Divisor to compute edge forces
//     edgeElasticity: 0.45,
//     // edgeElasticity: 0.9,
//     // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
//     nestingFactor: 0.1,
//     // Gravity force (constant)
//     gravity: 0.25,
//     // Maximum number of iterations to perform
//     // numIter: 2500,
//     numIter: 10000,
//     // Whether to tile disconnected nodes
//     tile: true,
//     // tile: false,
//     // Type of layout animation. The option set is {'during', 'end', false}
//     animate: 'end',
//     // animate: 'during',
//     // Duration for animate:end
//     animationDuration: 500,
//     // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
//     tilingPaddingVertical: 10,
//     // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
//     tilingPaddingHorizontal: 10,
//     // Gravity range (constant) for compounds
//     gravityRangeCompound: 1.5,
//     // Gravity force (constant) for compounds
//     gravityCompound: 1.0,
//     // Gravity range (constant)
//     gravityRange: 3.8,
//     // Initial cooling factor for incremental layout
//     initialEnergyOnIncremental: 0.5
// };

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
                'curve-style': 'bezier'
                // 'curve-style': 'unbundled-bezier'
            }
        },

        {
            selector: '.selected-edge',
            style: {
                'width': 2.5,
                'line-color': '#F5B041'
            }
        }
    ],

    layout: layoutPrefs

};