const fs = require('fs');
const path = require('path');

const { Gateway, Wallets } = require('fabric-network');

async function getGateWay(orgNumber, userName) {
    // load the network configuration
    const ccpPath = path.resolve(
        __dirname,
        '..',
        '..',
        'test-network',
        'organizations',
        'peerOrganizations',
        `org${orgNumber}.example.com`,
        `connection-org${orgNumber}.json`
    );

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, '../wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: true },
    });

    return gateway;
}

exports.evaluateTransaction = async (transaction, orgNumber, userName, params = null) => {

    const gateway = await getGateWay(orgNumber, userName);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('eKYC');
    const result =
        params ?
            await contract.evaluateTransaction(transaction, ...params) :
            await contract.evaluateTransaction(transaction);

    gateway.disconnect();

    return result;
};

exports.submitTransaction = async (transaction, orgNumber, userName, params = null) => {

    const gateway = await getGateWay(orgNumber, userName);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('eKYC');
    const result =
        params ?
            await contract.submitTransaction(transaction, ...params) :
            await contract.submitTransaction(transaction);

    gateway.disconnect();

    return result;
};