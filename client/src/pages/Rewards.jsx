import { Trophy, Gift, Award, Target } from "lucide-react";
function Rewards() {
  const milestones = [
    {
      level: "Bronze",
      points: 100,
      rewards: ["10% discount on recycled products", "Bronze badge on profile"],
      icon: Trophy,
      color: "from-amber-500 to-amber-700",
      progress: 65,
    },
    {
      level: "Silver",
      points: 500,
      rewards: ["15% discount on recycled products", "Silver badge on profile"],
      icon: Gift,
      color: "from-gray-300 to-gray-500",
      progress: 30,
    },
    {
      level: "Gold",
      points: 1000,
      rewards: ["25% discount on recycled products", "Gold badge on profile"],
      icon: Award,
      color: "from-yellow-400 to-yellow-600",
      progress: 10,
    },
    {
      level: "Platinum",
      points: 5000,
      rewards: [
        "40% discount on recycled products",
        "Platinum badge",
        "Free Recyclable Goods",
        "Premium Account",
      ],
      icon: Target,
      color: "from-cyan-400 to-cyan-600",
      progress: 5,
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-green-100 px-6 py-2 rounded-full mb-4">
          <Trophy className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-3xl font-bold text-gray-800">
            <span className="text-green-600">Eco</span> Rewards Program
          </h2>
        </div>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Earn recycling points and unlock sustainable rewards while helping the
          planet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {milestones.map((milestone) => {
          const Icon = milestone.icon;
          return (
            <div
              key={milestone.level}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group relative"
            >
              <div
                className={`bg-gradient-to-r ${milestone.color} p-6 text-white relative`}
              >
                <div className="absolute bottom-2 right-2 opacity-20">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <Icon className="h-12 w-12 mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold">{milestone.level}</h3>
                <p className="text-sm mt-1 opacity-90">
                  {milestone.points} Recycling Points
                </p>
              </div>

              <div className="p-6 border-t-4 border-green-50">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3">
                    <div
                      className="bg-green-600 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-3">
                  {milestone.rewards.map((reward, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start bg-green-50 px-3 py-2 rounded-lg"
                    >
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2" />
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Environmental Impact Section */}
      <div className="mt-16 p-8 bg-green-50 rounded-xl text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          <span className="text-green-600">🌍 Your Impact:</span> 650 Points
          Earned
        </h3>
        <p className="text-gray-600">
          Equivalent to recycling 85kg of waste and offsetting 120kg CO₂
          emissions
        </p>
      </div>
    </div>
  );
}

export default Rewards;
