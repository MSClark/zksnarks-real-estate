var ERC721MintableComplete = artifacts.require('RealEstateERC721Token');

contract('TestERC721Mintable', accounts => {

    const totalSupply = 10;
    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (let i = 0; i < totalSupply; i++) {
                await this.contract.mint(account_two, i, {from: account_one});
            }
        })

        it('should return total supply', async function () {
            let actualSupply = await this.contract.totalSupply.call();
            assert.equal(actualSupply, totalSupply, "Total supply does not match actual supply");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf.call(account_two);
            assert.equal(balance, 10, "Token count does not match");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Wrong tokenURI");
        })

        it('should transfer token from one owner to another', async function () {
            let tokenId = 1;
            await this.contract.transferFrom(account_two, account_one, tokenId, { from: account_two });
            let newOwner = await this.contract.ownerOf.call(tokenId);
            assert.equal(newOwner, account_one, "Error transferring tokens");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
            let success = true;
            try {
                await this.contract.mint(account_one, 100, { from: account_two });
            }
            catch (e) {
                success = false;
            }

            assert.equal(success, false, "only the contract owner can mint tokens");
        })

        it('should return contract owner', async function () {
            let owner = await this.contract.getOwner.call();
            assert.equal(owner, account_one, "Owner doesnt match");
        })

    });
})
