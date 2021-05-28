import {fragmentSizes} from './reference_data/fragment_sizes'
const { SerializedTransaction } = require('raw-tx-splitter');


const from = "0100000003abd041c1202e8983fca9ae6972328029ff4352e1ab0b06421d92dc791106eb752000000000bffcec54531a129e20f2d7e0cca588e7a1870ae1194ffd811028836c052ec6678f5fbc9124010000004ef05b6fabd041c1202e8983fca9ae6972328029ff4352e1ab0b06421d92dc791106eb755e00000000b970226903d59a0c01000000001976a91417532b793a4c38166b7822199aa7f5dd3397845d88ac5802000000000000160014f7a2b9f4bc730eb00df6f0f0cafa974a5f8e688658020000000000001976a914ac035b8c12058c9b35fb0161f49790ee2d246d7d88acb8084b20"
const to = `CTransaction(
                    nVersion=1
                    vin=[
                        CTxIn(prevout=COutPoint(hash=75eb061179dc921d42060babe15243ff2980327269aea9fc83892e20c141d0ab n=32) scriptSig= nSequence=1424817343), 
                        CTxIn(prevout=COutPoint(hash=91bc5f8f67c62e056c83281081fd4f19e10a87a1e788a5cce0d7f2209e121a53 n=292) scriptSig= nSequence=1868296270), 
                        CTxIn(prevout=COutPoint(hash=75eb061179dc921d42060babe15243ff2980327269aea9fc83892e20c141d0ab n=94) scriptSig= nSequence=1763864761)
                    ] 
                    vout=[
                        CTxOut(nValue=0.17603285 scriptPubKey=76a91417532b793a4c38166b7822199aa7f5dd3397845d88ac), 
                        CTxOut(nValue=0.00000600 scriptPubKey=0014f7a2b9f4bc730eb00df6f0f0cafa974a5f8e6886),
                        CTxOut(nValue=0.00000600 scriptPubKey=76a914ac035b8c12058c9b35fb0161f49790ee2d246d7d88ac)
                    ] 
                    wit=CTxWitness(CScriptWitness();CScriptWitness();CScriptWitness()) 
                    nLockTime=541788344
                )
`



function getCValue(cString: string, property: string):string {
    const whiteSpaceAndBrackets = /[\s()]+/g;
    const propertyStartIndex = cString.indexOf(`${property}=`);
    const lengthOfProperty = property.length;
    const indexOfValue = propertyStartIndex + lengthOfProperty + 1; //+1 because we are inclusing the = character
    const propertyStartToStringEnd = cString.substring(indexOfValue);
    const indexOfFirstSpace = propertyStartToStringEnd.search(whiteSpaceAndBrackets);
    return propertyStartToStringEnd.substring(0, indexOfFirstSpace);
}

function parseVins(cArray: string, property: string) {
    const propertyStartIndex = cArray.indexOf(`${property}=[`);
    const lengthOfarray = property.length;
    const indexOfValue = propertyStartIndex + lengthOfarray + 2; //+2 because we are inclusing the =[ characters
    const arrayStartToStringEnd = cArray.substring(indexOfValue);
    const indexOfEndBracket = arrayStartToStringEnd.indexOf(']');
    const array = arrayStartToStringEnd.substring(0, indexOfEndBracket);

    let indexes = [];
    let i=-1;
    while( (i=array.indexOf("CTxIn(", i+1) ) >= 0) {
        indexes.push(i);
    }
    let stringArray = [];
    for (i=0; i < indexes.length; i++) {
        let elementToPush = array.substring(indexes[i]);
        if (i < indexes.length)  {
            elementToPush = array.substring(indexes[i], indexes[i + 1]);
        }
        stringArray.push(elementToPush)
    }

    let result = [];
        for (let i = 0; i < stringArray.length; i++) {
            let object = {
                prevout: {
                    hash: getCValue(stringArray[i], "hash"),
                    n: getCValue(stringArray[i], "n"),
                },
                scriptSig: getCValue(stringArray[i], "scriptSig"),
                nSequence: getCValue(stringArray[i], "nSequence"),
            };
            result.push(object);
        }


    return result;
}


function parseVouts(cArray: string, property: string) {
    const propertyStartIndex = cArray.indexOf(`${property}=[`);
    const lengthOfarray = property.length;
    const indexOfValue = propertyStartIndex + lengthOfarray + 2; //+2 because we are inclusing the =[ characters
    const arrayStartToStringEnd = cArray.substring(indexOfValue);
    const indexOfEndBracket = arrayStartToStringEnd.indexOf(']');
    const array = arrayStartToStringEnd.substring(0, indexOfEndBracket);

    let indexes = [];
    let i=-1;
    while( (i=array.indexOf("CTxOut(", i+1) ) >= 0) {
        indexes.push(i);
    }
    let stringArray = [];
    for (i=0; i < indexes.length; i++) {
        let elementToPush = array.substring(indexes[i]);
        if (i < indexes.length)  {
            elementToPush = array.substring(indexes[i], indexes[i + 1]);
        }
        stringArray.push(elementToPush)
    }

    let result = [];
        for (let i = 0; i < stringArray.length; i++) {
            let object = {
                scriptSig: getCValue(stringArray[i], "scriptPubKey"),
                nSequence: getCValue(stringArray[i], "nValue"),
            };
            result.push(object);
        }


    return result;
}

function parseWitnesses(cArray: string, property: string) {
    const propertyStartIndex = cArray.indexOf(`${property}=CTxWitness(`);
    const lengthOfarray = property.length;
    const indexOfValue = propertyStartIndex + lengthOfarray + 2; //+2 because we are inclusing the =[ characters
    const arrayStartToStringEnd = cArray.substring(indexOfValue);
    const indexOfEndBracket = arrayStartToStringEnd.indexOf('))');
    const array = arrayStartToStringEnd.substring(0, indexOfEndBracket);

    let indexes = [];
    let i=-1;
    while( (i=array.indexOf("CScriptWitness(", i+1) ) >= 0) {
        indexes.push(i);
    }
    let stringArray = [];
    for (i=0; i < indexes.length; i++) {
        let elementToPush = array.substring(indexes[i]);
        if (i < indexes.length)  {
            elementToPush = array.substring(indexes[i], indexes[i + 1]);
        }
        stringArray.push(elementToPush)
    }

    return stringArray;
}

export class CTransaction {
    nVersion: string;
    nLocktime: string;
    vins: Array<object>;
    vouts: Array<object>;
    witnesses: Array<any>;
    
    constructor(cTransaction: string) {
        this.nVersion = getCValue(cTransaction, "nVersion");
        this.nLocktime = getCValue(cTransaction, "nLockTime");
        this.vins = parseVins(cTransaction, "vin");
        this.vouts = parseVouts(cTransaction, "vout");
        this.witnesses = parseWitnesses(cTransaction, "wit");
    }


}

console.log(to)
console.log(new CTransaction(to))