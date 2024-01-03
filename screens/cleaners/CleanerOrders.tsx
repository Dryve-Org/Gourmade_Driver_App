import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useCallback, useState, useEffect } from 'react'
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import { CleanerI, DriverI, OrderI } from '../../interface/api'
import { getCleanerActiveOrders, getCleanerPickups, pickUpOrders } from '../../data/requests'
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
        <TouchableOpacity onPress={() => order.status === 'Clothes Ready' && select(order._id)}>
            <View style={ selected ? s.orderA : s.order }>
                <Text style={s.orderTxt}>{ order.apartment.name }</Text>
                <Text style={s.orderTxt}>{order.client.firstName} {order.client.lastName}</Text>
                <Text style={s.orderTxt}>{ unixDateFormatter(order.created) }</Text>
                <Text style={s.orderTxt}>{ order.status }</Text>
            </View>
        </TouchableOpacity>
    )
}

const CleanerOrders = () => {
    const [ clnAO, setClnAO ] = useState<DriverI['activeOrders']>()
    const [ selAO, setSelAO ] = useState<OrderI['_id'][]>([])
    const [ orderType, setOrdersType ] = useState<'Active' | 'Pickup'>('Active')
    const [ loading, setLoading ] = useState<boolean>(true)
    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<cleanerNavProps>()
    const { cleanerId, clnName } = useRoute<RouteProp<MapStackParamsList, 'CleanerOrders'>>().params

    useFocusEffect(
        useCallback(() => {
            getCleanerActiveOrders(token, cleanerId)
                .then(res => {
                    setClnAO(res)
                })
                .finally(() => {
                    setLoading(false)
                })
        }, [])
    )

    useEffect(() => {
        if(orderType === 'Active') {
            setLoading(true)
            getCleanerActiveOrders(token, cleanerId)
                .then(res => {
                    setClnAO(res)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(true)
            getCleanerPickups(token, cleanerId)
                .then(res => {
                    setClnAO(res)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [ orderType ])

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

    if(clnAO === undefined) {
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

    const handlePickupOrders = async () => {
        try {
            setLoading(true)
            await AsyncStorage.setItem('pickedUpOrderIds', JSON.stringify(selAO))
            await pickUpOrders(token, cleanerId, selAO)

            const orders = orderType === 'Active' ? 
                getCleanerActiveOrders(token, cleanerId) :
                getCleanerPickups(token, cleanerId)

            if(orders) setClnAO(await orders)
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
                        Cleaner's Active Orders
                    </Text>
                    {
                        !clnAO.length &&
                        <Text style={s.headHeaderTxt}>
                            You have no orders
                        </Text>
                    }
                </View>
            </View>
            <View style={s.orderTypeCtn}>
                <View style={orderType === 'Active' ? s.orderTypeA : s.orderType}>
                        <TouchableOpacity onPress={() => setOrdersType('Active')}>
                        <Text style={orderType === 'Active' ? s.orderTypeTxtA : s.orderTypeTxt}>Active Orders</Text>
                    </TouchableOpacity>
                </View>
                <View style={orderType === 'Pickup' ? s.orderTypeA : s.orderType}>
                        <TouchableOpacity onPress={() => setOrdersType('Pickup')}>
                        <Text style={orderType === 'Pickup' ? s.orderTypeTxtA : s.orderTypeTxt}>Pickup Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View style={s.ordersCtn}>
                    {clnAO.map(aO => OrderCard(
                        aO, 
                        handleSelect, 
                        selAO.includes(aO._id)
                    ))}
                </View>
            </ScrollView>
            <View style={s.BttnCtn}>
                {
                    selAO.length ?
                    <TouchableOpacity onPress={() => handlePickupOrders()}>
                        <View style={s.submitBttn}>
                            <Text style={s.submitBttnTxt}>Pickup Orders</Text>
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
    orderTypeCtn: {
        borderBottomWidth: 3,
        borderColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        height: 50,
    },
    orderType: {
        justifyContent: 'center',
        width: '50%',
        textAlign: 'center',
        alignItems: 'center'
    },
    orderTypeTxt: {
        color: colors.offGold

    },
    orderTypeA: {
        justifyContent: 'center',
        backgroundColor: colors.orange,
        width: '50%',
        textAlign: 'center',
        alignItems: 'center'
    },
    orderTypeTxtA: {
        color: colors.black
    },
    ordersCtn: {
        justifyContent: 'center',
        flex: 3,
        height: '100%',
    },
    order: {
        backgroundColor: colors.orange,
        borderColor: colors.secondaryOffGold,
        borderWidth: 3,
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
        width: 150,
        height: 50
    },
    submitBttnTxt: {
        fontSize: 20,
        color: colors.orange
    }
})

export default CleanerOrders