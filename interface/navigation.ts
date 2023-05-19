import { AptI, CleanerI, ServiceI, UnitI } from "./api"
// import { CleanerInfoI } from "./screens"

export type RootStackParamList = {
    login: undefined
    signup: undefined
    creating: undefined
    home: undefined
}

export type MainButtonParams = {
    mapView: undefined
    orders: undefined
    cleaners: undefined
    account: undefined
    activeOrders: undefined
}

export type MapStackParamsList = {
    apartment: {
        aptId: string
    }
    aptBld: {
        bldId: string
        aptId: string
        apt: AptI
    }
    aptUnit: {
        aptId: string
        bldId: string
        apt: AptI
        unitId: string
    }
    map: undefined
    cleanerInfo: {
        cleanerId: string
    }
    CleanerDropOff: {
        cleanerId: string
        clnName: string,
    }
    CleanerOrders: {
        cleanerId: string
        clnName: string,
    }
}

export type ActiveOrdersParams = {
    ActiveOrders: undefined
    ViewOrder: {
        orderId: string
    }
    Unit: {
        apt: AptI
        aptId: string
        bldId: string
        unitId: string
    }
}

export type CleanerStackParams = {
    cleanerList: {}
    cleaner: {
        cleanerId: CleanerI['_id']
    }
}

export type OrderStackParams = {
    ordersList: undefined
}

export type AccountStackParams = {
    home: undefined
}

