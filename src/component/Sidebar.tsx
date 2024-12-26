import { useState } from "react";
import useStorageEventListener from "../hooks/useStorageEventListener";
import { checkMultipleKeys } from "../utils/checkMultipleLocalStorageKey";
import clsx from "clsx";
import { FIRST_SAVE, SECOND_SAVE, THIRD_SAVE } from "../const/localStorageKey";

// ! https://github.com/xyflow/xyflow/discussions/1021
// ! https://github.com/xyflow/xyflow/issues/1323
const Sidebar = ({ onInitialRestore, onSave, onRestore, onDelete }) => {
  const [selectedSave, setSelectedSave] = useState(FIRST_SAVE);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { isKeySet } = useStorageEventListener(selectedSave);
  const keyStates = checkMultipleKeys([FIRST_SAVE, SECOND_SAVE, THIRD_SAVE]);

  const handleSaveChange = (event) => {
    setSelectedSave(event.target.value);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      {/* Toggle button for the sidebar */}
      <button
        className={clsx(
          "fixed bottom-[170px] right-4 z-20 p-2 bg-white rounded shadow-md md:hidden border border-gray-800",
          "hover:bg-gray-100"
        )}
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? "關掉選單" : "打開選單"}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 right-0 z-10 h-full bg-gray-50 border-l border-gray-300 p-4",
          "transform transition-transform md:static md:translate-x-0",
          isSidebarVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          <div
            className={clsx(
              "md:text-xl text-sm mb-3 text-gray-700 font-bold",
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
          <div
            className={clsx(
              "hidden md:flex md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
              "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
            )}
            onDragStart={(event) => onDragStart(event, "product-info-node")}
            draggable
          >
            🏷️ 商品
          </div>
          <div
            className={clsx(
              "hidden md:flex md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
              "flex justify-center items-center cursor-grab bg-white shadow-sm hover:bg-gray-100 font-bold"
            )}
            onDragStart={(event) => onDragStart(event, "extra-charge-node")}
            draggable
          >
            💲 額外費用計算
          </div>
          <div
            className={clsx(
              "hidden md:flex md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
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
              "md:text-xl text-sm p-2 mb-3 text-gray-700 font-bold text-center",
              "border-black border-b-2"
            )}
          >
            ⚙️ 節點操作
          </div>
          <select
            value={selectedSave}
            onChange={handleSaveChange}
            className={clsx(
              "md:text-xl text-sm w-full h-12 p-2 border border-gray-800 rounded mb-3",
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
              "md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
              "flex justify-center items-center cursor-pointer shadow-sm hover:bg-gray-100 font-bold"
            )}
            onClick={() => onSave(selectedSave)}
          >
            💾 儲存目前資料
          </div>
          <div
            className={clsx(
              "md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
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
              "md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
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
              "md:text-xl text-sm h-12 p-2 border border-gray-800 rounded mb-3",
              "flex justify-center items-center cursor-pointer bg-white shadow-sm hover:bg-gray-100 font-bold"
            )}
            onClick={onInitialRestore}
          >
            ⤴️ 初始化節點
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
