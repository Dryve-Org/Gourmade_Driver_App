import { useState, useEffect } from 'react'
import { GlobalI, useGlobalContext } from "../context/global"
import { getNearByClns, secureApi } from '../data/requests'
import { CleanerI } from '../interface/api'


const cleanersHook = (token: string) => {
    const [ cleaners, setCleaners ] = useState<CleanerI[]>()

    const getCleanersNearby = async () => {
        const cleanersData = await secureApi(token).post('/cleaner_nearby', {
            
        })
    }

    useEffect(() => {
        (async () => {
            try {
                
            } catch (e) {

            }
        })()
    }, []) 

    return {
        
    }
}

export default cleanersHook