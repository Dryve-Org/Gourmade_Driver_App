import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { CleanerStackParams } from "../../interface/navigation"
import Map from '../../components/map/map'
import CleanerInfo from "../../screens/cleaners/CleanerInfo"
import CleanerList from "../../screens/cleaners/CleanerList"
import { colors } from "../../styles/colors"


const Stack = createNativeStackNavigator<CleanerStackParams>()

/*
    **selected services will be stored in
        local storage when this component
        unmounts
*/
const CleanerNavigation = () => {
    /* 
        initialRouteName should be checking if
        requests already exists
    */
    return (
        <Stack.Navigator initialRouteName='cleanerList' id='cleanerTab'>
            <Stack.Screen
                name="cleanerList"
                component={ CleanerList }
                options={{
                    title: 'Nearby Cleaners',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="cleaner"
                component={ CleanerInfo }
                options={{
                    title: 'Cleaner',
                    headerStyle: {
                        backgroundColor: colors.darkGrey,
                    }
                }}
            />
        </Stack.Navigator>
    )
}

export default CleanerNavigation