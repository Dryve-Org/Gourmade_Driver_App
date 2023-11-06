import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { MapStackParamsList } from "../../interface/navigation"
import Map from '../../components/map/map'
import CleanerInfo from "../../screens/cleaners/CleanerInfo"
import AptScreen from "../../screens/apartment/Apartment"
import BuildingInfoScreen from "../../screens/apartment/Building"
import Unit from "../../screens/apartment/unit"
import CleanerChoice from "../../screens/cleaners/CleanerDropOff"
import CleanerDropOff from "../../screens/cleaners/CleanerDropOff"
import CleanerOrders from "../../screens/cleaners/CleanerOrders"
import { colors } from "../../styles/colors"
import ViewOrderByUnit from "../../screens/order/ViewOrderByUnit"


const Stack = createNativeStackNavigator<MapStackParamsList>()

const MapNavigation = () => {

    return(
        <Stack.Navigator 
            initialRouteName='map'
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.darkGrey,
                },
            }}
        >
            <Stack.Screen
                name='map'
                component={ Map }
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name='cleanerInfo'
                component={ CleanerInfo }
                options={{
                    title: 'Cleaner'
                }}
            />
            <Stack.Screen 
                name='apartment'
                component={ AptScreen }
                options={{
                    title: 'Apartment'
                }}
            />
            <Stack.Screen 
                name='aptBld'
                component={ BuildingInfoScreen }
                options={{
                    title: 'Building',
                }}
            />
            <Stack.Screen 
                name='aptUnit'
                component={ Unit }
                options={{
                    title: 'Unit'
                }}
            />
            <Stack.Screen 
                name='order'
                component={ ViewOrderByUnit }
                options={{
                    title: 'Unit Order'
                }}
            />
            <Stack.Screen 
                name='CleanerDropOff'
                component={ CleanerDropOff }
                options={{
                    title: 'Cleaner Drop Off'
                }}
            />
            <Stack.Screen 
                name='CleanerOrders'
                component={ CleanerOrders }
                options={{
                    title: 'Cleaner Orders'
                }}
            />
        </Stack.Navigator>
    )
}

export default MapNavigation