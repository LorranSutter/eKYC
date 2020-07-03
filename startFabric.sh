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
node enrollAdmin.js
node registerUser.js
node populate.js
popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Next, use the eKYC applications to interact with the deployed eKYC contract.
The eKYC applications are available in multiple programming languages.
Follow the instructions for the programming language of your choice:

JavaScript:

  Start by changing into the "api" directory:
    cd api

  Next, install all required packages:
    npm install

  Then run the following applications to enroll the admin user, and register a new user
  called appUser which will be used by the other applications to interact with the deployed
  eKYC contract:
    node enrollAdmin
    node registerUser

  You can run the invoke application as follows. By default, the invoke application will
  create a new car, but you can update the application to submit other transactions:
    node invoke

  You can run the query application as follows. By default, the query application will
  return all cars, but you can update the application to evaluate other transactions:
    node query

EOF
