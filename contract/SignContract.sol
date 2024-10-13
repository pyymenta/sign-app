// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Sign
 * @dev Store & retrieve signs
 */
contract SignContract {
    struct Sign {
        string nickname;
        address owner;
    }

    Sign[] public signs;

    function addSign(string memory _nickname, address _owner) public {
        require(bytes(_nickname).length > 4, "Nickname should have more than 4 characters");

        signs.push(Sign(_nickname, _owner));
    }

    function getSigns() public view returns (Sign[] memory) {
        return signs;
    }
}
