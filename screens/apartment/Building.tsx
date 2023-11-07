import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { useGlobalContext } from '../../context/global'
import { getActiveUnits } from '../../data/requests'
import { AptBuildingI } from '../../interface/api'
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'

type mapProps = NativeStackNavigationProp<MapStackParamsList, 'apartment'>

const BuildingInfoScreen = () => {
    //aU stands for active units
    const [ aU, setAU ] = useState<AptBuildingI["units"]>()
    const [ loading, setLoading ] = useState<boolean>(true)

    const route = useRoute<RouteProp<MapStackParamsList, 'aptBld'>>()
    const { bldId, aptId, apt } = route.params

    const { global } = useGlobalContext()
    const { token } = global

    const navigation = useNavigation<mapProps>()

    useFocusEffect(
        useCallback(() => {
            getActiveUnits(token, aptId, bldId)
                .then(res => {
                    if(res) {
                        setAU(res)
                    }
                })
                .finally(() => setLoading(false))
        }, [])
    )

    if(loading) {
        return (
            <View style={ s.container }>
                <Text style={ s.loading }>Loading...</Text>
            </View>
        )
    }

    if(!aU) {
        return(
            <View>
                <View style={ s.container }>
                    <Text>Something went wrong</Text>
                </View>
            </View>
        )
    }

    const unitsMap = Object.entries(aU)

    const handleUnitPress = (unitNum: string, unitId: string) => {
        navigation.navigate('aptUnit', {
            apt,
            aptId,
            bldId,
            unitNum,
            unitId
        })
    }

    return(
        <View style={ s.container }>
            <View style={ s.intro }>
                <Text style={ s.address }>{ apt.name }</Text>
                <Text style={ s.address }>Building:</Text>
                <Text style={ s.name }>{ bldId }</Text>
            </View>
            <ScrollView>
                <View style={ s.optsList }>
                    {
                        unitsMap.map(unit => (
                            <TouchableOpacity onPress={() => handleUnitPress(unit[0],unit[1].unitId)}>
                                <View style={ !unit[1].activeOrders.length ? s.opt : s.opt2 }>
                                    <Text style={ s.optTxt }>{ unit[0] }</Text>
                                    <Text style={ s.optTxt }>{ unit[1].unitId }</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </ScrollView>
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
        marginHorizontal: 20
    },
    address: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    name: {
        color: colors.orange,
        fontSize: 25
    },
    optsList: {
        // width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    opt: {
        backgroundColor: colors.orange,
        border: 'white',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        marginBottom: 15,
    },
    opt2: {
        backgroundColor: colors.orange,
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        marginBottom: 15,
    },
    optTxt: {
        fontSize: 20,
        // color: 'white',
        textAlign: 'center'
    }
})

export default BuildingInfoScreen