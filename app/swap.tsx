'use client';

import * as React from 'react';
import { Copy, ArrowDown, Share2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
import { useSwapStore } from '@/store/store';
import TransferSection from '@/components/TransferSection';
import ReceiveSection from '@/components/ReceiveSection';

export interface Token {
  label: string;
  name: string;
  icon: string;
  address: string;
  abr: string;
}

export interface Chain {
  value: string;
  label: string;
  icon: string;
  abr: string;
  tokens: Token[];
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
    receiveAmount,
    setSwapSecret,
    setFromChain,
    setToChain,
    setFromToken,
    setToToken,
    setAmount,
    setFromAddress,
    setToAddress,
    setReceiveAmount
  } = useSwapStore();

  return (
    <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-[700px_400px] gap-6">
      <div className="space-y-6">
        {/* Swap Secret Input Field */}
        <div className="flex items-center space-x-4 flex-nowrap gap-6">
          {/* Label */}
          <label
            htmlFor="swap-secret"
            className="text-xl text-muted-foreground font-bold font-mono w-32 whitespace-nowrap"
          >
            Swap Secret :
          </label>

          {/* Input Field */}
          <div className="relative flex-1 min-w-0">
            <Input
              id="swap-secret"
              value={swapSecret}
              onChange={(e) => setSwapSecret(e.target.value)}
              className="h-12 text-lg rounded-md bg-input w-full focus:ring-transparent focus:border-transparent"
              placeholder="Enter a Swap Secret"
            />
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
        <ReceiveSection
          title="You Receive"
          chain={toChain}
          setChain={setToChain}
          token={toToken}
          setToken={setToToken}
          address={toAddress}
          setAddress={setToAddress}
          isFrom={false}
          receiveAmount={receiveAmount}
          setReceiveAmount={setReceiveAmount}
        />
      </div>
      <div className="w-full">
        <ReceiverSelection amount={amount} fromToken={fromToken} />
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
    <div className="flex flex-col h-full justify-between">
      <Card className="bg-card text-card-foreground border border-border shadow-md rounded-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-center">
            Direct Peer-to-Peer Swap
          </h2>

          {!linkGenerated ? (
            <div className="space-y-4">
              <div className="bg-muted/25 aspect-square border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center space-y-2">
                <div className="text-muted/60 transition-colors duration-300">
                  <QrCode className="w-72 h-72" />
                </div>
                <p className="text-base text-muted-foreground/45 text-center">
                  Generate a link to share with another user for a direct P2P
                  exchange.
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
      <div className="text-center">or</div>
      <div className="p-10 pt-0">
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