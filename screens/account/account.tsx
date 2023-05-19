import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { capFirst } from '../../constants/general'
import { useGlobalContext } from '../../context/global'
import { apiUrl, api } from '../../data/requests'
import { DriverI } from '../../interface/api'
import { colors } from '../../styles/colors'

const Account = () => {
    const [ driver, setDriver ] = useState<DriverI>()
    const [ loading, setLoading ] = useState(true)
    const {
        global,
        setGlobal
    } = useGlobalContext()

    const { token } = global

    const getDriverData = async () => {
        await api(token)
            .get<DriverI>(`${ apiUrl }/driver`)
            .then(res => {
                setDriver(res.data)
            })
    }

    useFocusEffect(
        useCallback(() => {
            getDriverData()
                .finally(() => {
                    setLoading(false)
                })
        }, [])
    )
    
    if(loading) {
        return (
            <View style={ s.container }>
                <Text style={s.loading}>Loading...</Text>
            </View>
        )
    }

    if(!driver) {
        return (
            <View style={ s.container }>
                <Text>Something went wrong</Text>
            </View>
        )
    }

    const opt = {
        logout: async () => {
            await AsyncStorage.setItem('token', '')

            setGlobal({...global, token: ''})
        }
    }

    return(
        <View style={ s.container }>
            <View style={ s.intro }>
                <Text style={s.hello}>Hello,</Text>
                <Text style={s.name}>
                    { capFirst(driver.user.firstName) }
                    {' '}
                    { capFirst(driver.user.lastName) }
                    {' '}
                </Text>
            </View>
            <ScrollView>
                <TouchableOpacity 
                    style={s.optsList} 
                    onPress={() => opt.logout()}
                >
                    <View style={s.opt}>
                        <Text style={s.optTxt}>Log out</Text>
                    </View>
                </TouchableOpacity>
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
    },
    hello: {
        color: 'white',
        fontSize: 20
    },
    name: {
        color: colors.orange,
        fontSize: 25
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

export default Account