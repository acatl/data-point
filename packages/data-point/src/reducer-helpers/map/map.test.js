const { ReducerMap } = require("./map");
const { Accumulator } = require("../../Accumulator");
const { resolve } = require("../../resolve");

describe("ReducerMap", () => {
  const multiplyByTwo = value => value * 2;

  describe("constructor", () => {
    it("should set type to 'map'", () => {
      const reducer = new ReducerMap(multiplyByTwo);
      expect(reducer.type).toEqual("map");
    });

    it("should create a reducer from spec and assign to iterateeReducer", () => {
      const reducer = new ReducerMap(multiplyByTwo);
      expect(reducer.iterateeReducer).toHaveProperty("type", "function");
    });
  });

  describe("create", () => {
    it("should create a new instance of ReducerMap", () => {
      expect(ReducerMap.create(multiplyByTwo)).toBeInstanceOf(ReducerMap);
    });
  });

  describe("resolve", () => {
    it("should map reducers to each element on the provided array", async () => {
      const reducer = new ReducerMap(multiplyByTwo);

      const acc = new Accumulator({
        value: [1, 2, 3]
      });

      const result = await reducer.resolve(acc, resolve);
      expect(result).toEqual([2, 4, 6]);
    });
  });
});