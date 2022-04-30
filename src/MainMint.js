import { useState } from 'react';
import NFT from './NFT.json';
import { ethers } from 'ethers';

const NFTAddress="0x5E31D1b678018dF8527e9E5894f89419FAAc9Ae4";

const MainMint= ({accounts, setAccounts})=>{
    const [mintAmount,setMintAmount]=useState(1);
    const isConnected = Boolean(accounts?.[0]);

    async function handleMint(){
        
        if(window.ethereum){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                NFTAddress,
                NFT.abi,
                signer
            );
            try{
                const contentId = 'QmWU8nDYUTagvLE78Da8yHVrP3PdJ5wauGP8CCkVAp5xse';
                const metadataURI = `${contentId}/${mintAmount}.json`;
                const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${mintAmount}.png`;
    
                const response = await contract.payToMint(metadataURI,
                {
                    value: ethers.utils.parseEther('0.01'),
                });
                console.log('response: ',response);
            }catch(err){
                console.log("error: ",err);
            }
        }
    }

    const handleDecrement= () =>{
        if(mintAmount<1) return;
        setMintAmount(mintAmount - 1);
    };

    const handleIncrement= () =>{
        setMintAmount(mintAmount + 1);
    };
    
    return (
        <div>
        <h1>NFT Minter</h1>
        <p>I made this. Mint it and pay me for useless NFTs.</p>
        {isConnected ? (
            <div>
                <div>
                    <button onClick={handleDecrement}>-</button>
                    <input type="number" value={mintAmount}/>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <button onClick={handleMint}>Mint it.</button>
            </div>
        ):(
            <p> Connect your eth wallet to mint NFTs.</p>
        )}
        </div>
    );
};

export default MainMint;