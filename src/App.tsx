import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import "@xyflow/react/dist/style.css";

export default function App() {
  return (
    <div className='flex flex-col flex-grow h-full md:flex-row dndflow'>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
