import {
  type Node,
  ReactFlow,
  type Edge,
  Background,
  Controls,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

const initialNodes: Node[] = [
  {
    id: "root",
    position: { x: 0, y: 0 },
    data: { label: "root" },
    type: "default",
  },
  {
    id: "user",
    position: { x: 0, y: 0 },
    data: { label: "user" },
    type: "default",
  },
  {
    id: "name",
    position: { x: 0, y: 0 },
    data: { label: "name" },
    type: "default",
  },
];

const initialEdges: Edge[] = [
  {
    id: "root-user",
    source: "root",
    target: "user",
    type: "default",
  },
  {
    id: "user-name",
    source: "user",
    target: "name",
    type: "default",
  },
];

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph direction and spacing
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 100 });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 40 });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Get the positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 75, // center offset
        y: nodeWithPosition.y - 20, // center offset
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

type GraphViewProps = {
  data?: {
    nodes: Node[];
    edges: Edge[];
  };
};

export const GraphView = ({ data }: GraphViewProps) => {
  if (!data) {
    return null;
  }

  const { nodes, edges } = getLayoutedElements(data.nodes, data.edges);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionMode={ConnectionMode.Strict}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
