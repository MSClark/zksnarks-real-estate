pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateERC721Token {

    SquareVerifier private verifier;

    constructor(address verifierAddress) public {
        verifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an tokenId & an address
    struct Solution {
        bool minted;
        uint256 tokenId;
        address from;
        uint256[2] input;
    }

    // TODO define an array of the above struct
    mapping(bytes32 => Solution) solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => bytes32) private submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address from);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input,
        address source,
        uint256 tokenId) public {
//        require(verifier.verifyTx(a, b, c, input), "Unable to verify Solution");

        // Create a unique key for tracking solutions
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));

        // Ensure the solution does not already exist
        require(solutions[solutionKey].tokenId == 0, "Solution already exists");

        solutions[solutionKey].minted = false;
        solutions[solutionKey].tokenId = tokenId;
        solutions[solutionKey].from = source;
        solutions[solutionKey].input = input;
        submittedSolutions[tokenId] = solutionKey;

        emit SolutionAdded(tokenId, source);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId) public returns (bool) {
        bytes32 key = submittedSolutions[tokenId];

        // Ensure the key really exists
        require(key != bytes32(0), "The solution with the provided tokenId was not found");

        // Ensure the token has not been minted before
        require(!solutions[key].minted, "The Solution has already been minted");

        // Esnure the owner is the one minting the Solution
        address owner = solutions[submittedSolutions[tokenId]].from;
        require(owner == to, "The destination address does not match the source address");

        solutions[key].minted = true;
        return true;
    }
}



























