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
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import { CleanerI, DriverI, OrderI } from '../../interface/api'
import { cleanerDropOff, getCleaner, getCleanerActiveOrders, getDriverActiveOrders } from '../../data/requests'
import { useGlobalContext } from '../../context/global'
import { unixDateFormatter } from '../../constants/time'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'

type cleanerNavProps = NativeStackNavigationProp<MapStackParamsList, 'cleanerInfo'>

const OrderCard = (
    order: OrderI,
    select: (orderId: OrderI['_id']) => void,
    selected: boolean
) => {
    return (
        <TouchableOpacity onPress={() => select(order._id)}>
            <View style={ selected ? s.orderA : s.order }>
                <Text style={s.orderTxt}>{ order.apartment.name }</Text>
                <Text style={s.orderTxt}>{order.client.firstName} {order.client.lastName}</Text>
                <Text style={s.orderTxt}>{ unixDateFormatter(order.created) }</Text>
                <Text style={s.orderTxt}>{ order.status }</Text>
            </View>
        </TouchableOpacity>
    )
}

const CleanerDropOff = () => {
    const [ dAO, setDAO ] = useState<DriverI['activeOrders']>()
    const [ selAO, setSelAO ] = useState<OrderI['_id'][]>([])
    const [ sumbittedIds, setSubmittedIds ] = useState<OrderI['_id'][]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<cleanerNavProps>()
    const { cleanerId, clnName } = useRoute<RouteProp<MapStackParamsList, 'CleanerDropOff'>>().params

    useFocusEffect(
        useCallback(() => {
            getDriverActiveOrders(token)
                .then(res => {
                    setDAO(res)
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

    if(dAO === undefined) {
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
        if(!selAO.includes(orderId)) {
            selAO.push(orderId)
        } else {
            _.remove(selAO, (id) => id === orderId)    
        }

        setSelAO([...selAO])
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await AsyncStorage.setItem('submittedOrderIds', JSON.stringify(selAO))
            await cleanerDropOff(token, cleanerId, selAO)

            const activeOrders = await getDriverActiveOrders(token)

            setDAO(activeOrders)
        } catch(e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return(
        <View style={s.container}>
            <View style={s.head}>
                <View style={s.headHeader}>
                    <Text style={s.headHeaderTxt}>
                        { clnName }
                    </Text>
                    <Text style={s.headHeaderTxt}>
                        Your Active Orders
                    </Text>
                    {
                        !dAO.length &&
                        <Text style={s.headHeaderTxt}>
                            You have no orders
                        </Text>
                    }
                </View>
            </View>
            <ScrollView>
                <View style={s.ordersCtn}>
                    {dAO.map(aO => OrderCard(
                        aO, 
                        handleSelect, 
                        selAO.includes(aO._id)
                    ))}
                </View>
            </ScrollView>
            <View style={s.BttnCtn}>
                {
                    selAO.length ? <TouchableOpacity onPress={() => handleSubmit()}>
                        <View style={s.submitBttn}>
                            <Text style={s.submitBttnTxt}>Submit</Text>
                        </View>
                    </TouchableOpacity> : null
                }
            </View>
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
    BttnCtn: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    submitBttn: {
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderColor: colors.orange,
        borderWidth: 3,
        width: 100,
        height: 50
    },
    submitBttnTxt: {
        fontSize: 20,
        color: colors.orange
    }
})

export default CleanerDropOff