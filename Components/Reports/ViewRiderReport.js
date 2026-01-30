import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import Screensheader from '../Universal/Screensheader';

const ViewRiderReport = ({ navigation, route }) => {
  const { email } = route.params;
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [GetData4, setGetData4] = useState([]);
  const [GetData6, setGetData6] = useState([]);
  const [GetData7, setGetData7] = useState([]);

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const [GetData5, setGetData5] = useState([]);
  const [sales, setSales] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });

  const todaysale = async email => {
    console.log(new Date().getDate());

    const todaySaleQuery = query(
      collection(db, 'Orders'),
      where('rideremail', '==', email),
      where('orderstatus', '==', 'completed'),
      where('singledate', '==', new Date().getDate()),
      where('month', '==', new Date().getMonth() + 1),
      where('year', '==', new Date().getFullYear()),
    );

    const todaySaleSnap = await getDocs(todaySaleQuery);
    const todaySale = todaySaleSnap.docs.reduce(
      (sum, doc) => sum + parseInt(doc.data().totalbill),
      0,
    );
    console.log('Today Sale:', todaySale);
    setSales(prev => ({
      ...prev,
      today: todaySale,
    }));
  };

  const monthly = async email => {
    const monthlySaleQuery = query(
      collection(db, 'Orders'),
      where('rideremail', '==', email),
      where('orderstatus', '==', 'completed'),
      where('month', '==', new Date().getMonth() + 1),
      where('year', '==', new Date().getFullYear()),
    );

    const monthlySaleSnap = await getDocs(monthlySaleQuery);
    const monthlySale = monthlySaleSnap.docs.reduce(
      (sum, doc) => sum + parseInt(doc.data().totalbill),
      0,
    );
    console.log('Monthly Sale:', monthlySale);

    setSales(prev => ({
      ...prev,
      month: monthlySale,
    }));
  };

  const overallSale = async email => {
    try {
      const overallQuery = query(
        collection(db, 'Orders'),
        where('rideremail', '==', email),
        where('orderstatus', '==', 'completed'),
      );

      const overallSnap = await getDocs(overallQuery);

      const overallTotal = overallSnap.docs.reduce((sum, doc) => {
        const bill = parseInt(doc.data().totalbill);
        return sum + (isNaN(bill) ? 0 : bill);
      }, 0);

      console.log('Overall Sale:', overallTotal);

      setSales(prev => ({
        ...prev,
        week: overallTotal, // yahan "week" key use kar rahe ho to match UI, lekin chahein to "overall" bhi rakh sakte ho
      }));
    } catch (error) {
      console.error('Error fetching overall sale:', error);
    }
  };

  const yearly = async email => {
    const yearlySaleQuery = query(
      collection(db, 'Orders'),
      where('rideremail', '==', email),
      where('orderstatus', '==', 'completed'),
      where('year', '==', new Date().getFullYear()),
    );

    const yearlySaleSnap = await getDocs(yearlySaleQuery);
    const yearlySale = yearlySaleSnap.docs.reduce(
      (sum, doc) => sum + parseInt(doc.data().totalbill),
      0,
    );
    console.log('Yearly Sale:', yearlySale);

    setSales(prev => ({
      ...prev,
      year: yearlySale,
    }));
  };

  useFocusEffect(
    React.useCallback(() => {
      //   AsyncStorage.getItem('email').then(email => {
      monthly(email);
      overallSale(email);
      yearly(email);
      todaysale(email);
      //   });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      //   AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(coll, where('rideremail', '==', email));
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData1(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
      //   });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      //   AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('rideremail', '==', email),
        where('riderorderstatus', '==', 'dispatch'),
      );
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData4(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
        // });
        return () => {
          unSubscribe();
        };
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      //   AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,

        where('orderstatus', '==', 'reject'),
      );
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData6(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
        // });
        return () => {
          unSubscribe();
        };
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      //   AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'Orders');
      const q = query(
        coll,
        where('rideremail', '==', email),
        where('riderorderstatus', '==', 'completed'),
        where('orderstatus', '==', 'completed'),
      );
      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData7(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
      //   });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       let unsubscribe = null;

  //       AsyncStorage.getItem('email').then(email => {
  //         const coll = collection(db, 'Companypromotion');
  //         unsubscribe = onSnapshot(coll, snapshot => {
  //           const images = [];

  //           snapshot.forEach(async docs => {
  //             const data = docs.get('img');
  //             console.log('images for promotion', data[0]);

  //             // if (data) {
  //             // Agar img array hai to img[0] lo, warna direct img
  //             // if (Array.isArray(data.img)) {
  //             images.push(data[0]);
  //             // } else {
  //             //   images.push(data.img);
  //             // }
  //             // }
  //           });

  //           // Sirf Firebase wali images set karo
  //           console.log('all images', images);

  //           setGetData5(images);
  //         });
  //       });

  //       return () => {
  //         if (unsubscribe) unsubscribe();
  //       };
  //     }, []),
  //   );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'subs_users');
        const q = query(coll, where('uid', '==', id));
        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData3(
            snapshot.docs.map(doc => ({
              selecteduser: doc.data(),
            })),
          );
        });
        return () => {
          unSubscribe();
        };
      });
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'REPORT'}
        left={5}
        onPress={() => navigation.goBack()}
      />

      <View
        style={[
          {
            width: width,
            height: height * 0.9,
            //   alignSelf : '',
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          tw`mt-5 self-end flex-1 flex-col  bg-white `,
        ]}
      >
        <TouchableOpacity
          disabled
          onPress={() => {
            navigation.navigate('Viewuserorder', {
              vendoremail: data.selecteduser.vendoremail,
              myorderid: data.selecteduser.id,
            });
          }}
        >
          <View
            style={[
              { width: width * 0.92 },
              tw`  h-40 mb-5 mr-2 ml-2 mt-10 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
            ]}
          >
            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-8 w-8`}
                    source={require('../../Images/choices.png')}
                  />
                </View>

                <Text style={tw` font-semibold text-base`}>
                  Today Order Sale
                </Text>
                <Text style={tw`ml-5 text-green-500 font-semibold text-lg`}>
                  {sales.today}
                </Text>
              </View>
            </View>

            <View style={tw`border border-gray-300 w-75 self-center`} />

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.3 }, tw` flex-row items-center`]}
              >
                <View>
                  <Text style={tw`ml-5 font-semibold text-base`}>
                    This Month
                  </Text>
                  <Text style={tw`ml-5 font-semibold text-green-500 text-xs`}>
                    {sales.month}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  { width: width * 0.3 },
                  tw` flex-row border-l items-center`,
                ]}
              >
                <View>
                  <Text style={tw`ml-2 font-semibold text-base`}>
                    This Year
                  </Text>
                  <Text style={tw`ml-2 text-green-500 font-semibold text-xs`}>
                    {sales.year}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  { width: width * 0.3 },
                  tw` flex-row border-l items-center`,
                ]}
              >
                <View>
                  <Text style={tw`ml-2 font-semibold text-base`}>OverAll</Text>
                  <Text style={tw`ml-2 text-green-500 font-semibold text-xs`}>
                    {sales.year}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={[
            { width: width * 0.92 },
            tw` flex-row justify-between self-center h-40 `,
          ]}
        >
          <View
            style={[
              { width: width * 0.42 },
              tw`border border-gray-200 shadow-lg self-center justify-evenly h-40 rounded-xl bg-white`,
            ]}
          >
            <View
              style={[
                { width: width * 0.42 },
                tw` self-center justify-start items-end  h-18  bg-white`,
              ]}
            >
              <Image
                style={tw`h-12 w-12 mr-3 mt-2`}
                source={require('../../Images/box.png')}
              />
            </View>

            <View
              style={[
                { width: width * 0.4 },
                tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
              ]}
            >
              <Text style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}>
                {GetData1.length}
              </Text>
              <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                ORDERS
              </Text>
            </View>
          </View>

          <View
            style={[
              { width: width * 0.42 },
              tw`border border-gray-200 shadow-lg self-center justify-evenly h-40 rounded-xl bg-white`,
            ]}
          >
            <View
              style={[
                { width: width * 0.42 },
                tw` self-center justify-start items-end  h-18  bg-white`,
              ]}
            >
              <Image
                style={tw`h-12 w-12 mr-3 mt-2`}
                source={require('../../Images/box.png')}
              />
            </View>

            <View
              style={[
                { width: width * 0.4 },
                tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
              ]}
            >
              <Text style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}>
                {GetData4.length}
              </Text>
              <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                ACTIVE
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` flex-row justify-between self-center mt-5 h-40 `,
          ]}
        >
          {/* <View
            style={[
              { width: width * 0.42 },
              tw`border border-gray-200 shadow-lg self-center justify-evenly h-40 rounded-xl bg-white`,
            ]}
          >
            <View
              style={[
                { width: width * 0.42 },
                tw` self-center justify-start items-end  h-18  bg-white`,
              ]}
            >
              <Image
                style={tw`h-12 w-12 mr-3 mt-2`}
                source={require('../../Images/package.png')}
              />
            </View>

            <View
              style={[
                { width: width * 0.4 },
                tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
              ]}
            >
              <Text style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}>
                {GetData6.length}
              </Text>
              <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                REJECT
              </Text>
            </View>
          </View> */}

          <View
            style={[
              { width: width * 0.9 },
              tw`border border-gray-200 shadow-lg self-center justify-evenly h-40 rounded-xl bg-white`,
            ]}
          >
            <View
              style={[
                { width: width * 0.9 },
                tw` self-center justify-start items-end  h-18  bg-white`,
              ]}
            >
              <Image
                style={tw`h-16 w-16 mr-3 mt-2`}
                source={require('../../Images/package.png')}
              />
            </View>

            <View
              style={[
                { width: width * 0.9 },
                tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
              ]}
            >
              <Text style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}>
                {GetData7.length}
              </Text>
              <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                COMPLETE
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* </ScrollView> */}
    </View>
  );
};

export default ViewRiderReport;
