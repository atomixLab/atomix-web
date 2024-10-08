'use client';

import * as React from 'react';
// import { Copy} from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { ShrinkingInput } from '@/components/ui/shrinkingInput';
// import { Input } from '@/components/ui/input';
import { useSwapStore } from '@/store/store';
import { ChainSelector } from '@/components/ChainSelector';
import { TokenSelector } from '@/components/TokenSelector';
import { Chain, Token } from '@/app/swap';

interface TransferSectionProps {
  title: string;
  chain: Chain;
  setChain: (chain: Chain) => void;
  token: Token;
  setToken: (token: Token) => void;
  address: string;
  setAddress: (address: string) => void;
  isFrom: boolean;
  amount: string;
  setAmount: (amount: string) => void;
}

export default function TransferSection({
  title,
  chain,
  setChain,
  token,
  setToken,
  // address,
  // setAddress,
  // isFrom,
  amount,
  setAmount,
}: TransferSectionProps) {
  const { chains } = useSwapStore();

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 space-y-4 border border-border">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold">{title}</h2>
        <ChainSelector selected={chain} onSelect={setChain} items={chains} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <ShrinkingInput
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
      {/* <div className="flex items-center space-x-2">
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