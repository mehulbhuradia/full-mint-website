// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NFT is ERC721,Ownable {

    uint256 public tokenCounter;
    mapping(string => uint8) existingURIs;
    
    constructor() ERC721("NFT", "NFT") {
        tokenCounter=0;
    }

    function withdraw() external onlyOwner {
        (bool success,) = owner().call{value: address(this).balance}('');
        require(success,'withdraw failed');
    }

    function payToMint(
        string memory metadataURI
    ) public payable {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require (msg.value >= 0.0001 ether, 'Need to pay up!');
        
        _safeMint(msg.sender, tokenCounter);
        
        tokenCounter++;
        existingURIs[metadataURI] = 1;
    }

   // Override isApprovedForAll to auto-approve OS's proxy contract
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
      // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        // otherwise, use the default ERC721.isApprovedForAll()
        return  ERC721.isApprovedForAll(_owner, _operator);
    }
}