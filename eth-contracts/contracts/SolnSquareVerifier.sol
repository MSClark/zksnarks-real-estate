pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateERC721Token {

    Verifier private verifier;

    constructor(address verifierAddr) public {
        verifier = Verifier(verifierAddr);
    }

    // TODO define a solutions struct that can hold an tokenId & an address
    struct Solution {
        bytes32 index;
        address ownerAddr;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 tokenId, address from);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(Verifier.Proof memory proof, uint256[2] memory input) internal {
        bytes32 key = getKey(proof, input);
        require(submittedSolutions[key].index == 0, "Unique solution required");
        require(verifier.verifyTx(proof, input), "Error in verification");
        Solution memory newSolution = Solution({index: key, ownerAddr: msg.sender});

        solutions.push(newSolution);
        submittedSolutions[key] = newSolution;

        emit SolutionAdded(key, newSolution.ownerAddr);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function NFTmint(address to, uint256 tokenId, Verifier.Proof memory proof, uint256[2] memory input) public {
        addSolution(proof, input);
        super.mint(to, tokenId);
    }

    function getKey(Verifier.Proof memory proof, uint256[2] memory input) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X, proof.b.Y, proof.c.X, proof.c.Y, input));
    }
}
