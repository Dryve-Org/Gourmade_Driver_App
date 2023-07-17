import { useFocusEffect } from '@react-navigation/native'
import { useState, useEffect, useCallback } from 'react'
import { apiUrl, api } from '../data/requests'
import { AddressI } from '../interface/api'

const pickupsHook = (token: string) => {
    const [ pickups, setPickups ] = useState<AddressI[]>([])
    const [ pickupAddress, setPickupAddress ] = useState<AddressI>()

    const getPickups = async () => {
        const pickupsData = await api(token)
            .get<AddressI[]>(`${ apiUrl }/client/retreive/pickups`)
            .then(res => res.data)
            .catch((e) => {
                console.log('pickupsData failed', e)
                return []
            })
        
        console.log('pickupsData: ', pickupsData)
        setPickups(pickupsData)
        //find address with truthy default
        const dflt = pickupsData.filter(addy => addy.default)

        setPickupAddress(
            dflt[0] ? dflt[0] : pickupsData[0]
        )
    }

    return {
        pickups,
        pickupAddress,
        update: () => getPickups()
    }
}

export default pickupsHook