import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import tw from 'twrnc';
import { width } from '../Universal/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
// import {Dropdown} from 'react-native-element-dropdown';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const Ridersreport = ({ navigation }) => {
  const [userflag, setuserflag] = useState('');
  const [GetData2, setGetData2] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [value1, setValue1] = useState(null);
  const [label1, setlabel1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [cat, setcat] = useState('SORT BY CITY');
  const [showPicker, setShowPicker] = useState(false); // To show/hide the date picker
  const [datename, setdatename] = useState(''); // To store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date()); // To store the selected date

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('role').then(role => {
        setuserflag(role);
        if (role === 'Admin') {
          getorders('pending');
        }
      });
      return () => {
        setcat('SORT BY CITY');
      };
    }, []),
  );

  const getorders = async status => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'subs_users');
      const q = query(
        coll,
        where('role', '==', 'Rider'),
        // where('ordertype', '==', 'food'),
        // where('ordertype', '==', "deals"),
        // where('orderstatus', '==', status),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData2(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  };

  return (
    <View
      style={[
        tw`flex-1 bg-white items-center`,
        {
          backgroundColor: '#ffffff',
          width: width,
        },
      ]}
    >
      <>
        <ScrollView
          style={tw`flex-1 mb-5 self-center `}
          showsVerticalScrollIndicator={false}
        >
          {GetData2.map((data, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewRiderReport', {
                  email: data.selecteduser.email,
                });
              }}
            >
              <View
                style={[
                  { width: width * 0.92 },
                  tw`  h-20 mb-5 mr-2 ml-2 mt-5 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
                ]}
              >
                <View style={tw` flex-row justify-around items-center`}>
                  <View style={tw`flex-row justify-between`}>
                    <View
                      style={[
                        { width: width * 0.45 },
                        tw` flex-row items-center`,
                      ]}
                    >
                      <View
                        style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                      >
                        <Image
                          style={tw`h-8 w-8`}
                          source={require('../../Images/rider.png')}
                        />
                      </View>

                      <View>
                        <Text numberOfLines={1} style={tw`ml-2  font-semibold text-base`}>
                          {data.selecteduser.name}
                        </Text>
                        <Text style={tw`ml-2 font-semibold text-xs`}>
                          {data.selecteduser.usernum}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      { backgroundColor: '#F16767' },
                      tw`w-30 h-10 items-center justify-center rounded-3xl `,
                    ]}
                  >
                    <Text style={tw`text-center text-sm text-white`}>
                      VIEW REPORT
                    </Text>
                  </View>
                </View>
                <View style={tw`border border-gray-300 w-75 self-center`} />

                {/* <View style={tw`flex-row justify-between`}>
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-5 font-semibold text-base`}>
                        Customer Name
                      </Text>
                      <Text
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.customername}
                      </Text>
                    </View>
                  </View> */}
                {/* 
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row border-l items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-2 font-semibold text-base`}>
                        Phone Number
                      </Text>
                      <Text style={tw`ml-2 font-semibold text-xs`}>
                        {data.selecteduser.customerphone}
                      </Text>
                    </View>
                  </View>
                </View> */}

                {/* <View style={tw`border border-gray-300 w-75 self-center`} />

                <View style={tw`flex-row justify-between`}>
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-5 font-semibold text-base`}>
                        Payment Method
                      </Text>
                      <Text
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.paymentmode}
                      </Text>
                    </View>
                  </View> */}

                {/* <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row border-l items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-2 font-semibold text-base`}>
                        Order Status
                      </Text>
                      <Text
                        style={tw`ml-2 font-semibold text-green-400 text-xs`}
                      >
                        {data.selecteduser.orderstatus.toUpperCase()}
                      </Text>
                    </View>
                  </View> */}
                {/* </View> */}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    </View>
  );
};

export default Ridersreport;
