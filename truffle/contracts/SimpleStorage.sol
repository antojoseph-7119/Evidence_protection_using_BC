// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
    mapping(string => string) idToHashMap;
    uint256 public one = 1;
    uint256 public zero = 0;
    
    function uploadHash(string memory id, string memory _hash) public {
        idToHashMap[id] = _hash;
    }

    function checkHash(string memory id, string memory hash)
        public
        view
        returns (uint256)
    {
        if (
            keccak256(abi.encodePacked((idToHashMap[id]))) ==
            keccak256(abi.encodePacked((hash)))
        ) {
            return one;
        } else {
            return zero;
        }
    }
}