import { createConfig, http } from '@wagmi/core';
import { sepolia, bscTestnet, polygonAmoy, avalancheFuji } from 'wagmi/chains';
import { metaMask } from '@wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, bscTestnet, polygonAmoy, avalancheFuji],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
    [polygonAmoy.id]: http(),
    [avalancheFuji.id]: http(),
  },
});