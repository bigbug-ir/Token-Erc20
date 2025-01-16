// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


interface IToken{
    function totalSupply() external view returns(uint256);
    function decimals() external view returns(uint256) ;
    function symbol() external view returns(string memory);
    function name() external view returns(string memory);
    function getOwner() external view returns(address);
    function balanceOf(address account) external view returns(uint256);
    function transfer(address recipte, uint256 amount) external returns(bool);
    function allowance(address _owner,address spender) external view returns(uint256);
    function approve(address spender , uint256 amount) external returns(bool);
    function transferFrom(address from,address to,uint256 amount) external returns(bool);

    event Transfer(address indexed from ,address indexed to,uint256 value);
    event Approval(address indexed owner ,address indexed spender,uint256 value);
}