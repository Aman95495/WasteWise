import { Recycle, Leaf, Battery, Trash2, Zap } from 'lucide-react';

function Reedeem() {
  const currentPoints = 650; // This should come from your state/backend
  const rewards = [
    {
      name: 'Recycled Product Voucher',
      points: 100,
      description: 'Get 10% off on recycled products in our store',
      category: 'Plastic',
      icon: Recycle,
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Eco Workshop Access',
      points: 250,
      description: 'Free access to sustainability workshop',
      category: 'Education',
      icon: Leaf,
      color: 'from-green-400 to-green-600',
    },
    {
      name: 'E-Waste Recycling Kit',
      points: 500,
      description: 'Professional e-waste recycling collection kit',
      category: 'Electronics',
      icon: Battery,
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Premium Compost Bin',
      points: 750,
      description: 'High-quality home compost system',
      category: 'Organic',
      icon: Trash2,
      color: 'from-amber-400 to-amber-600',
    },
    {
      name: 'Solar Charger',
      points: 1000,
      description: 'Portable solar-powered device charger',
      category: 'Energy',
      icon: Zap,
      color: 'from-orange-400 to-orange-600',
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-green-100 px-6 py-2 rounded-full mb-4">
          <Leaf className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-3xl font-bold text-gray-800">
            <span className="text-green-600">Eco</span> Rewards Marketplace
          </h2>
        </div>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Redeem your recycling points for sustainable rewards
        </p>
        <div className="mt-6 bg-green-50 p-4 rounded-lg inline-flex items-center">
          <span className="text-xl font-bold text-green-600 mr-2">
            {currentPoints}
          </span>
          <span className="text-gray-600">Recycling Points Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const Icon = reward.icon;
          const canRedeem = currentPoints >= reward.points;
          
          return (
            <div 
              key={reward.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group relative"
            >
              <div className={`bg-gradient-to-r ${reward.color} p-6 text-white relative`}>
                <div className="absolute bottom-2 right-2 opacity-20">
                  <Icon className="w-16 h-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Icon className="h-12 w-12" strokeWidth={1.5} />
                  <span className="text-2xl font-bold">{reward.points}</span>
                </div>
                <h3 className="text-xl font-bold mt-4">{reward.name}</h3>
                <p className="text-sm mt-1 opacity-90">{reward.category} Category</p>
              </div>
              
              <div className="p-6 border-t-4 border-green-50">
                <p className="text-gray-600 mb-4">{reward.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    {canRedeem ? 'Available' : 'Need more points'}
                  </span>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      canRedeem 
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canRedeem}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="mt-16 p-8 bg-green-50 rounded-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          <span className="text-green-600">📈 Your Progress</span>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Next Reward: Eco Workshop Access (250 points)</span>
            <span>{currentPoints}/250</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-3">
            <div 
              className="bg-green-600 rounded-full h-3 transition-all duration-500" 
              style={{ width: `${Math.min((currentPoints/250)*100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div className="mt-8 p-8 bg-green-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          <span className="text-green-600">🌱 Total Redeemed:</span> 3 Items
        </h3>
        <p className="text-gray-600">
          Equivalent to recycling 120kg of waste and offsetting 180kg CO₂ emissions
        </p>
      </div>
    </div>
  );
}

export default Reedeem;