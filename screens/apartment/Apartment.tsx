import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useGlobalContext } from '../../context/global'
import { getApartment } from '../../data/requests'
import { AptI } from '../../interface/api'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MapStackParamsList } from '../../interface/navigation'
import { colors } from '../../styles/colors'
import AptList from '../../components/apartment/AptList'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type mapProps = NativeStackNavigationProp<MapStackParamsList, 'apartment'>

const AptScreen: React.FC = () => {
    const [ apt, setApt ] = useState<AptI>()
    const [ loading, setLoading ] = useState<boolean>(true)

    const { global, setGlobal } = useGlobalContext()
    const { token } = global

    const route = useRoute<RouteProp<MapStackParamsList, 'apartment'>>()
    const { aptId } = route.params

    const navigation = useNavigation<mapProps>()

    useFocusEffect(
        useCallback(() => {
            getApartment(token, aptId)
                .then(res => {
                    if(res) {
                        setApt(res)
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

    if(!apt) {
        return(
            <View>
                <View style={ s.container }>
                    <Text>Something went wrong</Text>
                </View>
            </View>
        )
    }

    const handleBuildingPress = (bld: string) => {
        navigation.navigate('aptBld', {
            bldId: bld,
            aptId,
            apt
        })
    }
    
    return(
        <View style={ s.container }>
            <View style={ s.intro }>
                <Text style={ s.name }>{ apt.name }</Text>
                <Text style={ s.address }>{ apt.address.formatted }</Text>
            </View>
            <AptList 
                buildings={ apt.buildings }
                buildingPress={ handleBuildingPress }
            />
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
        fontSize: 25,
        textAlign: 'center'
    },
    optsList: {
        width: '100%'
    },
    opt: {
        width: '100%',
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        marginBottom: 15
    },
    optTxt: {
        fontSize: 20,
        color: 'white'
    }
})

export default AptScreen