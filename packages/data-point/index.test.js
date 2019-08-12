const { DataPoint, Model, ifThenElse, map } = require("./index");

const myModel = Model({
  name: "myModel",

  before: "$a",

  value: ["$b", input => input.toUpperCase()],

  after: ifThenElse({
    if: input => input === "FOO",
    then: () => "foo yes!",
    else: input => `foo no! got ${input}`
  }),

  catch: error => {
    console.log(error); // eslint-disable-line
    return "failed";
  },

  params: {
    uid: acc => acc.reducer.id,
    ttl: "20h"
  }
});

async function main() {
  const datapoint = DataPoint();

  // making the linter happy while I test this
  let result = null;

  const cache = new Map();

  // cache hit/lookup
  datapoint.cache.get = (input, acc) => {
    const uid = acc.reducer.params.uid(acc);
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

  console.log(result); // eslint-disable-line
}

main();
