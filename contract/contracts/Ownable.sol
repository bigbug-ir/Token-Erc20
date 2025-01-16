// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Context.sol";

contract Ownable is Context{
    address private _owner;

    modifier onlyOwner(){
        require(_owner == _msgSender(),"Only owner cand do it");
        _;
    }

    event OwnershipTransferred(address indexed previousOwner,address indexed newOwner);

    constructor() public{
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns(address){
        return _owner;
    }

    function renounceOwnersip() public onlyOwner(){ // left ownr from this contract;
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner() {
        _transferOwnership(newOwner);
    }
    
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0),"New owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

}