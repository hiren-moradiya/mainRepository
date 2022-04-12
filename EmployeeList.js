import {
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {Colors} from '../utils/Colors';
import Header from '../component/Header';
import Custombutton from '../component/Custombutton';
import Employee from '../component/Employee';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {Context} from '../../AuthContex';
import {getEmployee} from '../redux/Actions';
import {store} from '../redux/Store';
import {useIsFocused} from '@react-navigation/native';

export default function EmployeeList({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const [token, setToken] = useState(null);
  const {signOut} = useContext(Context);
  const {users} = useSelector(state => state.employeeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('token_key').then(token => {
      setToken(token);
      if (token) {
        dispatch(getEmployee(token, onError));
      } else {
        Alert.alert(
          'Warning!',
          'Your session has been expired! please login again',
          [
            {
              text: 'Ok',
              onPress: () => {
                signOut();
              },
            },
          ],
          {cancelable: false},
        );
      }
    });
  }, [isFocused]);

  const onError = error => {
    alert(error);
    console.log(error);
  };

  // const getUsers = async token => {
  //   axios
  //     .get('http://192.168.10.167:4000/employee', {
  //       headers: {Authorization: `Bearer ${token}`},
  //     })
  //     .then(response => {
  //       // console.log('response', response?.data?.data);
  //       const data = response?.data?.data;
  //       setEmployeeData(data);
  //     })
  //     .catch(error => {
  //       const statusCode = error?.response?.data?.statusCode;
  //       const message = error?.response?.data?.message;
  //       if (statusCode == '401') {
  //         Alert.alert('Warning!', `${message}`, [
  //           {
  //             text: 'Ok',
  //             onPress: () => {
  //               signOut();
  //             },
  //           },
  //         ]);
  //       } else {
  //         alert(error);
  //       }
  //     });
  // };
  // const onRefresh = () => {
  //   return (
  //     setRefreshing(true),
  //     dispatch(getEmployee(token, onSuccess, onError)),
  //     setRefreshing(false)
  //   );
  // };

  const renderItem = item => {
    const employee = item?.item;
    let today = new Date(employee?.createdAt);
    // console.log('employee', employee);

    let date =
      today.getDate() +
      ' ' +
      parseInt(today.getMonth() + 1) +
      ' ' +
      today.getFullYear();

    let statusOfUsers = employee?.status.toLowerCase();
    return (
      <View style={{marginVertical: 15, marginHorizontal: 25}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profilescreen', {
              employeeDetails: employee,
            })
          }>
          <Employee
            image={require('../utils/image/user.png')}
            title={`${employee.firstName} ${employee.lastName}`}
            address={`${employee?.address}`}
            date={date}
            activeBarStyle={{
              backgroundColor:
                statusOfUsers == 'active' ? Colors.GREEN : Colors.RED,
            }}
            status={statusOfUsers}
            statusStyle={{
              color: statusOfUsers == 'active' ? Colors.GREEN : Colors.RED,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onRefresh = () => {
    return (
      setRefreshing(true),
      dispatch(getEmployee(token, onError)),
      setRefreshing(false)
    );
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle={'Employee List'}
        headerContainerStyle={{marginTop: 20}}
      />
      <View
        style={{
          marginBottom: 25,
          height: 19,
          marginTop: 25,
          alignItems: 'flex-end',
          marginRight: 25,
        }}>
        <Custombutton
          buttonStyle={{
            borderRedius: 2,
            width: 76,
            height: 19,
          }}
          buttontextStyle={{lineHeight: 16.63}}
          buttonName={'+ new'}
          onPress={() => navigation.navigate('AddemployeeScreen')}
        />
      </View>
      <View>
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={item => {
            return renderItem(item);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND_COL0R,
    flex: 1,
  },
});
