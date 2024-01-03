import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { colors, theme } from '../../styles/colors';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../context/global'
import validator from 'validator'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../interface/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormBttn, TI } from '../../components/form';
import { apiUrl } from '../../constants/values';

interface ValuesI {
  email: string,
  password: string
}

type loginScreenProps = NativeStackNavigationProp<RootStackParamList, 'login'>

const Login = () => {
  const [ values, setValues ] = useState<ValuesI>({
    email: "",
    password: ""
  })
  const [ errors, setErrors ] = useState<ValuesI>({
    email: "",
    password: ""
  })
  const [ invalid, setInvalid ] = useState<string>("")
  const { global, setGlobal } = useGlobalContext()
  const [ submit, setSubmit ] = useState<boolean>(false)
  
  const navigation = useNavigation<loginScreenProps>()

  const handleChange = (input: "email" | "password", value: string) => {
    setValues({
      ...values,
      [input]: value
    })
  }

    const validate = (): boolean => {
      let { email, password } = values

      if(!email) {
        email = "please enter an email"
      } else if(!validator.isEmail(email.trim())) {
        email = "invalid email"
      } else {
        email = ""
      }

      if(!password) {
        password = "please enter a password"
      } else if(password.length < 3) {
        password = "password must be more than 3 characters"
      } else {
        password = ""
      }

      setErrors({ email, password })

      return !email && !password ? true : false
    }

    const login = async () => {
      try {
        if(!validate()) return

        const receivedToken = await axios.post<string>(`${ apiUrl }/driver/login`, {
          username: values.email.trim(),
          password: values.password
        }).then(res => res.data)

        setInvalid("")

        setGlobal({ ...global, token: receivedToken })

        navigation.navigate('creating')
      } 
      catch (e: any) {
        setValues({ ...values, password: "" })
        
        if(e.response.status === 401) {
          setInvalid("Invalid username or password")
        }
        if(e.response.status >= 500) {
          setInvalid("Something went wrong, please comeback later")
        }
      }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
              <Text style={styles.header}>Welcome Back Dryver!</Text>
            </View>

            <View style={styles.form}>
              <TI 
                label='Email'
                name='email'
                handleChange={ handleChange }
                value={ values.email }
                error={ errors.email }
              />

              <TI 
                label='Password'
                name='password'
                handleChange={ handleChange }
                value={ values.password }
                error={ errors.password }
              />

              <FormBttn title='Login' onPress={ async () => await login() }/>
            </View>

            { invalid !== "" && <Text style={ styles.invalidText }>{ invalid }</Text> }

            <TouchableOpacity 
              style={styles.signUpBttn}
              onPress={ () => navigation.navigate('signup') }
            >
              <Text style={styles.signUpBttnTxt}>Sign Up</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '50%',
    flex: 3,
    // backgroundColor: theme.background,
    alignItems: 'center',
    // justifyContent: 'space-around',
    white: 'white',
  },
  headerView: {
    height: 100
  },
  header: {
    // color: theme.header,
    fontSize: 24,
  },
  form: {
    // flex: 2,
    width: '80%',
    justifyContent: 'space-around',
    textAlign: 'left',
    minHeight: 90,
  },
  signUpBttn: {
    // backgroundColor: theme.buttonBackground,
    width: 180,
    height: 180,
    borderRadius: 100,
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpBttnTxt: {
    // color: theme.buttonText,
    fontSize: 20,
    // textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  invalidText: {
    color: theme.errorText,
    marginTop: 10,
  }
})

export default Login
  