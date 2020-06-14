# Camera Freelancer Collaboration Graph

Live demo at [**graph.unscripted.camera**](https://graph.unscripted.camera).

![Demo Screenshot](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_1.jpg)

This app allows camera freelancers to explore their collaboration networks
using an interactive graph visualization. You can discover which of your
colleagues have worked together before, and whether you're indirectly connected 
to someone you might want to work with in the future.

I built it using the Neo4j property graph database and the Django web framework on the back end, and 
the Cytoscape.js graph visualization library on the front end. 

The current version is a proof of concept for a
graph search feature that would be part of a larger career networking app for film and TV 
freelancers. The sample data used in the 
demo represents the TV credits of 500 TV camera freelancers, scraped from IMDb.

## How to use the app

Go to [**graph.unscripted.camera**](https://graph.unscripted.camera) using a recent version of Chrome or Safari. The app will run on iOS but the layout is only really usable on a large screen like an iPad Pro. When the app loads, it looks like this:

![Screenshot 2](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_2.jpg)

Initially the page is mostly empty except for a navigation bar at the top with a search box and the "Clear graph" and "Expand all" buttons. The rest of the page below the navigation bar will be devoted to the graph visualization.

To add a person to the graph, do a search for their name using the search box. As soon as you've typed at least three letters into the box, suggestions from the database index will appear below the search bar.

![Screenshot 3](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_3.jpg)

If the person you're looking for does not appear in the suggestion dropdown menu, that means they're not in the database. Make sure you're spelling the name correctly.

When you see the person's name you want to add to the graph, select it from the list by clicking on it. You don't need to type the entire name into the search box, and hitting "enter" will not do anything.

![Screenshot 4](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_4.jpg)

As soon as you select a person from the suggestion menu, they will be added to the graph as a node. Each node is labeled with the name of the person it represents.

The orange border around the node means that it's currently selected. You may select any node on the graph by clicking it. Any edges incident to the currently-selected node will also become selected and appear in orange.

In the upper-left corner of the graph area is the information panel, which displays the name, job title, and last five credits of the person whose node is currently selected in the graph. To hide the information panel, click on the background of the graph area.

![Screenshot 5](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_5.jpg)

If you want to zoom in or out on the graph area, just use your device's gestures for zooming in and out (two fingers up/down on a MacOS laptop, pinch zoom on an iOS device). To move the entire graph up, down, left, or right, click and drag on the background.

With an initial node on the graph, the "Clear graph" and "Expand all" buttons become active. The "Clear graph" button allows you to clear all nodes and edges from the graph if you want to start fresh with a new search. The "Expand all" button is active when the graph contains between one and five nodes. It allows you to expand all the nodes currently in the graph to their first neighbors.

![Screenshot 6](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_6.jpg)

You can access a context menu on any node in the graph by clicking and holding on that node. The menu allows you to expand, collapse, or delete the node. To select one of the options, move your cursor or finger over the corresponding icon and release.

<div>
<img align="left" width="48" height="48" src="https://github.com/derthadams/406_fcg_django/blob/master/images/expanded_sm.png" alt="Expand icon"> 
<strong>Expand:</strong> Finds all of the people that the person has collaborated with in the last five years (the "first neighbors" of the node) and adds them to the graph.
</div>

<div>
<img align="left" width="48" height="48" src="https://github.com/derthadams/406_fcg_django/blob/master/images/node_collapse_sm.png" alt="Collapse icon"> 
<strong>Collapse:</strong> Removes all of the people added to the graph as a result of a previous expansion of the node.
</div>

<div>
<img align="left" width="48" height="48" src="https://github.com/derthadams/406_fcg_django/blob/master/images/delete_sm.png" alt="Delete icon"> 
<strong>Delete:</strong> Removes the node and all edges incident to it.
</div>

Here's our initial node expanded to its first neighbors:

![Screenshot 7](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_7.jpg)

In the above screenshot, since there are more than five nodes in the graph, the "Expand all" button is disabled. To expand the graph further, use the context menu to expand an individual node.

![Screenshot 8](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_8.jpg)

Here, one of the first neighbors from the initial node expansion is expanded, adding more nodes to the graph:

![Screenshot 9](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_9.jpg)

Once you have a populated graph, you can drag any of the individual nodes around to reposition them in the graph area. The search box also remains active and you can use it to add more people to the graph. If a person you search for and select is already on the graph, they become selected so that you can see where they are in the visualization.

If you're interested in finding out what links may exist within a small group of two to five people, you can add the people to the graph individually using the search box, then use the "Expand all" button to add all of their first neighbors to the graph at the same time. If any of the original nodes are linked as first neighbors, an edge will be drawn between them. If they aren't connected, then you will end up with one or more disconnected graphs.

Here are three nodes added to the graph one at a time with the search box:

![Screenshot 10](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_10.jpg)

By clicking the "Expand all" button, you can expand all three nodes' first neighbors at once and see their mutual connections:

![Screenshot 11](https://github.com/derthadams/406_fcg_django/blob/master/images/screenshot_11.jpg)