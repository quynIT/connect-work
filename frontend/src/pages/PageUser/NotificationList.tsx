interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "Thông báo 1",
    content: "Nội dung của thông báo 1.",
    date: "2024-11-01",
  },
  {
    id: 2,
    title: "Thông báo 2",
    content: "Nội dung của thông báo 2.",
    date: "2024-11-02",
  },
  {
    id: 3,
    title: "Thông báo 3",
    content: "Nội dung của thông báo 3.",
    date: "2024-11-03",
  },
];
export default function NotificationList() {
  return (
    <div className="max-w-8xl mx-auto p-4 bg-gray-100 mt-[90px]">
      <h2 className="text-4xl font-bold mb-16 mt-7 text-center">
        Danh sách thông báo
      </h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="bg-white shadow-md rounded-lg p-4 w-[70%] mx-auto"
          >
            <h3 className="text-lg font-semibold">{notification.title}</h3>
            <p className="text-xl font-semibold" style={{ color: "#271756" }}>
              {notification.content}
            </p>
            <span className="text-gray-500 text-sm">{notification.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
