import {
  Button,
  StyleSheet,
  Text,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../component/Input';
import Custombutton from '../component/Custombutton';
import Header from '../component/Header';
import {Colors} from '../utils/Colors';
import React, {useState, useContext, useEffect} from 'react';
import {Context} from '../../AuthContex';
import {store} from '../redux/Store';
import {useDispatch, useSelector} from 'react-redux';
import {loginEmail, loginPassword, loginAPI} from '../redux/Actions';

export default function Loginscreen() {
  const dispatch = useDispatch();
  const [isEmailError, setIsEmailsError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const {signIn} = useContext(Context);
  const {email, password, token} = useSelector(state => state.reducer);
  // const getLoginUser = async () => {
  //   axios
  //     .post('http://192.168.10.167:4000/auth/login', {
  //       email: email,
  //       password: password,
  //     })
  //     .then(response => {
  //       const token = response?.data?.data?.accessToken;
  //       const message = response?.data?.message;
  //       // console.log(token);
  //       if (token) {
  //         signIn(token);
  //       } else {
  //         alert(message);
  //       }
  //     })
  //     .catch(error => {
  //       // console.log(error.response);
  //       alert(error);
  //     });
  // };

  const onRequest = () => {
    setIsloading(true);
  };

  const onSuccess = message => {
    setIsloading(false);

    if (token == null) {
      alert(message);
    } else {
      signIn(token);
    }
  };


  const onError = message => {
    setIsloading(false);
    alert(message);
  };

  const userLogin = () => {
    const strongRegex = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );
    if (!strongRegex.test(email)) {
      // console.log('gdfb', email);
      setIsActive(!isActive);
      setIsEmailsError(true);
    } else {
      setIsEmailsError(false);
    }
    if (password.length < 4) {
      // console.log('password', password);
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
    if (strongRegex.test(email) && password.length > 3) {
      const requestBody = {
        email: email,
        password: password,
      };
      dispatch(loginAPI(requestBody, onRequest, onError, onSuccess));
    } else {
      Keyboard.dismiss();
      alert('please enter valid details');
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 140,
          marginBottom: 59,
          fontWeight: '600',
          fontSize: 26,
          color: Colors.BLACK,
        }}>
        Login
      </Text>
      <View style={{marginBottom: 25}}>
        <Input
          placeholder={'bytes@gmail.com'}
          textColor={Colors.BLACK}
          isError={isEmailError}
          error={'invalid email'}
          inputHeader={'Email'}
          onChangeText={value => {
            dispatch(loginEmail(value));
          }}
        />
      </View>
      <Input
        placeholder={'password'}
        secureTextEntry={true}
        textColor={Colors.BLACK}
        isError={isPasswordError}
        inputHeader={'Password'}
        error={'invalid password'}
        onChangeText={value => {
          // setPassword(value);
          dispatch(loginPassword(value));
        }}
      />
      <View style={{marginTop: 51, alignItems: 'center'}}>
        <Custombutton
          onPress={userLogin}
          buttonName={
            isloading ? <ActivityIndicator color={Colors.BLACK} /> : 'Login'
          }
          buttonStyle={{color: Colors.PRIMARY, width: 102}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: 30,
    // marginRight: 20,
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.BACKGROUND_COL0R,
  },
});
