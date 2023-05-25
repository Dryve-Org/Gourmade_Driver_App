import { StyleSheet, Text, View } from 'react-native'
import { useGlobalContext } from '../context/global'
import { RootStackParamList } from '../interface/navigation'
import Login from './login'
import Home from './app'

export default function Index() {
  const { global, setGlobal } = useGlobalContext()

  if(global.loading) {
    return <Text>Loading</Text>
  }
  
  return (
    <>
        { !!global.token ? <Home /> : <Login /> }
    </>
  )
}