const { Contract } = require('fabric-contract-api');
// TODO maybe use shim to return success messages
// Example: return shim.success(Buffer.from('saveData Successful!'));
// const shim = require('fabric-shim');

const initialClientData = require('../data/initialClientData.json');
const initialFIData = require('../data/initialFIData.json');

class eKYC extends Contract {

    constructor() {
        super();
        this.nextClientId = 0;
        this.nextFiId = 0;
    }

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const clients = initialClientData;
        const fis = initialFIData;

        for (const client of clients) {
            client.docType = 'client';
            await ctx.stub.putState('CLIENT' + this.nextClientId, Buffer.from(JSON.stringify(client)));
            console.info('Added <--> ', client);
            this.nextClientId++;
        }

        for (const fi of fis) {
            fi.docType = 'fi';
            await ctx.stub.putState('FI' + this.nextFiId, Buffer.from(JSON.stringify(fi)));
            console.info('Added <--> ', fi);
            this.nextFiId++;
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    async getClientData(ctx, fields, clientId, fiId = null) {

        if (fiId) {
            const relations = await this.getRelationByFi(fiId);
            if (!relations.includes(clientId)) {
                return null;
            }
        }

        const clientAsBytes = await ctx.stub.getState(clientId);
        if (!clientAsBytes || clientAsBytes.length === 0) {
            return null;
        }

        const clientAsJson = JSON.parse(clientAsBytes.toString());
        if (fields) {
            fields = fields.split(',');

            let result = {};
            for (const field of fields) {
                if (clientAsJson.hasOwnProperty(field)) {
                    result[field] = clientAsJson[field];
                }
            }
            return result;
        }
        return clientAsJson;
    }

    async getClientDataByFI(ctx, fields, clientId, fiId) {

        const relations = await this.getRelationByFi(ctx, fiId);
        if (!relations.includes(clientId)) {
            return null;
        }

        return await this.getClientData(ctx, fields, clientId);
    }

    async getFinancialInstitutionData(ctx, fiId) {
        const fiAsBytes = await ctx.stub.getState(fiId);
        if (!fiAsBytes || fiAsBytes.length === 0) {
            return null;
        }
        return fiAsBytes.toString();
    }

    async createClient(ctx, clientData) {
        console.info('============= START : Create client ===========');

        const client = {
            docType: 'client',
            ...JSON.parse(clientData)
        };

        await ctx.stub.putState('CLIENT' + this.nextClientId, Buffer.from(JSON.stringify(client)));
        this.nextClientId++;
        console.info('============= END : Create client ===========');
    }

    async createFinancialInstitution(ctx, fiData) {
        console.info('============= START : Create financial institution ===========');

        const fi = {
            docType: 'fi',
            ...JSON.parse(fiData)
        };

        await ctx.stub.putState('FI' + this.nextFiId, Buffer.from(JSON.stringify(fi)));
        this.nextFiId++;
        console.info('============= END : Create financial institution ===========');
    }

    async approve(ctx, clientId, fiId) {
        console.log('======== START : Approve financial institution for client data access ==========');

        const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [clientId, fiId]);
        const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [fiId, clientId]);

        if (!clientFiIndexKey) {
            throw new Error('Composite key: clientFiIndexKey is null');
        }

        if (!fiClientIndexKey) {
            throw new Error('Composite key: fiClientIndexKey is null');
        }

        await ctx.stub.putState(clientFiIndexKey, Buffer.from('\u0000'));
        await ctx.stub.putState(fiClientIndexKey, Buffer.from('\u0000'));
        console.log('======== END : Approve financial institution for client data access =========');
    }

    async getRelationsArray(ctx, relationResultsIterator) {
        let relationsArray = [];
        while (true) {

            const responseRange = await relationResultsIterator.next();

            if (!responseRange || !responseRange.value || !responseRange.value.key) {
                return JSON.stringify(relationsArray);
            }

            const { attributes } = await ctx.stub.splitCompositeKey(responseRange.value.key);

            relationsArray.push(attributes[1]);

        }
    }

    async getRelationByClient(ctx, clientId) {

        const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('clientId~fiId', [clientId]);

        return await this.getRelationsArray(ctx, relationResultsIterator);
    }

    async getRelationByFi(ctx, fiId) {

        const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('fiId~clientId', [fiId]);

        return await this.getRelationsArray(ctx, relationResultsIterator);
    }

    async queryAllData(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = eKYC;
