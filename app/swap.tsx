"use client"

import * as React from "react"
import {
  Check,
  ChevronsUpDown,
  Copy,
  ArrowDown,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ShrinkingInput } from "@/components/ui/shrinkingInput"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QRCodeSVG } from "qrcode.react"
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share"

// TypeScript interfaces for props
interface Token {
  label: string
  name: string
  icon: string
  address: string
  abr: string
}

interface Chain {
  value: string
  label: string
  icon: string
  abr: string
  tokens: Token[]
}

interface SelectorProps<T> {
  selected: T
  onSelect: (item: T) => void
  items: T[]
}

interface TransferSectionProps {
  title: string
  chain: Chain
  setChain: React.Dispatch<React.SetStateAction<Chain>>
  token: Token
  setToken: React.Dispatch<React.SetStateAction<Token>>
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  isFrom: boolean
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}

interface ReceiverSelectionProps {
  amount: string
  fromToken: Token
  toToken: Token
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
    value: "nile",
    label: "Nile Testnet",
    icon: "/icons/chains/tron.svg",
    abr: "TRX",
    tokens: [
      { label: "TRX", name: "Tron", icon: "/icons/tokens/trx.png", address: "native", abr: "TRX" },
      { label: "USDT", name: "Tether", icon: "/icons/tokens/usdt.png", address: "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf", abr: "USDT" },
      { label: "USDD", name: "Decentralized USD", icon: "/icons/tokens/usdd.png", address: "TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK", abr: "USDD" },
      { label: "JST", name: "Just", icon: "/icons/tokens/jst.png", address: "TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3", abr: "JST" },
      { label: "SUNOLD", name: "Sun", icon: "/icons/tokens/sunold.png", address: "TWrZRHY9aKQZcyjpovdH6qeCEyYZrRQDZt", abr: "SUN" },
      { label: "WTRX", name: "Wrapped BitTorrent Token", icon: "/icons/tokens/wtrx.png", address: "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR", abr: "WBTT" },
    ]
  },
  {
    value: "sepolia",
    label: "Sepolia",
    icon: "/icons/chains/eth.svg",
    abr: "ETH",
    tokens: [
      { label: "ETH", name: "Ether", icon: "/icons/tokens/eth.png", address: "native", abr: "ETH" },
      { label: "USDC", name: "USD Coin", icon: "/icons/tokens/usdc.png", address: "0xA0b86991c6218b36c1d19D4a2e9EB0cE3606eb48", abr: "USDC" },
      { label: "DAI", name: "Dai", icon: "/icons/tokens/dai.png", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", abr: "DAI" },
      { label: "LINK", name: "Chainlink", icon: "/icons/tokens/link.png", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", abr: "LINK" },
      { label: "UNI", name: "Uniswap", icon: "/icons/tokens/uni.png", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", abr: "UNI" },
    ]
  },
  {
    value: "bscTestnet",
    label: "Binance Smart Chain Testnet",
    icon: "/icons/chains/bsc.svg",
    abr: "BSC",
    tokens: [
      { label: "BNB", name: "Binance Coin", icon: "/icons/tokens/bnb.png", address: "native", abr: "BNB" },
      { label: "BUSD", name: "Binance USD", icon: "/icons/tokens/busd.png", address: "0x55d398326f99059fF775485246999027B3197955", abr: "BUSD" },
      { label: "CAKE", name: "PancakeSwap", icon: "/icons/tokens/cake.png", address: "0x0E09FaBB73Bd3Ade0A17ECC321fD13a19e81cE82", abr: "CAKE" },
      { label: "XVS", name: "Venus", icon: "/icons/tokens/xvs.png", address: "0x15156A3F51F3E292DA76b22B83Edf4aB1dE76F52", abr: "XVS" },
      { label: "ALPACA", name: "Alpaca Finance", icon: "/icons/tokens/alpaca.png", address: "0x8f0528Ce5EF7B51152A59745BEFDD91D97091d2F", abr: "ALPACA" },
    ]
  },
  {
    value: "polygonAmoy",
    label: "Polygon Amoy",
    icon: "/icons/chains/polygon.svg",
    abr: "MATIC",
    tokens: [
      { label: "MATIC", name: "Polygon", icon: "/icons/tokens/matic.png", address: "native", abr: "MATIC" },
      { label: "USDC", name: "USD Coin", icon: "/icons/tokens/usdc.png", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", abr: "USDC" },
      { label: "DAI", name: "Dai", icon: "/icons/tokens/dai.png", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", abr: "DAI" },
      { label: "QUICK", name: "Quickswap", icon: "/icons/tokens/quick.png", address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13", abr: "QUICK" },
      { label: "AAVE", name: "Aave", icon: "/icons/tokens/aave.png", address: "0xdB3943fEc88ae93eFBc3039Ce9aB58B6A5ea5729", abr: "AAVE" },
    ]
  },
  {
    value: "avalancheFuji",
    label: "Avalanche Fuji",
    icon: "/icons/chains/avalanche.svg",
    abr: "AVAX",
    tokens: [
      { label: "AVAX", name: "Avalanche", icon: "/icons/tokens/avax.png", address: "native", abr: "AVAX" },
      { label: "USDC", name: "USD Coin", icon: "/icons/tokens/usdc.png", address: "0xB97EF9Ef8734C71904D8002F8b6BC66Dd9c48a6E", abr: "USDC" },
      { label: "JOE", name: "Trader Joe", icon: "/icons/tokens/joe.png", address: "0x6e84A6216eAcABaC5eFbCAb6A5b3e0A688bF9dC1", abr: "JOE" },
      { label: "PNG", name: "Pangolin", icon: "/icons/tokens/png.png", address: "0x60781C2586D68229fde47564546784ab3fACA982", abr: "PNG" },
      { label: "QI", name: "BENQI", icon: "/icons/tokens/qi.png", address: "0x8729438EB15e2c8b576fcc6AECda6A148776c0f5", abr: "QI" },
    ]
  }
]


export default function CryptoTransfer() {
  const [fromChain, setFromChain] = React.useState<Chain>(chains[0])
  const [toChain, setToChain] = React.useState<Chain>(chains[1])
  const [fromToken, setFromToken] = React.useState<Token>(
    chains[0].tokens[0]
  )
  const [toToken, setToToken] = React.useState<Token>(chains[1].tokens[0])
  const [amount, setAmount] = React.useState<string>("")
  const [fromAddress, setFromAddress] = React.useState<string>("")
  const [toAddress, setToAddress] = React.useState<string>("")

  // Update tokens when chains change
  React.useEffect(() => {
    setFromToken(fromChain.tokens[0])
  }, [fromChain])

  React.useEffect(() => {
    setToToken(toChain.tokens[0])
  }, [toChain])

  return (
    <div className="max-w-8xl mx-auto p-8 bg-background text-foreground rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        <div className="flex-1 lg:flex-[3]">
          <div className="space-y-6">
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
              <ArrowDown className="text-muted-foreground" />
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
          <div className="mt-6">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 transition-transform transform hover:scale-105"
              disabled={!amount}
            >
              {amount
                ? `Exchange ${amount} ${fromToken.label} for ${toToken.label}`
                : "Enter an amount to exchange"}
            </Button>
          </div>
        </div>
        <div className="flex-1 lg:flex-initial lg:w-1/3">
          <ReceiverSelection
            amount={amount}
            fromToken={fromToken}
            toToken={toToken}
          />
        </div>
      </div>
    </div>
  )
}

function ReceiverSelection({
  amount,
  fromToken,
  toToken,
}: ReceiverSelectionProps) {
  const [linkGenerated, setLinkGenerated] = React.useState(false)
  const [generatedLink, setGeneratedLink] = React.useState("")
  const qrRef = React.useRef<SVGSVGElement>(null)

  const generateLink = () => {
    if (!amount || !fromToken.label) {
      alert("Please enter a valid amount and select a token.")
      return
    }
    // Generate a link (placeholder logic)
    const link = `https://p2p-swap.com/swap?amount=${amount}&token=${fromToken.label}`
    setGeneratedLink(link)
    setLinkGenerated(true)
  }

  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current
      const serializer = new XMLSerializer()
      const source = serializer.serializeToString(svg)
      const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "qr-code.svg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-md rounded-lg">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-center">Peer-to-Peer Swap</h2>
        <p className="text-sm text-muted-foreground text-center">
          Generate a swap link to share with another user for a direct P2P exchange.
        </p>

        {!linkGenerated ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
              <div className="text-muted-foreground">
                <ArrowDown className="w-10 h-10 animate-bounce" />
              </div>
              <p className="text-base text-muted-foreground text-center">
                Your QR code will appear here once you generate the link.
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
                          })
                        } else {
                          alert("Share API not supported in this browser.")
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
                    navigator.clipboard.writeText(generatedLink)
                    alert("Link copied to clipboard")
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
  )
}

function ShareButton({ platform, url }: { platform: string; url: string }) {
  const icons = {
    WhatsApp: WhatsappIcon,
    Twitter: TwitterIcon,
    Facebook: FacebookIcon,
    Telegram: TelegramIcon,
  }
  const IconComponent = icons[platform]

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity transform hover:scale-110"
    >
      <IconComponent size={32} round />
    </a>
  )
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
  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 space-y-4 border border-border">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold">{title}</h2>
        <ChainSelector selected={chain} onSelect={setChain} items={chains} />
      </div>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Balance: 0</div>
        <div className="flex items-center space-x-2">
          <ShrinkingInput
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-light text-foreground bg-transparent border-none focus:ring-0 focus:outline-none w-full h-auto py-1 text-xl"
          />
          <div>
            <TokenSelector
              selected={token}
              onSelect={setToken}
              items={chain.tokens}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground w-28">
          {isFrom ? "Your Address:" : "Recipient Address:"}
        </div>
        <div className="relative w-full">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pr-8 bg-input w-full"
            placeholder={
              isFrom ? "Enter your address" : "Enter recipient address"
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
                    alert("Address copied to clipboard")
                  })
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ChainSelector({ selected, onSelect, items }: SelectorProps<Chain>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border border-border h-10 bg-transparent transition-transform transform hover:scale-105"
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
                    onSelect(chain)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.value === chain.value
                        ? "opacity-100"
                        : "opacity-0"
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
  )
}

function TokenSelector({ selected, onSelect, items }: SelectorProps<Token>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border border-border h-10 bg-transparent transition-transform transform hover:scale-105"
        >
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarImage src={selected.icon} />
              <AvatarFallback>{selected.abr}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{selected.label}</span>
          </div>
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
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
                    onSelect(token)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.label === token.label
                        ? "opacity-100"
                        : "opacity-0"
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
  )
}