import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useCallback, useState } from 'react'
import { ActiveOrdersParams, MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import { CleanerI, DriverI, OrderI } from '../../interface/api'
import { cleanerDropOff, getApartment, getCleaner, getCleanerActiveOrders, getDriverActiveOrders, getDriverData, getOrderData } from '../../data/requests'
import { useGlobalContext } from '../../context/global'
import { unixDateFormatter } from '../../constants/time'
import _ from 'lodash'

type ViewOrderNavProps = NativeStackNavigationProp<ActiveOrdersParams, 'ViewOrder'>

const ViewOrder = () => {
    const [ order, setOrder ] = useState<OrderI>()
    const [ loading, setLoading ] = useState<boolean>(true)
    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<ViewOrderNavProps>()
    const { orderId } = useRoute<RouteProp<ActiveOrdersParams, 'ViewOrder'>>().params


    useFocusEffect(
        useCallback(() => {
            getOrderData(token, orderId)
                .then(res => setOrder(res))
                .finally(() => setLoading(false))
        }, [])
    )

    if(loading) {
        return (
            <View style={s.container}>
                <View style={s.head}>
                    <View style={s.headHeader}>
                        <Text style={s.headHeaderTxt}>
                            Loading
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    if(!order) {
        return (
            <View style={s.container}>
                <View style={s.head}>
                    <View style={s.headHeader}>
                        <Text style={s.headHeaderTxt}>
                            Error
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const goToUnit = async () => {
        try {
            setLoading(true)
            const apt = await getApartment(token, order.apartment._id)
            if(!apt) return

            navigation.navigate('Unit', {
                apt,
                aptId: apt._id,
                bldId: order.building,
                unitNum: order.unit,
                unitId: order.unitId

            })
        } catch {

        } finally {
            setLoading(false)
        }
        
    }

    return(
        <View style={s.container}>
            <View style={s.head}>
                <View style={s.headHeader}>
                    <Text style={s.headHeaderTxt}>
                        { order.client.firstName } { order.client.lastName }
                    </Text>
                </View>
            </View>
            <View style={s.orderCtn}>
                <View style={s.orderHead}>
                    <Text style={s.headHeaderTxt}>
                        { order.status }
                    </Text>
                </View>
            </View>
            <View style={s.actionSection}>
                <TouchableOpacity onPress={() => goToUnit()}>
                    <View style={s.actionBttn}>
                        <Text style={s.actionBttnTxt}>
                            Go to Unit
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkGrey
    },
    head: {

    },
    headHeader: {

    },
    headHeaderTxt: {
        fontSize: 20,
        color: colors.offGold,
        textAlign: 'center'
    },
    orderCtn: {
        flex: 5,
        justifyContent: 'center',
    },
    order: {
        backgroundColor: colors.orange,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: '10%'
    },
    orderHead: {

    },
    orderHeadTxt: {

    },
    orderTxt: {
        textAlign: 'center'
    },
    actionSection: {
        flex: 1,
        bottom: 0,
        // width: '100%',
        // height: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionBttn: {
        backgroundColor: colors.orange,
        borderRadius: 10,
        width: '80%',
        paddingVertical: 20,
        justifyContent: 'center',
    },
    actionBttnTxt: {
        textAlign: 'center',
        fontSize: 20
    }
})

export default ViewOrder