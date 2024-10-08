import { connect } from '@wagmi/core'
import { injected } from '@wagmi/connectors'
import { config } from '@/lib/wagmi'
import { Button } from './ui/button'

export function WalletOptions() {
  return <Button onClick={() => connect(config, { connector: injected({ target: 'metaMask' }), })}>
    Connect With MetaMask
  </Button>
}