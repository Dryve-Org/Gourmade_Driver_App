import { useEffect, useState } from "react"
import { useGlobalContext } from "../context/global"
import { apiUrl, api } from "../data/requests"
import { OrderI } from "../interface/api"

interface GeoI {
    latitude: number
    longitude: number
}

const driverTracking = (token: string) => {
    const [ activeOrder, setActiveOrder ] = useState<OrderI>()
    const [ driverLoc, setDriverLoc ] = useState<GeoI>()
    const [ driver, setDriver ] = useState<{
        '_id': string
        firstName: string
        lastName: string
        phoneNumber: string
    }>()
    const getOrder = async () => {
        try {
            const order = await api(token)
                .get<OrderI[]>(`${ apiUrl }/client/active_orders`)
                .then(res => res.data)


            //there should only be one order
            setActiveOrder(order[0])

            if(order[0].driverLocation) {
                const driverLocation = order[0].driverLocation.coordinates

                setDriverLoc({
                    latitude: driverLocation[0],
                    longitude: driverLocation[1]
                })
            }

            if(order[0].pickUpDriver) {
                const pUD = order[0].pickUpDriver
                setDriver({
                    '_id': pUD._id,
                    firstName: pUD.user.firstName,
                    lastName: pUD.user.lastName,
                    phoneNumber: pUD.user.phoneNumber
                })
            }

        } catch(e) {
            console.log('could not get order: ', e)
        }
    }

    const getDriverLoc = async () => {
        try {
            if(!activeOrder) return
            const location = await api(token)
                .get<[number, number] | []>(
                    `${apiUrl}/client/track_driver/${activeOrder._id}`
                )
                .then(res => res.data)
            
            if(location.length === 2) {
                setDriverLoc({
                    latitude: location[0],
                    longitude: location[1]
                })
            }
        } catch {
            console.log('could not track driver')
        }
    }

    useEffect(() => {
        getDriverLoc()
        getOrder()
    }, [])

    

    return {
        activeOrder,
        driverLoc,
        driver
    }
}

export default driverTracking