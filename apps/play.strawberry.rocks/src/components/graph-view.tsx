import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

type GraphViewProps = {
  // Later this could be derived from the actual schema
  data?: unknown;
};

const initialNodes: Node[] = [
  {
    id: "root",
    position: { x: 250, y: 0 },
    data: { label: "root" },
    type: "default",
  },
  {
    id: "user",
    position: { x: 250, y: 100 },
    data: { label: "user" },
    type: "default",
  },
  {
    id: "name",
    position: { x: 250, y: 200 },
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

export const GraphView = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        connectionMode={ConnectionMode.STRICT}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
