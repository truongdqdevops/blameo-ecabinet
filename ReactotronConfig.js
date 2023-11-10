import Reactotron, {networking} from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import {NativeModules} from 'react-native';

console.disableYellowBox = true;

const scriptURL = NativeModules.SourceCode.scriptURL;
let scriptHostname = scriptURL.split('://')[1].split(':')[0];
// console.log = Reactotron.log;
// swizzle the old one
const yeOldeConsoleLog = console.log;

// make a new one
console.log = (...args) => {
  // always call the old one, because React Native does magic swizzling too
  yeOldeConsoleLog(...args);

  // send this off to Reactotron.
  Reactotron.display({
    name: 'CONSOLE.LOG',
    value: args,
    preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
  });
};
const reactotron = Reactotron.configure({
  name: 'CMS',
  host: scriptHostname,
  port: 9090,
})
  .useReactNative({
    asyncStorage: {ignore: ['secret']},
  })
  .use(reactotronRedux())
  .use(
    networking({
      ignoreContentTypes: /^(image)\/.*$/i,
      ignoreUrls: /\/(logs|symbolicate)$/,
    }),
  )
  .connect();
console.tron = reactotron;
export default reactotron;
