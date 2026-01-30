import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Screensheader from '../../Components/Universal/Screensheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import tw from 'twrnc';
// import CheckBox from '@react-native-community/checkbox';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {showToast} from '../../Screens/Universal/Input';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import { Dropdown } from 'react-native-element-dropdown';
import { keepLocalCopy, pick } from '@react-native-documents/picker';
import storage from '@react-native-firebase/storage';
// import { t } from 'i18next';
import { AppContext } from '../../AppContext';
import { width } from '../Universal/Input';

const Addplan = ({ navigation, route }) => {
  const { darkMode } = useContext(AppContext);
  const {
    pid,
    planname,
    planamount,
    plandess,
    subcat,
    subcatv,
    link,
    content,
    linktype,
    active
  } = route.params;
  // console.log('image path', content, ':', materialtypel);

  const [GetData, setGetData] = useState([]);
  const [GetData1, setGetData1] = useState([]);
  const [GetData3, setGetData3] = useState([]);
  const [input, setinput] = useState('');
  const [inputpay, setinputpay] = useState(planamount);
  const [inputadd, setinputadd] = useState(planname);
  const [planamountt, setplanamountt] = useState(planamount);
  const [plandes, setplandes] = useState(plandess);
  const [textmaterial, settextmaterial] = useState(content);
  const [loading1, setloading1] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // To store the selected date
  const [datename, setdatename] = useState(''); // To store the selected date
  const [showPicker, setShowPicker] = useState(false); // To show/hide the date picker

  const [selectedDate1, setSelectedDate1] = useState(new Date()); // To store the selected date
  const [datename1, setdatename1] = useState(''); // To store the selected date
  const [showPicker1, setShowPicker1] = useState(false); // To show/hide the date picker

  const [value, setValue] = useState(subcatv);
  const [label, setlabel] = useState(subcat);
  const [isFocus, setIsFocus] = useState(false);

  const [value2, setValue2] = useState('');
  const [label2, setlabel2] = useState('');
  const [isFocus2, setIsFocus2] = useState(false);

  const [value3, setValue3] = useState('');
  const [label3, setlabel3] = useState('');
  const [isFocus3, setIsFocus3] = useState(false);

  const [value1, setValue1] = useState('');
  const [label1, setlabel1] = useState('');
  const [isFocus1, setIsFocus1] = useState(false);
  const [GetData4, setGetData4] = useState([]);

  // const [images, setImages] = useState(
  //   pimage.length === 1
  //     ? [pimage[0], null, null]
  //     : pimage.length === 2
  //     ? [pimage[0], pimage[1], null]
  //     : pimage,
  // );

  const choice = [
    { label: 'Text Material', value: '1' },
    { label: 'Image/PDF Material', value: '2' },
  ];

  const [images, setImages] = useState(link);

  const [rnum, setrnum] = useState(Math.floor(Math.random() * 1000000));
  const useridd = uuid.v4();
  const date = new Date();
  const monthdate =
    date.getMonth() + 1 + ':' + date.getDate() + ':' + date.getFullYear();

  useEffect(() => {
    getspecific();
    
    // if (pid) {
    //   fetchSubcategories(label);
    //   fetchwriter(label3);
    // }
  }, []);

  const fetchSubcategories = label4 => {
    console.log('lebel', label4);

    const coll = collection(db, 'Sub_subcat');
    const q = query(coll, where('areal', '==', label4.toLowerCase()));

    const unSubscribe = onSnapshot(q, snapshot => {
      setGetData1(
        snapshot.docs.map(doc => ({
          label: doc.data().company, // Set company name as label
          value: doc.data().userid, // Set user ID as value
        })),
      );
    });

    return unSubscribe; // Taake isko cleanup ke liye useEffect me call kar sakein
  };

  const fetchwriter = label4 => {
    console.log('writer lebel', label4);
    // setlabel1("")
    // setValue1("")
    const coll = collection(db, 'writer');
    const q = query(coll, where('subcatl', '==', label4.toLowerCase()));

    const unSubscribe = onSnapshot(q, snapshot => {
      setGetData4(
        snapshot.docs.map(doc => ({
          label: doc.data().company, // Set company name as label
          value: doc.data().userid, // Set user ID as value
        })),
      );
    });

    return unSubscribe; // Taake isko cleanup ke liye useEffect me call kar sakein
  };

  useEffect(() => {
    const categoriesColl = collection(db, 'Sub_Maincat');
    const subcategoriesColl = collection(db, 'Sub_subcat');

    const unSubscribe = onSnapshot(categoriesColl, async categoriesSnapshot => {
      const categories = categoriesSnapshot.docs.map(doc => ({
        label: doc.data().company, // Category name
        value: doc.data().userid, // Category value
      }));

      // Get all subcategories
      // const subSnap = await getDocs(subcategoriesColl);
      // const subcategories = subSnap.docs.map(doc => doc.data().areal); // Get main category names

      // Filter only those categories that exist in subcategories
      // const validCategories = categories.filter(cat =>
      //   subcategories.includes(cat.label),
      // );
      // console.log("cat",categories);

      setGetData3(categories);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  // useEffect(() => {
  //   const coll = collection(db, 'cities');

  //   const unSubscribe = onSnapshot(coll, snapshot => {
  //     setGetData4(
  //       snapshot.docs.map(doc => ({
  //         label: doc.data().label, // Set company name as label
  //         value: doc.data().value, // Set user ID as value
  //       })),
  //     );
  //   });

  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  const getspecific = async () => {
    AsyncStorage.getItem('email').then(email => {
      const coll = collection(db, 'subs_users');
      const q1 = query(coll, where('email', '==', email));

      const unSubscribe = onSnapshot(q1, snapshot => {
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
  };

  const Bookingdata = async () => {
    AsyncStorage.getItem('Guest').then(guest => {
      AsyncStorage.getItem('email').then(email => {
        if (guest == 'No') {
          const bookdd = async () => {
            const selectedImagesCount = images.filter(
              img => img !== null,
            ).length;
            console.log('select images', selectedImagesCount);
            if (
              // input &&
              // inputpay &&
              label &&
              // label1 &&
              // label3 &&
              inputadd &&
              planamountt &&
              plandes
              // datename &&
              // datename1 &&
              // selectedImagesCount >= 1
            ) {
              setloading1(true);
              console.log('images', images);

              const uploadPromises = images.map(async (image, index) => {
                try {
                  if (images[index] !== null && image?.name && image?.path) {
                    console.log('Image OK:', image.name, image.path);
                    console.log('step 1');
                    console.log('name', image.name);
                    const reference = storage().ref(`products/${image.name}`);
                    console.log('step 2');
                    console.log('path', image.path);
                    const filePath = `file://${image.path}`;
                    await reference.putFile(image.path, {
                      cacheControl: 'no-store', // disable caching
                    });
                    console.log('step 3');
                    const url = await reference.getDownloadURL();
                    console.log('step 4');
                    return url;
                  } else {
                    setloading1(true);
                    console.log('Invalid or null image at index:', index);
                    return null;
                  }
                } catch (error) {
                  setloading1(true);
                  console.log(
                    `Upload failed at index ${index}:`,
                    error.message,
                  );
                  return null;
                }
              });

              const unfilterurls = await Promise.all(uploadPromises);
              const filterimages = unfilterurls.filter(url => url !== null);
              // setloading(false)
              console.log('Uploaded image URLs:', filterimages);

              setDoc(doc(db, 'Products', useridd), {
                email: GetData[0].selecteduser.email,
                vendorid: GetData[0].selecteduser.uid,
                name: inputadd,
                categoryl: label.toLowerCase(),
                categoryv: value,
                planamount: planamountt,
                plandes: plandes,
                active : true,

                // subcatl: label3,
                // subcatv: value3,
                // writerl: label1 ? label1 : '',
                // writerv: value1 ? value1 : '',
                // materialtypel: label2,
                // materialtypev: value2,
                link: filterimages,
                linktype: images[0].uri ? images[0].type : linktype,
                content: '',
                viewcount: 0,

                // planamount: inputpay,
                // productlimit: input,
                id: useridd,
                ordernum: rnum,
                date: monthdate,
                month: date.getMonth() + 1,
                singledate: date.getDate(),
                year: date.getFullYear(),
              })
                .then(() => {
                  console.log('done');
                  setloading1(false);
                  setinput('');
                  setinputpay('');
                  Alert.alert('Congratulation', 'Product Has Been Posted', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                })
                .catch(error => {
                  setloading1(false);
                  Alert.alert('this :', error.message);
                });
            } else {
              let missingFields = [];
              // if (!input) missingFields.push('Plan Detail');
              // if (!inputpay) missingFields.push('Plan amount');
              if (!label) missingFields.push('Category');
              // if (!label1) missingFields.push('Writer');
              // if (!label3) missingFields.push('Subcategory');
              if (!inputadd) missingFields.push('Name');
              if (!planamountt) missingFields.push('Product Amount');
              if (!plandes) missingFields.push('Product Discription');
              // if (!datename) missingFields.push('Booking date');
              // if (!datename1) missingFields.push('Booking time');
              if (selectedImagesCount < 1)
                missingFields.push('Select At least one image');

              // if (!label2) missingFields.push('Material Type');
              // if (label2 === 'Text Material' && !textmaterial)
              //   missingFields.push('Content');
              if (missingFields.length > 0) {
                if (missingFields.length === 1) {
                  Alert.alert('Error', `${missingFields[0]} is required`);
                } else {
                  Alert.alert(
                    'Fill Required Fields:',
                    `${missingFields.join('\n')}`,
                  );
                }
                return;
              }

              // showToast(
              //   'error',
              //   'Error',
              //   'Please Fill The All Input',
              //   true,
              //   5000,
              // );
            }
          };
          bookdd();
        } else {
          // showToast(
          //   'error',
          //   'Please Logout As Guest',
          //   'And Please Login As User',
          //   true,
          //   5000,
          // );

          Alert.alert('Please Logout As Guest', 'And Login As User', [
            {
              text: 'NO',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'GO TO LOGIN',
              onPress: () => {
                AsyncStorage.removeItem('role').then(() => {
                  AsyncStorage.removeItem('mobileid').then(() => {
                    AsyncStorage.removeItem('email').then(() => {
                      AsyncStorage.removeItem('Guest').then(() => {
                        AsyncStorage.removeItem('catl').then(() => {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'WelcomeScreen' }],
                          });
                        });
                      });
                    });
                  });
                });
              },
            },
          ]);
        }
      });
    });
  };

  // const [Getdata3, setGetdata3] = React.useState([]);

  // useEffect(() => {
  //   const coll = collection(db, 'Sub_Maincat');

  //   const unSubscribe = onSnapshot(coll, snapshot => {
  //     setGetdata3(
  //       snapshot.docs.map(doc => ({
  //         label: doc.data().company, // Set company name as label
  //         value: doc.data().userid, // Set user ID as value
  //       })),
  //     );
  //   });

  //   return () => {
  //     unSubscribe();
  //   };
  // }, []);

  const Bookingupdate = async () => {
    console.log('length', GetData);

    AsyncStorage.getItem('Guest').then(guest => {
      if (guest == 'No') {
        const bookdd = async () => {
          // const selectedImagesCount = images.filter(img => img !== null).length;
          // console.log('select images', typeof selectedImagesCount);
          if (
            // input &&
            // inputpay &&
            label &&
            // label1 &&
            inputadd &&
            planamountt &&
            plandes
            // datename &&
            // datename1 &&
            // selectedImagesCount >= 1
          ) {
            setloading1(true);
            console.log('images my', images);

            const uploadPromises = images.map(async (image, index) => {
              if (image?.uri) {
                const reference = storage().ref(`products/${image.name}`);
                await reference.putFile(image.path);
                const url = await storage()
                  .ref(`products/${image.name}`)
                  .getDownloadURL();
                return url;
              } else {
                console.log('ma chala update ma no image');

                return images[index];
              }
              // return null;
            });
            console.log('upload ho chuki ha images ya pdf');

            const unfilterurls = await Promise.all(uploadPromises);
            const filterimages = unfilterurls.filter(url => url !== undefined);
            // setloading(false)
            console.log('Uploaded image URLs:', filterimages);
            try {
              updateDoc(doc(db, 'Products', pid), {
                email: GetData[0]?.selecteduser.email,
                vendorid: GetData[0]?.selecteduser.uid,
                name: inputadd,
                categoryl: label.toLowerCase(),
                categoryv: value,
                planamount: planamountt,
                plandes: plandes,
                active : active,
                // subcatl: label3,
                // subcatv: value3,
                // writerl: GetData4.length > 0 ? label1 : '',
                // writerv: GetData4.length > 0 ? value1 : '',
                link: filterimages,
                // materialtypel: label2,
                // materialtypev: value2,
                linktype: images[0]?.uri ? images[0]?.type : linktype,
                content: '',
                // id: useridd,
                ordernum: rnum,
                date: monthdate,
                month: date.getMonth() + 1,
                singledate: date.getDate(),
                year: date.getFullYear(),
                // productsamples: filterimages,
                // id: useridd,
                // ordernum: rnum,
                // date: monthdate,
                // month: date.getMonth() + 1,
                // singledate: date.getDate(),
                // year: date.getFullYear(),

                // bookingtime: datename1.toLocaleTimeString(),
                // bookingdate: datename,
                // bookingcityv: value1,
                // bookingcityl: label1,

                // vendorname: '',
                // vendorphone: '',
                // vendorcity: '',
                // vendoremail: '',
                // vendorid: '',
                // vendorcat: '',
                // vendorprofile: '',
                // vendoramount: 0,

                // orderstatus: 'pending',
                // rating: false,
                // ordertype: 'job',
                // ordercat: label,
                // ordersubcat: label3,
                // paymentmode: 'COD',
                // ordernum: rnum,
                // orders: input,
                // expectedamount: parseInt(inputpay),
              })
                .then(() => {
                  console.log('done');
                  setloading1(false);
                  setinput('');
                  setinputpay('');
                  Alert.alert('Congratulation', 'Product Has Been Updated', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                })
                .catch(error => {
                  setloading1(false);
                  Alert.alert('this :', error.message);
                });
            } catch (error) {
              console.log(error);
            }
          } else {
            let missingFields = [];
            // if (!input) missingFields.push('Plan Product limit');
            // if (!inputpay) missingFields.push('Plan amount');
            if (!label) missingFields.push('Category');
            // if (!label1) missingFields.push('Writer');
            // if (!label3) missingFields.push('Subcategory');
            if (!inputadd) missingFields.push('Name');
            if (!planamountt) missingFields.push('Product Amount');
            if (!plandes) missingFields.push('Product Discription');
            if (selectedImagesCount < 1)
              missingFields.push('Select At least one image');

            // if (!label2) missingFields.push('Material Type');
            // if (label2 === 'Text Material' && !textmaterial)
            // missingFields.push('Content');
            // if (!datename) missingFields.push('Booking date');
            // if (!datename1) missingFields.push('Booking time');
            // if (selectedImagesCount < 1)
            //   missingFields.push('Select At least one image');

            if (missingFields.length > 0) {
              if (missingFields.length === 1) {
                Alert.alert('Error', `${missingFields[0]} is required`);
              } else {
                Alert.alert(
                  'Fill Required Fields:',
                  `${missingFields.join('\n')}`,
                );
              }
              return;
            }

            // showToast(
            //   'error',
            //   'Error',
            //   'Please Fill The All Input',
            //   true,
            //   5000,
            // );
          }
        };
        bookdd();
      } else {
        // showToast(
        //   'error',
        //   'Please Logout As Guest',
        //   'And Please Login As User',
        //   true,
        //   5000,
        // );

        Alert.alert('Please Logout As Guest', 'And Login As User', [
          {
            text: 'NO',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'GO TO LOGIN',
            onPress: () => {
              AsyncStorage.removeItem('role').then(() => {
                AsyncStorage.removeItem('mobileid').then(() => {
                  AsyncStorage.removeItem('email').then(() => {
                    AsyncStorage.removeItem('Guest').then(() => {
                      AsyncStorage.removeItem('catl').then(() => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'WelcomeScreen' }],
                        });
                      });
                    });
                  });
                });
              });
            },
          },
        ]);
      }
    });
  };

  const onChange = (event, date) => {
    setShowPicker(false); // Hide the picker when a date is selected
    if (date) setSelectedDate(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed

    const formattedDate = `${year}-${month}-${day}`;
    console.log('formatted date', formattedDate);
    setdatename(formattedDate);
  };

  const handleTimeChange = (event, selectedDate1, type) => {
    if (type === 'from') {
      setShowPicker1(false);
      if (selectedDate1) setSelectedDate1(selectedDate1);
      setdatename1(selectedDate1);
    } else if (type === 'to') {
      setShowPicker1(false);
      if (selectedDate1) setSelectedDate1(selectedDate1);
    }
  };

  const choosefileimg = async index => {
    try {
      const [file] = await pick(); // Custom picker, returns [{ uri, name, size, type }]

      if (!file) return;

      if (file.size / 1000 / 1000 >= 5.0) {
        Alert.alert('Alert', 'Select Image Max 5 MB');
        return;
      }

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      const newImage = {
        uri: localCopy.localUri,
        path: localCopy.localUri.replace('file://', ''),
        name: file.name ?? 'fallbackName',
        type: file.type ?? 'image/jpeg',
      };

      console.log('images :', localCopy);
      console.log('images :', newImage);

      setImages(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = newImage;
        return updatedImages;
      });
    } catch (error) {
      if (error?.message?.includes('cancel')) {
        console.log('User canceled the picker');
      } else {
        console.log('Error image:', error);
      }
    }
  };

  // Generate numbers array from 1 to 100
  const numbers_arr = Array.from({ length: 101 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  return (
    <View style={tw`flex-1 `}>
      <ScrollView>
        <Screensheader
          name={pid ? 'UPDATE PRODUCTS' : 'ADD PRODUCTS'}
          left={15}
          onPress={() => navigation.goBack()}
        />

        <>
          <View
            style={[
              { width: width * 0.9 },
              tw` flex-col justify-around items-center  h-35 rounded-md self-center `,
            ]}
          >
            <View
              style={[
                { width: width * 0.9 },
                tw`h-35 justify-center   border-b-2  `,
                { borderColor: '#000000' },
              ]}
            >
              <Text
                numberOfLines={1}
                style={tw` text-black font-bold  w-60 text-2xl`}
              >
                {pid ? 'Update Your Product' : 'Add Your Product'}
              </Text>

              <Text
                numberOfLines={5}
                style={tw`font-light mt-1 w-80  text-black text-base`}
              >
                {
                  'Now You Can Add A Product And Easily Customize it with Your Custom Requirements And Share With Your Customers'
                }
              </Text>
            </View>
            {/* <View style={[tw`border border-b-2 w-80 self-center`,{borderColor:"#00b9e2"}]}/> */}
          </View>
        </>

        <View style={[{ width: width * 0.95 }, tw`  self-center mt-3`]}>
          <Text style={tw`font-semibold text-lg `}>{'Write Your Detail'}</Text>

          <TextInput
            multiline={true}
            style={[
              { width: width * 0.93 },
              tw` border border-${darkMode ? 'white' : 'black'} mt-3 text-${
                darkMode ? 'white' : 'black'
              } self-center rounded-md`,
            ]}
            placeholder={'Enter Product Name'}
            placeholderTextColor={darkMode ? 'white' : 'black'}
            value={inputadd}
            onChangeText={setinputadd}
          />

          <TextInput
            multiline={true}
            style={[
              { width: width * 0.93 },
              tw` border border-${darkMode ? 'white' : 'black'} mt-3 text-${
                darkMode ? 'white' : 'black'
              } self-center rounded-md`,
            ]}
            placeholder={'Enter Product Price'}
            placeholderTextColor={darkMode ? 'white' : 'black'}
            value={planamountt}
            onChangeText={setplanamountt}
          />

          <TextInput
            multiline={true}
            style={[
              { width: width * 0.93 },
              tw` h-20 border border-${
                darkMode ? 'white' : 'black'
              } mt-3 text-${
                darkMode ? 'white' : 'black'
              } self-center rounded-md`,
            ]}
            placeholder={'Enter Product Description'}
            placeholderTextColor={darkMode ? 'white' : 'black'}
            value={plandes}
            textAlignVertical="top"
            onChangeText={setplandes}
          />

          {/* <Dropdown
            style={[
              tw`h-12 mt-3 w-80 border-${
                darkMode ? 'white' : 'black'
              } border  rounded-md`,
            ]}
            placeholderStyle={tw`ml-3 text-${
              darkMode ? 'white' : 'black'
            }  text-base `}
            selectedTextStyle={tw`ml-3 text-${darkMode ? 'white' : 'black'}  `}
            containerStyle={tw`h-60 w-80  mt-7 bg-gray-100 rounded-md`}
            data={choice}
            // search={true}
            // searchPlaceholder="Sear *"
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select Material Type'}
            mode="modal"
            value={value2}
            onFocus={() => setIsFocus2(true)}
            onBlur={() => setIsFocus2(false)}
            onChange={item => {
              console.log('time', item.label);
              // fetchSubcategories(item.label);
              setlabel2(item.label);
              setValue2(item.value);
              setIsFocus2(false);
            }}
          /> */}

          <Dropdown
            style={[
              { width: width * 0.93 },
              tw`h-12 mt-3  border-${
                darkMode ? 'white' : 'black'
              } border self-center  rounded-md`,
            ]}
            placeholderStyle={tw`ml-3 text-${
              darkMode ? 'white' : 'black'
            }  text-base `}
            selectedTextStyle={tw`ml-3 text-${darkMode ? 'white' : 'black'}  `}
            containerStyle={tw`h-60 w-80  mt-7 bg-gray-100 rounded-md`}
            data={GetData3}
            search={true}
            searchPlaceholder="Search Category *"
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select Category *'}
            mode="modal"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              console.log('time', item.label);
              // fetchSubcategories(item.label);
              setlabel(item.label);
              setValue(item.value);
              setIsFocus(false);
            }}
          />
          {/* 
          {label && (
            <Dropdown
              style={[
                tw`h-12 mt-3 w-80 border-${
                  darkMode ? 'white' : 'black'
                } border  rounded-md`,
              ]}
              placeholderStyle={tw`ml-3 text-${
                darkMode ? 'white' : 'black'
              }  text-base `}
              selectedTextStyle={tw`ml-3 text-${
                darkMode ? 'white' : 'black'
              }  `}
              containerStyle={tw`h-60 w-80  mt-7 bg-gray-100 rounded-md`}
              data={GetData1}
              search={true}
              searchPlaceholder="Search Sub Category *"
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'Select Sub Category *'}
              mode="modal"
              value={value3}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={item => {
                console.log('time', item.label);
                fetchwriter(item.label);
                setlabel3(item.label);
                setValue3(item.value);
                setIsFocus3(false);
              }}
            />
          )} */}

          {/* {label3 && GetData4.length ? (
            <Dropdown
              style={[
                tw`h-12 mt-3 w-80 border-${
                  darkMode ? 'white' : 'black'
                } border   rounded-md`,
              ]}
              placeholderStyle={tw`ml-3 text-${
                darkMode ? 'white' : 'black'
              }  text-base `}
              selectedTextStyle={tw`ml-3 text-${
                darkMode ? 'white' : 'black'
              }  `}
              containerStyle={tw`h-60 w-80  mt-7 bg-gray-50 rounded-md`}
              data={GetData4}
              search={true}
              searchPlaceholder="Search Writer *"
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={'Select Writer *'}
              mode="modal"
              value={value1}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={item => {
                console.log('time', item.label);

                setlabel1(item.label);
                setValue1(item.value);
                setIsFocus1(false);
              }}
            />
          ) : (
            <></>
          )} */}

          {/* <View
              style={tw` flex-row w-80 mt-3 justify-between self-center items-center`}>
              <TouchableOpacity
                style={[
                  tw`h-12 w-38  justify-center items-center rounded-lg`,
                  {backgroundColor: '#00b9e2'},
                ]}
                onPress={() => setShowPicker(true)}>
                <Text style={tw`text-white font-bold`}>
                  {' '}
                  {datename
                    ? selectedDate.toDateString()
                    : 'Select Booking Date *'}
                </Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                style={[
                  tw`h-12 w-38 bg-blue-500 justify-center items-center rounded-lg`,
                  {backgroundColor: '#00b9e2'},
                ]}
                onPress={() => setShowPicker1(true)}>
                <Text style={tw`text-white font-bold`}>
                  {' '}
                  {datename1
                    ? selectedDate1.toLocaleTimeString()
                    : 'Select Booking Time *'}
                </Text>
              </TouchableOpacity>
             
            </View> */}

          {/* {showPicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
  
            {showPicker1 && (
              <DateTimePicker
                value={selectedDate1}
                mode="time"
                display="default"
                onChange={(e, date) => handleTimeChange(e, date, 'from')}
              />
            )} */}

          {/* <TextInput
              numberOfLines={50}
              multiline={true}
              style={tw`w-80 border mt-3  rounded-md h-12`}
              placeholder={'Product Limit *'}
              textAlignVertical="top" // This moves the placeholder to the top
              value={input}
              onChangeText={setinput}
            /> */}

          {/* <Dropdown
              style={[
                tw`h-12 w-80 mt-2 border-black border self-center  rounded-md`,
              ]}
              placeholderStyle={tw`ml-3 text-black font-semibold text-base `}
              selectedTextStyle={tw`ml-3 text-gray-400  `}
              containerStyle={tw`h-60 w-80  mt-7 bg-gray-100 rounded-md`}
              data={GetData4}
              maxHeight={300}
              search={true}
              searchPlaceholder="Search City *"
              labelField="label"
              valueField="value"
              placeholder={'Select City *'}
              mode="modal"
              value={value1}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={item => {
                console.log('time', item.label);
                setlabel1(item.label);
                setValue1(item.value);
                setIsFocus1(false);
              }}
            /> */}

          {/* <TextInput
              multiline={true}
              style={tw`w-80 border mt-3 rounded-md`}
              placeholder={'Your Plan Amount *'}
              value={inputpay}
              onChangeText={setinputpay}
            /> */}

          {/* <Dropdown
              style={[tw`h-12 w-80 mt-3 border-black border  rounded-md`]}
              placeholderStyle={tw`ml-3 text-black font-semibold text-base `}
              selectedTextStyle={tw`ml-3 text-gray-400  `}
              containerStyle={tw`h-60 w-80  mt-7 bg-gray-100 rounded-md`}
              data={numbers_arr}
              maxHeight={300}
              search={true}
              searchPlaceholder="Search Video Limit*"
              labelField="label"
              valueField="value"
              placeholder={'Select Video Limit *'}
              mode="modal"
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                console.log('time', item.label);
                setlabel(item.label);
                // fetchSubcategories(item.label);
                setValue(item.value);
                setIsFocus(false);
              }}
            /> */}
          {label2 === 'Text Material' ? (
            <>
              <TextInput
                multiline={true}
                textAlignVertical="top"
                style={tw`w-80 h-20 border mt-3 rounded-md`}
                placeholder={'Enter Content'}
                value={textmaterial}
                onChangeText={settextmaterial}
              />
            </>
          ) : (
            <>
              <Text
                style={tw`mt-3 text-base text-${
                  darkMode ? 'white' : 'black'
                } font-semibold`}
              >
                Add Product Image ({'Select minimum 1'})
              </Text>

              <View style={tw`w-60 self-center flex-row mt-5 justify-around`}>
                {images.map((image, index) => (
                  <View
                    style={tw`flex flex-col w-15 self-center justify-around`}
                  >
                    <TouchableOpacity
                      key={index}
                      onPress={() => choosefileimg(index)}
                    >
                      {/* <View style={tw`flex w-10 items-center  mt-5 flex-col`}> */}
                      <View
                        style={tw`  h-15 border-2 border-${
                          darkMode ? 'white' : 'black'
                        } rounded-md w-15 justify-center items-center border-dotted`}
                      >
                        {images[index] !== null ? (
                          <Image
                            source={{ uri: image.uri ? image.uri : image }}
                            resizeMode="cover"
                            style={tw`h-14 w-14  self-center rounded-lg`}
                          />
                        ) : (
                          <Text style={tw`font-bold text-lg`}>+</Text>
                        )}
                      </View>
                      {/* </View> */}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <>
          <>
            {loading1 ? (
              <ActivityIndicator
                size={'large'}
                color={'#199A8E'}
                style={tw`mt-10`}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Alert',
                      pid
                        ? 'Are You Sure You Want TO Update Product ?'
                        : 'Are You Sure You Want TO Add Product ?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            pid ? Bookingupdate() : Bookingdata();
                            // console.log('Cancel Pressed');
                          },
                        },
                      ],
                    );
                  }}
                >
                  <View
                    style={[
                      tw`mt-5 mb-2 h-10 self-center justify-center items-center rounded-md`,
                      { backgroundColor: '#F16767', width: width * 0.93 },
                    ]}
                  >
                    <Text style={tw`text-center font-bold text-white`}>
                      {pid ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        </>
      </ScrollView>
      <Toast />
    </View>
  );
};

export default Addplan;
