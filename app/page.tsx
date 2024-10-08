'use client';

import { useEffect } from 'react';
import Swap from './swap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import TronHTLCInteraction from '@/contracts/interactions/TronHTLC';
// import { Button } from '@/components/ui/button';

export default function Home() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      new LocomotiveScroll();
    })();
  }, []);

  // const callInitiateHTLC = async () => {
  //   try {
  //     const tronHTLC = TronHTLCInteraction();

  //     // Define the HTLC parameters
  //     // const htlcParams = {
  //     //   amount: 10,
  //     //   expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  //     //   secretHash: '0xe4ccafa019d74e7ee92b577f99c14c61781d98d85b8581704877421ad7bc4cad',
  //     //   tokenAddress: '0x0000000000000000000000000000000000000000', // TRX
  //     //   refundAddress: 'THqzGABvKhFY6R78XBidujgcXxLXu2YgSU',
  //     //   recipientAddress: 'TP1CQtpCPhNaNJNoSwxQeV7fzMrxJAV6by',
  //     // }

  //     // Call initiateHTLC and await the transaction
  //     debugger;
  //     const hash = '62ade3eeed0bb367f5fc6b08f864494b39d400f4a7e13a31126e735fdbf62a7f' //await tronHTLC.initiateHTLC(htlcParams);

  //     console.log('------------------------ 1');

  //     const htlcId = await tronHTLC.getHTLCId(hash);

  //     console.log('------------------------ 2');

  //     const htlcDetails = await tronHTLC.getHTLCDetails(htlcId || "0x0");
  //     console.log(htlcDetails);

  //   } catch (error) {
  //     console.error('Error initiating HTLC:', error);
  //   }
  // };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <Button
        onClick={callInitiateHTLC}
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        HTLC
      </Button> */}
      <Tabs defaultValue="send">
        <TabsContent value="send"><Swap /></TabsContent>
        <TabsContent value="receive">Change your password here.</TabsContent>
        <div className="fixed bottom-10 left-0 flex justify-center w-full m-auto">
          <TabsList>
            <TabsTrigger value="send">Send Profile</TabsTrigger>
            <TabsTrigger value="receive">Receive Profile</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
