import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import cssta from "cssta/native";
import GlobalContextProvider from './context/global';
import Index from './screens';

const MainView = cssta(View)`
  flex: 1;
  background-color: blue;
  alignItems: center;
  justifyContent: center;
  color: white;
`

const MainText = cssta(Text)`
  color: white;
  fontSize: 20px;
`

export default function App() {
  return (
    <GlobalContextProvider>
      <Index />
    </GlobalContextProvider>
  );
}
