import {} from "../generated/CensorshipOracle/CensorshipOracle"
import {blockRange, lastBlock} from "../generated/schema"
import { ethereum, ByteArray, Bytes, BigInt } from '@graphprotocol/graph-ts'

export function handleBlock(block: ethereum.Block): void {
    // special case: hardcoded from yaml
    let n = block.number.toU64()

    if (n == 25348018) {
        let _lastBlock = new lastBlock(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(7382819))));
        _lastBlock.blockTimestamp = block.timestamp
        _lastBlock.blockNumber = block.number
        _lastBlock.save()
    } else if (n % 7200 == 0){
        let _lastBlock = lastBlock.load(Bytes.fromByteArray(Bytes.fromBigInt(BigInt.fromU32(7382819))));

        let _lastBlockTimestamp = _lastBlock!.blockTimestamp.toU64()
        let _lastBlockNumber = _lastBlock!.blockNumber.toU64()
        let _blockTimestamp = block.timestamp.toU64()
        let _blockNumber = block.number.toU64()

        if (_lastBlockNumber < _blockNumber - 1) {

            // MISSING BLOCKS : (
            let expectedBlocksSinceLastBlock = (_blockTimestamp-_lastBlockTimestamp)/5
            let actualBlocksSinceLastBlock = _blockNumber - _lastBlockNumber
            let missingBlocks = expectedBlocksSinceLastBlock - actualBlocksSinceLastBlock

            let _blockRange = new blockRange(Bytes.fromByteArray(Bytes.fromU64(_lastBlockNumber)));
            _blockRange.blockNumberLow = _lastBlock!.blockNumber
            _blockRange.blockNumberHigh = block.number
            _blockRange.blockTimestampLow = _lastBlock!.blockTimestamp
            _blockRange.blockTimestampHigh = block.timestamp
            _blockRange.missingBlocks = BigInt.fromU64(missingBlocks)
            _blockRange.save()
        }
        _lastBlock!.blockNumber = block.number
        _lastBlock!.blockTimestamp = block.timestamp
        _lastBlock!.save()
    }
    //let blockEntity = new Block(Bytes.fromByteArray(Bytes.fromBigInt(block.number)))

    // logic?
}