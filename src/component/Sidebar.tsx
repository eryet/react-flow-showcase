import clsx from "clsx";
import { DragEvent, useMemo, useState } from "react";
import { FIRST_SAVE, SECOND_SAVE, THIRD_SAVE } from "../const/localStorageKey";
import useStorageEventListener from "../hooks/useStorageEventListener";
import { checkMultipleKeys } from "../utils/checkMultipleLocalStorageKey";

type SidebarProps = {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
  onInitialRestore: () => void;
  onSave: (key: string) => void;
  onRestore: (key: string) => void;
  onDelete: (key: string) => void;
};

type SaveSlot = {
  key: string;
  label: string;
};

type DraggableNode = {
  type: string;
  label: string;
  icon: string;
};

const SAVE_SLOTS: SaveSlot[] = [
  { key: FIRST_SAVE, label: "資料一" },
  { key: SECOND_SAVE, label: "資料二" },
  { key: THIRD_SAVE, label: "資料三" },
];

const DRAGGABLE_NODES: DraggableNode[] = [
  { type: "product-info-node", label: "商品", icon: "🏷️" },
  { type: "extra-charge-node", label: "額外費用計算", icon: "💲" },
  { type: "total-price-node", label: "總計", icon: "💳" },
];

// ! https://github.com/xyflow/xyflow/discussions/1021
// ! https://github.com/xyflow/xyflow/issues/1323
const Sidebar = ({
  isSidebarVisible,
  setIsSidebarVisible,
  onInitialRestore,
  onSave,
  onRestore,
  onDelete,
}: SidebarProps) => {
  const [selectedSave, setSelectedSave] = useState<string>(FIRST_SAVE);
  const { isKeySet } = useStorageEventListener(selectedSave);

  const saveSlotStates = useMemo(
    () => checkMultipleKeys(SAVE_SLOTS.map((slot) => slot.key)),
    []
  );

  const handleSaveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSave(event.target.value);
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className='relative flex-shrink-0 h-full'>
      {/* Sidebar */}
      <aside
        className={clsx(
          "h-full bg-gray-50 border-l border-gray-300 overflow-hidden",
          "transition-all duration-300",
          isSidebarVisible ? "w-32 md:w-64" : "w-0 border-l-0"
        )}
      >
        <div
          className={clsx(
            "w-32 md:w-64 h-full overflow-y-auto pt-16 px-4 pb-4 transition-opacity duration-300",
            isSidebarVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Controls section at top-left */}
          <div className='mb-6'>
            <div
              className={clsx(
                "text-sm p-2 mb-3 text-gray-700 font-bold text-center",
                "border-black border-b-2"
              )}
            >
              ⚙️ 節點操作
            </div>
            <select
              value={selectedSave}
              onChange={handleSaveChange}
              className={clsx(
                "text-sm w-full h-12 p-2 border border-gray-800 rounded mb-3",
                "flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100 font-bold",
                "text-center"
              )}
            >
              {SAVE_SLOTS.map((slot) => (
                <option key={slot.key} value={slot.key}>
                  {saveSlotStates[slot.key] ? "🗃️" : ""}
                  {slot.label}
                </option>
              ))}
            </select>
            <div
              className={clsx(
                "text-sm h-12 p-2 border border-gray-800 rounded mb-3",
                "flex justify-center items-center cursor-pointer shadow-sm hover:bg-gray-100 font-bold"
              )}
              onClick={() => onSave(selectedSave)}
            >
              💾 儲存目前資料
            </div>
            <div
              className={clsx(
                "text-sm h-12 p-2 border border-gray-800 rounded mb-3",
                "flex justify-center items-center cursor-pointer shadow-sm font-bold",
                isKeySet
                  ? "bg-red-300 hover:bg-red-100"
                  : "bg-white hover:bg-gray-100"
              )}
              onClick={() => onDelete(selectedSave)}
            >
              ❌ 刪除目前資料
            </div>
            <div
              className={clsx(
                "text-sm h-12 p-2 border border-gray-800 rounded mb-3",
                "flex justify-center items-center cursor-pointer shadow-sm font-bold",
                isKeySet
                  ? "bg-green-300 hover:bg-green-100"
                  : "bg-white hover:bg-gray-100"
              )}
              onClick={() => onRestore(selectedSave)}
            >
              🔄 恢復儲存的資料
            </div>
            <div
              className={clsx(
                "text-sm h-12 p-2 border border-gray-800 rounded mb-3",
                "flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100 font-bold"
              )}
              onClick={onInitialRestore}
            >
              ⤴️ 初始化節點
            </div>
          </div>

          {/* Draggable nodes section */}
          <div>
            <div
              className={clsx(
                "text-sm mb-3 text-gray-700 font-bold",
                "border-black border-b-2"
              )}
            >
              <span className='hidden md:inline'>
                你可以將這些節點拖到⬜面板上。
              </span>
              <span className='inline md:hidden text-red-500'>
                拖曳節點沒辦法在觸控螢幕上使用
              </span>
            </div>
            {DRAGGABLE_NODES.map((node) => (
              <div
                key={node.type}
                className={clsx(
                  "hidden md:flex text-sm h-12 p-2 border border-gray-800 rounded mb-3",
                  "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
                )}
                onDragStart={(event) => onDragStart(event, node.type)}
                draggable
              >
                {node.icon} {node.label}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
