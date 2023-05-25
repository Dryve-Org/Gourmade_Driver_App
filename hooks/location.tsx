import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location'
import { GlobalI, useGlobalContext } from '../context/global'

const locationHook = (
    global: GlobalI,
    setGlobal: React.Dispatch<React.SetStateAction<GlobalI>>
) => {
    const [ locationPermissionInformation, requestPermission ] = useForegroundPermissions()
    const [ locationPerm, setLocationPerm ] = useState<boolean>(false)

    const verifyPermission = async () => {
        if(locationPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission()

            return permissionResponse.granted
        }

        if(locationPermissionInformation?.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant access to location to use this app.'
            )
            return false
        }
        return true
    }

    const getLocationHandler = async (toGlobal?: boolean) => {
        const hasPermission = await verifyPermission()
        if(!hasPermission) {
            await requestPermission()
            return false
        }

        const location = await getCurrentPositionAsync()

        toGlobal && setGlobal({ ...global, location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        }})

        return location
    }

    useEffect(() => {
        (async () => {
            const locPerm = await verifyPermission()
                .catch((e) => { 
                    console.log('location permission fail: ',e) 
                    return false
                })
            setLocationPerm(locPerm)
            if(!locPerm) return
            await getLocationHandler(true)
        })()
    }, [])

    return {
        locationPermission: locationPerm,
        verifyPermission,
        getLocationHandler
    }
}

export default locationHook