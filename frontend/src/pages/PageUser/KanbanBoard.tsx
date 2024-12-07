import React from "react";
import {
  FaPlus,
  FaEllipsisV,
  FaFilter,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

const KanbanBoard: React.FC = () => {
  return (
    <div
      className="mt-20 p-6  min-h-screen"
      style={{ backgroundColor: "#f7fafd" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-lexend text-gray-800">
          Board: <span className="text-green-600">Task</span>
        </h1>
        <button
          className="flex items-center px-4 py-2 text-gray-800 font-lexend rounded-xl hover:bg-green-600"
          style={{ backgroundColor: "#52e052" }}
        >
          <FaPlus className="mr-2" />
          New Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search tasks..."
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-xl text-gray-600 hover:text-gray-800">
            <FaFilter className="mr-2" />
            Quick Filters
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-4 gap-4">
        {/* Column 1 */}
        <div
          className=" rounded-xl shadow-md p-4"
          style={{ backgroundColor: "#ecf2f9" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-lexend" style={{ color: "#6366f1" }}>
              ● To Do (2)
            </h2>
            <button className="text-gray-500 hover:text-gray-800">
              <FaEllipsisV />
            </button>
          </div>

          {/* Task 1 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-lexend text-blue-600">FE</span>
            </div>
            <p className="text-gray-800 font-medium">fe</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button className="text-purple-500 hover:text-purple-600">
                  <FaArrowDown />
                </button>
                <button className="text-purple-500 hover:text-purple-600">
                  <FaArrowUp />
                </button>
              </div>
              <div className="flex space-x-1">
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  H
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  AA
                </span>
              </div>
            </div>
          </div>

          {/* Task 2 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-lexend text-blue-600">FE</span>
            </div>
            <p className="text-gray-800 font-medium">fe</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button className="text-purple-500 hover:text-purple-600">
                  <FaArrowDown />
                </button>
                <button className="text-purple-500 hover:text-purple-600">
                  <FaArrowUp />
                </button>
              </div>
              <div className="flex space-x-1">
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  H
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                  AA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div
          className=" rounded-xl shadow-md p-4"
          style={{ backgroundColor: "#ecf2f9" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-lexend" style={{ color: "#f59e0b" }}>
              ● In Progress (0)
            </h2>
            <button className="text-gray-500 hover:text-gray-800">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Column 3 */}
        <div
          className=" rounded-xl shadow-md p-4"
          style={{ backgroundColor: "#ecf2f9" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-lexend " style={{ color: "#f43f5e" }}>
              ● In Review (0)
            </h2>
            <button className="text-gray-500 hover:text-gray-800">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Column 4 */}
        <div
          className=" rounded-xl shadow-md p-4"
          style={{ backgroundColor: "#ecf2f9" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-lexend " style={{ color: "#10b981" }}>
              ● Done (0)
            </h2>
            <button className="text-gray-500 hover:text-gray-800">
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
