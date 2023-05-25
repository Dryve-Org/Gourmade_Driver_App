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
import { cleanerDropOff, getCleaner, getCleanerActiveOrders, getDriverActiveOrders, getDriverData } from '../../data/requests'
import { useGlobalContext } from '../../context/global'
import { unixDateFormatter } from '../../constants/time'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AONavProps = NativeStackNavigationProp<ActiveOrdersParams, 'ActiveOrders'>

const OrderCard = (
    order: OrderI,
    select: (orderId: OrderI['_id']) => void
) => {
    return (
        <TouchableOpacity onPress={() => select(order._id)}>
            <View style={ s.order }>
                <Text style={s.orderTxt}>{ order.apartment.name }</Text>
                <Text style={s.orderTxt}>{order.client.firstName} {order.client.lastName}</Text>
                <Text style={s.orderTxt}>{ unixDateFormatter(order.created) }</Text>
                <Text style={s.orderTxt}>{ order.status }</Text>
            </View>
        </TouchableOpacity>
    )
}

const ActiveOrders = () => {
    const [ dAO, setDAO ] = useState<DriverI['activeOrders']>()
    const [ driver, setDriver ] = useState<DriverI>()
    const [ selAO, setSelAO ] = useState<OrderI['_id']>()
    const [ loading, setLoading ] = useState<boolean>(true)
    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<AONavProps>()

    useFocusEffect(
        useCallback(() => {

            getDriverData(token)
                .then(res => {
                    if(!res || typeof res === 'string') return
                    setDriver(res)
                    getDriverActiveOrders(token)
                        .then(res => setDAO(res))
                })
                .finally(() => {
                    setLoading(false)
                })
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

    if(!driver) {
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

    const handleSelect = (orderId: OrderI['_id']) => {
        navigation.navigate('ViewOrder', { orderId })
    }

    return(
        <View style={s.container}>
            <View style={s.head}>
                <View style={s.headHeader}>
                    <Text style={s.headHeaderTxt}>
                        {/* { driver?.user.firstName } { driver?.user.lastName } */}
                    </Text>
                    <Text style={s.headHeaderTxt}>
                        Your Active Orders
                    </Text>
                    {
                        !dAO?.length ?
                        <Text style={s.headHeaderTxt}>
                            You have no orders
                        </Text> : null
                    }
                </View>
            </View>
            <ScrollView>
                <View style={s.ordersCtn}>
                    {dAO?.length ? dAO.map(aO => OrderCard(
                        aO, 
                        handleSelect
                    )) : null}
                </View>
            </ScrollView>
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 2,
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
    ordersCtn: {
        justifyContent: 'center',
        flex: 3,
        height: '100%',
    },
    order: {
        backgroundColor: colors.orange,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: '10%'
    },
    orderA: {
        backgroundColor: colors.orange,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        margin: '10%',
        borderColor: 'red',
        borderWidth: 3
    },
    orderTxt: {
        textAlign: 'center'
    },
})

export default ActiveOrders