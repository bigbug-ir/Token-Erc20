const Token = artifacts.require("Token");

module.exports=(deployer)=>{
    deployer.deploy(Token,'BigBug','BIB',2,100000000,200000000);
}