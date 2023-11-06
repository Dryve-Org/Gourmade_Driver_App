import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ActiveOrdersParams, MapStackParamsList } from "../../interface/navigation"
import ActiveOrders from "../../screens/activeOrders/ActiveOrders"
import Unit from "../../screens/apartment/unit"
import ViewOrder from "../../screens/order/ViewOrder"
import ViewOrderByUnit from "../../screens/order/ViewOrderByUnit"


const Stack = createNativeStackNavigator<ActiveOrdersParams>()

const AONavigation = () => {

    return(
        <Stack.Navigator initialRouteName='ActiveOrders'>
            <Stack.Screen 
                name='ActiveOrders'
                component={ ActiveOrders }
                options={{
                    title: 'Active Orders',
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name='Order'
                component={ ViewOrderByUnit }
                options={{
                    title: 'Order',
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name='Unit'
                component={ Unit }
                options={{
                    title: 'Unit',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default AONavigation