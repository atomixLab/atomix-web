'use client';

import * as React from 'react';
// import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShrinkingInput } from '@/components/ui/shrinkingInput';
// import { Input } from '@/components/ui/input';
import { useSwapStore } from '@/store/store';
import { ChainSelector } from '@/components/ChainSelector';
import { TokenSelector } from '@/components/TokenSelector';
import { Chain, Token } from '@/app/swap';
import { WalletOptions } from './wallet-options';
import { Toast } from './ui/toast';
import { useTronlink } from "use-tronlink";
import TronLinkIcon from './tronlink-icon';
import { getAccount } from '@wagmi/core'
import { config } from '@/lib/wagmi';

interface TransferSectionProps {
  title: string;
  chain: Chain;
  setChain: (chain: Chain) => void;
  token: Token;
  setToken: (token: Token) => void;
  address: string;
  setAddress: (address: string) => void;
  isFrom: boolean;
  receiveAmount: string;
  setReceiveAmount: (receiveAmount: string) => void;
}

export default function ReceiveSection({
  title,
  chain,
  setChain,
  token,
  setToken,
  // address,
  // setAddress,
  // isFrom,
  receiveAmount,
  setReceiveAmount,
}: TransferSectionProps) {
  const { chains, fromChain } = useSwapStore();
  const { isConnected } = useTronlink();

  const account = getAccount(config);

  const connected = (fromChain.value == 'nile' && isConnected) || (fromChain.value != 'nile' && account.isConnected);

  const handleScreenInClick = async () => {
    if (!window.tronLink.ready) {
      const res = await window.tronLink.request({
        method: "tron_requestAccounts",
      });
      if (res.code !== 200) {
        Toast({
          variant: "destructive",
          title: "Oops! login failed.",
        });
        return;
      }
    }
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 space-y-4 border border-border relative">
      {/* Horizontally center the Connect Wallet button */}
      {!connected && (<div className="absolute inset-0 flex justify-center items-center">
        {fromChain.value == 'nile' ?
          <Button
            onClick={handleScreenInClick}
          >
            <TronLinkIcon className="mr-2 h-4 w-4" />
            Connect With Tronlink
            <span className="sr-only">Wallet Connection</span>
          </Button>
          : <WalletOptions />}
      </div>)}

      <div className={`${!connected ? 'blur-md z-10 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">{title}</h2>
          <ChainSelector selected={chain} onSelect={setChain} items={chains} />
        </div>
      </div>

      <div className={`space-y-2 ${!connected ? 'blur-md z-10 pointer-events-none' : ''}`}>
        <div className="flex items-center space-x-2">
          <ShrinkingInput
            type="text"
            placeholder="0.00"
            value={receiveAmount}
            onChange={(e) => setReceiveAmount(e.target.value)}
            className="text-foreground bg-transparent border-none focus:ring-0 focus:outline-none w-full h-auto py-1 text-xl"
          />
          <div>
            <TokenSelector
              selected={token}
              onSelect={setToken}
              items={chain.tokens}
            />
          </div>
        </div>
        {/* <div className="text-sm text-muted-foreground">Balance: 0</div> */}
      </div>

      {/* <div className={`flex items-center space-x-2 ${!connected ? 'blur-md z-10 pointer-events-none' : ''}`}>
        <div className="text-sm text-muted-foreground w-28">
          {isFrom ? 'Your Address:' : 'Recipient Address:'}
        </div>
        <div className="relative w-full">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pr-8 bg-input w-full"
            placeholder={
              isFrom ? 'Enter your address' : 'Enter recipient address'
            }
          />
          {!isFrom && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(address).then(() => {
                    alert('Address copied to clipboard');
                  });
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div> */}
    </div>
  );
}