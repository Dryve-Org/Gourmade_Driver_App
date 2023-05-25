import moment from 'moment'
import validator from 'validator'

const v = validator

type Values = {
    [key: string]: string
}

export const numOnly = (val: string) => val === undefined ? "" :  val.replace(/[^0-9.]/g, "")

/**
 * It takes in an object of values and returns an object of errors.
 * @param {Values} values - Values
 * @returns The return type is T.
*/
export default function validation<T>(values: Values) {
    const e = {...values}

    for (const [ key ] of Object.entries(e)) {
        e[key] = ""
    }

    const pe = 'Please enter'
    const ps = 'Please select'

    const exists = (keyValue: string) => values[keyValue] !== undefined
    
    //firstName
    if(values.firstName === "") {
        e.firstName = `${ pe } your first name`
    } 

    //lastName
    if(values.lastName === "") {
        e.lastName = `${ pe } your last name`
    }

    //phoneNumber
    if(exists('phoneNumber')) {
        if(values.phoneNumber === "") {
            e.phoneNumber = `${ pe } a phone number`
        } else if(!v.isMobilePhone(values.phoneNumber)){
            e.phoneNumber = `${ pe } a valid phone number`
        }
    }

    //streetLineOne
    if(values.streetLineOne === "") {
        e.streetLineOne = `${ pe } enter street address`
    }

    //email
    if(exists('email')) {
        if(values.email === "") {
            e.email = `${ pe } your email`
        } else if(!v.isEmail(values.email)) {
            e.email = `${ pe } a valid email`
        }
    }

    //state
    if(values.state === "") {
        e.state = `${ pe } a state`
    }

    //city
    if(values.city === "") {
        e.city = `${ pe } a city`
    }

    //zipcode
    if(exists("zipcode")) {
        if(values.zipcode === "" || values?.zipcode.length < 5) {
            e.zipcode = `${ pe } a postal code`
        }
    }

    if(exists('dob')) {
        const date = moment(values.dob, 'MM/DD/YYYY', true)

        if(values.dob === "") {
            e.dob = `${ pe } your date of birth`
        } else {
            if(date.isValid()) {
                const years = moment().diff(values.dob, 'years', false)
    
                if(years < 18) {
                    e.dob = 'Must be 18 or older'
                }
            } else {
                e.dob = `${ pe } a valid date of birth`
            }
        }
    }

    //password
    if(exists('password')) {
        if(values.password === "") {
            e.password = `${ pe } a password`
        } else if (values.password.length < 8) {
            e.password = 'Password must be more than 8 characters'
        }
    }

    //secPassword
    if(exists('secPassword')) {
        if(values.secPassword !== values.password) {
            e.secPassword = 'Must match'
        }
    }

    return e as unknown as T
}