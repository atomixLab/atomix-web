/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import abi from '../abis/TronHTLCAbi.json'; // ABI of the TronHTLC contract

const contractAddress = process.env.NEXT_PUBLIC_TRON_HTL_CONTRACT_ADDRESS;

interface TronHTLCContract {
  initiateHTLC: (args: InitiateHTLCArgs) => Promise<any>;
  claimHTLC: (id: string, secret: string) => Promise<any>;
  refundHTLC: (id: string) => Promise<any>;
  getHTLCId: (transactionHash: string) => Promise<string | null>;
  getHTLCDetails: (id: string) => Promise<any>;
}

interface InitiateHTLCArgs {
  amount: number; // Amount in token decimals or TRX
  expiration: number; // UNIX timestamp
  secretHash: string;
  tokenAddress: string; // TRC20 token address or '0x0000000000000000000000000000000000000000' for TRX
  refundAddress: string;
  recipientAddress: string;
}

const TronHTLCInteraction = (): TronHTLCContract => {
  const tronLinkAvailable = typeof window !== 'undefined' && window?.tronWeb;

  const htlcContract = tronLinkAvailable
    ? window.tronWeb.fullNode.host === process.env.NEXT_PUBLIC_TRON_HOST_URL &&
      window.tronLink.ready
      ? window.tronLink.tronWeb.contract(abi, contractAddress)
      : window.tronWeb.contract(abi, contractAddress)
    : window.tronWeb.contract(abi, contractAddress);

  if (!htlcContract) {
    throw new Error('HTLC contract not initialized');
  }

  // Function to get the token decimals from the token contract
  const getTokenDecimals = async (tokenAddress: string): Promise<number> => {
    // Check for known tokens
    switch (tokenAddress) {
      case 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf': // USDT (6 decimals)
      case 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR': // WTRX (6 decimals)
        return 6;
      case 'TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK': // USDD (18 decimals)
      case 'TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3': // JST (18 decimals)
      case 'TWrZRHY9aKQZcyjpovdH6qeCEyYZrRQDZt': // SUNOLD (18 decimals)
        return 18;
      case '0x0000000000000000000000000000000000000000':
        return 6; // For TRX (using 6 decimals as standard for TRX)
      default:
        try {
          const tokenContract = await window.tronWeb
            .contract()
            .at(tokenAddress);
          const decimals = await tokenContract.decimals().call();
          return decimals;
        } catch (error) {
          console.error('Error fetching token decimals:', error);
          throw error;
        }
    }
  };

  const initiateHTLC = async ({
    amount,
    expiration,
    secretHash,
    tokenAddress,
    refundAddress,
    recipientAddress,
  }: InitiateHTLCArgs) => {
    try {
      const decimals = await getTokenDecimals(tokenAddress);
      const amountConverted =
        tokenAddress === '0x0000000000000000000000000000000000000000'
          ? window.tronWeb.toSun(amount) // Convert TRX to SUN
          : amount * Math.pow(10, decimals); // Convert token amount based on decimals

      console.log({
        amount: amountConverted,
        expiration,
        secretHash,
        tokenAddress,
        refundAddress,
        recipientAddress,
      });

      const transactionHash = await htlcContract
        .initiate([
          amountConverted,
          expiration,
          secretHash,
          tokenAddress,
          refundAddress,
          recipientAddress,
        ])
        .send({
          feeLimit: 4000000000, // 4 TRX
          callValue: amountConverted,
        });

      console.log('Transaction successful and the Hash is : ', transactionHash);

      return transactionHash;
    } catch (error) {
      console.error('Error initiating HTLC:', error);
      throw error;
    }
  };

  const claimHTLC = async (id: string, secret: string) => {
    try {
      return await htlcContract.claim(id, secret).send({
        feeLimit: 4000000000,
      });
    } catch (error) {
      console.error('Error claiming HTLC:', error);
      throw error;
    }
  };

  const refundHTLC = async (id: string) => {
    try {
      return await htlcContract.refund(id).send({
        feeLimit: 4000000000,
      });
    } catch (error) {
      console.error('Error refunding HTLC:', error);
      throw error;
    }
  };

  const getHTLCId = async (transactionHash: string): Promise<string | null> => {
    try {
      const result = await window.tronWeb.trx.getTransactionInfo(
        `0x${transactionHash}`
      );
      console.log('Transaction Info: ', result);

      // Check if logs exist and process the first log entry
      if (result.log && result.log.length > 0) {
        const log = result.log[0]; // Assuming you want the first log entry
        console.log('Log Topics:', log.topics);
        console.log('Log Data:', log.data);

        // Extract the first 64 characters (32 bytes) from log.data
        const htlcId = '0x' + log.data.slice(0, 64);
        console.log('HTLC ID:', htlcId);

        return htlcId; // Return the extracted HTLC ID
      } else {
        console.log('No event logs found for this transaction');
        return null;
      }
    } catch (err) {
      console.error('Error fetching transaction info: ', err);
      return null;
    }
  };

  const getHTLCDetails = async (id: string) => {
    try {
      const htlcData = await htlcContract
        .htlcs(window.tronWeb.toHex(id))
        .call();

      const {
        amount,
        expiration,
        secretHash,
        tokenAddress,
        refundAddress,
        recipientAddress,
      } = htlcData;

      // Convert amount back to human-readable format based on token decimals
      const address =
        tokenAddress === '410000000000000000000000000000000000000000'
          ? '0x0000000000000000000000000000000000000000'
          : tokenAddress;

      const decimals = await getTokenDecimals(address);
      const amountReadable =
        address === '0x0000000000000000000000000000000000000000'
          ? window.tronWeb.fromSun(amount)
          : amount / Math.pow(10, decimals);

      return {
        amount: amountReadable,
        expiration: new Date(expiration * 1000).toISOString(), // Convert UNIX to readable format
        secretHash,
        address,
        refundAddress,
        recipientAddress,
      };
    } catch (error) {
      console.error('Error fetching HTLC details:', error);
      throw error;
    }
  };

  return {
    initiateHTLC,
    claimHTLC,
    refundHTLC,
    getHTLCId,
    getHTLCDetails,
  };
};

export default TronHTLCInteraction;
