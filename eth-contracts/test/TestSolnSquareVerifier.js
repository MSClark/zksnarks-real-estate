// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SolnVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require("Verifier");
const Proof = require("../../zokrates/code/square/proof");

contract('TestSolnVerifier', accounts => {

    const acct1 = accounts[0];
    const acct2 = accounts[1];

    describe('test SolnSquareVerifier', function () {
        before(async function () {
            let verifier = await Verifier.new({ from: accounts[0] });
            this.contract = await SolnVerifier.new(verifier.address, {from: accounts[0]});
        });

        it('test mint', async function () {
            let acct2_bal = await this.contract.balanceOf(acct2);

            assert.equal(acct2_bal, 0, "cannot be 0");
            await this.contract.NFTmint(acct2, 21, Proof.proof, Proof.inputs, {from: acct1});
            let ownerAddress = await this.contract.ownerOf.call(21, {from: acct1});

            assert.equal(acct2, ownerAddress, "Error minting token");
        });

        it('fail mint for duplicate solution', async function () {
            let success = true;
            try {
                await this.contract.NFTmint(acct2, 22, Proof.proof, Proof.inputs, {from: acct1});
            }
            catch (e) {
                success = false;
            }
            assert.equal(success, false, "solution already exists");
        });
    });
})
