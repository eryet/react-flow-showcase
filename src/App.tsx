import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import "@xyflow/react/dist/style.css";

export default function App() {
  return (
    <div className='flex flex-row flex-grow h-full dndflow'>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
