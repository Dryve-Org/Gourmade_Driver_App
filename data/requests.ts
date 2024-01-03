import axios from 'axios'
import { AddressI, AptBuildingI, AptI, CleanerI, DriverI, OrderI, UnitI, UnitRespI } from '../interface/api'

export const apiUrl = process.env.React_APP_APIURL ? process.env.React_APP_APIURL : "https://octopus-app-5lcnt.ondigitalocean.app/"

/**
 * This function returns an axios instance with a baseURL and a header with an Authorization key and a
 * value of Bearer and the providedToken or null if no token is provided.
 * @param {string} [providedToken] - The token that is passed in from the user.
 * @returns An axios instance with a baseURL and headers.
 */
export const api = (providedToken?: string) => {
    return axios.create({
        baseURL: apiUrl,
        headers: {
            "Authorization": `Bearer ${ providedToken ? providedToken : 'null' }`,
        }
    })
}

export const getDriverData = async (token: string) => {
    try {
        const driver = await api(token)
            .get<DriverI>('/driver')
            .then(res => res.data)

        return driver
    } catch {
        return undefined
    }
}

export const getOrderData = async (
    token: string,
    orderId: OrderI['_id']
) => {
    try {
        const order = await api(token)
            .get<OrderI>(`/driver/order/${ orderId }`)
            .then(res => res.data)

        return order
    } catch {
        return undefined
    }
}

export const getOrders = async (
    token: string,
    orderIds: OrderI['_id'][]
) => {
    try { 
        const orders = await api(token)
            .post<OrderI[]>('/driver/order/orders', {
                orderIds
            })
            .then(res => res.data)

        return orders
    } catch {
        return undefined
    }
}

/**
 * It makes a post request to the server, and returns the data from the response.
 * @param {string} token - string,
 * @param {number} latitude - number,
 * @param {number} longitude - -122.4194
 * @param {number} maxDistance - number = 10
 * @returns clns:  [
 *   {
 *     "id": "5d8f9b8f8b9c8a0017b8f8b9",
 *     "name": "John Doe",
 *     "email": "john@doe.com",
 *     "phone": "1234567890",
 *     "address": AddressI
 * }
*/
export const getNearByClns = async (
    token: string,
    latitude: number,
    longitude: number,
    maxDistance: number
) => {
    try {
        const clns = await api(token)
            .post<CleanerI[]>('/client/cleaners_nearby', {
                latitude,
                longitude,
                maxDistance //in milesp
            }).then(res => res.data)

            return clns
    } catch(e) {
        return []
    }
}

export const getDriverActiveOrders = async (
    token: string
) => {
    try {
        const dAO = await api(token)
            .get<DriverI['activeOrders']>('/driver/order/active_orders')
            .then(res => res.data)

        return dAO
    } catch {
        return undefined
    }
}

export const getCleanerActiveOrders = async (
    token: string,
    clnId: string
) => {
    try {
        const cAO = await api(token)
            .get<CleanerI['activeOrders']>(`/driver/cleaner/${ clnId }/active_orders`)
            .then(res => res.data)

        return cAO
    } catch {
        return undefined
    }
}

export const getCleanerPickups = async (
    token: string,
    clnId: string
) => {
    try {
        const cAO = await api(token)
            .get<CleanerI['activeOrders']>(`/driver/cleaner/${ clnId }/pickups`)
            .then(res => res.data)

        return cAO
    } catch {
        return undefined
    }
}

export const pickUpOrders = async (
    token: string,
    clnId: string,
    orderIds: string[]
) => {
    try {
        const updatedOrders = await api(token)
            .post<OrderI[]>(`/driver/order/cleaner_pickups/${ clnId }`, {
                orderIds
            })
            .then(res => res.data)

        return updatedOrders
    } catch {
        return undefined
    }
}

/**
 * Get Cleaner Data
 * @param {string} token - string - the token that is used to authenticate the user
 * @param clnId - CleanerI['_id']
 * @returns An object with the following properties:
 */
export const getCleaner = async (
    token: string,
    clnId: CleanerI['_id']
) => {
    try {
        const cln = await api(token)
            .get<CleanerI>(`/driver/cleaner/${ clnId }`)
            .then(res => res.data)

        return cln
    } catch(e) {
        return undefined
    }
}

/**
 * Request that transfers orders to specified cleaners
 * @param {string} token - string,
 * @param clnId - CleanerI['_id']
 * @param {OrderI['_id'][]} orderIds - OrderI['_id'][]
 * @returns An array of orders.
 */
export const cleanerDropOff = async (
    token: string,
    clnId: CleanerI['_id'],
    orderIds: OrderI['_id'][]
) => {
    try {
        const orders = await api(token)
            .post<OrderI[]>(`/driver/cleaner/${clnId}/drop_off`, {
                orderIds
            })
            .then(res => res.data)

        return orders
    } catch {
        return undefined
    }
}

/**
 * Get all apartments from the server, if there's an error, return an empty array
 * @param {string} token - string - the token that is used to authenticate the user
 * @returns An array of AptI objects.
*/
export const getApartments = async (token: string) => {
    try {
        const apts = await api(token)
            .get<AptI[]>('/driver/apartments')
            .then(res => res.data)

        return apts
    } catch(e) {
        return []
    }
}

/**
 * This function returns an apartment object if the token is valid, otherwise it returns null.
 * @param {string} token - string - the token that is used to authenticate the user
 * @param {string} aptId - string - the id of the apartment
 * @returns The return type is AptI.
*/
export const getApartment = async (
    token: string,
    aptId: string
) => {
    try {
        const apt = await api(token)
            .get<AptI>(`/driver/apartment/${ aptId }`)
            .then(res => res.data)
        
        return apt
    } catch(e) {
        return null
    }
}

/**
 * This function will return an object of type AptI if the request is successful, otherwise it will
 * return null.
 * @param {string} token - string,
 * @param {string} aptId - string,
 * @param {string} bldId - string
 * @returns An object with a property called data that is an array of objects.
*/
export const getActiveUnits = async (
    token: string,
    aptId: string,
    bldId: string
) => {
    try {
        const activeUnits = await api(token)
            .get<{[unit: string]: UnitI}>(`/driver/apartment/${ aptId }/${bldId}/active_units`)
            .then(res => res.data)
        
        return activeUnits
    } catch {
        return null
    }
}

/**
 * This function will return a unit object if the token is valid, otherwise it will return null.
 * @param {string} token - string,
 * @param {string} aptId - string,
 * @param {string} bldId - string,
 * @param {string} unitId
 * @returns The return type is UnitI.
*/
export const getUnit = async (
    token: string,
    unitId: string
) => {
    try {
        const unit = await api(token)
            .get<UnitRespI>(`/driver/apartment/unitId/${unitId}`)
            .then(res => res.data)

        return unit
    } catch {
        return null
    }
}

/**
 * This function takes a token, an apartment id, a building id, and a unit id, and returns an order
 * object or null.
 * @param {string} token - string,
 * @param {string} aptId - string,
 * @param {string} bldId - string,
 * @param {string} unitId - string
 * @returns The return type is OrderI.
 */
export const cancelOrderByOrderId = async (
    token: string,
    orderId: OrderI['_id']
) => {
    try {
        const order = await api(token)
            .delete<OrderI>(`/driver/order/${orderId}/cancel_order`)
            .then(res => res.data)

        return order
    } catch {
        return null
    }
}

export const createOrder = async (
    token: string,
    unitId: string,
    email: string
) => {
    try {
        const order = await api(token)
            .post<OrderI>(`/driver/order/client_create/${unitId}/${email}`)
            .then(res => res.data)
            .catch(err => console.log(err))

        return order
    } catch {
        return null
    }
}

export const clientDropoff = async (
    token: string,
    orderId: OrderI['_id']
) => {
    try {
        const order = await api(token)
            .post<OrderI>(`/driver/order/${ orderId }/client_dropoff`)
            .then(res => res.data)

        return order
    } catch {
        return null
    }
}

export const updateBagQuantity = async (
    token: string,
    orderId: OrderI['_id'],
    bagQuantity: number
) => {
    try {
        const order = await api(token)
            .post<OrderI>(`/driver/order/bagquantity/${ orderId }/${bagQuantity}`, {
                bagQuantity
            })
            .then(res => res.data)

        return order
    } catch {
        return null
    }
}