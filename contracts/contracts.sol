// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// ERC20 Token using OpenZeppelin with 140 Billion Supply
contract MyToken is ERC20, Ownable {
    constructor(address dexAddress) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(dexAddress, 140_000_000_000 * 10**decimals());
    }
}

// Simple DEX Contract
contract SimpleDEX is Ownable {
    using ECDSA for bytes32;

    MyToken public token;
    uint256 public feePercent = 1; // 1% Fee
    uint256 public totalFeesCollected; // ETH Fees
    string public claimableUsername;

    event Bought(address indexed buyer, uint256 amountETH, uint256 amountTokens);
    event Sold(address indexed seller, uint256 amountTokens, uint256 amountETH);
    event FeesClaimed(address indexed claimer, uint256 amount);

    constructor(string memory _username) Ownable(msg.sender) {
        token = new MyToken(address(this));
        claimableUsername = _username;
    }

    function buy() external payable {
        uint256 amountToBuy = (msg.value * 1000) / 0.001 ether; // 0.001 ETH = 1000 Tokens
        require(token.balanceOf(address(this)) >= amountToBuy, "Not enough tokens");
        
        uint256 fee = (msg.value * feePercent) / 100;
        uint256 finalAmount = amountToBuy;
        totalFeesCollected += fee;
        token.transfer(msg.sender, finalAmount);

        emit Bought(msg.sender, msg.value, finalAmount);
    }

    function sell(uint256 tokenAmount) external {
        require(token.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");

        uint256 ethAmount = (tokenAmount * 0.001 ether) / 1000;
        require(address(this).balance >= ethAmount, "Not enough ETH in the contract");
        
        uint256 fee = (ethAmount * feePercent) / 100;
        uint256 finalEthAmount = ethAmount - fee;
        totalFeesCollected += fee;
        
        token.transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(finalEthAmount);

        emit Sold(msg.sender, tokenAmount, finalEthAmount);
    }


    function verifyAndExtract(bytes memory messageBytes, bytes memory signature) public pure returns (bool, string memory) {
        // Hash the message using keccak256
        bytes32 messageHash = keccak256(messageBytes);

        // Recover the address from the signature
        address recoveredAddress = messageHash.recover(signature);

        // Check if the recovered address matches the expected address
        if (recoveredAddress != 0x3Ac3480AeAab41e6E6E80a657bEe24ff95C3e348) {
            return (false, "Invalid Signature");
        }

        // Extract response body
        string memory responseBody = extractResponseBody(messageBytes);
        return (true, responseBody);
    }

    function extractResponseBody(bytes memory messageBytes) internal pure returns (string memory) {
        // Define marker to identify response body
        bytes memory responseBodyMarker = bytes("|response||body|");

        // Find the starting index of the response body
        uint responseBodyStart = indexOf(messageBytes, responseBodyMarker);
        require(responseBodyStart != type(uint).max, "Response body marker not found");

        // Calculate actual response body start (after marker)
        responseBodyStart += responseBodyMarker.length;

        // Extract the response body
        bytes memory responseBody = new bytes(messageBytes.length - responseBodyStart);
        for (uint i = responseBodyStart; i < messageBytes.length; i++) {
            responseBody[i - responseBodyStart] = messageBytes[i];
        }

        return string(responseBody);
    }

    function indexOf(bytes memory haystack, bytes memory needle) internal pure returns (uint) {
        if (needle.length == 0 || haystack.length < needle.length) {
            return type(uint).max;
        }
        for (uint i = 0; i <= haystack.length - needle.length; i++) {
            bool matchFound = true;
            for (uint j = 0; j < needle.length; j++) {
                if (haystack[i + j] != needle[j]) {
                    matchFound = false;
                    break;
                }
            }
            if (matchFound) {
                return i;
            }
        }
        return type(uint).max; // Not found
    }

    function parseUsername(bytes memory messageBytes) internal pure returns (string memory) {
        // Simple parsing assuming fixed JSON structure
        bytes memory searchKey = '"username":"';
        uint256 startIndex = findIndex(messageBytes, searchKey);
        require(startIndex != type(uint256).max, "Username not found");
        
        startIndex += searchKey.length;
        uint256 endIndex = startIndex;

        while (endIndex < messageBytes.length && messageBytes[endIndex] != '"') {
            endIndex++;
        }

        return string(slice(messageBytes, startIndex, endIndex - startIndex));
    }

    function findIndex(bytes memory data, bytes memory key) internal pure returns (uint256) {
        for (uint256 i = 0; i <= data.length - key.length; i++) {
            bool matchFound = true;
            for (uint256 j = 0; j < key.length; j++) {
                if (data[i + j] != key[j]) {
                    matchFound = false;
                    break;
                }
            }
            if (matchFound) return i;
        }
        return type(uint256).max;
    }

    function slice(bytes memory data, uint256 start, uint256 length) internal pure returns (bytes memory) {
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = data[start + i];
        }
        return result;
    }

    function claimFees(bytes memory messageBytes, bytes memory signature) external {
        (bool valid, string memory extractedUsername) = verifyAndExtract(messageBytes, signature);
        require(valid, "Invalid signature or verification failed");
        require(keccak256(abi.encodePacked(extractedUsername)) == keccak256(abi.encodePacked(claimableUsername)), "Username mismatch");

        uint256 fees = totalFeesCollected;
        totalFeesCollected = 0;
        payable(msg.sender).transfer(fees);

        emit FeesClaimed(msg.sender, fees);
    }

    function getClaimableFees() external view returns (uint256) {
        return totalFeesCollected;
    }

    receive() external payable {}
}

// Factory Contract to Deploy Token and DEX
contract TokenDEXFactory {
    event TokenAndDEXCreated(address tokenAddress, address dexAddress);

    function createTokenAndDEX(string memory username) external returns (address, address) {
        SimpleDEX dex = new SimpleDEX(username);
        MyToken token = dex.token();

        emit TokenAndDEXCreated(address(token), address(dex));
        return (address(token), address(dex));
    }
}