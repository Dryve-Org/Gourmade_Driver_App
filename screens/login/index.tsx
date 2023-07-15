import { NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../interface/navigation'
import CreatingUser from './creatingUser'
import Login from './login'
// import SignUp from './signUp'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={ 'login' }>
          <Stack.Screen name='login' component={ Login } options={{ headerShown: false }}/>
          {/* <Stack.Screen name='signup' component={ SignUp } options={{ headerShown: false }}/> */}
          <Stack.Screen name='creating' component={ CreatingUser } options={{ headerShown: false }}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}