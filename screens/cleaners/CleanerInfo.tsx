import { useState, useEffect } from 'react'
import { View, Text, Linking, StyleSheet, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { apiUrl, getCleaner } from '../../data/requests'
import { useGlobalContext } from '../../context/global'
import { CleanerI, ServiceI } from '../../interface/api'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MapStackParamsList } from '../../interface/navigation'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors } from '../../styles/colors'

type cleanerNavProps = NativeStackNavigationProp<MapStackParamsList, 'cleanerInfo'>

const CleanerInfo: React.FC = () => {
    const [ cleaner, setCleaner ] = useState<CleanerI>()
    const { global, setGlobal } = useGlobalContext()
    const token = global.token

    const navigation = useNavigation<cleanerNavProps>()
    const { cleanerId } = useRoute<RouteProp<MapStackParamsList, 'cleanerInfo'>>().params

    /**
     * I'm trying to get the cleaner data from the backend and set the state of the cleaner and
     * assigned variables.
    */
    const handleCleaner = async () => {
        try {
            const cln = await getCleaner(token, cleanerId)
            if(cln) {
                setCleaner(cln)
            }
        } catch(e) {
            //redirect
            console.log(e)
        }
    }

    useEffect(() => {
        handleCleaner()
    }, [])

    if(!cleaner) {
        return (
            <View>
                <Text>Unable to Retreive Cleaner</Text>
            </View>
        )
    }

    const activeOrder = cleaner.activeOrders

    return (
        <View style={s.container}>
            <View style={s.infoContainer}>
                <Text style={s.head}>{ cleaner.name }</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${ cleaner.phoneNumber }`)}>
                    <Text style={s.head}>{ cleaner.phoneNumber }</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Clipboard.setString(cleaner.address.formatted)}>
                    <Text style={s.head}>{ cleaner.address.formatted }</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(
                'CleanerDropOff', {
                    cleanerId,
                    clnName: cleaner.name
                })
            }>
                <View style={s.choiceCtn}>
                    <Text style={s.choiceTxt}>
                        Drop Off
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(
                'CleanerOrders', {
                    cleanerId,
                    clnName: cleaner.name
                })
            }>
                <View style={s.choiceCtn}>
                    <Text style={s.choiceTxt}>
                        Pick Up
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkGrey
    },
    infoContainer: {
        height: '30%',
        maxWidth: 500,
        alignItems: 'center',
    },
    head: {
        fontSize: 20,
        color: colors.offGold,
        textAlign: 'center'
    },
    assignBttn: {
        backgroundColor: colors.black,
        minWidth: '40%',
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: '10%'
    },
    assignBttnTxt: {
        color: colors.offGold,
        fontSize: 18,
        textAlign: 'center'
    },
    choiceCtn: {
        borderColor: 'red',
        borderRadius: 15,
        borderWidth: 3,
        height: 120,
        justifyContent: 'center',
        marginHorizontal: '10%',
        backgroundColor: colors.orange,
        marginBottom: 10,
    },
    choiceTxt: {
        fontSize: 25,
        fontWeight: '800',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})

export default CleanerInfo