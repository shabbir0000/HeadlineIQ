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

const Dispatchorders = ({ navigation }) => {
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
          getorders('dispatch');
        }
      });
      return () => {
        setcat('SORT BY CITY');
      };
    }, []),
  );

  const getorders = async status => {
    AsyncStorage.getItem('email').then(email => {
      const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('vendoremail', '==', email),
        where('orderstatus', '==', status),
        where('timestamp', '>=', fourHoursAgo), // 👈 yahan filter laga
        orderBy('timestamp', 'desc'),
      );

      const unSubscribe = onSnapshot(q, snapshot => {
        const now = new Date();

        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          let timeAgo = '';

          if (d.timestamp) {
            const orderDate = d.timestamp.toDate(); // Firestore timestamp → JS Date
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
              timeAgo = 'just now';
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
  };
  // const getorders = async status => {
  //   AsyncStorage.getItem('email').then(email => {
  //     const coll = collection(db, 'Orders');
  //     const q = query(
  //       coll,
  //       where('vendoremail', '==', email),
  //       // where('ordertype', '==', 'food'),
  //       // where('ordertype', '==', "deals"),
  //       where('orderstatus', '==', status),
  //     );

  //     const unSubscribe = onSnapshot(q, snapshot => {
  //       setGetData2(
  //         snapshot.docs.map(doc => ({
  //           selecteduser: doc.data(),
  //         })),
  //       );
  //     });
  //     return () => {
  //       unSubscribe();
  //     };
  //   });
  // };

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
                navigation.navigate('Viewadminorder', {
                  customeremail: data.selecteduser.customeremail,
                  myorderid: data.selecteduser.id,
                  timeAgo: data.selecteduser.timeAgo,
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

                  <View style={tw`items-center right-2`}>
                    <Text style={tw`mr-2 font-bold`}>
                      {data.selecteduser.timeAgo}
                    </Text>
                    <Text style={tw`font-light`}>{data.selecteduser.date}</Text>
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
                        Customer Name
                      </Text>
                      <Text
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.customername}
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
                        {data.selecteduser.customerphone}
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
                        style={tw`ml-2 font-semibold text-green-400 text-xs`}
                      >
                        {data.selecteduser.orderstatus.toUpperCase()}
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

export default Dispatchorders;
