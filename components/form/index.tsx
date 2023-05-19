import React from 'react'
import { Text, View, TextInput, TouchableOpacity, KeyboardTypeOptions } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { TIStyles, formBttnStyles, dropdownStyles } from './formCSS'
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text'

interface TII {
    label: string
    placeHolder?: string
    name: string
    value: string
    secureTextEntry?: boolean
    handleChange: Function
    customStyles?: Object
    error?: string
    useMask?: boolean
    maskType?: MaskedTextInputProps["type"]
    acceptMask?: boolean
    maskOptions?: MaskedTextInputProps["options"]
    keyboardType?: KeyboardTypeOptions
    mask?: string
}

export const TI: React.FC<TII> = ({
    label,
    placeHolder,
    name,
    value,
    handleChange,
    customStyles,
    error,
    acceptMask=true,
    maskType='custom',
    maskOptions,
    keyboardType,
    mask='',
    useMask=false,
    secureTextEntry
}: TII) => { //short for text input

    return (
        <View style={[TIStyles.TIContainer, customStyles]}>
            <Text style={TIStyles.label}>{ label }</Text>
            { !useMask ? <TextInput 
                style={TIStyles.textInput}
                onChangeText={text => { handleChange(name, text) }}
                value={ value }
                keyboardType={ keyboardType }
                placeholder={ placeHolder }
                secureTextEntry={ secureTextEntry }
                /> : <MaskedTextInput
                style={TIStyles.textInput}
                onChangeText={(text, raw) => {
                    handleChange(
                        name,
                        acceptMask ? text : raw
                    )
                }}
                placeholder={ placeHolder }
                secureTextEntry={ secureTextEntry }
                value={ value }
                type={ maskType }
                mask={ mask }
                options={ maskOptions }
                keyboardType={ keyboardType }
            /> }
            <Text style={TIStyles.inputError}>{ error }</Text>
        </View>
    )
}

interface FormBttnI {
    title: string
    onPress: Function
    disable?: boolean
}

export const FormBttn: React.FC<FormBttnI> = ({
    title,
    onPress,
    disable
}: FormBttnI) => {


    return (
        <TouchableOpacity 
            style={formBttnStyles.bttn}
            onPress={ () => onPress() }
            disabled={ disable}
        >
            <Text style={formBttnStyles.bttnTxt}>{ title }</Text>
        </TouchableOpacity>
    )
}

interface DropdownI {
    data: string[]
    onSelect: (item: string, name: string, index?: number) => void
    value: string
    placeHolder?: string
    customStyles?: object,
    search?: boolean
    label?: string
    error?: string
    name: string
} 

export const Selector: React.FC<DropdownI> = ({
    name,
    data,
    onSelect,
    value,
    placeHolder,
    customStyles,
    search,
    label,
    error
}: DropdownI) =>{

    return (
        <View style={customStyles}>
            <Text style={dropdownStyles.label}>{ label }</Text>
            <SelectDropdown 
                data={ data }
                onSelect={ (item: string, index) => onSelect(item, name, index)}
                buttonTextAfterSelection={ () => value }
                rowTextForSelection={ (item) => item }
                search={ search }
                defaultButtonText={ placeHolder }
                buttonStyle={ dropdownStyles.dropDown }
            />
            <Text style={ dropdownStyles.error }>{ error }</Text>
        </View>
    )
}