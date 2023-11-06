import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { MapStackParamsList } from '../../interface/navigation';
import { colors } from '../../styles/colors';
import { unixDateFormatter } from '../../constants/time';
import { getDriverActiveOrders } from '../../data/requests';
import { OrderI } from '../../interface/api';
import { useGlobalContext } from '../../context/global';

const DataDisplay = ({
    label,
    data
}: {
    label: string;
    data: string | number | boolean | undefined;
}) => {
    return (
        <View style={s.data}>
            <Text style={s.dataLabel}>{label}:</Text>
            <Text style={s.dataValue}>{data || "N/A"}</Text>
        </View>
    )
}

const ViewOrderByUnit: React.FC = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ aO, setAO ] = useState<OrderI[]>([]) //aO stands for active orders

    const { global } = useGlobalContext()
    const { token } = global

    const route = useRoute<RouteProp<MapStackParamsList, 'order'>>()
    const { order } = route.params

    const handleGetActiveOrder = () => {
        getDriverActiveOrders(token)
            .then(res => {
                if(res) {
                    setAO(res)
                }
            })
            .finally(() => setLoading(false))
    }  

    useFocusEffect(
        useCallback(() => {
            handleGetActiveOrder()
        }, [])
    )

    if(loading) {
        return (
            <View style={s.container}>
                <View style={s.head}>
                    <View style={s.headHeader}>
                        <Text style={s.headHeaderTxt}>Loading</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={s.container}>
            <View style={s.head}>
                <View style={s.headHeader}>
                    <Text style={s.headHeaderTxt}>Order Details</Text>
                    <Text style={s.headSubHeadTxt}>{ order.status }</Text>
                    <Text style={s.headSubHeadTxt}>{ order.client.email }</Text>
                    <Text style={s.headSubHeadTxt}>{ order.unitId }</Text>
                    { aO.map(odr => odr._id).includes(order._id) && <Text style={s.headSubHeadTxt}>*You currently have this order</Text> }
                </View>
            </View>
            <View style={s.dataSection}>
                <DataDisplay 
                    label="Name" 
                    data={`${order.client.firstName} ${order.client.lastName}`}
                />
                <DataDisplay label="Start Time" data={unixDateFormatter(order.created)} />
                <DataDisplay label="Cleaner" data={order.cleaner?.name} />
                <DataDisplay label="Status" data={order.status} />
                <DataDisplay label="Address" data={order.dropOffAddress?.formatted} />
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkGrey,
    },
    head: {

    },
    headHeader: {

    },
    headHeaderTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.orange,
        textAlign: 'center',
    },
    headSubHeadTxt: {
        fontSize: 15,
        color: colors.offGold,
        textAlign: 'center',
    },
    dataSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    data: {
        width: '50%',
        padding: 10,
    },
    dataLabel: {
        textAlign: 'center',
        color: colors.orange,
        fontSize: 20,
        fontWeight: 'bold',
    },
    dataValue: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
});

export default ViewOrderByUnit;
