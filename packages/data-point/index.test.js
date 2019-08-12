const { DataPoint, Model, ifThenElse, map, parallel } = require("./index");

const myModel = Model({
  name: "myModel",

  before: "$a",

  value: ["$b", input => input.toUpperCase()],

  after: ifThenElse({
    if: input => input === "FOO",
    then: input => "foo yes!",
    else: input => `foo no! got ${input}`
  }),

  catch: error => {
    console.log(error);
    return "failed";
  },

  params: {
    uid: acc => acc.reducer.id,
    ttl: "20h"
  }
});

async function main() {
  const datapoint = DataPoint();

  let result;

  const cache = new Map();

  // cache hit/lookup
  datapoint.cache.get = (input, acc) => {
    const uid = acc.reducer.params.uid(acc);
    const value = cache.get(uid);
    return cache.get(uid);
  };

  // cache miss
  datapoint.cache.set = (input, acc) => {
    const uid = acc.reducer.params.uid(acc);
    cache.set(uid, input);
  };

  // const input = {
  //   a: {
  //     b: 'foo'
  //   }
  // }

  // console.time('resolve1')
  // result = await datapoint.resolve(input, myModel)
  // console.timeEnd('resolve1')
  // console.time('resolve2')
  // result = await datapoint.resolve(input, myModel)
  // console.timeEnd('resolve2')

  const input = [
    {
      a: {
        b: "foo"
      }
    },
    {
      a: {
        b: "bar"
      }
    },
    {
      a: {
        b: "baz"
      }
    }
  ];

  result = await datapoint.resolve(input, map(myModel));

  console.log(result);
}

main();
