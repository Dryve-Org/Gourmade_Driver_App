import AsyncStorage from "@react-native-async-storage/async-storage"
import { AxiosError } from "axios"
import { useGlobalContext } from "../context/global"


const ErrorHandler = () => {
    const {
        global, 
        setGlobal
    } = useGlobalContext()

    const errorHandler = async (err: AxiosError) => {
        if(err.response?.status === 401) {
            await AsyncStorage.setItem('token', '')
            setGlobal({
                ...global,
                token: ''
            })
        }
    }

    return [
        errorHandler
    ]
}

export default ErrorHandler