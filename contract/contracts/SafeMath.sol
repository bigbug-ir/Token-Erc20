// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.4.22 <0.9.0;

library SafeMath{
    function add(uint256 a,uint256 b) internal pure returns(uint256){
        uint256 c = a + b;
        require(c >= a,"safeMath: addition overflow");
        return c;
    }
    function sub(uint256 a,uint256 b) internal pure returns(uint256){
        return sub(a,b,"safeMath: subtract overflow");
    }
    function sub(uint256 a,uint256 b,string memory errorMessage) internal pure returns(uint256){
        require(b <= a , errorMessage);
        uint256 c = a -b;
        return c;
    }
    function mul(uint256 a, uint256 b) internal pure returns(uint256){
        if(a==0 || b==0){
            return 0;
        }
        uint256 c = a*b;
        require((c / a ) ==b ,"SafeMath: multiple overflow");
        return c;
    }
    function div(uint256 a,uint256 b)internal pure returns(uint256){
        return div(a,b,"SafeMath: division overflow");
    }
    function div(uint256 a,uint256 b,string memory errorMessage)internal pure returns(uint256){
        require(b > 0,errorMessage);
        uint256 c = a / b;
        return c;
    }
    function mod(uint256 a,uint256 b)internal pure returns(uint256){
        return mod(a,b,"SafeMath: modulo overflow");
    }
    function mod(uint256 a,uint256 b,string memory errorMessage)internal pure returns(uint256){
        require(b != 0,errorMessage);
        uint256 c = a % b;
        return c;
    }

}