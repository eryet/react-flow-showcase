import { useState } from "react";
import useStorageEventListener from "../hooks/useStorageEventListener";
import { checkMultipleKeys } from "../utils/checkMultipleLocalStorageKey";
import clsx from "clsx";
import { FIRST_SAVE, SECOND_SAVE, THIRD_SAVE } from "../const/localStorageKey";

const Sidebar = ({ onInitialRestore, onSave, onRestore, onDelete }) => {
  const [selectedSave, setSelectedSave] = useState(FIRST_SAVE);
  const { isKeySet } = useStorageEventListener(selectedSave);
  const keyStates = checkMultipleKeys([FIRST_SAVE, SECOND_SAVE, THIRD_SAVE]);

  const handleSaveChange = (event) => {
    setSelectedSave(event.target.value);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  console.log(isKeySet);

  return (
    <aside
      className={clsx(
        "border-r border-[#D0CAD3] p-4 bg-gray-50 md:max-w-[400px]",
        "flex flex-col justify-between h-full"
      )}
    >
      <div>
        <div
          className={clsx(
            "text-xl mb-3 text-gray-700 font-bold",
            "border-black border-b-2"
          )}
        >
          你可以將這些節點拖到⬜面板上。
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
          )}
          onDragStart={(event) => onDragStart(event, "product-info-node")}
          draggable
        >
          🏷️ 商品
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
          )}
          onDragStart={(event) => onDragStart(event, "extra-charge-node")}
          draggable
        >
          💲 額外費用計算
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
          )}
          onDragStart={(event) => onDragStart(event, "total-price-node")}
          draggable
        >
          💳 總計
        </div>
      </div>
      <div>
        <div
          className={clsx(
            "text-xl p-2 mb-3 text-gray-700 font-bold text-center",
            "border-black border-b-2"
          )}
        >
          ⚙️ 節點操作
        </div>
        <select
          value={selectedSave}
          onChange={handleSaveChange}
          className={clsx(
            "text-xl w-full h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100 font-bold",
            "text-center"
          )}
        >
          <option value='first-save'>
            {keyStates[FIRST_SAVE] ? "🗃️" : ""}資料一
          </option>
          <option value='second-save'>
            {keyStates[SECOND_SAVE] ? "🗃️" : ""}資料二
          </option>
          <option value='third-save'>
            {keyStates[THIRD_SAVE] ? "🗃️" : ""}資料三
          </option>
        </select>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-pointer shadow-sm hover:bg-gray-100 font-bold"
          )}
          onClick={() => onSave(selectedSave)}
        >
          💾 儲存目前資料
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-pointer shadow-sm font-bold",
            isKeySet
              ? "bg-red-400 hover:bg-red-200"
              : "bg-white hover:bg-gray-100"
          )}
          onClick={() => onDelete(selectedSave)}
        >
          ❌ 刪除目前資料
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-pointer shadow-sm font-bold",
            isKeySet
              ? "bg-green-400 hover:bg-green-200"
              : "bg-white hover:bg-gray-100"
          )}
          onClick={() => onRestore(selectedSave)}
        >
          🔄 恢復儲存的資料
        </div>
        <div
          className={clsx(
            "text-xl h-12 p-2 border border-gray-800 rounded mb-3",
            "flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100 font-bold"
          )}
          onClick={onInitialRestore}
        >
          ⤴️ 初始化節點
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
