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

    async createClient(ctx, clientData) {
        console.info('============= START : Create client ===========');

        const client = {
            docType: 'client',
            ...JSON.parse(clientData)
        };

        const newId = 'CLIENT' + this.nextClientId;
        this.nextClientId++;

        await ctx.stub.putState(newId, Buffer.from(JSON.stringify(client)));
        console.info('============= END : Create client ===========');

        return newId;
    }

    async createFinancialInstitution(ctx, fiData) {
        console.info('============= START : Create financial institution ===========');

        const fi = {
            docType: 'fi',
            ...JSON.parse(fiData)
        };

        const newId = 'FI' + this.nextFiId;
        this.nextFiId++;

        await ctx.stub.putState(newId, Buffer.from(JSON.stringify(fi)));
        console.info('============= END : Create financial institution ===========');

        return newId;
    }

    async getClientData(ctx, clientId, fields) {

        const clientAsBytes = await ctx.stub.getState(clientId);
        if (!clientAsBytes || clientAsBytes.length === 0) {
            return null;
        }

        if (fields) {
            fields = fields.split(',');
            const clientAsJson = JSON.parse(clientAsBytes.toString());

            let result = {};
            for (const field of fields) {
                if (clientAsJson.hasOwnProperty(field)) {
                    result[field] = clientAsJson[field];
                }
            }
            return result;
        }
        return clientAsBytes;
    }

    async getClientDataByFI(ctx, fiId, clientId, fields) {

        const relations = await this.getRelationByFi(ctx, fiId);
        if (!relations.includes(clientId)) {
            return null;
        }

        return await this.getClientData(ctx, clientId, fields);
    }

    async getFinancialInstitutionData(ctx, fiId) {
        const fiAsBytes = await ctx.stub.getState(fiId);
        if (!fiAsBytes || fiAsBytes.length === 0) {
            return null;
        }
        return fiAsBytes.toString();
    }

    async approve(ctx, clientId, fiId) {
        console.info('======== START : Approve financial institution for client data access ==========');

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
        console.info('======== END : Approve financial institution for client data access =========');
    }

    // async approve2(ctx, clientId, fiId, approvedFields) {
    //     console.info('======== START : Approve financial institution for client data access ==========');

    //     const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [clientId, fiId]);
    //     const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [fiId, clientId]);

    //     if (!clientFiIndexKey) {
    //         throw new Error('Composite key: clientFiIndexKey is null');
    //     }

    //     if (!fiClientIndexKey) {
    //         throw new Error('Composite key: fiClientIndexKey is null');
    //     }

    //     await ctx.stub.putState(clientFiIndexKey, Buffer.from(JSON.stringify(approvedFields)));
    //     await ctx.stub.putState(fiClientIndexKey, Buffer.from(JSON.stringify(approvedFields)));
    //     console.info('======== END : Approve financial institution for client data access =========');
    // }

    async remove(ctx, clientId, fiId) {
        console.info('======== START : Remove financial institution for client data access ==========');

        const clientFiIterator = await ctx.stub.getStateByPartialCompositeKey('clientId~fiId', [clientId, fiId]);
        const clientFiResult = await clientFiIterator.next();
        if (clientFiResult.value) {
            await ctx.stub.deleteState(clientFiResult.value.key);
        }

        const fiClientIterator = await ctx.stub.getStateByPartialCompositeKey('fiId~clientId', [fiId, clientId]);
        const fiClientResult = await fiClientIterator.next();
        if (fiClientResult.value) {
            await ctx.stub.deleteState(fiClientResult.value.key);
        }

        console.info('======== END : Remove financial institution for client data access =========');
    }

    async getRelationsArray(ctx, relationResultsIterator) {
        let relationsArray = [];
        while (true) {

            const responseRange = await relationResultsIterator.next();

            if (!responseRange || !responseRange.value) {
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
                console.info(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}

module.exports = eKYC;
