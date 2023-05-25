import { StyleSheet, Image } from 'react-native'
import theme, { colors } from '../styles/colors'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import MapNavigation from '../components/navigation/navMap'
import { MainButtonParams } from '../interface/navigation'
import AccountNavigation from '../components/navigation/navAccount'
import AONavigation from '../components/navigation/navActiveOrders'
import CleanerNavigation from '../components/navigation/navCleaner'

const Tab = createBottomTabNavigator<MainButtonParams>()

const Home = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName='mapView'
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.darkGrey,
                    },
                    tabBarStyle:{
                        backgroundColor: colors.darkGrey,
                    },
                    tabBarItemStyle:{
                        // backgroundColor:'#00ff00',
                        borderRadius:10,
                    }
                }}
            >
                <Tab.Screen 
                    name='cleaners'
                    component={ CleanerNavigation }
                    options={{
                        tabBarLabel: 'Cleaners',
                        headerShown: false,
                        tabBarIcon(props) {
                            
                            return (
                                <Image
                                    style={{ width: 30, height: 30 }} 
                                    source={require('../assets/images/cleaner_icon.png')}
                                />
                            )
                        },
                    }}
                />
                <Tab.Screen 
                    name="mapView" 
                    component={ MapNavigation }
                    options={{
                        tabBarLabel: 'Map',
                        headerShown: false,
                        tabBarIcon(props: any) {
                            
                            return (
                                <Image
                                    style={{ width: 30, height: 30 }} 
                                    source={require('../assets/images/pin.png')}
                                />
                            )
                        }
                    }}
                />
                <Tab.Screen 
                    name="activeOrders" 
                    component={ AONavigation }
                    options={{
                        tabBarLabel: 'Active Orders',
                        headerShown: false
                    }}
                />
                <Tab.Screen 
                    name="account" 
                    component={ AccountNavigation }
                    options={{
                        tabBarLabel: 'Account',
                        headerShown: false
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: theme.background,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    footerTxt: {
        color: theme.text,
        fontSize: 20,
    }
})

export default Home