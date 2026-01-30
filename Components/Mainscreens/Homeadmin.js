import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';

const Homeadmin = ({ navigation }) => {
  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [GetData4, setGetData4] = useState([]);
  const [GetData6, setGetData6] = useState([]);
  const [GetData7, setGetData7] = useState([]);
  const [GetData8, setGetData8] = useState([]);
  const [GetData9, setGetData9] = useState([]);
  const [GetData10, setGetData10] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [inactiveProducts, setInactiveProducts] = useState([]);

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const [GetData5, setGetData5] = useState([]);
  const [sales, setSales] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });

  const todaysale = async () => {
    console.log(new Date().getDate());

    const todaySaleQuery = query(
      collection(db, 'Orders'),
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

  const monthly = async () => {
    const monthlySaleQuery = query(
      collection(db, 'Orders'),
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

  const overallSale = async () => {
    try {
      const overallQuery = query(
        collection(db, 'Orders'),
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

  const yearly = async () => {
    const yearlySaleQuery = query(
      collection(db, 'Orders'),
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
      monthly();
      overallSale();
      yearly();
      todaysale();
      return () => {};
    }, []), // Empty dependency array ensures this runs only on focus and cleanup on blur
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedDate = `${month}:${day}:${year}`; // "10:20:2025"

        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          // where('email', '==', email),
          where('date', '==', formattedDate),
        );

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
      });

      return () => {};
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"

        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          where('orderstatus', '==', 'pending'),
          where('date', '==', formattedDate),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData4(
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
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"

        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          where('orderstatus', '==', 'reject'),
          where('date', '==', formattedDate),
        );

        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData6(
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
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"

        const coll = collection(db, 'Orders');
        const q = query(
          coll,
          where('orderstatus', '==', 'completed'),
          where('date', '==', formattedDate),
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
      });

      return () => {};
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      let unsubscribe = null;

      AsyncStorage.getItem('email').then(email => {
        const coll = collection(db, 'Companypromotion');
        unsubscribe = onSnapshot(coll, snapshot => {
          const images = [];

          snapshot.forEach(async docs => {
            const data = docs.get('img');
            console.log('images for promotion', data[0]);

            // if (data) {
            // Agar img array hai to img[0] lo, warna direct img
            // if (Array.isArray(data.img)) {
            images.push(data[0]);
            // } else {
            //   images.push(data.img);
            // }
            // }
          });

          // Sirf Firebase wali images set karo
          console.log('all images', images);

          setGetData5(images);
        });
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, []),
  );

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

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'Restaurentstatus');
        const q = query(coll, where('uid', '==', id));
        const unSubscribe = onSnapshot(coll, snapshot => {
          setGetData10(
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

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'subs_users');
        const q = query(coll, where('role', '==', 'User'));
        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData8(
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

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'subs_users');
        const q = query(coll, where('role', '==', 'Rider'));
        const unSubscribe = onSnapshot(q, snapshot => {
          setGetData9(
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

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userid').then(id => {
        const coll = collection(db, 'Products');

        const unSubscribe = onSnapshot(coll, snapshot => {
          // Saara data le kar separate kar do
          const active = [];
          const inactive = [];

          snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.active === true) {
              active.push({ id: doc.id, ...data });
            } else if (data.active === false) {
              inactive.push({ id: doc.id, ...data });
            }
          });

          // Set states
          setActiveProducts(active);
          setInactiveProducts(inactive);
        });

        return () => {
          unSubscribe();
        };
      });

      return () => {};
    }, []),
  );

  const Updatestatus = async status => {
    try {
      // setloading(true);

      const userRef = doc(
        db,
        'Restaurentstatus',
        GetData10[0]?.selecteduser?.id,
      ); // userid must be known

      await updateDoc(userRef, {
        Status: !status,
      });

      // setloading(false);
      Alert.alert('Success', 'Status updated successfully', [{ text: 'OK' }]);
    } catch (error) {
      setloading(false);
      Alert.alert('Error', error.message);
      console.log('Update Error:', error);
    }
  };

  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <View
        style={[
          { width: width * 0.95 },
          tw` h-12 mt-6 self-center flex-row justify-between`,
        ]}
      >
        <View style={[{ width: width * 0.5 }, tw` flex-row items-center`]}>
          <View
            style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
          >
            <Image
              style={tw`h-12 w-12 rounded-full`}
              source={
                GetData3[0]?.selecteduser?.image !== null
                  ? { uri: GetData3[0]?.selecteduser?.image[0] }
                  : require('../../Images/userc.png')
              }
            />
          </View>

          <View>
            <Text style={tw`ml-2 font-semibold text-base`}>
              {GetData3[0]?.selecteduser.name}
            </Text>
            <Text style={tw`ml-2 font-semibold text-xs`}>
              {GetData3[0]?.selecteduser.role}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Alert', 'Are You Sure You Want To Do This', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  Updatestatus(GetData10[0]?.selecteduser?.Status);
                },
              },
            ]);
          }}
        >
          <View
            style={[
              tw`w-30 h-12 mr-5 items-center shadow-lg bg-white justify-center rounded-md`,
              { backgroundColor: '#F16767' },
            ]}
          >
            <Text style={tw`text-base text-white`}>
              {GetData10[0]?.selecteduser?.Status ? 'Go Offline' : 'Go Online'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

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
        <ScrollView>
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
                tw`  h-100 mb-5 mr-2 ml-2 mt-10 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Customerdetail');
                }}
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
                        source={require('../../Images/userc.png')}
                      />
                    </View>

                    <Text style={tw` font-semibold text-base`}>
                      Your Total Rigester Users
                    </Text>
                    <Text style={tw`ml-5 text-green-500 font-semibold text-lg`}>
                      {GetData8.length}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={tw`border border-gray-300 w-75 self-center`} />

              <View style={tw`flex-row justify-between`}>
                <View
                  style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
                >
                  <View
                    style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                  >
                    <Image
                      style={tw`h-8 w-8`}
                      source={require('../../Images/dispatcha.png')}
                    />
                  </View>

                  <Text style={tw` font-semibold text-base`}>
                    Your Total Rigester Rider
                  </Text>
                  <Text style={tw`ml-5 text-green-500 font-semibold text-lg`}>
                    {GetData9.length}
                  </Text>
                </View>
              </View>

              <View style={tw`border border-gray-300 w-75 self-center`} />

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
                    Your Today Order Sale
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
                    <Text style={tw`ml-2 font-semibold text-base`}>
                      OverAll
                    </Text>
                    <Text style={tw`ml-2 text-green-500 font-semibold text-xs`}>
                      {sales.year}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={tw`border border-gray-300 w-75 self-center`} />

              <View
                style={[
                  { width: width * 0.9 },
                  tw`flex-row items-center self-center justify-between`,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ShowProductbystatus', {
                      mystatus: true,
                    });
                  }}
                >
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row  items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-3 font-semibold text-base`}>
                        Active Products
                      </Text>
                      <Text
                        style={tw`ml-3 text-green-500 font-semibold text-base`}
                      >
                        {activeProducts?.length}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ShowProductbystatus', {
                      mystatus: false,
                    });
                  }}
                >
                  <View
                    style={[
                      { width: width * 0.45 },
                      tw` flex-row border-l items-center`,
                    ]}
                  >
                    <View>
                      <Text style={tw`ml-2 font-semibold text-base`}>
                        De-Active Product
                      </Text>
                      <Text
                        style={tw`ml-2 text-red-500 font-semibold text-base`}
                      >
                        {inactiveProducts?.length}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={[
              { width: width * 0.92 },
              tw` flex-row justify-between self-center h-40 `,
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewAdminorders', {
                  mystatus: 'all',
                  flag: false,
                });
              }}
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
                  <Text
                    style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}
                  >
                    {GetData1.length}
                  </Text>
                  <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                    ORDERS
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewAdminorders', {
                  mystatus: 'pending',
                  flag: true,
                });
              }}
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
                  <Text
                    style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}
                  >
                    {GetData4.length}
                  </Text>
                  <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                    PENDING
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={[
              { width: width * 0.92 },
              tw` flex-row mb-5 justify-between self-center mt-5 h-40 `,
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewAdminorders', {
                  mystatus: 'reject',
                  flag: true,
                });
              }}
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
                    source={require('../../Images/package.png')}
                  />
                </View>

                <View
                  style={[
                    { width: width * 0.4 },
                    tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
                  ]}
                >
                  <Text
                    style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}
                  >
                    {GetData6.length}
                  </Text>
                  <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                    REJECT
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewAdminorders', {
                  mystatus: 'completed',
                  flag: true,
                });
              }}
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
                    source={require('../../Images/package.png')}
                  />
                </View>

                <View
                  style={[
                    { width: width * 0.4 },
                    tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
                  ]}
                >
                  <Text
                    style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}
                  >
                    {GetData7.length}
                  </Text>
                  <Text style={tw`font-extrabold ml-2 text-black text-lg`}>
                    COMPLETE
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* </ScrollView> */}
    </View>
  );
};

export default Homeadmin;
