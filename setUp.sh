#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=$(echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:])
if [ "$CC_SRC_LANGUAGE" != "go" -a \
  "$CC_SRC_LANGUAGE" != "golang" -a \
  "$CC_SRC_LANGUAGE" != "java" \
  -a "$CC_SRC_LANGUAGE" != "javascript" -a \
  "$CC_SRC_LANGUAGE" != "typescript" ]; then

  echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
  echo Supported chaincode languages are: go, java, javascript, and typescript
  exit 1

fi

# clean out any old identites in the wallets
rm -rf api/wallet/*

# launch network; create channel and join peer to channel
pushd ./test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -l ${CC_SRC_LANGUAGE}
popd

pushd ./api/utils
node enrollAdmin.js 1 admin1
node enrollAdmin.js 2 admin2
node registerUser.js 1 admin1 FI1
node registerUser.js 2 admin2 FI2
node populate.js 1 FI1
popd