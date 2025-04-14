import { ShoppingCart } from 'lucide-react';

function Shop() {
  const products = [
    {
      id: 1,
      name: 'Recycled Paper Notebook',
      price: parseFloat((1 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Stationery',
    },
    {
      id: 2,
      name: 'Eco-Friendly Water Bottle',
      price: parseFloat((1.5 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Lifestyle',
    },
    {
      id: 3,
      name: 'Recycled Plastic Planter',
      price: parseFloat((1.8 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Home & Garden',
    },
    {
      id: 4,
      name: 'Upcycled Denim Bag',
      price: parseFloat((2.4 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Fashion',
    },
    {
      id: 5,
      name: 'Recycled Glass Vase',
      price: parseFloat((3 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Home Decor',
    },
    {
      id: 6,
      name: 'Eco-Friendly Cutlery Set',
      price: parseFloat((5.99 * 82).toFixed(2)),
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      category: 'Kitchen',
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="relative">
          <h2 className="text-4xl font-bold text-gray-800">
            <span className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2">Eco</span>
            Marketplace
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            Discover products made from recycled materials and support the circular economy. 
            Every purchase helps reduce landfill waste.
          </p>
          <div className="absolute -top-6 -left-6 opacity-20">
            <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.5 2.5a2.5 2.5 0 0 1 5 0v5a2.5 2.5 0 0 1-5 0v-5zM2 12.5a10.5 10.5 0 1 1 21 0 10.5 10.5 0 0 1-21 0zm14.5-7a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z"/>
            </svg>
          </div>
        </div>
        
        {/* Cart Button */}
        <button className="relative p-3 bg-green-100 rounded-full hover:bg-green-200 transition-colors group">
          <ShoppingCart className="h-8 w-8 text-green-700 group-hover:text-green-800" />
          <span className="absolute top-0 right-0 bg-green-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
            0
          </span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group relative"
          >
            {/* Recycling Badge */}
            <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
              ♻️ Recycled Material
            </div>

            {/* Product Image */}
            <div className="relative aspect-w-3 aspect-h-2 bg-green-50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            </div>

            {/* Product Details */}
            <div className="p-6 border-t-4 border-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-gray-800">{product.name}</h3>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Saves 200g of waste</p>
                </div>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability Impact Section */}
      <div className="mt-16 p-8 bg-green-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          <span className="text-green-600">🌱 Your Impact:</span> 0 items purchased
        </h3>
        <p className="text-gray-600">
          Equivalent to diverting 0kg of waste from landfills and reducing 0kg CO₂ emissions
        </p>
      </div>
    </div>
  );
}

export default Shop;