import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useGlobalContext } from '../../context/global'
import { cancelUnitOrder, clientDropoff, createOrder, getUnit } from '../../data/requests'
import { UnitI } from '../../interface/api'
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import ActiveOrder from './OrderData'

const DisplayData = (
    headTxt: string,
    bodyTxt: string
) => {

    return (
        <View style={s.aOData}>
            <View style={s.aODataHead}>
                <Text style={s.aODataHeadTxt}>
                    { headTxt }
                </Text>
            </View>
            <View style={s.aODataBody}>
                <Text style={s.aODataBodyTxt}>
                    { bodyTxt }
                </Text>
            </View>
        </View>
    )
}

const Unit = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ unit, setUnit ] = useState<UnitI>()
    const route = useRoute<RouteProp<MapStackParamsList, 'aptUnit'>>()
    const {
        aptId,
        apt,
        bldId,
        unitId
    } = route.params

    const { global } = useGlobalContext()
    const { token } = global

    const handleGetUnit = () => {
        getUnit(
            token,
            aptId,
            bldId,
            unitId
        )
        .then(res => {
            res && setUnit(res)
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
            <View>
                <View style={ s.container }>
                    <Text>Something went wrong</Text>
                </View>
            </View>
        )
    }

    const client = unit.client
    const aO = unit.activeOrder

    const cancelOrder = async () => {
        try {
            if(!unit.activeOrder) return
            setLoading(true)

            await cancelUnitOrder(
                token,
                aptId,
                bldId,
                unitId
            )

            await handleGetUnit()
            console.log('order:', unit.activeOrder)
        } catch {
            console.error('something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateOrder = async () => {
        try {
            if(unit.activeOrder) return
            setLoading(true)

            await createOrder(
                token,
                aptId,
                bldId,
                unitId
            )

            await handleGetUnit()
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDropOff = async () => {
        try {
            setLoading(true)
            await clientDropoff(token, aO._id)
            handleGetUnit()
        } catch {

        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={ s.container }>
            <View style={ s.intro }>
                <Text style={ s.aptName }>{ apt.name }</Text>
                <Text style={ s.bldName }>
                    {`Building #: ${bldId}`}
                </Text>
                <Text style={ s.unit }>
                    { unitId }
                </Text>

                { client && 
                    <Text style={ s.bldName }>
                        Client Name: { client.firstName } { client.lastName }
                    </Text>
                }
            </View>
            <View style={s.activeOrderSection}>
                <ScrollView>
                    <View style={s.aOHead}>
                        <Text style={s.aOHeadTxt}>
                            Active Order
                        </Text>
                    </View>
                    { aO && <ActiveOrder {...aO} /> }
                </ScrollView>
            </View>
            <View style={s.actionSection}>
                {
                    aO?.status === 'Clothes To Cleaner' &&
                    <TouchableOpacity onPress={() => cancelOrder()}>
                        <View style={s.actionBttn}>
                            <Text style={s.actionBttnTxt}>
                                Cancel Order
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
                {
                    !aO &&
                    <TouchableOpacity onPress={() => handleCreateOrder()}>
                        <View style={s.actionBttn}>
                            <Text style={s.actionBttnTxt}>
                                Create Order
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
                {
                    aO?.status === 'Picked Up From Cleaner' && 
                    <TouchableOpacity onPress={() => handleDropOff()}>
                        <View style={s.actionBttn}>
                            <Text style={s.actionBttnTxt}>
                                Drop Off Order
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
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
        fontSize: 25
    },
    activeOrderSection: {
        width: '100%',
        flex: 6,
    },
    aOHead: {
        borderWidth: 2,
        borderBottomColor: colors.orange
    },
    aOHeadTxt: {
        fontSize: 23,
        fontStyle: 'italic',
        textAlign: 'center',
        color: colors.offGold
    },
    orderData: {
        flexGrow: 2,
        justifyContent: 'space-between',
    },
    aOData: {

    },
    aODataHead: {

    },
    aODataHeadTxt: {
        color: colors.orange,
    },
    aODataBody: {

    },
    aODataBodyTxt: {
        color: 'white',
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
        height: '90%',
        justifyContent: 'center',
    },
    actionBttnTxt: {
        textAlign: 'center',
        fontSize: 20
    }
})

export default Unit