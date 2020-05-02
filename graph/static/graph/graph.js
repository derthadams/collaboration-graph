import { cyPrefs, cxtMenuPrefs } from "./cy_config.js";

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
    const cy = cytoscape(cyPrefs);
    cy.cxtmenu(cxtMenuPrefs);
    cy.add(elements);
    const graphLayout = cy.layout({name: 'cola'});
    cy.maxZoom(1);
    graphLayout.run();

    cy.on('layoutstop', function() {
        cy.fit();
        cy.maxZoom(2);
    });

    cy.on('tap', 'node', function(evt){
    let node = evt.target;
    // setContextMenus();
    // node.select();
    // node.json({ selected: true });
    console.log( 'tapped ' + node.id() );
    console.log(node.data.full_name);
    console.log( node.json());
    console.log(node.selected());
    console.log(cy.zoom())
});
}