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
  selectedNode: Number = 1;
  network!: Network;
  nodes: Node[] = [{ id: 1, label: 'Node 1' }];

  edges: Edge[] = [];

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

    this.network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        this.selectedNode = nodeId;
        // this.onNodeClick(nodeId);
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

              if (distance < 20) {
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
  onNodeClick(
    nodeId: string,
    shape: string,
    label: string,
    colour: string,
    edgeType: string
  ): void {
    this.showModal = true;
    console.log('Node clicked:', nodeId);
    const selectedNode = Number(nodeId);

    const newNodeId = this.nodes.length + 1;
    this.nodes.push({
      id: newNodeId,
      shape: shape,
      label: label,
      opacity: 0,
      color: colour,
    });

    if (edgeType == 'arrow') {
      const newEdge: Edge = { from: selectedNode, to: newNodeId, arrows: 'to' };
      this.edges.push(newEdge);
    } else {
      const newEdge: Edge = { from: selectedNode, to: newNodeId };
      this.edges.push(newEdge);
    }
    this.update_network();
  }
  add_node(event: Event) {
    event.preventDefault();

    const nodeNameInput = document.getElementById(
      'node_name'
    ) as HTMLInputElement;
    const selectedShapeInput = document.querySelector(
      'input[name="shape"]:checked'
    ) as HTMLInputElement;
    const edgeTypeInput = document.querySelector(
      'input[name="connector"]:checked'
    ) as HTMLInputElement;
    const edgeType = edgeTypeInput.value;
    const colourInput = document.querySelector(
      'input[name="colour"]:checked'
    ) as HTMLInputElement;
    const colour = colourInput.value;

    const nodeName = nodeNameInput.value;
    const selectedShape = selectedShapeInput ? selectedShapeInput.value : '';

    const parent = `${this.selectedNode}`;

    this.onNodeClick(parent, selectedShape, nodeName, colour, edgeType);
  }
}
