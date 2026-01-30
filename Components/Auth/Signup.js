import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Screensheader from '../Universal/Screensheader';
import tw from 'twrnc';
import { height, Input, width } from '../Universal/Input';
import { Buttonnormal } from '../Universal/Buttons';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/FIrebase';
import uuid from 'react-native-uuid';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setphone] = useState('');
  const [address, setaddress] = useState('');
  const [Getdata, setGetdata] = useState([]);
  const [value3, setValue3] = useState();
  const [label3, setlabel3] = useState();
  const [isFocus3, setIsFocus3] = useState(false);
  const [loading, setloading] = useState(false);
  const [entry, setentry] = useState(false);
  const userid = uuid.v4();
  const [rnum, setrnum] = useState(Math.floor(Math.random() * 1000000));
  const datee = new Date();
  const showdate =
    datee.getFullYear() + '-' + (datee.getMonth() + 1) + '-' + datee.getDate();

  const Signinwithemailandpass = async () => {
    if (
      !email ||
      !password ||
      !fname ||
      !lname ||
      !phone ||
      !address ||
      !value3
    ) {
      Alert.alert('Field Required', `Must Fill All The Field`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK');
          },
        },
      ]);
    } else {
      if (phone.length === 11) {
        const coll = collection(db, 'subs_users');
        // const q = query(coll, where('role', '==', label1), where('email', '==', email));
        const q = query(
          coll,
          where('phoneNumber', '==', phone.trim()),
          // where('password', '==', password),
        );
        try {
          setloading(true);
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size > 0) {
            setloading(false);
            Alert.alert(
              'Alert',
              `Phone Number is Already Register Please Add New One`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('OK');
                  },
                },
              ],
            );
          } else {
            createUserWithEmailAndPassword(
              auth,
              email.toLowerCase().trim(),
              password.trim(),
            )
              .then(data => {
                console.log(data.user.email);
                setDoc(doc(db, 'subs_users', userid), {
                  name: fname + ' ' + lname,
                  fname: fname,
                  lname: lname,
                  role: 'User',
                  email: email.toLowerCase().trim(),
                  address: address,
                  cnic: `42403-959303-${rnum}`,
                  phoneNumber: phone,
                  area_l: label3,
                  area_v: value3,
                  image: [null],
                  active: true,
                  usernum: rnum,
                  joiningDate: showdate,
                  profilestatus: 'active',
                  country: 'Pakistan',
                  city: 'Karachi',
                  password: password.trim(),
                  uid: userid,
                  walletamount: 0,
                  timestamp: serverTimestamp(),
                })
                  .then(() => {
                    setloading(false);
                    Alert.alert(
                      'Register Successfully',
                      `Go To Login And Order The Delicius Food`,
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Login' }],
                            });
                          },
                        },
                      ],
                    );
                  })
                  .catch(error => {
                    setloading(false);
                    // console.log(error);
                    Alert.alert('Error :', error.message);
                  });
              })
              .catch(error => {
                setloading(false);
                // console.log("this : ",error.message);
                Alert.alert('Error :', error.message);
              });
          }
        } catch (error) {
          setloading(false);
          Alert.alert('Error :', error.message);
          console.log(error);
        }
      } else {
        Alert.alert('Alert', `Number Should Be 11 Digits`, [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK');
            },
          },
        ]);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('chala');
      let unSubscribe;

      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'Sub_Areas');
        // const q = query(coll, where('email', '==', email));

        unSubscribe = onSnapshot(coll, snapshot => {
          const data = snapshot.docs.map(doc => ({
            label: doc.data().company, // product name
            value: doc.data().userid, // product id
            fuel: doc.data().fuel_charges,
          }));
          setGetdata(data);
        });
      });

      return () => {
        if (unSubscribe) unSubscribe(); // unsubscribe Firestore listener
      };
    }, []),
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'SIGNUP'}
        left={5}
        onPress={() => navigation.goBack()}
      />

      <View
        style={[
          {
            width: width,
            // height: height * 0.85,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          tw`mt-5 self-center mb-25 bg-white `,
        ]}
      >
        <ScrollView>
          <View
            style={[
              { width: width * 0.98 },
              tw`items-center justify-center h-35`,
            ]}
          >
            <Text style={tw`text-3xl mt-8 font-semibold`}>
              Create New Account
            </Text>

            <Text
              style={[
                { width: width * 0.9 },
                tw`text-base mt-2 text-center font-light`,
              ]}
            >
              Create An Account To Start Looking For The Food You Like
            </Text>
          </View>

          <View>
            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center  items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>First Name</Text>
              <Input
                value={fname}
                onchangetext={setfname}
                source={require('../../Images/usercolor.png')}
                placeholder={'First Name'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Last Name</Text>
              <Input
                value={lname}
                onchangetext={setlname}
                source={require('../../Images/usercolor.png')}
                placeholder={'Last Name'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Phone</Text>
              <Input
                value={phone}
                onchangetext={setphone}
                phonepad={'number-pad'}
                source={require('../../Images/phone.png')}
                placeholder={'Enter Phone Number 03'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Select Area</Text>
              <Dropdown
                style={tw`h-12 w-80 mt-5 self-center rounded-md border border-gray-400 `}
                placeholderStyle={tw`ml-3 text-black  `}
                selectedTextStyle={tw`ml-3 text-black  `}
                containerStyle={tw`h-60 w-70  mt-7  rounded-md`}
                data={Getdata}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Select Your Area'}
                // search
                // searchPlaceholder="Search Category"
                mode="modal"
                value={value3}
                onFocus={() => setIsFocus3(true)}
                onBlur={() => setIsFocus3(false)}
                onChange={item => {
                  setValue3(item.value);
                  setlabel3(item.label);
                  // setfuel(item.fuel);
                  // fetchcities1(item.value)
                  setIsFocus3(false);
                }}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Address</Text>
              <Input
                value={address}
                onchangetext={setaddress}
                source={require('../../Images/city-map.png')}
                placeholder={'Enter Address'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Email Address</Text>
              <Input
                value={email}
                onchangetext={setEmail}
                source={require('../../Images/emailcolor.png')}
                placeholder={'Enter Email'}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw`mt-5 self-center items-start  `,
              ]}
            >
              <Text style={tw`text-gray-400`}>Password</Text>
              <View
                style={[
                  { width: width * 0.9 },
                  tw`flex-row text-black justify-between rounded-lg items-center border border-gray-400    mt-3 `,
                ]}
              >
                <TextInput
                  placeholder={'Enter Password'}
                  onChangeText={setPassword}
                  placeholderTextColor={'black'}
                  value={password}
                  secureTextEntry={entry}
                  style={[
                    tw`h-12 w-70 rounded-xl text-black
                text-start pl-5  `,
                  ]}
                ></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setentry(!entry);
                  }}
                >
                  <Image
                    source={
                      entry
                        ? require('../../Images/lockcolor.png')
                        : require('../../Images/visible.png')
                    }
                    style={tw`h-5 w-5 -left-5  justify-end`}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={tw`justify-end items-center flex-row w-85 h-10 mt-5`}>
            <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
              <Text style={[tw`text-center`, { color: '#FBAE17' }]}>
                {'Forget Password'}
              </Text>
            </TouchableOpacity>
          </View> */}
            {loading ? (
              <ActivityIndicator size={'large'} color={'#00b9e2'} />
            ) : (
              <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
                <Buttonnormal
                  onPress={() => Signinwithemailandpass()}
                  // onPress={()=> navigation.navigate('Tabbar')}

                  c1={'#F16767'}
                  c2={'#F16767'}
                  style={tw`text-white text-xl`}
                  title={'Register'}
                />
              </View>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <View style={tw`mt-5 self-center`}>
                <Text style={tw`text-black mb-5`}>
                  {'Already have an account?'}
                  <Text style={{ color: '#FBAE17' }}> {'Sign In'}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Toast />
    </View>
  );
};

export default Signup;
