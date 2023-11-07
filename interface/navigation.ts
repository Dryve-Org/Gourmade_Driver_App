import { AptI, CleanerI, OrderI, ServiceI, UnitI } from "./api"
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
    order: {
        order: OrderI
    }
    aptUnit: {
        aptId: string
        bldId: string
        apt: AptI
        unitNum: string
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
    Order: {
        order: OrderI
    }
    Unit: {
        aptId: string
        bldId: string
        apt: AptI
        unitNum: string
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

