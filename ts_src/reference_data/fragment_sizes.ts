export enum fragmentSizes {
    transactionHash_LE = 64,
    utxoIndex_LE= 8,
    utxoSequence_LE= 8,
    outputSatoshis_LE= 16,
    compactSize_BE= 2,
    version_LE= 8,
    segwitMarker_BE= 2,
    segwitFlag_BE= 2,
    noOfInputs_BE= 2, //varint tho
    noOfOutputs_BE= 2, //varint tho
    noOfWitnesses_BE= 2, //varint tho??
    nLockTime= 7,
}