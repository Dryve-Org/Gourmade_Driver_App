import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'
import { QuantityT } from '../interface/api'

/*
    gets an array of object and
    uniquely return the objects back
    with the amount of repeated of the 
    corresponding item as quantity
*/
export const uniqueWithQuantity = <T>(
    dataArray: T[], 
    unProp: keyof T
): (T & QuantityT)[] => {
    type WithQ = T & QuantityT
    let addedProps: WithQ[] = []
    for(const data of _.uniqBy(dataArray, unProp)) {
        const unData = dataArray.filter(d => d[unProp] === data[unProp])
        addedProps.push({
            ...unData[0],
            quantity: unData.length
        })
    }

    return addedProps
}

export const capFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

//store item in local storage
export const storeItem = async (
    prop: string,
    data: any,
    //use async on non-async storing/ default: async
    noAsync?: boolean
) => {
    try{ 
        const stringed = JSON.stringify(data)

        if(noAsync) {
            await AsyncStorage.setItem(prop, stringed)
        } else {
            AsyncStorage.setItem(prop, stringed)
        }
        
        //if storing data is successful
        return true
    } catch {
        //if storing data fails
        return false
    }

}