import { useNotification } from "../components/user/Notification";

export default function NoPage() {
  const { showNotification } = useNotification();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="text-8xl mb-4">
          <span role="img" aria-label="sad face">
            😢
          </span>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => showNotification("success", "Thao tác thành công!")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Test Success
          </button>

          <button
            onClick={() => showNotification("error", "Có lỗi xảy ra!")}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Test Error
          </button>

          <button
            onClick={() => showNotification("warning", "Cảnh báo!")}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Test Warning
          </button>
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Page not found!</h1>
        <p className="text-gray-600 mt-2">
          Sorry, we couldn't find the page you are looking for.
        </p>
        <div className="mt-4">
          <a href="/" className="text-blue-500 hover:underline">
            Homepage
          </a>
          <span className="mx-2">·</span>
          <a href="/chat-web" className="text-blue-500 hover:underline">
            Chat
          </a>
          <span className="mx-2">·</span>
          <a href="/roll-call" className="text-blue-500 hover:underline">
            KanbanBoard
          </a>
        </div>
      </div>
    </div>
  );
}
