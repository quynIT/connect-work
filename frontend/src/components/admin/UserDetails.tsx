import {
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

export default function UserDetails() {
  return (
    <div className="min-h-screen bg-[#21222d] rounded-xl text-white p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Customer details</h1>

      {/* User Info Card */}
      <div className="flex gap-8 mb-6">
        {/* User Profile Section */}
        <div className="bg-[#171821] p-6 rounded-lg flex-1 flex flex-col items-center text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold">Ansolo Lazinatov</h2>
          <p className="text-gray-400">Joined 3 months ago</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-white">
              <EnvelopeIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <PhoneIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            </a>
          </div>
          <div className="flex justify-between w-full mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Following</p>
              <p className="text-lg font-bold">297</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Projects</p>
              <p className="text-lg font-bold">56</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completion</p>
              <p className="text-lg font-bold">97</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-[#171821] p-6 rounded-lg flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Default Address</h2>
            <button className="text-gray-400 hover:text-white">
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4">
            <span className="font-semibold">Address:</span> Vancouver, British
            Columbia Canada
          </p>
          <p className="mt-4">
            <span className="font-semibold">Email:</span> shatinon@jeemail.com
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +1234567890
          </p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-[#171821] p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Notes on Customer</h2>
        <textarea
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-600"
          placeholder="Write notes here..."
        ></textarea>
        <button className="bg-blue-600 text-white rounded-full px-4 py-2 mt-4 flex items-center">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2" />
          Chat demo
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
          <TrashIcon className="w-5 h-5 mr-2" />
          Delete customer
        </button>
        <button className="bg-gray-700 hover:bg-[#171821] text-white px-4 py-2 rounded-lg flex items-center">
          <LockClosedIcon className="w-5 h-5 mr-2" />
          Reset password
        </button>
      </div>
    </div>
  );
}
