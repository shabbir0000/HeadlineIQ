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
import Screensheader from '../Universal/Screensheader';
import { Dropdown } from 'react-native-element-dropdown';

const Customerdetail = ({ navigation }) => {
  //   const { mystatus, flag } = route.params;
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
  const [Getdata, setGetdata] = useState([]);
  const [value3, setValue3] = useState();
  const [label3, setlabel3] = useState();
  const [isFocus3, setIsFocus3] = useState(false);

  useFocusEffect(
    useCallback(() => {
      //   AsyncStorage.getItem('role').then(role => {
      // setuserflag(role);
      // if (flag) {
      //   //   if (role === 'Admin') {
      //   console.log('my date');
      getorders();

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
      //   }
      // } else {
      //   console.log('my date 1');
      //   getorders1();
      // }
      //   });
      return () => {
        setcat('SORT BY CITY');
      };
    }, []),
  );

  const getorders = async status => {
    AsyncStorage.getItem('email').then(email => {
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate();
      const year = today.getFullYear();
      const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"
      console.log('my date');

      const coll = collection(db, 'subs_users');
      const q = query(
        coll,
        where('role', '==', 'User'),
        // where('riderorderstatus', '==', status),
        // orderBy('timestamp', 'desc'),
        // where('date', '==', formattedDate),
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

    // useFocusEffect(
    //   useCallback(() => {
    //     console.log('chala');
    //     let unSubscribe;

    //     // AsyncStorage.getItem('email').then(email => {

    //     // });

    //     return () => {
    //       if (unSubscribe) unSubscribe(); // unsubscribe Firestore listener
    //     };
    //   }, []),
    // );

    // AsyncStorage.getItem('email').then(email => {
    //   const coll = collection(db, 'Orders');
    //   const q = query(coll, where('orderstatus', '==', status));
    //   const unSubscribe = onSnapshot(q, snapshot => {
    //     setGetData2(
    //       snapshot.docs.map(doc => ({
    //         selecteduser: doc.data(),
    //       })),
    //     );
    //   });
    //   return () => {
    //     unSubscribe();
    //   };
    // });
  };

  const getorders1 = async area => {
    console.log('enter log');

    AsyncStorage.getItem('email').then(email => {
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate();
      const year = today.getFullYear();
      const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"

      const coll = collection(db, 'subs_users');
      const q = query(
        coll,
        where('role', '==', 'User'),
        // where('date', '==', formattedDate),
        where('area_l', '==', area),
      );
      console.log('enter log 1');
      const unSubscribe = onSnapshot(q, snapshot => {
        const now = new Date();
        console.log('enter log 2');
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          console.log('enter log 3');
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

          console.log('enter log 5');
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

    // AsyncStorage.getItem('email').then(email => {
    //   const coll = collection(db, 'Orders');
    //   const q = query(coll, where('email', '==', email));
    //   const unSubscribe = onSnapshot(coll, snapshot => {
    //     setGetData2(
    //       snapshot.docs.map(doc => ({
    //         selecteduser: doc.data(),
    //       })),
    //     );
    //   });
    //   return () => {
    //     unSubscribe();
    //   };
    // });
  };

  return (
    <View
      style={[
        tw`flex-1 bg-white`,
        {
          backgroundColor: '#ffffff',
          width: width,
        },
      ]}
    >
      <Screensheader
        name={'Customer Detail'}
        left={5}
        onPress={() => navigation.goBack()}
      />

      <View
        style={[
          { width: width * 0.9 },
          tw`h-14  self-center flex-row items-center justify-around`,
        ]}
      >
        <Dropdown
          style={tw`h-12 w-65  self-center rounded-lg border border-gray-400 `}
          placeholderStyle={tw`ml-3 text-black  `}
          selectedTextStyle={tw`ml-3 text-black  `}
          containerStyle={tw`h-70 w-80  mt-7  rounded-md`}
          data={Getdata}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Filter By Area'}
          search
          searchPlaceholder="Search Area"
          mode="modal"
          value={value3}
          onFocus={() => setIsFocus3(true)}
          onBlur={() => setIsFocus3(false)}
          onChange={item => {
            setValue3(item.value);
            setlabel3(item.label);
            getorders1(item.label);
            // setfuel(item.fuel);
            // fetchcities1(item.value)
            setIsFocus3(false);
          }}
        />

        <TouchableOpacity
          onPress={() => {
            getorders();
            setValue3();
            setlabel3();
          }}
        >
          <View
            style={[
              // { backgroundColor: '#F16767' },
              tw`w-15 h-12 rounded-lg justify-center items-center`,
            ]}
          >
            <Image
              style={tw`h-8 w-8 justify-center items-center`}
              source={require('../../Images/clear-filter.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <>
        <ScrollView
          style={tw`flex-1 mb-5 self-center `}
          showsVerticalScrollIndicator={false}
        >
          {GetData2.map((data, index) => (
            <TouchableOpacity
              disabled
              onPress={() => {
                navigation.navigate('MyRiderorders', {
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
                {/* <View style={tw`border border-gray-300 w-75 self-center`} /> */}

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
                        {data.selecteduser.name}
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
                      <Text
                        style={tw`ml-2 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.phoneNumber}
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
                        Customer Area
                      </Text>
                      <Text
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.area_l}
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
                        Join Date
                      </Text>
                      <Text
                        style={tw`ml-2 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.joiningDate}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={tw`border border-gray-300 w-75 self-center`} />

                <View>
                  <View style={[{ width: width * 0.9 }]}>
                    <View>
                      <Text style={tw`ml-5 font-semibold text-base`}>
                        Full Address
                      </Text>
                      <Text
                        numberOfLines={3}
                        style={tw`ml-5 font-semibold text-green-500 text-xs`}
                      >
                        {data.selecteduser.address}
                        {/* nave; colony hub rider karachi paksitan is the capital city of pakistan and no one dare to tuch like that best is the best */}
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

export default Customerdetail;
