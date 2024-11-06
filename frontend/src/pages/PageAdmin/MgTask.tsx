import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import {
  DocumentIcon,
  CheckCircleIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/solid";

type Task = {
  id: string;
  title: string;
  category: string;
};

type TaskColumns = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

const initialTasks: TaskColumns = {
  todo: [
    {
      id: "DP-5",
      title: "(Sample) Donation History Tracking",
      category: "(SAMPLE) DONATION MANAGEMENT",
    },
  ],
  inProgress: [
    {
      id: "DP-3",
      title: "(Sample) Create Donation Page",
      category: "(SAMPLE) DONATION MANAGEMENT",
    },
    {
      id: "DP-4",
      title: "(Sample) Email Verification Process",
      category: "(SAMPLE) USER REGISTRATION",
    },
  ],
  done: [
    {
      id: "DP-6",
      title: "(Sample) Create User Registration Form",
      category: "(SAMPLE) USER REGISTRATION",
    },
  ],
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-4 mt-9">
    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
    <span className="text-sm text-purple-600 font-bold bg-purple-100 rounded px-2 py-1">
      {task.category}
    </span>
    <div className="mt-4 flex items-center space-x-2">
      <span className="text-sm text-gray-500">{task.id}</span>
      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-gray-600">&#128100;</span>
      </div>
    </div>
  </div>
);

const MgTask: React.FC = () => {
  const [tasks, setTasks] = useState<TaskColumns>(initialTasks);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Nếu thả bên ngoài danh sách, trả về
    if (!destination) return;

    // Tạo bản sao của cột nguồn và cột đích
    const sourceColumn = Array.from(
      tasks[source.droppableId as keyof TaskColumns]
    );
    const destColumn = Array.from(
      tasks[destination.droppableId as keyof TaskColumns]
    );

    // Xóa tác vụ khỏi cột nguồn
    const [movedTask] = sourceColumn.splice(source.index, 1);

    // Thêm tác vụ vào cột đích
    destColumn.splice(destination.index, 0, movedTask);

    // Cập nhật trạng thái
    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-8 mt-20">
        {(["todo", "inProgress", "done"] as Array<keyof TaskColumns>).map(
          (status) => (
            <Droppable key={status} droppableId={status}>
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-1/3 bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-4">
                    {status === "todo" && (
                      <div className="flex items-center">
                        <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />
                        <h2 className="text-xl font-bold capitalize">To Do</h2>
                      </div>
                    )}
                    {status === "inProgress" && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                        <h2 className="text-xl font-bold capitalize">
                          In Progress
                        </h2>
                      </div>
                    )}
                    {status === "done" && (
                      <div className="flex items-center">
                        <ArchiveBoxArrowDownIcon className="h-6 w-6 text-green-500 mr-2" />
                        <h2 className="text-xl font-bold capitalize">Done</h2>
                      </div>
                    )}
                  </div>
                  {tasks[status].map((task, taskIdx) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={taskIdx}
                    >
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button className="mt-2 text-blue-500">+ Create issue</button>
                </div>
              )}
            </Droppable>
          )
        )}
      </div>
    </DragDropContext>
  );
};

export default MgTask;
