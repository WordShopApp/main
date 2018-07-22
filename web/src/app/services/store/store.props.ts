export const StoreProps = {
  App: {
    Profile: 'App.Profile'
  },
  UI: {}
};

export function propList () {
  let pl = [];

  let outerKeys = Object.keys(StoreProps);
  for (let ok of outerKeys) {

    let innerObj = StoreProps[ok];
    for (let io in innerObj) {
      if (innerObj.hasOwnProperty(io)) {
        pl.push(innerObj[io]);
      }
    }

  }
  return pl;
}
