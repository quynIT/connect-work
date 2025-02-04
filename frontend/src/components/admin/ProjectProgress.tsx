import React, { useState, useEffect } from "react";

interface Task {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  user: { _id: string; name: string; avt: string }[];
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  name: string;
  projectCategory: string;
  user: { _id: string; name: string; avt: string }[];
  createdBy: string;
}

const ProjectProgress: React.FC<{ project: Project }> = ({ project }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks/project/${project._id}`
        );
        const data = await response.json();
        setTasks(data);
        setTotalTasks(data.length);
        setCompletedTasks(
          data.filter((task: Task) => task.status === "Done").length
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [project._id]);

  const calculateProgress = (): number => {
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const progress = calculateProgress();
  const progressColor =
    progress < 25
      ? "bg-red-500"
      : progress < 50
      ? "bg-yellow-500"
      : progress < 75
      ? "bg-blue-500"
      : "bg-green-500";

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          {progress.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${progressColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500">
        {completedTasks} / {totalTasks} tasks completed
      </div>
    </div>
  );
};

export default ProjectProgress;
