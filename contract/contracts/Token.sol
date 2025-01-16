// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./SafeMath.sol";
import "./IToken.sol";
import "./Ownable.sol";
import "./Context.sol";

contract Token is IToken , Context, Ownable{

    mapping(address => uint256) private _balances; //_balances[address];

    mapping(address => mapping(address =>uint256)) private _allowance; //_allowance[address1][address2]

    uint256 private _totalSupply;
    uint256 private _cap;// end of totalsupply for later
    uint8 private _decimals;
    string private _symbol;
    string private _name;

    constructor(string memory TOKEN_NAME,string memory TOKEN_SYMBOL,uint8 DECIMALS,uint256 TOTAL_SUPPLY , uint256 CAP) public{
        _name = TOKEN_NAME;
        _symbol = TOKEN_SYMBOL;
        _decimals = DECIMALS;
        _totalSupply = TOTAL_SUPPLY;
        _cap = CAP;

        address msgSender = _msgSender();
        _balances[msgSender]= _totalSupply;
        emit Transfer(address(0), msgSender, _totalSupply);
    }

    function totalSupply() external view returns(uint256){
        return _totalSupply;
    }

    function decimals() external view returns(uint256){
        return _decimals;
    }

    function symbol() external view returns(string memory){
        return _symbol;
    }

    function name() external view returns(string memory){
        return _name;
    }

    function getOwner() external view returns(address){
        return _msgSender();
    }

    function balanceOf(address account) external view returns(uint256){
        return _balances[account];
    }

    function transfer(address recipte, uint256 amount) external returns(bool){
        _transfer(_msgSender(), recipte, amount);
        return true;

    }

    function allowance(address _owner,address spender) external view returns(uint256){
        return _allowance[_owner][spender];

    }

    function approve(address spender , uint256 amount) external  returns(bool){
        _approve(_msgSender(),spender, amount);
        return true;
    }

    function transferFrom(address sender,address recipte,uint256 amount) external  returns(bool){
        _transfer(sender ,recipte,amount);
        _approve(sender,_msgSender(), SafeMath.sub(_allowance[sender][_msgSender()],amount,"transfer amount exceeds allowance"));
        return true;
    }

    function _transfer(address sender , address recipte,uint256 amount) internal {
        require(sender != address(0),"transfer from the zero address");
        require(recipte!= address(0),"Transfer to the zero address");
        // require(_balances[sender] >= amount ,"Transfer amount exceeds balance");
        _balances[sender] = SafeMath.sub(_balances[sender],amount,"Transfer amount exceeds balance");
        _balances[recipte] = SafeMath.add(_balances[recipte],amount);
        emit Transfer(sender, recipte, amount);
    }

    function _approve(address owner,address spender ,uint256 amount) internal{
        require(owner != address(0),"transfer from the zero address");
        require(spender!= address(0),"Transfer to the zero address");
        _allowance[owner][spender]=amount;
        emit Approval(owner, spender, amount);
    }

    function increaseAllowance(address spender,uint256 addValue) public returns(bool){
        _approve(_msgSender(), spender, SafeMath.add(_allowance[_msgSender()][spender],addValue));
        return true;
    }

    function decreaseAllowance(address spender,uint256 subtractValue) public returns(bool){
        _approve(_msgSender(), spender, SafeMath.sub(_allowance[_msgSender()][spender],subtractValue,"approve amount exeeds allowance"));
        return true;
    }

    function mint(uint256 amount) public onlyOwner() returns(bool){
        _mint(_msgSender(),amount);
        return true;
    }

    function _mint(address account ,uint256 amount) internal{
        require(account != address(0),"this address is zero address");
        _totalSupply = SafeMath.add(_totalSupply,amount);
        _balances[account]= SafeMath.add(_balances[account],amount);
        emit Transfer(address(0), account, amount);
    }

    function burn(uint256 amount) public onlyOwner returns(bool){
        _burn(_msgSender(),amount);
        return true;
    }

    function _burn(address account,uint256 amount) internal{
        require(account != address(0),"this address is zero address");
        _totalSupply = SafeMath.sub(_totalSupply,amount,"burn amount token");
        _balances[account]= SafeMath.sub(_balances[account],amount);
        emit Transfer(account, address(0),amount);
    }

    function burnFrom(address account , uint256 amount) public onlyOwner() returns(bool){
        require(account != address(0),"this address is zero address");
        _burn(account,amount);
        _approve(account,_msgSender(), SafeMath.sub(_allowance[_msgSender()][account],amount,"transfer amount exceeds allowance"));
        return true;
    }

    function MintCap(uint256 amount) public onlyOwner() returns(bool){
        require(_cap > 0,"cap is 0");
        _mintCap(_msgSender(),amount);
        return true;
    }

    function _mintCap(address account, uint256 amount) internal{
        require(_totalSupply+amount <= _cap,"cap is 0");
        _mint(account , amount);
    }
}