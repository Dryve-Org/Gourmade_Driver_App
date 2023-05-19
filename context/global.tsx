import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, createContext, Dispatch, SetStateAction, useEffect } from 'react'
import { api, apiUrl } from '../data/requests'
import { AddressI } from '../interface/api'

export interface GlobalI {
    token: string
    loading: boolean
    location?: {
        longitude: number,
        latitude: number
    },
    "401": boolean
}

interface contextI {
    global: GlobalI
    setGlobal?: Dispatch<SetStateAction<GlobalI>>
}

export const GlobalContext = createContext<any>({});

interface GlobalContextProps {
    children: any
}

const GlobalContextProvider = (props: GlobalContextProps) => {
    const [ global, setGlobal ] = useState<GlobalI>({
        //if token doesn't exist user should
        //have to go to login screen
        token: "",
        loading: true,
        "401": false
    })

    /**
     * If the token is not falsy, store it in global contexts
    */
    const retreiveToken = async () => {
        try {
            await AsyncStorage.setItem('token', '')
            //get token for device storage
            const token = await AsyncStorage.getItem('token')
            
            //if token is not falsy, store it in global contexts
            if(token) setGlobal({ ...global, token })

            //only if token exists
            //edit: need to handle invalid or expired token
            
        } catch(e) {
            console.log(e)
        }
    }

    const onTokenUpdate = async (token: string) => {
        try {
            if(token) {
                AsyncStorage.setItem('token', token)
            }
        } catch(e: any) {
            console.log('unable to store token')
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await retreiveToken()
            } finally {
                setGlobal({...global, loading: false})
            }
        })()
    }, [])

    /* It's checking if the token is not falsy, if it's not, it will call the onTokenUpdate function. */
    useEffect(() => {
        if(global.token) {
            onTokenUpdate(global.token)
                .finally(() => setGlobal({ ...global, loading: false }))
        }
    }, [ global.token ])

    useEffect(() => {
        if(global[401]) {
            setGlobal({
                ...global,
                token: "",
                "401": false
            })
        }
    }, [ global[401] ])


    const passDown: contextI = { global, setGlobal }

    return (
        <GlobalContext.Provider value={ passDown }>
            { props.children }
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider

/**
 * This function returns the global context and the setGlobal function.
 */
export const useGlobalContext = (): { 
    global: GlobalI, 
    setGlobal: Dispatch<SetStateAction<GlobalI>> 
} => React.useContext(GlobalContext)