import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useGlobalContext } from '../../context/global'
import { cancelOrderByOrderId, clientDropoff, createOrder, getDriverActiveOrders, getOrders, getUnit } from '../../data/requests'
import { OrderI, OrderstatusT, UnitI, UnitRespI } from '../../interface/api'
import { ActiveOrdersParams, MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type mapProps = NativeStackNavigationProp<MapStackParamsList, 'apartment'>
type AONavProps = NativeStackNavigationProp<ActiveOrdersParams, 'ActiveOrders'>

const displayClients = (
    client: UnitI['clients'][0], 
    status: string,
    handlePress: Function,
    active: boolean,
    hasOrder: boolean
) => {
    return (
        <TouchableOpacity onPress={() => handlePress(client)}>
            <View style={active ? s.cltsCtn : s.cltsCtnGrn}>
                <Text style={s.cltsTxt}>
                    { client.firstName } {' '}
                    { client.lastName }
                    <Text style={s.containOrder}>
                        { hasOrder ? ' - Currently have' : '' }
                    </Text>
                </Text>
                <Text style={s.cltsTxt}>
                    { client.email }
                </Text>
                <Text style={s.cltsTxt}>
                    { status }
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const Unit = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ unit, setUnit ] = useState<UnitRespI>()
    const [ activeOrders, setActiveOrders ] = useState<OrderI[]>([])
    const [ chosenClient, setChosenClient ] = useState<string>('')
    const route = useRoute<RouteProp<MapStackParamsList, 'aptUnit'>>()
    const {
        apt,
        bldId,
        unitNum,
        unitId
    } = route.params

    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<mapProps>()
    const aoNav = useNavigation<AONavProps>()

    const handleGetUnit = () => {
        getDriverActiveOrders(token)
        .then(res => {
            if(!!res) setActiveOrders(res)
        })

        getUnit(
            token,
            unitId
        )
        .then(res => {
            res && setUnit(res)

            return res
        })
        .finally(() => {
            setLoading(false)
        })
    }

    useFocusEffect(
        useCallback(() => {
            handleGetUnit()
        }, [])
    )

    if(loading) {
        return (
            <View style={ s.container }>
                <Text style={ s.loading }>Loading...</Text>
            </View>
        )
    }

    if(!unit) {
        return(
            <View style={ s.container }>
                <Text style={ s.loading }>Something went wrong</Text>
                <Text style={ s.loading }>Could not get unit</Text>
            </View>
        )
    }

    const cancelOrder = async (cltId: OrderI['_id']) => {
        try {
            setLoading(true)

            const order = getOrderbyClient(cltId)

            await cancelOrderByOrderId(
                token,
                order._id
            )

            await handleGetUnit()
        } catch {
            console.error('something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateOrder = async (
        cltId: string
    ) => {
        try {
            setLoading(true)
            const client = getClientById(cltId)


            await createOrder(
                token,
                unit.unitId,
                client.email
            )

            await handleGetUnit()
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDropOff = async (cltId: string) => {
        try {
            setLoading(true)
            await clientDropoff(
                token, 
                getOrderbyClient(cltId)._id
            )
            handleGetUnit()
        } catch {

        } finally {
            setLoading(false)
        }
    }

    /**
     * The function `getOrderbyClient` returns the first active order for a given client.
     * @param clt - The parameter `clt` is of type `UnitI['clients'][0]`, which means it represents a
     * client object from the `clients` array of the `UnitI` interface.
     * @returns The function `getOrderbyClient` returns an object of type `OrderI`.
     */
    const getOrderbyClient = (cltId: string): OrderI => {
        return unit.activeOrders.filter(unitOrder => unitOrder.client._id === cltId)[0]
    }

    const statusOfOrder = (cltId: string): string => {
        const theOrder = getOrderbyClient(cltId)
        if(!theOrder) return 'Needs an order'
        return theOrder.status
    }

    const getClientById = (cltId: string) => {
        return unit.clients.filter(clt => clt._id === cltId)[0]
    }

    const chooseClient = (clt: UnitI['clients'][0]) => {
        setChosenClient(clt._id)
    }

    const doesDriverHaveOrder = (cltId: string) => {
        const cltOrder = getOrderbyClient(cltId)
        if(!cltOrder) return false

        const orderIds = activeOrders.map(odr => odr._id)
        return orderIds.includes(cltOrder._id)
    }

    const handleViewOrder = (cltId: string) => {
        const cltOrder = getOrderbyClient(cltId)
        if(!cltOrder) return
        setChosenClient('')//reset chosen client

        aoNav.navigate('Order', {
            order: cltOrder
        })
    }

    return (
        <View style={ s.container }>
            <View style={ s.intro }>
                <Text style={ s.aptName }>{ apt.name }</Text>
                <Text style={ s.bldName }>
                    {`Building: ${bldId}`}
                </Text>
                <Text style={ s.unit }>
                    Unit: { unitNum }
                </Text>
                <Text style={ s.unit }>
                    Unit Id: { unitId }
                </Text>

                {/* { client && 
                    <Text style={ s.bldName }>
                        Client Name: { client.firstName } { client.lastName }
                    </Text>
                } */}
            </View>
            <View style={s.clientSection}>
                <View>
                    <View style={s.cltsHead}>
                        <Text style={s.cltsHeadTxt}>
                            Clients
                        </Text>
                    </View>
                    <ScrollView style={s.cltsList}>
                        {
                            unit.clients.map(clt => displayClients(
                                clt, 
                                statusOfOrder(clt._id), 
                                chooseClient,
                                clt._id === chosenClient,
                                doesDriverHaveOrder(clt._id)
                            ))
                        }
                    </ScrollView>
                </View>
            </View>

            {
                chosenClient && <>
                <Text style={s.chosenCltHead}>
                    For { unit.clients.find(clt => clt._id === chosenClient)?.firstName }
                </Text>
                <View style={s.actionSection}>
                        <TouchableOpacity onPress={() => handleViewOrder(chosenClient)}>
                            <View style={s.actionBttn}>
                                <Text style={s.actionBttnTxt}>
                                    View Order
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {
                            'Clothes To Cleaner' === statusOfOrder(chosenClient) && doesDriverHaveOrder(chosenClient) && <TouchableOpacity onPress={() => cancelOrder(chosenClient)}>
                                <View style={s.actionBttn}>
                                    <Text style={s.actionBttnTxt}>
                                        Cancel Order
                                    </Text>
                                </View>
                            </TouchableOpacity> 
                        }
                        {
                            'Picked Up From Cleaner' === statusOfOrder(chosenClient) && doesDriverHaveOrder(chosenClient) && <TouchableOpacity onPress={() => handleDropOff(chosenClient)}>
                                <View style={s.actionBttn}>
                                    <Text style={s.actionBttnTxt}>
                                        Dropoff Order
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                        {
                            'Needs an order' === statusOfOrder(chosenClient) && <TouchableOpacity onPress={() => handleCreateOrder(chosenClient)}>
                                <View style={s.actionBttn}>
                                    <Text style={s.actionBttnTxt}>
                                        Start Order
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </>
            }
            
        </View>
    )
}

const s = StyleSheet.create({
    loading: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
    },
    container: {
        flex: 1,
        backgroundColor: colors.darkGrey,
    },
    intro: {
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    aptName: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    bldName: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    unit: {
        color: colors.orange,
        fontSize: 18
    },
    clientSection: {
        width: '100%',
        flex: 6,
    },
    aOHead: {
        borderWidth: 2,
        borderBottomColor: colors.orange
    },
    containOrder: {
        textAlign: 'right',
        color: colors.orange,
    },
    cltsHeadTxt: {
        fontSize: 23,
        fontStyle: 'italic',
        textAlign: 'center',
        color: colors.offGold
    },
    orderData: {
        flexGrow: 2,
        justifyContent: 'space-between',
    },
    cltsHead: {

    },
    cltsTxt: {
        color: 'white'
    },
    cltsataHeadTxt: {
        color: colors.orange,
    },
    cltsCtn: {
        marginHorizontal: 20,
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        marginBottom: 10
    },
    cltsCtnGrn: {
        marginHorizontal: 20,
        borderColor: 'green',
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        marginBottom: 10
    },
    cltsList: {

    },
    cltsataBodyTxt: {
        color: 'white',
    },
    actionSection: {
        flex: 1,
        bottom: 0,
        // width: '100%',
        // height: '20%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    chosenCltHead: {
        color: colors.orange,
        textAlign: 'center',
    },
    actionBttn: {
        backgroundColor: colors.orange,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: '90%',
        justifyContent: 'center',
    },
    actionBttnTxt: {
        textAlign: 'center',
        fontSize: 20
    }
})

export default Unit