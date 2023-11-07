import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ClipboardStatic } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ActiveOrdersParams, CleanerStackParams, MapStackParamsList } from '../../interface/navigation';
import { colors } from '../../styles/colors';
import { unixDateFormatter } from '../../constants/time';
import { getApartment, getDriverActiveOrders } from '../../data/requests';
import { OrderI } from '../../interface/api';
import { useGlobalContext } from '../../context/global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';

const DataDisplay = ({
    label,
    data,
    onPress,
    parameter
}: {
    label: string;
    data: string | number | boolean | undefined;
    onPress?: Function
    parameter?: string
}) => {

    if(onPress && parameter) {
        return (
            <TouchableOpacity 
                style={s.data} 
                onPress={() => onPress(parameter)}
            >
                    <Text style={s.dataLabel}>{label}:</Text>
                    <Text style={s.dataValue}>{data || "N/A"}</Text>
            </TouchableOpacity>
        )
    } else if(onPress) {
        return (
            <TouchableOpacity style={s.data} onPress={() => onPress()}>
                    <Text style={s.dataLabel}>{label}:</Text>
                    <Text style={s.dataValue}>{data || "N/A"}</Text>
            </TouchableOpacity>
        )
    } else {
        return (
            <View style={s.data}>
                <Text style={s.dataLabel}>{label}:</Text>
                <Text style={s.dataValue}>{data || "N/A"}</Text>
            </View>
        )
    }
}

type AONavProps = NativeStackNavigationProp<ActiveOrdersParams, 'ActiveOrders'>
type mapProps = NativeStackNavigationProp<MapStackParamsList, 'apartment'>
type cleanerNavProps = NativeStackNavigationProp<CleanerStackParams, 'cleanerList'>

const ViewOrder: React.FC = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ aO, setAO ] = useState<OrderI[]>([]) //aO stands for active orders
    const { global } = useGlobalContext()
    const { token } = global

    const route = useRoute<RouteProp<MapStackParamsList, 'order'>>()
    const { order } = route.params

    const navigation = useNavigation<AONavProps>()
    const navCleaner = useNavigation<cleanerNavProps>()
    

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

    const copyToClipboard = (data: string) => {
        Clipboard.setStringAsync(data);
    }

    const handleGoToUnit = () => {
        getApartment(token, order.apartment._id)
            .then(res => {
                if(res) {
                    navigation.navigate('Unit', { 
                        aptId: order.apartment._id,
                        unitId: order.unitId,
                        unitNum: order.unit,
                        apt: res,
                        bldId: order.building,
                    })
                }
            })
    }

    const handleGoToCleaner = () => {
        navCleaner.navigate(
            'cleaner', 
            {
                cleanerId: order.cleaner._id
            }
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
            <View style={s.dataSectionContainter}>
                <ScrollView>
                    <View style={s.dataSection}>
                        <DataDisplay 
                            label="Name" 
                            data={`${order.client.firstName} ${order.client.lastName}`}
                        />
                        <DataDisplay label="Start Time" data={unixDateFormatter(order.created)} />
                        <DataDisplay 
                            label="Cleaner" 
                            data={order.cleaner?.name}
                            onPress={handleGoToCleaner}
                            // parameter={order.cleaner}
                        />
                        <DataDisplay label="Status" data={order.status} />
                        <DataDisplay 
                            label="Address" 
                            data={order.dropOffAddress?.formatted}
                            onPress={copyToClipboard}
                            parameter={order.dropOffAddress?.formatted}
                        />
                    </View>
                </ScrollView>
            </View>
            <View style={s.actionSection}>
                <Text style={s.chosenCltHead}>
                    {}
                </Text>
                <View style={s.actionSection}>
                    <TouchableOpacity onPress={() => handleGoToUnit()}>
                        <View style={s.actionBttn}>
                            <Text style={s.actionBttnTxt}>
                                Go To Unit
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
    dataSectionContainter: {
        height: '75%',
        justifyContent: 'center',
    },
    dataSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
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
    chosenCltHead: {
        color: colors.orange,
        textAlign: 'center',
    },
    actionSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionBttn: {
        backgroundColor: colors.orange,
        borderRadius: 10,
        paddingHorizontal: 10,
        padding: 10,
        // height: '90%',
        justifyContent: 'center',
    },
    actionBttnTxt: {
        textAlign: 'center',
        fontSize: 20
    }
});

export default ViewOrder;
