import "./App.css";
import React, { useState, useEffect } from "react";
import BridgeForm from "./components/BridgeForm";
import WalletSection from "./components/WalletSection";
import Header from "./components/Header.jsx";
import MessageArea from "./components/MessageArea.jsx";

const ETH_BRIDGE_ADDRESS = "0x822E275ab86B42418aAfAe2b32754f1cc51B9aE5";
function App() {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [form, setForm] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div>
      <Header />
      <WalletSection
        account={account}
        onConnect={status}
        onDisconnect={status}
      />
      <BridgeForm />
      <MessageArea />
    </div>
  );
}

export default App;

// import "./App.css";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import ethBridgeAbi from "./abi/EthBridgeABI.json";

// const ETH_BRIDGE_ADDRESS = "0x822E275ab86B42418aAfAe2b32754f1cc51B9aE5";

// function App() {
//   const [signer, setSigner] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [isWalletConnecting, setIsWalletConnecting] = useState(false);
//   const [isBridging, setIsBridging] = useState(false);

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setMessage("MetaMask is not installed!");
//       return;
//     }
//     setIsWalletConnecting(true);
//     setMessage("Connecting to wallet...");
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const accounts = await provider.send("eth_requestAccounts", []);
//       const web3Signer = await provider.getSigner();
//       setSigner(web3Signer);
//       setAccount(accounts[0]);
//       setMessage(
//         `Wallet Connected: ${accounts[0].substring(
//           0,
//           6
//         )}...${accounts[0].substring(accounts[0].length - 4)}`
//       );
//     } catch (err) {
//       setMessage("Error connecting wallet. Please try again.");
//       console.error(err);
//     } finally {
//       setIsWalletConnecting(false);
//     }
//   };

//   const handleBridge = async (e) => {
//     e.preventDefault();
//     if (!signer || !amount) {
//       setMessage("Please connect your wallet and enter an amount.");
//       return;
//     }
//     if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
//       setMessage("Please enter a valid positive amount.");
//       return;
//     }

//     setIsBridging(true);
//     setMessage("Processing bridge transaction... Please wait.");

//     try {
//       const bridgeContract = new ethers.Contract(
//         ETH_BRIDGE_ADDRESS,
//         ethBridgeAbi,
//         signer
//       );

//       const amountToSend = ethers.parseEther(amount); // amount to send from ETH to WETH
//       const tx = await bridgeContract.Locking({
//         value: amountToSend,
//         gasLimit: 300000, // remix.ethereum also uses same for custom
//       });

//       const sepoliaExplorerLink = `https://sepolia.etherscan.io/tx/${tx.hash}`;

//       setMessage(
//         `Transaction sent! Waiting for confirmation...\n\nSepolia Transaction: ${sepoliaExplorerLink}`
//       );
//       console.log("Transaction hash:", tx.hash);
//       console.log("Sepolia Explorer Link:", sepoliaExplorerLink);

//       await tx.wait();

//       setMessage(
//         `Success! ${amount} ETH locked. WETH will be minted on Amoy shortly.\n\n` +
//           `Sepolia Transaction: ${sepoliaExplorerLink}\n\n`
//       );
//       setAmount("");
//     } catch (error) {
//       console.error("Bridging failed:", error);

//       // Detailed error logging for debugging
//       console.log("Error details:", {
//         error,
//         message: error.message,
//         reason: error.reason,
//         code: error.code,
//         data: error.data,
//       });

//       let errorMessage = "Transaction failed.";

//       if (error.reason) {
//         errorMessage = error.reason;
//       } else if (error.data) {
//         errorMessage = `Contract revert: ${error.data}`;
//       } else if (error.message) {
//         if (error.message.includes("user rejected transaction")) {
//           errorMessage = "Transaction rejected by user.";
//         } else if (error.message.includes("insufficient funds")) {
//           errorMessage = "Insufficient funds for transaction.";
//         } else if (error.message.includes("execution reverted")) {
//           const revertMatch = error.message.match(/execution reverted: (.*?)"/);
//           errorMessage = revertMatch
//             ? `Contract error: ${revertMatch[1]}`
//             : "Contract execution reverted";
//         }
//       }

//       setMessage(`Error: ${errorMessage}`);
//     } finally {
//       setIsBridging(false);
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         // Optionally clear message after 5 secs only if not an error
//         if (!message.toLowerCase().includes("error")) {
//           setMessage("");
//         }
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   return (
//     <div className="app-container">
//       <h1>ETH Bridge</h1>
//       <p
//         style={{
//           fontSize: "0.9em",
//           color: "#aaa",
//           marginTop: "-20px",
//           marginBottom: "30px",
//         }}
//       >
//         Sepolia <span style={{ color: "#007AFF" }}>&rarr;</span> Amoy
//       </p>

//       {!account ? (
//         <button
//           onClick={connectWallet}
//           disabled={isWalletConnecting}
//           className="connect-wallet-button"
//         >
//           {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
//         </button>
//       ) : (
//         <p
//           style={{
//             fontSize: "0.9em",
//             color: "#a0a0a0",
//             marginBottom: "20px",
//             wordBreak: "break-all",
//           }}
//         >
//           Connected: {account}
//         </p>
//       )}

//       <hr />

//       <form onSubmit={handleBridge}>
//         <h3>Bridge Native ETH</h3>
//         <input
//           type="text"
//           placeholder="Amount (e.g., 0.1 ETH)"
//           value={amount}
//           onChange={(e) => {
//             const val = e.target.value;
//             // Allow only numbers and a single decimal point
//             if (/^\d*\.?\d*$/.test(val)) {
//               setAmount(val);
//             }
//           }}
//           disabled={!account || isBridging}
//         />
//         <button type="submit" disabled={!account || isBridging || !amount}>
//           {isBridging ? "Bridging..." : "Lock & Bridge ETH"}
//         </button>
//       </form>

//       {message && (
//         <div
//           className={`message-area ${message ? "visible" : ""}`}
//           style={{
//             background: message.includes("Error")
//               ? "rgba(255,0,0,0.1)"
//               : "rgba(0,255,0,0.1)",
//             padding: "15px",
//             borderRadius: "5px",
//             marginTop: "20px",
//           }}
//         >
//           <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
//             {message.split("\n").map((line, index) => {
//               if (
//                 line.includes("https://sepolia.etherscan.io") ||
//                 line.includes("https://amoy.polygonscan.com")
//               ) {
//                 const [prefix, url] = line.split(": ");
//                 if (url) {
//                   return (
//                     <p key={index}>
//                       {prefix}:{" "}
//                       <a
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{
//                           color: "#007AFF",
//                           textDecoration: "underline",
//                         }}
//                       >
//                         View on Explorer
//                       </a>
//                     </p>
//                   );
//                 }
//               }
//               return <p key={index}>{line}</p>;
//             })}
//           </div>
//           {message.includes("Error") && (
//             <p style={{ fontSize: "0.8em", marginTop: "10px" }}>
//               Check the browser console (F12) for more technical details.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
