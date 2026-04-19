/* eslint-env jest */

// Jest setup file — mock native modules that aren't available in the test env

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({children}) => children,
  Swipeable: jest.fn(),
  DrawerLayout: jest.fn(),
  State: {},
  PanGestureHandler: jest.fn(),
  TapGestureHandler: jest.fn(),
  FlingGestureHandler: jest.fn(),
  ForceTouchGestureHandler: jest.fn(),
  LongPressGestureHandler: jest.fn(),
  ScrollView: jest.fn(),
  Slider: jest.fn(),
  Switch: jest.fn(),
  TextInput: jest.fn(),
  ToolbarAndroid: jest.fn(),
  TouchableHighlight: jest.fn(),
  TouchableNativeFeedback: jest.fn(),
  TouchableOpacity: jest.fn(),
  TouchableWithoutFeedback: jest.fn(),
  Directions: {},
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}) => children,
  useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
}));

jest.mock('react-native-maps', () => {
  const {View} = require('react-native');
  const MockMapView = (props) => {
    return View(props);
  };
  const MockMarker = (props) => {
    return View(props);
  };
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});
