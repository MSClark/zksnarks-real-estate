

const Web3 = require('web3');
let web3 = new Web3('https://rinkeby.infura.io/v3/489eddc2cbc44439a1311c3856fe2619');

const contract = require("/Users/mclark/repo/Blockchain-Capstone/eth-contracts/build/contracts/SolnSquareVerifier.json");
const contractAddress = "0x470eBa3D8201CFa52Cc77acd419026A8Aa790E45";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const privateKey = "cb65fff59fc6d6794f23c301c1a0c981dc0deea5312505802677826cbca2b1b7\n";
const publicKey = "0x63937A216fe075Dfc055c42E7Bd5aC934Ab461b5";

// nftContract.methods.symbol().call().then(console.log);

web3.eth.defaultAccount = publicKey;
console.log(web3.eth.defaultAccount);

async function mint() {
    const nonce = await web3.eth.getTransactionCount(publicKey, 'latest'); //get latest nonce
    console.log(nonce);
    //the transaction
    const tx = {
        'from': publicKey,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.mint("0x63937A216fe075Dfc055c42E7Bd5aC934Ab461b5", 11).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
    signPromise.then((signedTx) => {

        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
            if (!err) {
                console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");
            } else {
                console.log("Something went wrong when submitting your transaction:", err)
            }
        });
    }).catch((err) => {
        console.log("Promise failed:", err);
    });
}

mint();



