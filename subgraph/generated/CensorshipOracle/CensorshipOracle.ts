// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class CensorshipOracle__finishAndGetTestInfoResult {
  value0: BigInt;
  value1: BigInt;
  value2: boolean;
  value3: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: boolean,
    value3: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    return map;
  }

  getStartTimestamp(): BigInt {
    return this.value0;
  }

  getResultAvailableTimestamp(): BigInt {
    return this.value1;
  }

  getFinished(): boolean {
    return this.value2;
  }

  getPassed(): boolean {
    return this.value3;
  }
}

export class CensorshipOracle__getTestInfoResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: boolean;
  value5: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: boolean,
    value5: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    map.set("value5", ethereum.Value.fromBoolean(this.value5));
    return map;
  }

  getInversePercentNoncensoringValidators(): BigInt {
    return this.value0;
  }

  getInverseConfidenceLevel(): BigInt {
    return this.value1;
  }

  getStartTimestamp(): BigInt {
    return this.value2;
  }

  getResultAvailableTimestamp(): BigInt {
    return this.value3;
  }

  getFinished(): boolean {
    return this.value4;
  }

  getPassed(): boolean {
    return this.value5;
  }
}

export class CensorshipOracle__startTestResult {
  value0: Bytes;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: Bytes, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromFixedBytes(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getTestId(): Bytes {
    return this.value0;
  }

  getDuration(): BigInt {
    return this.value1;
  }

  getMaxMissingBlocks(): BigInt {
    return this.value2;
  }
}

export class CensorshipOracle__testParametersResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): BigInt {
    return this.value1;
  }
}

export class CensorshipOracle__testsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: boolean;
  value4: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: boolean,
    value4: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    map.set("value4", ethereum.Value.fromBoolean(this.value4));
    return map;
  }

  getStartTimestamp(): BigInt {
    return this.value0;
  }

  getResultAvailableTimestamp(): BigInt {
    return this.value1;
  }

  getMaxMissingBlocks(): BigInt {
    return this.value2;
  }

  getFinished(): boolean {
    return this.value3;
  }

  getPassed(): boolean {
    return this.value4;
  }
}

export class CensorshipOracle extends ethereum.SmartContract {
  static bind(address: Address): CensorshipOracle {
    return new CensorshipOracle("CensorshipOracle", address);
  }

  finishAndGetTestInfo(
    testId: Bytes
  ): CensorshipOracle__finishAndGetTestInfoResult {
    let result = super.call(
      "finishAndGetTestInfo",
      "finishAndGetTestInfo(bytes32):(uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(testId)]
    );

    return new CensorshipOracle__finishAndGetTestInfoResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBoolean(),
      result[3].toBoolean()
    );
  }

  try_finishAndGetTestInfo(
    testId: Bytes
  ): ethereum.CallResult<CensorshipOracle__finishAndGetTestInfoResult> {
    let result = super.tryCall(
      "finishAndGetTestInfo",
      "finishAndGetTestInfo(bytes32):(uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(testId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CensorshipOracle__finishAndGetTestInfoResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBoolean(),
        value[3].toBoolean()
      )
    );
  }

  getTestInfo(testId: Bytes): CensorshipOracle__getTestInfoResult {
    let result = super.call(
      "getTestInfo",
      "getTestInfo(bytes32):(uint64,uint64,uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(testId)]
    );

    return new CensorshipOracle__getTestInfoResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBoolean(),
      result[5].toBoolean()
    );
  }

  try_getTestInfo(
    testId: Bytes
  ): ethereum.CallResult<CensorshipOracle__getTestInfoResult> {
    let result = super.tryCall(
      "getTestInfo",
      "getTestInfo(bytes32):(uint64,uint64,uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(testId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CensorshipOracle__getTestInfoResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBoolean(),
        value[5].toBoolean()
      )
    );
  }

  slotTime(): BigInt {
    let result = super.call("slotTime", "slotTime():(uint64)", []);

    return result[0].toBigInt();
  }

  try_slotTime(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("slotTime", "slotTime():(uint64)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  startTest(
    inversePercentNoncensoringValidators: BigInt,
    inverseConfidenceLevel: BigInt
  ): CensorshipOracle__startTestResult {
    let result = super.call(
      "startTest",
      "startTest(uint64,uint64):(bytes32,uint64,uint64)",
      [
        ethereum.Value.fromUnsignedBigInt(inversePercentNoncensoringValidators),
        ethereum.Value.fromUnsignedBigInt(inverseConfidenceLevel)
      ]
    );

    return new CensorshipOracle__startTestResult(
      result[0].toBytes(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_startTest(
    inversePercentNoncensoringValidators: BigInt,
    inverseConfidenceLevel: BigInt
  ): ethereum.CallResult<CensorshipOracle__startTestResult> {
    let result = super.tryCall(
      "startTest",
      "startTest(uint64,uint64):(bytes32,uint64,uint64)",
      [
        ethereum.Value.fromUnsignedBigInt(inversePercentNoncensoringValidators),
        ethereum.Value.fromUnsignedBigInt(inverseConfidenceLevel)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CensorshipOracle__startTestResult(
        value[0].toBytes(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  testParameters(
    inversePercentNoncensoringValidators: BigInt,
    inverseConfidenceLevel: BigInt
  ): CensorshipOracle__testParametersResult {
    let result = super.call(
      "testParameters",
      "testParameters(uint64,uint64):(uint64,uint64)",
      [
        ethereum.Value.fromUnsignedBigInt(inversePercentNoncensoringValidators),
        ethereum.Value.fromUnsignedBigInt(inverseConfidenceLevel)
      ]
    );

    return new CensorshipOracle__testParametersResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_testParameters(
    inversePercentNoncensoringValidators: BigInt,
    inverseConfidenceLevel: BigInt
  ): ethereum.CallResult<CensorshipOracle__testParametersResult> {
    let result = super.tryCall(
      "testParameters",
      "testParameters(uint64,uint64):(uint64,uint64)",
      [
        ethereum.Value.fromUnsignedBigInt(inversePercentNoncensoringValidators),
        ethereum.Value.fromUnsignedBigInt(inverseConfidenceLevel)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CensorshipOracle__testParametersResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  tests(param0: Bytes): CensorshipOracle__testsResult {
    let result = super.call(
      "tests",
      "tests(bytes32):(uint64,uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );

    return new CensorshipOracle__testsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBoolean(),
      result[4].toBoolean()
    );
  }

  try_tests(param0: Bytes): ethereum.CallResult<CensorshipOracle__testsResult> {
    let result = super.tryCall(
      "tests",
      "tests(bytes32):(uint64,uint64,uint64,bool,bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CensorshipOracle__testsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBoolean(),
        value[4].toBoolean()
      )
    );
  }
}

export class FinishAndGetTestInfoCall extends ethereum.Call {
  get inputs(): FinishAndGetTestInfoCall__Inputs {
    return new FinishAndGetTestInfoCall__Inputs(this);
  }

  get outputs(): FinishAndGetTestInfoCall__Outputs {
    return new FinishAndGetTestInfoCall__Outputs(this);
  }
}

export class FinishAndGetTestInfoCall__Inputs {
  _call: FinishAndGetTestInfoCall;

  constructor(call: FinishAndGetTestInfoCall) {
    this._call = call;
  }

  get testId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class FinishAndGetTestInfoCall__Outputs {
  _call: FinishAndGetTestInfoCall;

  constructor(call: FinishAndGetTestInfoCall) {
    this._call = call;
  }

  get startTimestamp(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }

  get resultAvailableTimestamp(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }

  get finished(): boolean {
    return this._call.outputValues[2].value.toBoolean();
  }

  get passed(): boolean {
    return this._call.outputValues[3].value.toBoolean();
  }
}

export class StartTestCall extends ethereum.Call {
  get inputs(): StartTestCall__Inputs {
    return new StartTestCall__Inputs(this);
  }

  get outputs(): StartTestCall__Outputs {
    return new StartTestCall__Outputs(this);
  }
}

export class StartTestCall__Inputs {
  _call: StartTestCall;

  constructor(call: StartTestCall) {
    this._call = call;
  }

  get inversePercentNoncensoringValidators(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get inverseConfidenceLevel(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class StartTestCall__Outputs {
  _call: StartTestCall;

  constructor(call: StartTestCall) {
    this._call = call;
  }

  get testId(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }

  get duration(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }

  get maxMissingBlocks(): BigInt {
    return this._call.outputValues[2].value.toBigInt();
  }
}