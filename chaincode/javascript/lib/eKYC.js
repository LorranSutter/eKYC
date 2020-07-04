/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
// TODO maybe use shim to return success messages
// Example: return shim.success(Buffer.from('saveData Successful!'));
// const shim = require('fabric-shim');

const initialClientData = require('../data/initialClientData.json');
const initialFIData = require('../data/initialFIData.json');

class eKYC extends Contract {

    // TODO define an id counter for client
    // TODO define an id counter for fi

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const clients = initialClientData;
        const fis = initialFIData;

        for (let i = 0; i < clients.length; i++) {
            clients[i].docType = 'client';
            // TODO Use id counter for client
            await ctx.stub.putState('CLIENT' + i, Buffer.from(JSON.stringify(clients[i])));
            console.info('Added <--> ', clients[i]);
        }

        for (let i = 0; i < fis.length; i++) {
            fis[i].docType = 'fi';
            // TODO Use id counter for fi
            await ctx.stub.putState('FI' + i, Buffer.from(JSON.stringify(fis[i])));
            console.info('Added <--> ', fis[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // TODO Make possible to choose what info the caller wants
    async getClientData(ctx, clientId, fiId = null) {

        if (fiId) {
            const relations = await this.getRelationByFi(fiId);
            if (!relations.includes(clientId)) {
                return null;
            }
        }

        const clientAsBytes = await ctx.stub.getState(clientId);
        if (!clientAsBytes || clientAsBytes.length === 0) {
            throw new Error(`${clientId} does not exist`);
        }
        console.log(clientAsBytes.toString());
        return clientAsBytes.toString();
    }

    async getFinancialInstitutionData(ctx, fiId) {
        const fiAsBytes = await ctx.stub.getState(fiId);
        if (!fiAsBytes || fiAsBytes.length === 0) {
            throw new Error(`${fiId} does not exist`);
        }
        console.log(fiAsBytes.toString());
        return fiAsBytes.toString();
    }

    // TODO Think how to create a good clientId
    async createClient(ctx, clientId, firstName, lastName, id) {
        console.info('============= START : Create client ===========');

        const client = {
            docType: 'client',
            firstName,
            lastName,
            id
        };

        await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(client)));
        console.info('============= END : Create client ===========');
    }

    async createFinancialInstitution(ctx, fiId, name, id) {
        console.info('============= START : Create financial institution ===========');

        const fi = {
            docType: 'financial institution',
            name,
            id
        };

        await ctx.stub.putState(fiId, Buffer.from(JSON.stringify(fi)));
        console.info('============= END : Create financial institution ===========');
    }

    async approve(ctx, clientId, fiId) {
        console.log('======== START : Approve financial institution for client data access ==========');

        const clientFiIndexKey = await ctx.stub.createCompositeKey('clientId~fiId', [clientId.toString(), fiId.toString()]);
        const fiClientIndexKey = await ctx.stub.createCompositeKey('fiId~clientId', [fiId.toString(), clientId.toString()]);

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

    async getRelationByClient(ctx, clientId) {

        const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('clientId~fiId', [clientId.toString()]);

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

    async getRelationByFi(ctx, fiId) {

        const relationResultsIterator = await ctx.stub.getStateByPartialCompositeKey('fiId~clientId', [fiId.toString()]);

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
