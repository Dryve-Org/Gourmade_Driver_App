import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableHighlight } from 'react-native'
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { CleanerI } from '../../interface/api'
import { useGlobalContext } from '../../context/global'
import { getNearByClns } from '../../data/requests'
import pickupsHook from '../../hooks/pickupAddress'
import { colors } from '../../styles/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { CleanerStackParams, MapStackParamsList } from '../../interface/navigation'

type cleanerNavProps = NativeStackNavigationProp<CleanerStackParams, 'cleanerList'>

interface CleanerCardI {
    cln: CleanerI
    onPress: Function
}
const CleanerCard: React.FC<CleanerCardI> = ({
    cln,
    onPress
}: CleanerCardI) => {
    return (
        <TouchableHighlight onPress={() => onPress(cln._id)}>
            <View style={s.cleaner}>
                <Text style={s.cleanerHead}>{ cln.name }</Text>
                <Text style={s.cleanerHead}>{ cln.phoneNumber }</Text>
            </View>
        </TouchableHighlight>
    )
}

const CleanerList = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const { global } = useGlobalContext()
    const [ cleaners, setCleaners ] = useState<CleanerI[]>([])

    const nav = useNavigation<cleanerNavProps>()      

    const initializeCleaners = async () => {
        try {
            // if(!pickupAddress) return
            const cleanersData = await getNearByClns(
                global.token,
                35.1698945,
                -80.9762814,
                999
            )

            setCleaners(cleanersData)
        } catch(e) {
            //edit: display 'no cleaners nearby'
            console.log('initializeCleaners Error: ', e)
        }
    }

    useFocusEffect(
        useCallback(() => {
                setLoading(true)
                initializeCleaners()
                    .finally(() => setLoading(false))
        }, [])
    )

    if(loading) {
        return (
            <View style={s.mainContainer}>
                <Text style={s.mainHeadTxt}>Loading...</Text>
            </View>
        )
    }

    const cleanerPressed = (clnId: string) => {
        nav.navigate('cleaner', { cleanerId: clnId })
    }

    return (
        <View style={s.mainContainer}>
            <Text style={s.mainHeadTxt}>Cleaners Nearby</Text>
            <View style={s.listContainer}>
                <ScrollView>
                    { cleaners.map(cln => <CleanerCard 
                        key={cln._id} 
                        cln={cln} 
                        onPress={cleanerPressed} 
                        />                        
                    )}
                </ScrollView>
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.darkGrey,
        paddingTop: 100
    },
    mainHeadTxt: {
        textAlign: 'center',
        fontSize: 30,
        color: colors.orange,
        fontWeight: '900',
        marginBottom: 50
    },
    listContainer: {
        height: '100%',
        marginHorizontal: 50
    },
    cleaner: {
        maxWidth: 800,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.offGold,
        marginBottom: 20,
        padding: 20
    },
    preferredCleaner: {
        maxWidth: 800,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.offGold,
        borderColor: colors.orange,
        borderWidth: 2,
        marginBottom: 20,
        padding: 20
    },
    cleanerHead: {
        textAlign: 'center',
        color: colors.black,
        fontWeight: '800'
    }
})

export default CleanerList