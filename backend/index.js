import express from 'express';
import cors from 'cors';
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://bridge-contract-eth-to-polygon.vercel.app/'
}));

app.use(express.json());

const private_key = process.env.PRIVATE_KEY;
const sepolia_rpc_url = process.env.SEPOLIA_RPC_URL;
const polygon_rpc_url = process.env.POLYGON_AMOY_RPC_URL;
const eth_bridge_address = process.env.ETH_BRIDGE_ADDRESS;
const polygon_bridge_address = process.env.POLYGON_BRIDGE_ADDRESS;

import eth_bridge_abi from "./abi/EthBridgeABI.json" with { type: "json" };
import polygon_bridge_abi from "./abi/PolygonBridge.json" with { type: "json" };


const sepolia_provider = new ethers.JsonRpcProvider(sepolia_rpc_url); // this will be read Only
const polygon_provider = new ethers.JsonRpcProvider(polygon_rpc_url);

const signer = new ethers.Wallet(private_key,polygon_provider);
const eth_contract_object = new ethers.Contract(eth_bridge_address,eth_bridge_abi,sepolia_provider);
const polygon_contract_object = new ethers.Contract(polygon_bridge_address,polygon_bridge_abi, signer);

// const eventheard = async(user,amount)=>{
//     const tx = await(polygon_contract_object.mint(user,amount))
//     await tx.wait();
//     console.log("Minted tokens in Poly AMOY");
// }
// eth_contract_object.on("LockETH",eventheard);

const eventheard = async(user, amount)=>{
    try {
        // Mint tokens on Polygon Amoy
        const tx = await polygon_contract_object.mint(user, amount);

        console.log(`Polygon Amoy mint transaction hash: ${tx.hash}`);
        console.log(`Polygon Amoy Transaction: https://amoy.polygonscan.com/tx/${tx.hash}`);


        // Wait for transaction to be confirmed
        const receipt = await tx.wait();
        console.log(`Minted tokens in Poly AMOY: https://amoy.polygonscan.com/tx/${receipt.hash}`);
    } catch (error) {
        console.error("Error processing bridge transaction:", error);
    }
}

eth_contract_object.on("LockETH", (user, amount, event) => {
    eventheard(user, amount, event);
});

// Express endpoints
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Bridge backend is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/bridge-status', (req, res) => {
    res.json({
        ethBridgeAddress: eth_bridge_address,
        polygonBridgeAddress: polygon_bridge_address,
        status: 'Listening for bridge events'
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Bridge backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log('Listening for ETH bridge events...');
});