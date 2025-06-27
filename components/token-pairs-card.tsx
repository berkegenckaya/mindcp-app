import React from 'react';

interface TokenPair {
  token1: string;
  token2: string;
  price: number;
  volume: number;
  change: number;
  liquidity: number;
  isNew?: boolean;
  isTrending?: boolean;
}

interface TokenPairsCardProps {
  title: string;
  pairs: TokenPair[];
}

const TokenPairsCard: React.FC<TokenPairsCardProps> = ({ title, pairs }) => {
  return (
    <div className="rounded-2xl shadow-lg p-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-600/50">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Pair</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Volume</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">24h Change</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Liquidity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pairs.map((pair, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-md p-2 flex items-center space-x-1">
                      <span className="text-white">{pair.token1}</span>
                      <span>/</span>
                      <span className="text-white">{pair.token2}</span>
                    </div>
                    {pair.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300">
                        New
                      </span>
                    )}
                    {pair.isTrending && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300">
                        Trending
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-white">{pair.price.toFixed(4)}</td>
                <td className="px-4 py-3 text-gray-300">${pair.volume.toLocaleString()}</td>
                <td className="px-4 py-3 text-white">
                  <span className={pair.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">${pair.liquidity.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="bg-gray-700/30 hover:bg-gray-600/40 text-white font-semibold py-2 px-4 rounded">
          See More
        </button>
      </div>
    </div>
  );
};

export default TokenPairsCard;
