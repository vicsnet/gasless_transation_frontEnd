import React, { SyntheticEvent, useState } from 'react'
import abi from "../abi/abi.json"
import { Biconomy } from '@biconomy/mexa';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { ethers } from 'ethers';

const contractAddress = "0xA771Ec96dFbcaa420426188060CceDdBC89f9b66";
export type ExternalProvider = {
    isMetaMask?: boolean;
    isStatus?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
    send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
    request?: (request: { method: string, params?: Array<any> }) => Promise<any>
  }
  



const BuyToken = () => {
   
    const [buyt, setBuyT] = useState("");

    


    async function requestAccounts() {
        // @ts-ignore
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
      }



      async function BuyToken() {
        if (!buyt) return
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await requestAccounts()
          const biconomy : any = new Biconomy(
            window.ethereum as ExternalProvider,
            {
              apiKey: "sEe-yXjAV.3adbd593-6781-4b01-8942-b5650ae5aaae",
              debug: true,
              contractAddresses: [contractAddress]
            }
          );
        
          const provider = await biconomy.provider;
    
          const contractInstance = new ethers.Contract(
            contractAddress,
            abi,
            biconomy.ethersProvider
          );
          await biconomy.init();
        
    
          const { data } = await contractInstance.populateTransaction.buyToken(buyt)
    
          let txParams = {
            data: data,
            to: contractAddress,
            from: accounts[0],
            signatureType: "EIP712_SIGN",
          };
    
          await provider.send("eth_sendTransaction", [txParams]);
        }
    }


      const handleSubmit = (e : SyntheticEvent)=>{
        e.preventDefault();
        BuyToken();
        // write?.()
      }

    
  return (
    <div>
        <form>
            <input type="number" value={buyt} onChange={(e) =>setBuyT(e.target.value)}/>
            <button onClick={handleSubmit}>BuyToken</button>
        </form>
    </div>
  )
}
      
    
export default BuyToken