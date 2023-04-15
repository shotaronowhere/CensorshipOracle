import {} from "../generated/CensorshipOracle/CensorshipOracle"
import {Block} from "../generated/schema"
import { ethereum, ByteArray, Bytes } from '@graphprotocol/graph-ts'

export function handleBlock(block: ethereum.Block): void {
    let blockEntity = new Block(Bytes.fromByteArray(Bytes.fromBigInt(block.number)))
    blockEntity.blockTimestamp = block.timestamp
    blockEntity.blockNumber = block.number
    blockEntity.save()
}