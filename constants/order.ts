import { api } from "../data/requests"
import { OrderI, QuantityT, ServiceI } from "../interface/api"
import { unixDateFormatter } from "./time"
import { apiUrl } from "./values"


interface CreateOrderI {
    cleanerId: string
    pickupAddress: string //address id: '_id'
    cardId: string
    requests: (ServiceI & QuantityT)[]
    token: string
}

export const createOrder = async ({
    cleanerId,
    pickupAddress,
    cardId,
    requests,
    token
}: CreateOrderI) => {
    try {
        const desiredServices = requests.map(req => {
            return {
                quantity: req.quantity,
                service: req._id
            }
        })
        const postData = {
            cleanerId,
            pickupAddress,
            cardId,
            desiredServices
        }
        await api(token).post(`${apiUrl}/client/request_pickup`, postData)
    } catch(e) {
        console.log('could not create order', e)
    }
}

export const formatOrderData = (o: OrderI) => {
    
    const fOrder = {
        'Client Name': `${o.client.firstName} ${o.client.lastName}`,
        'Client Number': o.phoneNumber,
        'Origin Address': o.origin?.formatted ? o.origin.formatted : undefined,
        'Drop Off Address': o.dropOffAddress?.formatted ? o.dropOffAddress.formatted : undefined,
        'Cleaner': o.cleaner?.name ? o.cleaner.name : undefined,
        'Cleaner Address': o.cleanerAddress?.formatted ? o.cleanerAddress.formatted : undefined,
        'Time Created': unixDateFormatter(o.created)
    }

    return fOrder
}