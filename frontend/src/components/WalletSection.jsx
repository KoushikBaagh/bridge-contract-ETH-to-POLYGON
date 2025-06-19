import React from 'react'

function WalletSection(account, onConnect, onDisconnect) {
    async function connectWallet(params) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
      }
  return (
    <>
        <div>WalletSection has connectWallet & DisconnectWallet</div>
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
        </div>
    </>
  )
}

export default WalletSection