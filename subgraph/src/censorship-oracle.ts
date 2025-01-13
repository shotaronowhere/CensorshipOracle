import {blockRange, lastBlock} from "../generated/schema"
import { ethereum, Bytes, BigInt } from '@graphprotocol/graph-ts'

export function handleBlock(block: ethereum.Block): void {
    // special case: hardcoded from yaml
    let n = block.number.toU64()

    if (n == 25349465) {
        let _lastBlock = new lastBlock(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(1))));
        _lastBlock.blockTimestamp = block.timestamp
        _lastBlock.blockNumber = block.number
        _lastBlock.save()
        let _lastBlockMonth = new lastBlock(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(2))));
        _lastBlockMonth.blockTimestamp = block.timestamp
        _lastBlockMonth.blockNumber = block.number
        _lastBlockMonth.save()
        return;
    } 
    // day
    if (n % 17280 == 0){
        let _lastBlock = lastBlock.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(1))));
        let _blockRange = new blockRange(Bytes.fromByteArray(Bytes.fromU64(_lastBlock!.blockNumber.toU64())));
        _blockRange.isDay = true
        updateBlockRange(_lastBlock!, _blockRange, block)
    }
    // month
    if (n % 518400 == 0){
        let lastBlockMonth = lastBlock.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(2))));
        let blockRangeMonth = new blockRange(Bytes.fromByteArray(Bytes.fromU64(lastBlockMonth!.blockTimestamp.toU64())));
        blockRangeMonth.isDay = false
        updateBlockRange(lastBlockMonth!, blockRangeMonth, block)
    }
}

function updateBlockRange(lastBlock: lastBlock, blockRange: blockRange, block: ethereum.Block): void {
    let _lastBlockTimestamp = lastBlock!.blockTimestamp.toU64()
    let _lastBlockNumber = lastBlock!.blockNumber.toU64()
    let _blockTimestamp = block.timestamp.toU64()
    let _blockNumber = block.number.toU64()

    // MISSING BLOCKS : (
    let expectedBlocksSinceLastBlock = (_blockTimestamp-_lastBlockTimestamp)/5
    let actualBlocksSinceLastBlock = _blockNumber - _lastBlockNumber
    let missingBlocks = expectedBlocksSinceLastBlock - actualBlocksSinceLastBlock

    let percentMissing = missingBlocks * 10000 / expectedBlocksSinceLastBlock

    blockRange.blockNumberLow = lastBlock!.blockNumber
    blockRange.blockNumberHigh = block.number
    blockRange.blockTimestampLow = lastBlock!.blockTimestamp
    blockRange.blockTimestampHigh = block.timestamp
    blockRange.missingBlocks = BigInt.fromU64(missingBlocks)
    blockRange.percentMissing = BigInt.fromU64(percentMissing)
    blockRange.save()

    lastBlock!.blockNumber = block.number
    lastBlock!.blockTimestamp = block.timestamp
    lastBlock!.save()
}