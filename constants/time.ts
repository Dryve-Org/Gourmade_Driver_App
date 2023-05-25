import moment from 'moment'
import validator from 'validator'

//validate if unix date
export const unixDateFormatter = (value: number): string => { 
    return moment.unix(value).format("MM/DD/YYYY hh:mm a")
}

//convert date to unix
export const dateToUnix = (date: string): number => {
    return moment(date.trim(), "MM/DD/YYYY").unix() 
}

//is valid unix date
export const isUnixDate = (value: number): boolean => {
    const date = moment.unix(value).format("YYYY/MM/DD")
    return validator.isDate(date)
}

// is above 18
export const isOfAge = (unixDate: number): boolean => {
    const date = moment.unix(unixDate).format("MM/DD/YYYY")
    return moment().diff(date, 'years', true) >= 18
}

export const now = () => moment().unix()