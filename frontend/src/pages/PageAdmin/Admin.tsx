export default function Admin() {
  return (
    <div>
      {" "}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-2xl font-semibold">$5k</h2>
          <p className="text-green-400 text-sm">+10% from yesterday</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-semibold">500</h2>
          <p className="text-green-400 text-sm">+8% from yesterday</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">Product Sold</p>
          <h2 className="text-2xl font-semibold">9</h2>
          <p className="text-green-400 text-sm">+2% from yesterday</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500">New Customers</p>
          <h2 className="text-2xl font-semibold">12</h2>
          <p className="text-green-400 text-sm">+3% from yesterday</p>
        </div>
      </div>
    </div>
  );
}
