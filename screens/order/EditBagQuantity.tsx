import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ClipboardStatic, TextInput } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ActiveOrdersParams, CleanerStackParams, MapStackParamsList } from '../../interface/navigation';
import { colors } from '../../styles/colors';
import { unixDateFormatter } from '../../constants/time';
import { getApartment, getDriverActiveOrders, updateBagQuantity } from '../../data/requests';
import { OrderI } from '../../interface/api';
import { useGlobalContext } from '../../context/global';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AONavProps = NativeStackNavigationProp<ActiveOrdersParams, 'ActiveOrders'>
type mapProps = NativeStackNavigationProp<MapStackParamsList, 'apartment'>
type cleanerNavProps = NativeStackNavigationProp<CleanerStackParams, 'cleanerList'>

const EditBagQuantity: React.FC = () => {
    const route = useRoute<RouteProp<ActiveOrdersParams, 'EditBagQuantity'>>()
    const { order } = route.params
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ quantityInput, setQuantityInput ] = useState<string>(order.bagQuantity.toString())
    const [ showError, setShowError ] = useState<boolean>(false)
    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<AONavProps | mapProps | cleanerNavProps>()

    const handleSubmission = () => {
        setLoading(true)

        const newBagQuantity = parseInt(quantityInput)
        if(newBagQuantity === order.bagQuantity) {
            navigation.goBack()
            setLoading(false)
            return
        } else if(newBagQuantity < 0) {
            setLoading(false)
            return
        } else if(isNaN(newBagQuantity)) {
            setLoading(false)
            return
        }


        // send request to update bag quantity
        updateBagQuantity(
            token,
            order._id,
            newBagQuantity,
        )
        .then(() => {
            console.log('bag quantity updated')
            setLoading(false)
            navigation.goBack()
        })
        .catch(err => {
            console.log('update bag quantity error')
            setShowError(true)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <View style={s.container}>
            <View style={s.head}>
                <View style={s.headHeader}>
                    <Text style={s.headHeaderTxt}>Order Details</Text>
                    <Text style={s.headSubHeadTxt}>{ order.client.email }</Text>
                    <Text style={s.headSubHeadTxt}>{ order.unitId }</Text>
                    <Text style={s.bodyHead}>Current Bag Quantity: { order.bagQuantity }</Text>
                    { showError && <Text style={{ color: 'red', textAlign: 'center' }}>Something went wrong</Text> }
                </View>
            </View>
            <View style={s.body}>
                <TextInput
                    style={s.input}
                    onChangeText={text => setQuantityInput(text)}
                    value={quantityInput}
                    placeholder="Bag Quantity"
                    keyboardType="numeric"
                    editable={!loading}
                    selectTextOnFocus={!loading}
                    />
            </View>
            <View style={s.foot}>
                <TouchableOpacity 
                    style={s.footBtn}
                    onPress={() => handleSubmission()}
                >
                    <Text style={s.footBtnTxt}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkGrey,
        justifyContent: 'space-around',
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
    body: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    bodyHead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.orange,
        textAlign: 'center',
        marginBottom: 10
    },
    input: {
        height: 60,
        textAlign: 'center',
        borderWidth: 1,
        padding: 10,
        fontSize: 20,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderColor: colors.orange,
        borderWidth: 3,
    },
    foot: {
        marginBottom: 20,
    },
    footBtn: {
        backgroundColor: colors.orange,
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    footBtnTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.darkGrey,
        textAlign: 'center',
    },
});

export default EditBagQuantity;
