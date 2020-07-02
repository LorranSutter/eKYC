/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

const initialUserData = require('../data/initialUserData.json');

class eKYC extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = initialUserData;

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async getCallerId(ctx) {
        let cid = new ClientIdentity(ctx.stub);
        const idString = cid.getID(); //'x509'
        // const idString2 = cid.getIDBytes(); //'x509'
        // const idString3 = cid.getMSPID(); //'x509'
        console.info('getCallerId:', idString);
        const idParams = idString.toString().split('::');
        return idParams[1].split('CN=')[1];
        // return [idString, idString2, idString3];
    }

    async getUserData(ctx, userId) {
        const userAsBytes = await ctx.stub.getState(userId);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userId} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    // TODO Think how to create a good userId
    async createUser(ctx, userId, firstName, lastName, id) {
        console.info('============= START : Create user ===========');

        const user = {
            docType: 'user',
            firstName,
            lastName,
            id
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create User ===========');
    }

    async approve(ctx, userId) {
        console.log('======== START : Approve company for user data access ==========');

        //  `relations` created for 2-way access like if company id is given then list of users will be fetched  and vice versa too.
        let relations = 'id1~id2';  //  relation type to be stored on blockchain (company~user or user~company)
        let companyUserIndexKey = await ctx.stub.createCompositeKey(relations, [companyId.toString(), userId.toString()]);  //  create company~user relation unique key
        let userCompanyIndexKey = await ctx.stub.createCompositeKey(relations, [userId.toString(), companyId.toString()]);  //  create user~company relation unique key

        // Validations for composite keys created
        if (!companyUserIndexKey) {
            throw new Error('Composite key: companyUserIndexKey is null');
        }

        if (!userCompanyIndexKey) {
            throw new Error('Composite key: userCompanyIndexKey is null');
        }

        console.log(companyUserIndexKey);

        //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
        await ctx.stub.putState(companyUserIndexKey, Buffer.from('\u0000'));    //  Store company~user unique key relation
        await ctx.stub.putState(userCompanyIndexKey, Buffer.from('\u0000'));    //  Store user~company unique key relation
        console.log('======== END : Relation of approved companies for users stored =========');
    }

    async queryAllUsersData(ctx) {
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
