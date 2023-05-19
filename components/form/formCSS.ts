import { StyleSheet } from "react-native"
import {theme} from "../../styles/colors"

const errorText = {
    color: theme.errorText,
    marginBottom: 1
}

export const TIStyles = StyleSheet.create({
    TIContainer: {},
    label: {
        color: theme.inputLabel,
        fontSize: 15,
    },
    textInput: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 20,
        backgroundColor: theme.inputBackground,
        marginBottom: 5,
        borderRadius: 5,
        height: 50,
    },
    inputError: {
        ...errorText
    },
})

export const formBttnStyles = StyleSheet.create({
    bttn: {
        marginTop: 20,
        backgroundColor: theme.buttonBackground,
        borderRadius: 100,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        height: 60,
        justifyContent: 'center'
    },
    bttnTxt: {
        color: theme.buttonText,
        fontSize: 25,
        alignSelf: 'center',
        marginVertical: '1%'
    }
})

export const dropdownStyles = StyleSheet.create({
    label: {
        color: theme.inputLabel,
        fontSize: 15,
    },
    dropDown: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: theme.inputBackground
    },
    error: {
        ...errorText
    }
})