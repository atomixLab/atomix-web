// swap.tsx

'use client';

import * as React from 'react';
import {
  Check,
  ChevronsUpDown,
  Copy,
  ArrowDown,
  Share2,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ShrinkingInput } from '@/components/ui/shrinkingInput';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QRCodeSVG } from 'qrcode.react';
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
import { useSwapStore } from '@/store/store';

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

interface SelectorProps<T> {
  selected: T;
  onSelect: (item: T) => void;
  items: T[];
}

interface ReceiverSelectionProps {
  amount: string;
  fromToken: Token;
}

export default function CryptoTransfer() {
  const {
    swapSecret,
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    fromAddress,
    toAddress,
    setSwapSecret,
    setFromChain,
    setToChain,
    setFromToken,
    setToToken,
    setAmount,
    setFromAddress,
    setToAddress,
  } = useSwapStore();

  return (
    <div className="max-w-8xl mx-auto p-8 text-foreground rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        <div className="flex-1 lg:flex-[3]">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground w-28">
                Give a Swap Secret
              </div>
              <div className="relative w-full">
                <Input
                  value={swapSecret}
                  onChange={(e) => setSwapSecret(e.target.value)}
                  className="pr-8 bg-input w-full"
                  placeholder="Enter a Swap Secrets"
                />
                {/* {!isFrom && (
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
          )} */}
              </div>
            </div>
            <TransferSection
              title="You Send"
              chain={fromChain}
              setChain={setFromChain}
              token={fromToken}
              setToken={setFromToken}
              address={fromAddress}
              setAddress={setFromAddress}
              isFrom={true}
              amount={amount}
              setAmount={setAmount}
            />
            <div className="flex justify-center">
              <ArrowDown className="text-muted-foreground animate-bounce" />
            </div>
            <TransferSection
              title="You Receive"
              chain={toChain}
              setChain={setToChain}
              token={toToken}
              setToken={setToToken}
              address={toAddress}
              setAddress={setToAddress}
              isFrom={false}
              amount={amount}
              setAmount={setAmount}
            />
          </div>
        </div>
        <div className="flex-1 lg:flex-initial lg:w-1/3">
          <ReceiverSelection amount={amount} fromToken={fromToken} />
        </div>
      </div>
    </div>
  );
}

function ReceiverSelection({ amount, fromToken }: ReceiverSelectionProps) {
  const [linkGenerated, setLinkGenerated] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState('');
  const qrRef = React.useRef<SVGSVGElement>(null);

  const generateLink = () => {
    if (!amount || !fromToken.label) {
      alert('Please enter a valid amount and select a token.');
      return;
    }
    // Generate a link (placeholder logic)
    const link = `https://p2p-swap.com/swap?amount=${amount}&token=${fromToken.label}`;
    setGeneratedLink(link);
    setLinkGenerated(true);
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const svgBlob = new Blob([source], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr-code.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Card className="bg-card text-card-foreground border border-border shadow-md rounded-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-center">Peer-to-Peer Swap</h2>

          {!linkGenerated ? (
            <div className="space-y-4">
              <div className="bg-muted/25 aspect-square border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                <div className="text-muted/60 transition-colors duration-300">
                  <QrCode className="w-72 h-72" />
                </div>
                <p className="text-base text-muted-foreground/45 text-center">
                  Generate a swap link to share with another user for a direct
                  P2P exchange.
                </p>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/80 transition-transform transform hover:scale-105"
                disabled={!amount}
                onClick={generateLink}
              >
                Generate Swap Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center relative">
                <div className="inline-block p-2 bg-card rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:rotate-1">
                  <QRCodeSVG
                    id="qr-code"
                    value={generatedLink}
                    size={180}
                    bgColor="hsl(var(--card))"
                    fgColor="hsl(var(--foreground))"
                    level="Q"
                    ref={qrRef}
                    className="rounded-lg"
                  />
                  <div className="absolute inset-0 bg-card/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              url: generatedLink,
                            });
                          } else {
                            alert('Share API not supported in this browser.');
                          }
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/80 transition-transform transform hover:scale-105"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        onClick={downloadQRCode}
                        className="bg-primary text-primary-foreground hover:bg-primary/80 transition-transform transform hover:scale-105"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="bg-input text-center font-mono w-full"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      alert('Link copied to clipboard');
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex justify-center space-x-2">
                  <ShareButton
                    platform="WhatsApp"
                    url={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      generatedLink
                    )}`}
                  />
                  <ShareButton
                    platform="Twitter"
                    url={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      generatedLink
                    )}`}
                  />
                  <ShareButton
                    platform="Facebook"
                    url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      generatedLink
                    )}`}
                  />
                  <ShareButton
                    platform="Telegram"
                    url={`https://t.me/share/url?url=${encodeURIComponent(
                      generatedLink
                    )}`}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      or
      <div className="mt-6">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 transition-transform transform hover:scale-105"
          disabled={!amount}
        >
          Place Swap Request
        </Button>
      </div>
    </div>
  );
}

type Platform = 'WhatsApp' | 'Twitter' | 'Facebook' | 'Telegram';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: Record<Platform, React.FC<any>> = {
  WhatsApp: WhatsappIcon,
  Twitter: TwitterIcon,
  Facebook: FacebookIcon,
  Telegram: TelegramIcon,
};

function ShareButton({ platform, url }: { platform: Platform; url: string }) {
  const IconComponent = icons[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity transform hover:scale-110"
    >
      <IconComponent size={32} round />
    </a>
  );
}

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

function TransferSection({
  title,
  chain,
  setChain,
  token,
  setToken,
  address,
  setAddress,
  isFrom,
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
        <div className="text-sm text-muted-foreground">Balance: 0</div>
      </div>
      <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}

function ChainSelector({ selected, onSelect, items }: SelectorProps<Chain>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between border-none h-10 bg-transparent transition-transform transform hover:scale-105',
            open && 'scale-105 bg-accent text-accent-foreground'
          )}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={selected.icon} />
              <AvatarFallback>{selected.abr}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{selected.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-popover text-popover-foreground border border-border">
        <Command>
          <CommandInput placeholder="Search chain..." />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {items.map((chain) => (
                <CommandItem
                  key={chain.value}
                  value={chain.label}
                  onSelect={() => {
                    onSelect(chain);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.value === chain.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={chain.icon} />
                      <AvatarFallback>{chain.abr}</AvatarFallback>
                    </Avatar>
                    {chain.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function TokenSelector({ selected, onSelect, items }: SelectorProps<Token>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between border-none h-10 bg-transparent transition-transform transform hover:scale-105 hover:bg-muted/70',
            open && 'scale-105 bg-muted/70 text-accent-foreground'
          )}
        >
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarImage src={selected.icon} />
              <AvatarFallback>{selected.abr}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{selected.label}</span>
          </div>
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-10 group-hover:opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-popover text-popover-foreground border border-border">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {items.map((token) => (
                <CommandItem
                  key={token.label}
                  value={token.label}
                  onSelect={() => {
                    onSelect(token);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.label === token.label
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={token.icon} />
                      <AvatarFallback>{token.abr}</AvatarFallback>
                    </Avatar>
                    {token.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
