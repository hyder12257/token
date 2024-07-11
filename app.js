const Web3 = require('web3');
const detectEthereumProvider = require('@metamask/detect-provider');

let web3;
let accounts;

async function connectWallet() {
    const provider = await detectEthereumProvider();
    if (provider) {
        web3 = new Web3(provider);
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('wallet-address').innerText = `Connected Wallet: ${accounts[0]}`;
    } else {
        console.error('Please install MetaMask!');
    }
}

document.getElementById('connect-wallet').addEventListener('click', connectWallet);

async function sendTokens() {
    const input = document.getElementById('addresses').value;
    const lines = input.split('\n');
    const transactions = lines.map(line => {
        const [address, amount] = line.split(',');
        return { address: address.trim(), amount: web3.utils.toWei(amount.trim(), 'ether') };
    });

    for (const tx of transactions) {
        try {
            const receipt = await web3.eth.sendTransaction({
                from: accounts[0],
                to: tx.address,
                value: tx.amount
            });
            console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error(`Failed to send to ${tx.address}: ${error.message}`);
        }
    }
}

document.getElementById('send-tokens').addEventListener('click', sendTokens);
