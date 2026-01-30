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
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
// import {Dropdown} from 'react-native-element-dropdown';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const ExpiredOrders = ({ navigation }) => {
  const [userflag, setuserflag] = useState('');
  const [GetData2, setGetData2] = useState([]);
  // const GetData2 = [
  //   {
  //     selecteduser: {
  //       vendorname: 'Ali Traders',
  //       vendorphone: '03001234567',
  //       ordernum: 'ORD-1001',
  //       ordertype: 'medical',
  //       date: '2025-07-04',
  //       orders: '10x Panadol, 5x Disprin',
  //       vendorarea: 'Gulshan-e-Iqbal',
  //       vendoraddress: 'Plot #22, Block 10, Karachi',
  //       orderstatus: 'pending',
  //       customername: 'Shabbir',
  //       totalbill: '550',
  //     },
  //   },
  //   {
  //     selecteduser: {
  //       vendorname: 'Bismillah Grocery',
  //       vendorphone: '03111234567',
  //       ordernum: 'ORD-1002',
  //       ordertype: 'grocery',
  //       date: '2025-07-03',
  //       orders: '5kg Rice, 2L Oil, 1kg Sugar',
  //       vendorarea: 'Nazimabad',
  //       vendoraddress: 'Shop 5, Main Market',
  //       orderstatus: 'dispatch',
  //       customername: 'Ahmed',
  //       totalbill: '1550',
  //     },
  //   },
  //   {
  //     selecteduser: {
  //       vendorname: 'Shahi Biryani',
  //       vendorphone: '03219876543',
  //       ordernum: 'ORD-1003',
  //       ordertype: 'food',
  //       date: '2025-07-02',
  //       orders: '2x Chicken Biryani, 1x Raita',
  //       vendorarea: 'Defence Phase 2',
  //       vendoraddress: 'Plot # 101, DHA',
  //       orderstatus: 'dispatch',
  //       customername: 'Farhan',
  //       totalbill: '900',
  //     },
  //   },
  // ];

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
        if (role === 'User') {
          console.log('my role user');

          getorders('pending');
        }
      });
      return () => {
        setcat('SORT BY CITY');
      };
    }, []),
  );

  const getorders = async status => {
    try {
      AsyncStorage.getItem('email').then(email => {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          where('customeremail', '==', email),
          orderBy('timestamp', 'desc'), // 👈 'desc' means latest first
          where('timestamp', '<=', fourHoursAgo), // 👈 yahan filter laga
          // where('ordertype', '==', 'food'),
          // where('ordertype', '==', "deals"),
          where('orderstatus', '==', status),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          const now = new Date();

          const data = snapshot.docs.map(doc => {
            const d = doc.data();
            let timeAgo = '';

            if (d?.timestamp) {
              // Firestore timestamp ko JS Date me convert karo
              const orderDate = d?.timestamp?.toDate();
              const diffMs = now - orderDate;
              const diffMins = Math.floor(diffMs / (1000 * 60));
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              // let timeAgo = '';

              if (diffDays > 0) {
                timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
              } else if (diffHours > 0) {
                timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
              } else if (diffMins > 0) {
                timeAgo = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
              } else {
                timeAgo = 'Just Now';
              }

              // return {
              //   selecteduser: {
              //     ...d,
              //     timeAgo,
              //   },
              // };
            }

            return {
              selecteduser: {
                ...d,
                timeAgo, // 👈 new label add ho gaya
              },
            };
          });

          setGetData2(data);
        });

        return () => {
          unSubscribe();
        };
      });
    } catch (error) {
      console.log('order time error', error);
    }
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
                navigation.navigate('Viewuserorder', {
                  vendoremail: data.selecteduser.vendoremail,
                  myorderid: data.selecteduser.id,
                  timeAgo : data.selecteduser.timeAgo
                });
              }}
            >
              <View
                style={[
                  { width: width * 0.92 },
                  tw`  h-60 mb-5 mr-2 ml-2 mt-5 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
                ]}
              >
                <View style={tw`flex-row justify-between`}>
                  <View
                    style={[
                      { width: width * 0.65 },
                      tw` flex-row items-center`,
                    ]}
                  >
                    <View
                      style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                    >
                      <Image
                        style={tw`h-8 w-8`}
                        source={require('../../Images/choices.png')}
                      />
                    </View>

                    <View>
                      <Text style={tw`ml-2 font-semibold text-base`}>
                        Order Num
                      </Text>
                      <Text style={tw`ml-2 font-semibold text-xs`}>
                        {data.selecteduser.ordernum}
                      </Text>
                    </View>
                  </View>

                  <View style={tw` items-center`}>
                    <Text style={tw`mr-2 font-bold`}>
                      {data.selecteduser.timeAgo}
                    </Text>
                    <Text style={tw`font-light right-2`}>
                      {data.selecteduser.date}
                    </Text>
                  </View>
                </View>

                <View style={tw`border border-gray-300 w-75 self-center`} />

                <View style={tw`flex-row justify-between`}>
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-5 font-semibold text-base`}>
                        Restaurent Name
                      </Text>
                      <Text
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.vendorname}
                      </Text>
                    </View>
                  </View>

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
                        {data.selecteduser.vendorphone}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={tw`border border-gray-300 w-75 self-center`} />

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
                  </View>

                  <View
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
                        style={tw`ml-2 font-semibold text-red-400 text-xs`}
                      >
                        {"Expired"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    </View>
  );
};

export default ExpiredOrders;
