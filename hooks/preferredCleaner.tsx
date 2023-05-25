import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import { useState, useEffect } from 'react'
import { useGlobalContext } from '../context/global'
import { apiUrl, secureApi } from '../data/requests'
import { CleanerI, ServiceI } from "../interface/api"
import RequestsHook from './requests'


const preferredCleanerHook = (theToken: string) => {
    const [ cleaner, setCleaner ] = useState<CleanerI>()
    const { global, setGlobal } = useGlobalContext()
    const [ requests, setRequests ] = useState<ServiceI[]>([])

    

    const intializeRequests = async (preferredCleaner: CleanerI) => {
        const storedRequesets = await AsyncStorage.getItem('requests')
        console.log('storedRequesets: ', storedRequesets)
        //edit: validate stored requests
        //if stored reqeusts exists put it in state
        if(storedRequesets) {
            const parsedRequests: ServiceI[] = JSON.parse(storedRequesets)

            const uniqueRequests = _.uniqBy(parsedRequests, '_id')
            console.log('uniqueRequests', uniqueRequests)
            const filterUniq = uniqueRequests.filter(req => {
                return !_.includes(
                    preferredCleaner.services,
                    req
                )
            })

            if(filterUniq.length === uniqueRequests.length) {
                setRequests(parsedRequests)
            }
        }
    }

    const handlePCleaner = async (token: string) => {
        //get user's preferred cleaner data
        return await secureApi(token).get<CleanerI>(`${apiUrl}/client/retreive/preferredCleaner`)
            .then(res => {
                setGlobal({ ...global, preferredCleaner: res.data._id })
                intializeRequests(res.data)
                setCleaner(res.data)
                return res.data
            })
            .catch(e => {
                console.log('failed: ', 'put preferredCleaner in global.tsx')
                return undefined
            })
    }

    useEffect(() => {
        if(requests.length) {
            AsyncStorage.setItem('requests', JSON.stringify(requests))
        }
    }, [ requests ])

    return {
        preferredCleaner: cleaner,
        requests, 
        setRequests,
        update: (token: string) => handlePCleaner(token)
    }
}

export default preferredCleanerHook