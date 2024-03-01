import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Network, Node, Edge } from 'vis-network';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'visJS-test1';
  @ViewChild('visualizationContainer') visualizationContainer!: ElementRef;

  showModal: boolean = false;
  network!: Network;
  nodes: Node[] = [
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
    { id: 6, label: 'Node 6' },
    { id: 7, label: 'Node 7' },
    { id: 8, label: 'Node 8' },
    { id: 9, label: 'Node 9' },
  ];

  edges: Edge[] = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
    { from: 2, to: 7 },
    { from: 2, to: 8 },
    { from: 2, to: 9 },
    { from: 9, to: 3 },
  ];

  ngAfterViewInit(): void {
    let data = {
      nodes: this.nodes,
      edges: this.edges,
    };

    let options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      clickToUse: true,
      physics: false, // Disable physics
    };

    this.network = new Network(
      this.visualizationContainer.nativeElement,
      data,
      options
    );
    this.network.setOptions(options);

    // Attach click event listener to the network
    this.network.on('click', (params) => {
      // Check if a node was clicked
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        this.onNodeClick(nodeId);
      }
    });
    this.network.on('dragEnd', (params) => {
      if (params.nodes.length > 0) {
        const draggedNodeId = params.nodes[0];
        const draggedNodePosition = this.network.getPositions([draggedNodeId])[
          draggedNodeId
        ];

        // Iterate through all nodes
        this.nodes.forEach((node) => {
          if (node.id !== draggedNodeId) {
            if (node.id) {
              const nodePosition = this.network.getPositions([node.id])[
                node.id
              ];
              const distance = Math.sqrt(
                Math.pow(draggedNodePosition.x - nodePosition.x, 2) +
                  Math.pow(draggedNodePosition.y - nodePosition.y, 2)
              );

              // Check if the distance is within a threshold

              if (distance < 100) {
                // Adjust threshold as needed
                console.log(
                  `Node ${draggedNodeId} is close to node ${node.id}`
                );

                const newEdge: Edge = { from: draggedNodeId, to: node.id };
                this.edges.push(newEdge);
                this.update_network();
              }
            }
          }
        });
      }
    });
  }

  update_network() {
    const nodePos = this.network.getPositions();
    this.nodes.forEach((node) => {
      if (node.id) {
        if (nodePos[node.id] == undefined) {
        } else {
          node.x = nodePos[node.id!].x;
          node.y = nodePos[node.id!].y;
        }
      }
    });

    this.network.setData({ nodes: this.nodes, edges: this.edges });
  }
  // Function to execute when a node is clicked
  onNodeClick(nodeId: string): void {
    this.showModal = true;
    console.log('Node clicked:', nodeId);
    const selectedNode = Number(nodeId);

    const newNodeId = this.nodes.length + 1;
    this.nodes.push({ id: newNodeId, label: 'Added Node' });

    const newEdge: Edge = { from: selectedNode, to: newNodeId };
    this.edges.push(newEdge);
    this.update_network();
  }
  add_node(event: Event) {
    event.preventDefault();

    const nodeNameInput = document.getElementById('node_name') as HTMLInputElement;
    const selectedShapeInput = document.querySelector('input[name="shape"]:checked') as HTMLInputElement;

    const nodeName = nodeNameInput.value;
    const selectedShape = selectedShapeInput ? selectedShapeInput.value : '';

    console.log('Name:', nodeName);
    console.log('Shape:', selectedShape);
}
}
