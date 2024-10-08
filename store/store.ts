import { create } from 'zustand';

interface Token {
  label: string;
  name: string;
  icon: string;
  address: string;
  abr: string;
}

interface Chain {
  value: string;
  label: string;
  icon: string;
  abr: string;
  tokens: Token[];
}

interface SwapState {
  swapSecret: string;
  chains: Chain[];
  fromChain: Chain;
  toChain: Chain;
  fromToken: Token;
  toToken: Token;
  amount: string;
  fromAddress: string;
  toAddress: string;
  setSwapSecret: (secret: string) => void;
  setFromChain: (chain: Chain) => void;
  setToChain: (chain: Chain) => void;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setAmount: (amount: string) => void;
  setFromAddress: (address: string) => void;
  setToAddress: (address: string) => void;
}

// Chains and tokens arrays
// 1.⁠ ⁠Tron: Nile Testnet
// 2.⁠ ⁠BTTC: BTTC Testnet
// 3.⁠ ⁠Ethereum: Sepolia Testnet
// 4.⁠ ⁠Binance Smart Chain(BSC): Binance Smart Chain Testnet
// 5.⁠ ⁠Polygon: Amoy Testnet
// 6.⁠ ⁠Avalanche: Fuji Testnet
const chains: Chain[] = [
  {
    value: 'nile',
    label: 'Nile Testnet',
    icon: '/icons/chains/tron.svg',
    abr: 'TRX',
    tokens: [
      {
        label: 'TRX',
        name: 'Tron',
        icon: '/icons/tokens/trx.png',
        address: 'native',
        abr: 'TRX',
      },
      {
        label: 'USDT',
        name: 'Tether',
        icon: '/icons/tokens/usdt.png',
        address: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        abr: 'USDT',
      },
      {
        label: 'USDD',
        name: 'Decentralized USD',
        icon: '/icons/tokens/usdd.png',
        address: 'TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK',
        abr: 'USDD',
      },
      {
        label: 'JST',
        name: 'Just',
        icon: '/icons/tokens/jst.png',
        address: 'TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3',
        abr: 'JST',
      },
      {
        label: 'SUNOLD',
        name: 'Sun',
        icon: '/icons/tokens/sunold.png',
        address: 'TWrZRHY9aKQZcyjpovdH6qeCEyYZrRQDZt',
        abr: 'SUN',
      },
      {
        label: 'WTRX',
        name: 'Wrapped BitTorrent Token',
        icon: '/icons/tokens/wtrx.png',
        address: 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR',
        abr: 'WBTT',
      },
    ],
  },
  {
    value: 'sepolia',
    label: 'Sepolia',
    icon: '/icons/chains/eth.svg',
    abr: 'ETH',
    tokens: [
      {
        label: 'ETH',
        name: 'Ether',
        icon: '/icons/tokens/eth.png',
        address: 'native',
        abr: 'ETH',
      },
      {
        label: 'USDC',
        name: 'USD Coin',
        icon: '/icons/tokens/usdc.png',
        address: '0xA0b86991c6218b36c1d19D4a2e9EB0cE3606eb48',
        abr: 'USDC',
      },
      {
        label: 'DAI',
        name: 'Dai',
        icon: '/icons/tokens/dai.png',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        abr: 'DAI',
      },
      {
        label: 'LINK',
        name: 'Chainlink',
        icon: '/icons/tokens/link.png',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        abr: 'LINK',
      },
      {
        label: 'UNI',
        name: 'Uniswap',
        icon: '/icons/tokens/uni.png',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        abr: 'UNI',
      },
    ],
  },
  {
    value: 'bscTestnet',
    label: 'Binance Smart Chain Testnet',
    icon: '/icons/chains/bsc.svg',
    abr: 'BSC',
    tokens: [
      {
        label: 'BNB',
        name: 'Binance Coin',
        icon: '/icons/tokens/bnb.png',
        address: 'native',
        abr: 'BNB',
      },
      {
        label: 'BUSD',
        name: 'Binance USD',
        icon: '/icons/tokens/busd.png',
        address: '0x55d398326f99059fF775485246999027B3197955',
        abr: 'BUSD',
      },
      {
        label: 'CAKE',
        name: 'PancakeSwap',
        icon: '/icons/tokens/cake.png',
        address: '0x0E09FaBB73Bd3Ade0A17ECC321fD13a19e81cE82',
        abr: 'CAKE',
      },
      {
        label: 'XVS',
        name: 'Venus',
        icon: '/icons/tokens/xvs.png',
        address: '0x15156A3F51F3E292DA76b22B83Edf4aB1dE76F52',
        abr: 'XVS',
      },
      {
        label: 'ALPACA',
        name: 'Alpaca Finance',
        icon: '/icons/tokens/alpaca.png',
        address: '0x8f0528Ce5EF7B51152A59745BEFDD91D97091d2F',
        abr: 'ALPACA',
      },
    ],
  },
  {
    value: 'polygonAmoy',
    label: 'Polygon Amoy',
    icon: '/icons/chains/polygon.svg',
    abr: 'MATIC',
    tokens: [
      {
        label: 'MATIC',
        name: 'Polygon',
        icon: '/icons/tokens/matic.png',
        address: 'native',
        abr: 'MATIC',
      },
      {
        label: 'USDC',
        name: 'USD Coin',
        icon: '/icons/tokens/usdc.png',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        abr: 'USDC',
      },
      {
        label: 'DAI',
        name: 'Dai',
        icon: '/icons/tokens/dai.png',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        abr: 'DAI',
      },
      {
        label: 'QUICK',
        name: 'Quickswap',
        icon: '/icons/tokens/quick.png',
        address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
        abr: 'QUICK',
      },
      {
        label: 'AAVE',
        name: 'Aave',
        icon: '/icons/tokens/aave.png',
        address: '0xdB3943fEc88ae93eFBc3039Ce9aB58B6A5ea5729',
        abr: 'AAVE',
      },
    ],
  },
  {
    value: 'avalancheFuji',
    label: 'Avalanche Fuji',
    icon: '/icons/chains/avalanche.svg',
    abr: 'AVAX',
    tokens: [
      {
        label: 'AVAX',
        name: 'Avalanche',
        icon: '/icons/tokens/avax.png',
        address: 'native',
        abr: 'AVAX',
      },
      {
        label: 'USDC',
        name: 'USD Coin',
        icon: '/icons/tokens/usdc.png',
        address: '0xB97EF9Ef8734C71904D8002F8b6BC66Dd9c48a6E',
        abr: 'USDC',
      },
      {
        label: 'JOE',
        name: 'Trader Joe',
        icon: '/icons/tokens/joe.png',
        address: '0x6e84A6216eAcABaC5eFbCAb6A5b3e0A688bF9dC1',
        abr: 'JOE',
      },
      {
        label: 'PNG',
        name: 'Pangolin',
        icon: '/icons/tokens/png.png',
        address: '0x60781C2586D68229fde47564546784ab3fACA982',
        abr: 'PNG',
      },
      {
        label: 'QI',
        name: 'BENQI',
        icon: '/icons/tokens/qi.png',
        address: '0x8729438EB15e2c8b576fcc6AECda6A148776c0f5',
        abr: 'QI',
      },
    ],
  },
];

export const useSwapStore = create<SwapState>((set) => ({
  swapSecret: '',
  chains: chains,
  fromChain: chains[0],
  toChain: chains[1] || chains[0],
  fromToken: chains[0].tokens[0],
  toToken: (chains[1] || chains[0]).tokens[0],
  amount: '',
  fromAddress: '',
  toAddress: '',
  setSwapSecret: (secret) => set({ swapSecret: secret }),
  setFromChain: (chain) =>
    set(() => ({
      fromChain: chain,
      fromToken: chain.tokens[0],
    })),
  setToChain: (chain) =>
    set(() => ({
      toChain: chain,
      toToken: chain.tokens[0],
    })),
  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setAmount: (amount) => set({ amount }),
  setFromAddress: (address) => set({ fromAddress: address }),
  setToAddress: (address) => set({ toAddress: address }),
}));
