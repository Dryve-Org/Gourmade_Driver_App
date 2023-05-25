import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { formatOrderData } from '../../constants/order'
import { useGlobalContext } from '../../context/global'
import { cancelUnitOrder, createOrder, getUnit } from '../../data/requests'
import { OrderI, UnitI } from '../../interface/api'
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'

const DisplaySimpleData = (
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

const ActiveOrder: React.FC<OrderI> = (order: OrderI) => {
    const fOrder = formatOrderData(order)

    const fOrderMap = Object.entries(fOrder)
    return (
        <View style={s.orderData}>
            {
                fOrderMap.map(o => o[1] && DisplaySimpleData(o[0], o[1]))
            }
        </View>
    )
}

const s = StyleSheet.create({
    orderData: {
        justifyContent: 'space-between',
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
    aOData: {

    },
    aODataHead: {

    },
    aODataHeadTxt: {
        color: colors.orange,
        textAlign: 'center'
    },
    aODataBody: {

    },
    aODataBodyTxt: {
        color: 'white',
        textAlign: 'center'
    }
})

export default ActiveOrder