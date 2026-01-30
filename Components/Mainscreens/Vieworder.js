import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import { AppContext } from '../../AppContext';
import tw from 'twrnc';
import { Buttonnormal } from '../Universal/Buttons';
import { showToast, width } from '../../Components/Universal/Input';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  orderBy,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import { ActivityIndicator } from 'react-native';
// import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import Screensheader from '../Universal/Screensheader';

const Vieworder = ({ navigation, route }) => {
  const [imageUri, setImageUri] = useState(null);
  const [simguri, setsimguri] = useState(null);
  const [imgname, setimgname] = useState('');
  const [orderid, setorderid] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [gimg, setgimg] = useState('');
  const [rnum, setrnum] = useState(0);
  const [shareflag, setshareflag] = useState(false);
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [user, setuser] = useState(null);
  const {
    state,
    removeFromCart,
    cat,
    clearCart,
    bankacc,
    banktitle,
    bankname,
    dadddress,
    dphone,
    dfuel,
    orderarea,
    setorderarea,
  } = useContext(AppContext);
  const useridd = uuid.v4();
  const date = new Date();
  const monthdate =
    date.getMonth() + 1 + ':' + date.getDate() + ':' + date.getFullYear();
  const monthdate1 =
    date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
  const [GetData, setGetData] = useState([]);
  const [GetData2, setGetData2] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);
  const [dcharges, setdchagres] = useState(0);

  const [guest, setguest] = useState('');
  //   const {userid} = route.params;
  const [GetData1, setGetdata1] = useState([]);
  const [GetData3, setGetdata3] = useState([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('email').then(email => {
        AsyncStorage.getItem('Guest').then(guest => {
          setguest(guest);
          setuser(email);
        });
      });
      return () => {};
    }, []),
  );

  const getNextOrderNumber = async () => {
    try {
      const ordersRef = collection(db, 'Orders');
      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate();
      const year = today.getFullYear();
      const formattedDate = `${month}:${day}:${year}`; // e.g. "10:20:2025"
      // 🔹 Sabse latest order lana (ordernum ke basis par descending)
      const q = query(
        ordersRef,
        where('date', '==', formattedDate),
        orderBy('timestamp', 'desc'),
        limit(1),
      );
      const querySnapshot = await getDocs(q);

      let nextOrderNum = 10001; // default (agar koi order nahi hai)

      if (!querySnapshot.empty) {
        const latestOrder = querySnapshot.docs[0].data();
        nextOrderNum = latestOrder.ordernum + 1;
      }

      console.log('Next Order Number:', nextOrderNum);
      return nextOrderNum;
    } catch (error) {
      console.error('Error fetching latest order:', error);
      return 1; // fallback
    }
  };

  useEffect(() => {
    const handleNewOrder = async () => {
      const nextNum = await getNextOrderNumber();
      setrnum(nextNum);
      // await addDoc(collection(db, 'Orders'), {
      //   ordernum: nextNum,
      //   customer: 'Shabbir',
      //   date: new Date(),
      // });

      console.log('✅ New order created with ordernum:', nextNum);
    };
    handleNewOrder();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'subs_users');
      const q = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetData(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('userid').then(id => {
      const coll = collection(db, 'subs_users');
      const q = query(coll, where('uid', '==', cat));

      const unSubscribe = onSnapshot(q, snapshot => {
        setGetdata1(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
      return () => {
        unSubscribe();
      };
    });
  }, []);

  useEffect(() => {
    const func = async () => {
      // Step 1: Calculate base total amount from cart
      const totalAmount = state.cart.reduce((total, item) => {
        return (
          parseInt(total) + parseInt(item.amount) * parseInt(item.quantity)
        );
      }, 0);

      console.log('Base Total:', totalAmount);

      // Step 2: Get user id
      const userId = await AsyncStorage.getItem('userid');
      const coll = collection(db, 'Charges');

      // Step 3: Listen to charges
      const unSubscribe = onSnapshot(coll, snapshot => {
        const charges = snapshot.docs.map(doc => doc.data());
        console.log('my charges', charges);

        // Step 4: Calculate total with charges
        let finalAmount = totalAmount;
        if (charges.length) {
          charges.forEach(charge => {
            if (charge.type_l === 'Fixed') {
              finalAmount += parseInt(charge.fuel_charges);
            } else if (charge.type_l === 'Percent') {
              const percentValue =
                (parseInt(charge.fuel_charges) / 100) * totalAmount;
              finalAmount += percentValue;
            }
          });

          console.log('Final Total (with Charges):', finalAmount);

          setGetData2(charges); // optional: store charge details
          setFinalAmount(finalAmount); // total amount after adding charges
        } else {
          setFinalAmount(totalAmount);
        }
      });

      return () => unSubscribe();
    };

    func();
  }, []);

  useEffect(() => {
    getspecific();
  }, []);

  const getspecific = async () => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'others');
      // const q1 = query(coll, where('email', '==', email));
      onSnapshot(coll, snapshot => {
        setGetdata3(
          snapshot.docs.map(doc => ({
            selecteduser: doc.data(),
          })),
        );
      });
    });
  };
  //   useEffect(() => {
  //     console.log('data for p', GetData1);

  //     AsyncStorage.getItem('email').then(email => {
  //       AsyncStorage.getItem('role').then(role => {
  //         console.log('userid', userid);

  //         const coll = collection(db, 'Product');
  //         const q = query(coll, where('userid', '==', userid));

  //         const unSubscribe = onSnapshot(q, snapshot => {
  //           setGetdata1(
  //             snapshot.docs.map(doc => ({
  //               selecteduser: doc.data(),
  //             })),
  //           );
  //           setloading(false);
  //         });
  //       });

  //       return () => {
  //         unSubscribe();
  //       };
  //     });
  //   }, []);

  const totalAmount = state.cart.reduce((total, item) => {
    return parseInt(total) + parseInt(item.amount) * parseInt(item.quantity);
  }, 0);

  const uploadfile = async () => {
    if (!imgname || !simguri) {
      showToast('error', 'Error', 'Please Select The Image First', true, 3000);
    } else {
      try {
        setloading(true);

        const reference = storage().ref(`allfiles/${imgname}`);
        await reference.putFile(simguri);
        const url = await storage().ref(`allfiles/${imgname}`).getDownloadURL();
        console.log('your file is locating :', url);
        Uploadata(url);
      } catch (error) {
        setloading(false);
        console.log('Error :', error);
      }
    }
  };

  const Uploadata = async () => {
    AsyncStorage.getItem('Guest').then(guest => {
      if (guest === 'No') {
        if (toggleCheckBox1) {
          if (!bankacc || !bankname || !banktitle) {
            showToast(
              'error',
              'Error',
              'Please Select The Account First',
              true,
              5000,
            );
          } else {
            if (!orderid) {
              showToast(
                'error',
                'Error',
                'Please Fill The Transection Id',
                true,
                5000,
              );
            } else {
              setloading1(true);
              // showToast('info', 'Info', 'Congo for online', true, 5000);
              setDoc(doc(db, 'Orders', useridd), {
                customername: GetData[0].selecteduser.fullname,
                customerphone: GetData[0].selecteduser.phone,
                customeraddress: GetData[0].selecteduser.address,
                customerarea: GetData[0].selecteduser.area,
                customerprovince: GetData[0].selecteduser.provincel,
                customeremail: GetData[0].selecteduser.email,
                vendorname: GetData1[0].selecteduser.fullname,
                vendorphone: GetData1[0].selecteduser.phone,
                vendoraddress: GetData1[0].selecteduser.address,
                vendorarea: GetData1[0].selecteduser.area,
                vendorprovince: GetData1[0].selecteduser.provincel,
                vendoremail: GetData1[0].selecteduser.email,
                vendorcity: GetData1[0].selecteduser.city,
                vendordc: GetData1[0].selecteduser.dc,
                orderstatus: 'pending',
                ordertype: 'food',
                ridername: '',
                riderid: '',
                rideremail: '',
                ridercity: '',
                riderorderstatus: 'pending',
                timestamp: serverTimestamp(),
                ridercall: 'offline',
                paymentmode: 'online',
                transectionid: orderid,
                accname: banktitle,
                bankname: bankname,
                banktitle: banktitle,
                ordernum: rnum,
                id: useridd,
                email: user,
                orders: state.cart,
                date: monthdate,
                month: date.getMonth() + 1,
                singledate: date.getDate(),
                year: date.getFullYear(),
                totalbill:
                  parseInt(totalAmount) +
                  parseInt(GetData1[0]?.selecteduser?.dc),
                riderlimit: 'true',
              })
                .then(() => {
                  // console.log('done');
                  setloading1(false);
                  clearCart();
                  Alert.alert('Congratulation', 'Order Has Been Placed', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                  // getinfo();
                })
                .catch(error => {
                  setloading1(false);
                  Alert.alert('this :', error.message);
                });
            }
          }
        } else {
          if (toggleCheckBox) {
            // showToast('info', 'Info', 'Congo for cod', true, 5000);
            if (!dphone || !dadddress) {
              showToast('error', 'Error', 'Select Address', true, 5000);
              return;
            }
            setloading1(true);
            setDoc(doc(db, 'Orders', useridd), {
              customername: GetData[0].selecteduser.name,
              customerphone: dphone,
              customeraddress: dadddress,
              // customerarea: GetData[0].selecteduser.area,
              // customerprovince: GetData[0].selecteduser.provincel,
              customeremail: GetData[0].selecteduser.email,
              vendorname: GetData1[0].selecteduser.name,
              vendorphone: GetData1[0].selecteduser.phoneNumber,
              vendoraddress: GetData1[0].selecteduser.address,
              // vendorarea: GetData1[0].selecteduser.area,
              // vendorprovince: GetData1[0].selecteduser.provincel,
              vendoremail: GetData1[0].selecteduser.email,
              vendorcity: GetData1[0].selecteduser.city,
              vendordc: dfuel,
              discount: parseInt(
                (parseInt(totalAmount) / 100) *
                  parseFloat(GetData3[0]?.selecteduser?.price),
              ),
              orderarea: orderarea,
              orderstatus: 'pending',
              timestamp: serverTimestamp(),
              ordertype: 'food',
              ridername: '',
              riderid: '',
              ridernum: '',
              rideremail: '',
              ridercity: '',
              riderorderstatus: 'pending',
              ridercall: 'offline',
              paymentmode: 'COD',
              transectionid: '',
              accname: '',
              bankname: '',
              banktitle: '',
              ordernum: rnum,
              id: useridd,
              email: user,
              orders: state.cart,
              date: monthdate,
              month: date.getMonth() + 1,
              singledate: date.getDate(),
              year: date.getFullYear(),
              subtotal: parseInt(totalAmount),
              tax : GetData2,
              totalbill:
                GetData3[0]?.selecteduser?.price > 0
                  ? parseInt(finalAmount + dfuel) -
                    parseInt(
                      (parseInt(totalAmount) / 100) *
                        parseFloat(GetData3[0]?.selecteduser?.price),
                    )
                  : parseInt(finalAmount + dfuel),
              riderlimit: 'true',
            })
              .then(() => {
                setloading1(false);

                Alert.alert('Congratulation', 'Order Has Been Placed', [
                  {
                    text: 'OK',
                    onPress: () => {
                      clearCart();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Tabbar' }],
                      });
                    },
                  },
                ]);
                // getinfo();
              })
              .catch(error => {
                setloading1(false);
                Alert.alert('this :', error.message);
              });
          } else {
            setloading1(false);
            showToast(
              'error',
              'Error',
              'Please Select Any Payment Method',
              true,
              5000,
            );
          }
        }
      } else {
        showToast(
          'error',
          'Please Logout As Guest',
          'And Please Login As User',
          true,
          5000,
        );
      }
    });
    // showToast("info","Info","Congo",true,5000)
  };

  const sendFCMNotification = async (fcmToken, accessToken) => {
    try {
      const response = await fetch(
        'https://fcm.googleapis.com/v1/projects/fasthomedelivery-9c8e4/messages:send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`, // 🔁 Dynamic Bearer Token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token: fcmToken, // 🔁 Dynamic FCM device token
              data: {},
              notification: {
                title: 'New Order Has Been Arrived',
                body: 'Click And Check The Detail',
              },
            },
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('done');
        clearCart();
        setloading1(false);
        Alert.alert('Congratulation', 'Order Has Been Placed', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        console.log('✅ FCM Message Sent Successfully!');
        console.log('👉 Result Token/ID:', result);
      } else {
        setloading1(false);
        showToast(
          'error',
          'Order Has Been Placed',
          'But Notifcation Not Send Due To Error',
          true,
          4000,
        );
        console.warn('⚠️ FCM Sending Failed:', result);
      }
    } catch (error) {
      setloading1(false);
      showToast(
        'error',
        'Order Has Been Placed',
        'But Notifcation Not Send Due To Error',
        true,
        4000,
      );
      console.error('❌ Error sending FCM message:', error);
    }
  };

  const getinfo = async () => {
    try {
      const fcmResponse = await fetch(
        'https://firebasenotificationtoken-vxt6.vercel.app/send-notification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: GetData1[0]?.selecteduser.fcmtoken,
            title: 'FCM Message',
            body: 'This is an FCM notification message!',
          }),
        },
      );

      const fcmResult = await fcmResponse.json();

      if (fcmResponse.ok || GetData1[0]?.selecteduser?.fcmtoken) {
        setloading1(false);
        sendFCMNotification(
          GetData1[0]?.selecteduser.fcmtoken,
          fcmResult.result,
        );
        console.log('✅ FCM Notification Sent, result:', fcmResult.result);
      } else {
        setloading1(false);
        showToast(
          'error',
          'Order Has Been Placed',
          'But Notifcation Not Send Due To Error',
          true,
          4000,
        );
        console.warn('⚠️ FCM Sending Failed:', fcmResult);
      }
    } catch (error) {
      setloading1(false);
      showToast(
        'error',
        'Order Has Been Placed',
        'But Notifcation Not Send Due To Error',
        true,
        4000,
      );
      console.error('Catch Error:', error);
    }
  };

  return (
    <View style={[tw`flex-1`, { backgroundColor: '#ffffff' }]}>
      <Screensheader
        name={'VIEW ORDER'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View
          style={[
            { width: width * 0.92 },
            tw`  h-40 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-row justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View
                style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
              >
                <Image
                  style={tw`h-8 w-8`}
                  source={require('../../Images/choices.png')}
                />
              </View>

              <View>
                <Text style={tw`ml-2 font-semibold text-base`}>Order Num</Text>
                <Text style={tw`ml-2 font-semibold text-xs`}>{`${rnum}`}</Text>
              </View>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-75 self-center`} />

          <View style={tw`flex-row justify-between`}>
            <View style={[{ width: width * 0.45 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Payment Method
                </Text>
                <Text style={tw`ml-5 font-semibold text-green-500 text-base`}>
                  {'COD'}
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
                  SubTotal Bill
                </Text>
                <Text style={tw`ml-2 font-semibold text-xs`}>
                  {parseInt(totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            {
              backgroundColor: '#ffffff',
              // borderColor: '#d4af00',
              width: width * 0.92,
            },
            tw`border self-center border-gray-200 shadow-xl rounded-lg mt-5`,
          ]}
        >
          <View
            style={tw`mt-2 w-85 items-center  flex-row justify-around h-10 self-center`}
          >
            {/* <View style={tw` items-center  justify-center w-20 h-10`}>
              <Text>Image</Text>
            </View> */}
            <View style={tw` items-start justify-center w-35  h-10`}>
              <Text style={tw`font-bold ml-3`}>Product Name</Text>
            </View>
            <View style={tw` items-start justify-center w-25  h-10`}>
              <Text style={tw`font-bold`}>Quantity</Text>
            </View>
            <View style={tw` items-center  justify-center w-25  h-10`}>
              <Text style={tw`font-bold`}>Amount</Text>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-80 self-center`} />

          {state.cart.map((product, index) => (
            <View
              key={index}
              style={tw`mt-2 w-85 items-center  flex-row justify-around h-10 self-center`}
            >
              <View style={tw` items-start justify-center  w-35  h-10`}>
                <Text style={tw`ml-3`} numberOfLines={2}>
                  {product.name}
                </Text>
              </View>
              <View style={tw` items-start justify-center w-25 h-10`}>
                <Text style={tw`ml-5`}>{product.quantity}</Text>
              </View>
              <View style={tw` items-center justify-center w-25 h-10`}>
                <Text>{product.amount * product.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` mt-6  self-center border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-col mt-3 justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Payment Details
                </Text>
              </View>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-76 mt-1 self-center`} />

          <View style={tw`flex-col justify-between`}>
            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>Sub Total</Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>{totalAmount}</Text>
              </View>
            </View>

            {GetData2.map(data => (
              <View
                style={[
                  { width: width * 0.85 },
                  tw` flex-row self-center justify-between  mt-2 items-center`,
                ]}
              >
                <View style={[{ width: width * 0.65 }]}>
                  <Text style={tw` font-light  text-base`}>
                    {/* {data?.type_l === 'Percent' && `${data?.fuel_charges}% `} */}
                    {data?.company.toUpperCase()}{' '}
                  </Text>
                </View>

                <View>
                  <Text style={tw`mr-1 font-light text-base`}>
                    {data.type_l === 'Fixed'
                      ? parseInt(data.fuel_charges)
                      : (parseInt(totalAmount) / 100) *
                        parseInt(data.fuel_charges)}
                  </Text>
                </View>
              </View>
            ))}

            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>Delivery Charges</Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>{dfuel}</Text>
              </View>
            </View>
          </View>

          {GetData3[0]?.selecteduser?.price > 0 && (
            <View
              style={[
                { width: width * 0.85 },
                tw` flex-row self-center justify-between  mt-2 items-center`,
              ]}
            >
              <View style={[{ width: width * 0.65 }]}>
                <Text style={tw` font-light  text-base`}>
                  {/* {data?.type_l === 'Percent' && `${data?.fuel_charges}% `} */}
                  Discount
                </Text>
              </View>

              <View>
                <Text style={tw`mr-1 font-light text-base`}>
                  {(parseInt(totalAmount) / 100) *
                    parseFloat(GetData3[0]?.selecteduser?.price)}
                </Text>
              </View>
            </View>
          )}

          <View style={tw`border border-gray-300 w-76 mt-1 self-center`} />

          <View
            style={[
              { width: width * 0.85 },
              tw` flex-row self-center justify-between mb-2  mt-2 items-center`,
            ]}
          >
            <View style={[{ width: width * 0.65 }]}>
              <Text style={tw` font-bold  text-base`}>Grand Total</Text>
            </View>

            <View>
              <Text style={tw`mr-1 font-bold text-base`}>
                {GetData3[0]?.selecteduser?.price > 0
                  ? finalAmount +
                    dfuel -
                    (parseInt(totalAmount) / 100) *
                      parseFloat(GetData3[0]?.selecteduser?.price)
                  : finalAmount + dfuel}
                {/* {data.selecteduser.type_l === 'Fixed'
                  ? parseInt(data.selecteduser.fuel_charges)
                  : (parseInt(totalAmount) / 100) *
                    parseInt(data.selecteduser.fuel_charges)} */}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` mt-6 h-40 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-col justify-between`}>
            <View
              style={[{ width: width * 0.85 }, tw` flex-row justify-between`]}
            >
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Delivery Address
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (guest === 'Yes') {
                    showToast(
                      'error',
                      'Please Logout As Guest',
                      'And Please Login As User',
                      true,
                      5000,
                    );
                  } else {
                    navigation.navigate('ManageAddress', {
                      flag: false,
                    });
                  }
                }}
              >
                <View>
                  <Text
                    style={tw`ml-5 font-semibold underline text-orange-500 text-base`}
                  >
                    {dadddress ? 'Change' : 'Add'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-75 self-center`} />

          <View style={tw`flex-col justify-between`}>
            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/phone.png')}
                  />
                </View>

                <View>
                  <Text style={tw`ml-2 font-light text-base`}>
                    {dphone ? dphone : 'Add Phone'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/city-map.png')}
                  />
                </View>

                <View>
                  <Text numberOfLines={2} style={tw`ml-2 font-light text-base`}>
                    {dadddress ? dadddress : 'Add Address'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            { width: width * 0.92 },
            tw` mt-6 h-50 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
          ]}
        >
          <View style={tw`flex-col justify-between`}>
            <View style={[{ width: width * 0.65 }, tw` flex-row items-center`]}>
              <View>
                <Text style={tw`ml-5 font-semibold text-base`}>
                  Restaurent Details
                </Text>
              </View>
            </View>
          </View>

          <View style={tw`border border-gray-300 w-75 self-center`} />

          <View style={tw`flex-col justify-between`}>
            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/userc.png')}
                  />
                </View>

                <View>
                  <Text style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/phone.png')}
                  />
                </View>

                <View>
                  <Text style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.phoneNumber}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.65 }, tw` flex-row items-center`]}
              >
                <View
                  style={tw`bg-white rounded-full items-center  justify-center h-12 w-12`}
                >
                  <Image
                    style={tw`h-5 w-5`}
                    source={require('../../Images/city-map.png')}
                  />
                </View>

                <View>
                  <Text numberOfLines={2} style={tw`ml-2 font-light text-base`}>
                    {GetData1[0]?.selecteduser?.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {loading1 ? (
          <ActivityIndicator
            size={'large'}
            color={'#199A8E'}
            style={tw`mt-10`}
          />
        ) : (
          <>
            {state.cart.length ? (
              <View style={tw`justify-between self-center w-80 h-15 mt-5`}>
                <Buttonnormal
                  // onPress={handleLogin}
                  onPress={() => Uploadata()}
                  c1={'#F16767'}
                  c2={'#F16767'}
                  style={tw`text-white text-xl`}
                  title={'Place Order'}
                />
              </View>
            ) : (
              <>
                <Text style={tw`text-center font-semibold text-lg mt-30`}>
                  No Cart Has Been Cart
                </Text>
              </>
            )}
          </>
        )}
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  captureArea: {
    // padding: 20,
    // margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productContainer: {
    flexDirection: 'row',

    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 50,
    height: 50,
    // marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
  },
  capturedImage: {
    height: 400,
    width: '100%',
    marginTop: 20,
  },
  captureArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#199A8E',
    borderRadius: 5,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  capturedImage: {
    height: 400,
    width: '100%',
    marginTop: 20,
  },
});

export default Vieworder;
