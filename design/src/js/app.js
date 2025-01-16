$(()=>{
    $(window).load(()=>{
        PrepareNetwork();
    });
});

let JsonContract = null;
var web3 = null;
let MyContract = null;
let owner = null;
let TokenName = null;
let TokenSymbol = null;
let TokenSupply = null;
let Balance_CurrentAccount = 0;
let CurrentAccount = null;

async function PrepareNetwork(){
    await loadWeb3();
    await loadDataSmartContract();
}

async function loadWeb3(){
    if(window.ethereum){
        window.web3 = new Web3(window.ethereum);
        await ethereum.request({method : 'eth_requestAccounts'}).then((accounts)=>{
            CurrentAccount = accounts[0];
            web3.eth.defaultAccount=CurrentAccount;
            setCurrentAccount();
        });
    }else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
    }else{
        window.alert('Non-Ethereum browser detectd. You should consider trying MetaMask!!!');
    }
    ethereum.on('accountChanged',handleAccountChanged);
    ethereum.on('chainChanged',handleChainChanged);
}


function setCurrentAccount(){
    $('#Address').text(CurrentAccount);
}

async function handleAccountChanged(){
    await ethereum.request({method:'eth_requestAccounts'}).then((accounts)=>{
        CurrentAccount= accounts[0];
        web3.eth.defaultAccount= CurrentAccount;
        setCurrentAccount();
        window.location.reload();
    });
}

function handleChainChanged(){
    window.location.reload();
}

async function loadDataSmartContract(){
    await $.getJSON('Token.json', function(contractData) {
        JsonContract = contractData;
        });

    web3 = await window.web3;

    const networkId = await web3.eth.net.getId();

    const networkData = JsonContract.networks[networkId];
    if(networkData) {
        MyContract = new web3.eth.Contract(JsonContract.abi, networkData.address);

        TokenName = await  MyContract.methods.name().call();
        TokenSymbol = await  MyContract.methods.symbol().call();
        TotalSupply = await  MyContract.methods.totalSupply().call();
        Owner = await  MyContract.methods.owner().call();
        Blence_CurrentAccount = await  MyContract.methods.balanceOf(CurrentAccount).call();


        $('#TokenName').text(TokenName);
        $('#TokenSymbol').text(TokenSymbol);
        $('#TotalSupply').text(TotalSupply/100);
        $('#Owner').text(Owner);
        $('#Blence_CurrentAccount').text(Blence_CurrentAccount/100);


    }
    $(document).on('click','#mint',mint);
    $(document).on('click','#transfer',transfer);
    $(document).on('click','#Approve',Approve);
    $(document).on('click','#TransfeFrom',transferFrom);
    $(document).on('click','#Allowance',Allowance);
    $(document).on('click','#increaseAllowance',increaseAllowance);
    $(document).on('click','#decreaseAllowance',decreaseAllowance);
    $(document).on('click', '#Burn', burn);
    $(document).on('click', '#BurnFrom', burnFrom);
    $(document).on('click', '#mintcap', mintCap);


}

function mint(){
    if(Owner.toLowerCase() != CurrentAccount){
        window.alert('Only owner can do it');
        return;
    }
    let amount = $(`#amountmint`).val();
    if(amount.trim() == ''){
        window.alert('Please fill the text...');
        return;
    }
    MyContract.methods.mint(amount).send({from: CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Transfer.returnValues[2]/100} Tokens minted by ${Instance.events.Transfer.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    });
}

function transfer(){
    let amount = $('#AmountAdressToTransfer').val();
    let address = $('#AdressToTransfer').val();

    if(amount.trim() == '' || address.trim() == ''){
        alert('Please fill text...');
    }

    MyContract.methods.transfer(address,amount).send({from:CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Transfer.returnValues[2]/100} Tokens transfred from ${Instance.events.Transfer.returnValues[0]} send to ${Instance.events.Transfer.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    })
}

function Approve(){
    let amount = $('#AmountAdressToApprove').val();
    let address = $('#AdressToApprove').val();

    if(amount.trim() == '' || address.trim() == ''){
        alert('Please fill text...');
    }

    MyContract.methods.approve(address,amount).send({from:CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Approval.returnValues[2]/100} Tokens approve from ${Instance.events.Approval.returnValues[0]} approve to ${Instance.events.Approval.returnValues[1]}`);
    }).catch(error=>{
        console.log(error);
    });
}

function transferFrom(){
    let addressFrom = $('#AdressFromTransfeFrom').val();
    let addressTo = $('#AdressToTransfeFrom').val();
    let amount = $('#AmountAdressToTransfeFrom').val();

    if(amount.trim() == '' || addressTo.trim() == '' || addressFrom.trim() == ''){
        alert('Please fill text...');
    }
    MyContract.methods.transferFrom(addressFrom, addressTo, amount).send({from : CurrentAccount}).then(Instanse=> {
        alert(`${Instance.events.Transfer.returnValues[2]/100} Tokens transfred from ${Instance.events.Transfer.returnValues[0]} send to ${Instance.events.Transfer.returnValues[1]}`);
        alert(`${Instance.events.Approval.returnValues[2]/100} Tokens approve from ${Instance.events.Approval.returnValues[0]} approve to ${Instance.events.Approval.returnValues[1]}`);
    }).catch(error=> {
        console.log(error.message);
    });
}

async function Allowance(){
    let addressFrom = $('#AdressFromAllowance').val();
    let addressTo = $('#AdressToAllowance').val();
    if(addressTo.trim() == '' || addressFrom.trim() == ''){
        alert('Please fill text...');
    }

    let Allowance = await MyContract.methods.allowance(addressFrom,addressTo).call();
    alert(addressFrom + 'allowance to '+ addressTo +' = '+Allowance/100);
}

function increaseAllowance(){
    let amount = $('#AmountAdressToincreaseAllowance').val();
    let address = $('#AdressToincreaseAllowance').val();

    if(amount.trim() == '' || address.trim() == ''){
        alert('Please fill text...');
    }
    MyContract.methods.increaseAllowance(address,amount).send({from: CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Approval.returnValues[2]/100} Tokens approve from ${Instance.events.Approval.returnValues[0]} approve to ${Instance.events.Approval.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    });
}

function decreaseAllowance(){
    let amount = $('#AmountAdressTodecreaseAllowance').val();
    let address = $('#AdressTodecreaseAllowance').val();

    if(amount.trim() == '' || address.trim() == ''){
        alert('Please fill text...');
    }

    MyContract.methods.decreaseAllowance(address,amount).send({from:CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Approval.returnValues[2]/100} Tokens approve from ${Instance.events.Approval.returnValues[0]} approve to ${Instance.events.Approval.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    });
}

function burn(){
    let amount = $('#amountBurn').val();
    if(amount.trim()==''){
        alert('Please fill the text...');
    }
    if(Owner.toLowerCase() != CurrentAccount){
        alert('Only owner has access');
        return;
    }

    MyContract.methods.burn(amount).send({from: CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Transfer.returnValues[2]/100} Tokens transfred from ${Instance.events.Transfer.returnValues[0]} send to ${Instance.events.Transfer.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    });
}

function burnFrom(){
    let address = $('#AdressToBurnFrom').val();
    let amount = $('#AmountBurnFrom').val();

    if(amount.trim() == '' || address.trim() == ''){
        alert('Please fill text...');
        return;
    }

    MyContract.methods.burnFrom(address,amount).send({from:CurrentAccount}).then(Instance=>{
        alert(`${Instance.events.Transfer.returnValues[2]/100} Tokens transfred from ${Instance.events.Transfer.returnValues[0]} send to ${Instance.events.Transfer.returnValues[1]}`);
        alert(`${Instance.events.Approval.returnValues[2]/100} Tokens approve from ${Instance.events.Approval.returnValues[0]} approve to ${Instance.events.Approval.returnValues[1]}`);
    }).catch(error=>{
        console.log(error.message);
    })
}

function mintCap(){
    if(Owner.toLowerCase() != CurrentAccount){
        alert('Only owner has access');
        return;
    }
    let amount = $('#amountmintcap').val();
    if(amount.trim() == ''){
        alert('Please fill the text...');
        return;
    }

    if(amount <= 0){
        alert('cap is under 0');
        return;
    }

    MyContract.methods.MintCap(amount).send({from:CurrentAccount}).then(Instance=>{
        alert(Instance.events.Transfer.returnValues[2]/100 + ' Tokens Minted By ' + 
        Instance.events.Transfer.returnValues[1]);
    }).catch(error=>{
        console.log(error.message);
    });
}