/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const eKYC = require('./lib/eKYC');

module.exports.eKYC = eKYC;
module.exports.contracts = [ eKYC ];
