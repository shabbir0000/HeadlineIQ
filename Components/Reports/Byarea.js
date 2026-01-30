import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import tw from 'twrnc';
import { width } from '../Universal/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { AppContext } from '../../AppContext';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Byarea = () => {
  const { darkMode } = useContext(AppContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const toggleModal = () => {
    setValue('');
    setlabel('');
    setModalVisible(!isModalVisible);
  };

  const toggleModal1 = () => {
    setValue1('');
    setlabel1('');
    setModalVisible1(!isModalVisible1);
  };

  const [Productdata, setProductdata] = useState();

  // picker 1
  const [showPicker, setShowPicker] = useState(false); // To show/hide the date picker
  const [datename, setdatename] = useState(''); // To store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date()); // To store the selected date

  // picker 2
  const [showPicker1, setShowPicker1] = useState(false); // To show/hide the date picker
  const [datename1, setdatename1] = useState(''); // To store the selected date
  const [selectedDate1, setSelectedDate1] = useState(new Date()); // To store the selected date

  // picker 3
  const [showPicker2, setShowPicker2] = useState(false); // To show/hide the date picker
  const [datename2, setdatename2] = useState(''); // To store the selected date
  const [selectedDate2, setSelectedDate2] = useState(new Date()); // To store the selected date

  const [value, setValue] = useState('');
  const [label, setlabel] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const [value1, setValue1] = useState('');
  const [label1, setlabel1] = useState('');
  const [isFocus1, setIsFocus1] = useState(false);

  const onChange = (event, date) => {
    setShowPicker(false); // Hide the picker when a date is selected
    if (date) setSelectedDate(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    const day = date.getDate().toString(); // Add leading zero if needed

    const formattedDate = `${month}:${day}:${year}`;
    console.log('formatted date', formattedDate);
    setdatename(formattedDate);
    generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const onChange1 = (event, date) => {
    setShowPicker1(false); // Hide the picker when a date is selected
    if (date) setSelectedDate1(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    const day = date.getDate().toString(); // Add leading zero if needed

    const formattedDate = `${month}:${day}:${year}`;
    console.log('formatted date', formattedDate);
    setdatename1(formattedDate);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const onChange2 = (event, date) => {
    setShowPicker2(false); // Hide the picker when a date is selected
    if (date) setSelectedDate2(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    const day = date.getDate().toString(); // Add leading zero if needed

    const formattedDate = `${month}:${day}:${year}`;
    console.log('formatted date', formattedDate);
    setdatename2(formattedDate);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const [Getdata, setGetdata] = React.useState([]);
  // const user = getAuth(app);

  useEffect(() => {
    console.log('chala');
    AsyncStorage.getItem('email').then(email => {
      console.log('chala email :', email);
      // const user = auth.currentUser;
      const coll = collection(db, 'Sub_Areas');

      const unSubscribe = onSnapshot(coll, snapshot => {
        setGetdata(
          snapshot.docs.map(doc => ({
            label: doc.data().company, // 👈 yahan company name aayega
            value: doc.userid, // 👈 yahan user id ya document id aayegi
          })),
        );
      });

      return () => {
        unSubscribe();
      };
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // generateSalesReportfromtodate('8:20:2025', '10:4:2025');
      setdatename('');
      setdatename1('');
      setdatename2('');
      const today = new Date();
      const formattedDate = `${
        today.getMonth() + 1
      }:${today.getDate()}:${today.getFullYear()}`;

      // generateSalesReport(formattedDate);
      generateSalesReportbyarea(formattedDate);

      // Optional cleanup (agar kuch cancel karna ho)
      return () => {
        console.log('🔙 Screen unfocused');
      };
    }, []),
  );

  const generateSalesReportfromtodate = async (
    fromDate = null,
    toDate = null,
    selectedArea = null,
  ) => {
    try {
      if (!datename1 || !datename2 || !label) {
        Alert.alert('Validation Error', 'Please Select Date Range And Area');
        return;
      }

      // ✅ Step 1: Get all areas from Sub_Areas
      const subAreasSnap = await getDocs(collection(db, 'Sub_Areas'));
      const allAreas = subAreasSnap.docs.map(doc => doc.data().company);

      if (allAreas.length === 0) {
        console.warn('⚠️ No areas found in Sub_Areas collection');
        return;
      }

      // ✅ Step 2: Choose selected or default area
      const areaToUse = selectedArea || allAreas[0];
      console.log(`🏙️ Selected Area: ${areaToUse}`);

      // ✅ Step 3: Format default date [month:day:year]
      const today = new Date();
      const defaultDate = `${
        today.getMonth() + 1
      }:${today.getDate()}:${today.getFullYear()}`;

      const startDate = fromDate ? fromDate : defaultDate;
      const endDate = toDate ? toDate : defaultDate;

      console.log(`📅 Generating report from ${startDate} to ${endDate}`);

      // ✅ Step 4: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 5: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));
      let productSales = {};

      // ✅ Step 6: Parse date for [month:day:year]
      const parseDate = str => {
        const [month, day, year] = str.split(':').map(Number);
        return new Date(year, month - 1, day);
      };

      const start = parseDate(startDate);
      const end = parseDate(endDate);

      // ✅ Step 7: Loop through orders and filter by date + area + completed
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();
        if (
          data.date &&
          data.orderstatus === 'completed' &&
          data.orderarea === areaToUse && // ✅ Filter by selected area
          Array.isArray(data.orders)
        ) {
          const orderDate = parseDate(data.date);

          if (orderDate >= start && orderDate <= end) {
            // ✅ Order is within range and area
            data.orders.forEach(orderItem => {
              const productName = orderItem.name;
              const qty = parseFloat(orderItem.quantity) || 0;
              const amount = parseFloat(orderItem.amount) || 0;
              const totalSale = qty * amount;

              if (productSales[productName]) {
                productSales[productName] += totalSale;
              } else {
                productSales[productName] = totalSale;
              }
            });
          }
        }
      });

      console.log('💰 Product Sales (Total Amount):', productSales);

      // ✅ Step 8: Add zero for products that didn’t sell
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 9: Convert to array
      const salesArray = Object.entries(productSales).map(
        ([product, totalSale]) => ({
          product_name: product,
          total_sale: totalSale.toFixed(0),
        }),
      );

      // ✅ Step 10: Sort descending
      const sorted = [...salesArray].sort(
        (a, b) => b.total_sale - a.total_sale,
      );

      // ✅ Step 11: Min, Max, Top3
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3);

      // ✅ Step 12: Final Report
      const report = {
        from: startDate,
        to: endDate,
        area: areaToUse,
        availableAreas: allAreas, // 🔥 For UI dropdowns
        sales: salesArray,
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      toggleModal();
      console.log('✅ Final Report (Dynamic Area + Date Range):', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  const generateSalesReport = async (selectedDate = null) => {
    try {
      // ✅ Step 1: Date formatting
      const today = new Date();
      const formattedDate = selectedDate
        ? selectedDate
        : `${today.getMonth() + 1}:${today.getDate()}:${today.getFullYear()}`;

      console.log('📅 Generating report for date:', formattedDate);

      // ✅ Step 2: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 3: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));

      let productSales = {};

      // ✅ Step 4: Filter orders by date + completed status and calculate total sales (amount × quantity)
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        if (
          data.date === formattedDate &&
          data.orderstatus === 'completed' && // ✅ only completed orders
          Array.isArray(data.orders)
        ) {
          data.orders.forEach(orderItem => {
            const productName = orderItem.name;
            const qty = parseFloat(orderItem.quantity) || 0;
            const amount = parseFloat(orderItem.amount) || 0;
            const totalSale = qty * amount;

            if (productSales[productName]) {
              productSales[productName] += totalSale;
            } else {
              productSales[productName] = totalSale;
            }
          });
        }
      });

      console.log('💰 Product Sales (Total Amount):', productSales);

      // ✅ Step 5: Add zero for products that didn’t sell today
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 6: Convert productSales into array of objects
      const salesArray = Object.entries(productSales).map(
        ([product, totalSale]) => ({
          product_name: product,
          total_sale: totalSale.toFixed(0),
        }),
      );

      // ✅ Step 7: Sort salesArray (descending order)
      const sorted = [...salesArray].sort(
        (a, b) => b.total_sale - a.total_sale,
      );

      // ✅ Step 8: Find max, min, and top 3 products
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3); // top 3 selling

      // ✅ Step 9: Final Report
      const report = {
        date: formattedDate,
        sales: salesArray, // [{ product_name, total_sale }]
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      console.log('✅ Final Report by sale:', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  const generateSalesReportbyarea = async (
    selectedDate = null,
    selectedArea = null,
  ) => {
    try {
      // ✅ Step 1: Get all areas from Sub_Areas collection
      const subAreasSnap = await getDocs(collection(db, 'Sub_Areas'));
      const allAreas = subAreasSnap.docs.map(doc => doc.data().company);

      if (allAreas.length === 0) {
        console.warn('⚠️ No areas found in Sub_Areas collection');
        return;
      }

      // ✅ Step 2: Use user-selected area or default to first one
      const areaToUse = selectedArea || allAreas[0];
      console.log('🏙️ Selected Area:', areaToUse);

      // ✅ Step 3: Date formatting
      const today = new Date();
      const formattedDate = selectedDate
        ? selectedDate
        : `${today.getMonth() + 1}:${today.getDate()}:${today.getFullYear()}`;

      console.log(
        `📅 Generating report for ${formattedDate}, 🏙️ Area: ${areaToUse}`,
      );

      // ✅ Step 4: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 5: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));
      let productSales = {};

      // ✅ Step 6: Filter orders (by date, area, and status)
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        const isDateMatch = data.date === formattedDate;
        const isAreaMatch = data.orderarea === areaToUse;
        const isCompleted = data.orderstatus === 'completed';

        if (
          isDateMatch &&
          isAreaMatch &&
          isCompleted &&
          Array.isArray(data.orders)
        ) {
          data.orders.forEach(orderItem => {
            const productName = orderItem.name;
            const qty = parseFloat(orderItem.quantity) || 0;
            const amount = parseFloat(orderItem.amount) || 0;
            const totalSale = qty * amount;

            if (productSales[productName]) {
              productSales[productName] += totalSale;
            } else {
              productSales[productName] = totalSale;
            }
          });
        }
      });

      console.log('💰 Product Sales (Total Amount):', productSales);

      // ✅ Step 7: Add zero for unsold products
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 8: Convert to array
      const salesArray = Object.entries(productSales).map(
        ([product, totalSale]) => ({
          product_name: product,
          total_sale: totalSale.toFixed(0),
        }),
      );

      // ✅ Step 9: Sort descending
      const sorted = [...salesArray].sort(
        (a, b) => b.total_sale - a.total_sale,
      );

      // ✅ Step 10: Find Max, Min, Top3
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3);

      // ✅ Step 11: Final Report
      const report = {
        date: formattedDate,
        area: areaToUse,
        availableAreas: allAreas, // 🔥 user ko dikhane ke liye
        sales: salesArray,
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      console.log('✅ Final Report (Dynamic Area):', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  const generateSalesReportbyarea1 = async (
    selectedDate = null,
    selectedArea = null,
  ) => {
    try {
      if (!label1 || !datename) {
        Alert.alert('Validation Error', 'Please select Area And Date');
        return;
      }
      // ✅ Step 1: Get all areas from Sub_Areas collection
      const subAreasSnap = await getDocs(collection(db, 'Sub_Areas'));
      const allAreas = subAreasSnap.docs.map(doc => doc.data().company);

      if (allAreas.length === 0) {
        console.warn('⚠️ No areas found in Sub_Areas collection');
        return;
      }

      // ✅ Step 2: Use user-selected area or default to first one
      const areaToUse = selectedArea || allAreas[0];
      console.log('🏙️ Selected Area:', areaToUse);

      // ✅ Step 3: Date formatting
      const today = new Date();
      const formattedDate = selectedDate
        ? selectedDate
        : `${today.getMonth() + 1}:${today.getDate()}:${today.getFullYear()}`;

      console.log(
        `📅 Generating report for ${formattedDate}, 🏙️ Area: ${areaToUse}`,
      );

      // ✅ Step 4: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 5: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));
      let productSales = {};

      // ✅ Step 6: Filter orders (by date, area, and status)
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        const isDateMatch = data.date === formattedDate;
        const isAreaMatch = data.orderarea === areaToUse;
        const isCompleted = data.orderstatus === 'completed';

        if (
          isDateMatch &&
          isAreaMatch &&
          isCompleted &&
          Array.isArray(data.orders)
        ) {
          data.orders.forEach(orderItem => {
            const productName = orderItem.name;
            const qty = parseFloat(orderItem.quantity) || 0;
            const amount = parseFloat(orderItem.amount) || 0;
            const totalSale = qty * amount;

            if (productSales[productName]) {
              productSales[productName] += totalSale;
            } else {
              productSales[productName] = totalSale;
            }
          });
        }
      });

      console.log('💰 Product Sales (Total Amount):', productSales);

      // ✅ Step 7: Add zero for unsold products
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 8: Convert to array
      const salesArray = Object.entries(productSales).map(
        ([product, totalSale]) => ({
          product_name: product,
          total_sale: totalSale.toFixed(0),
        }),
      );

      // ✅ Step 9: Sort descending
      const sorted = [...salesArray].sort(
        (a, b) => b.total_sale - a.total_sale,
      );

      // ✅ Step 10: Find Max, Min, Top3
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3);

      // ✅ Step 11: Final Report
      const report = {
        date: formattedDate,
        area: areaToUse,
        availableAreas: allAreas, // 🔥 user ko dikhane ke liye
        sales: salesArray,
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      toggleModal1();
      console.log('✅ Final Report (Dynamic Area):', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  return (
    <View style={tw`bg-white`}>
      <ScrollView>
        <View
          style={tw` flex-row w-80 mt-3 justify-between self-center items-center`}
        >
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <TouchableOpacity
              onPress={() => {
                setdatename('');
                setdatename1('');
                setdatename2('');
                const today = new Date();
                const formattedDate = `${
                  today.getMonth() + 1
                }:${today.getDate()}:${today.getFullYear()}`;

                // generateSalesReport(formattedDate);
                generateSalesReportbyarea(formattedDate);
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
            <TouchableOpacity
              style={[
                tw`h-12 w-38  justify-center items-center rounded-lg`,
                { backgroundColor: '#F16767' },
              ]}
              onPress={() => toggleModal1()}
            >
              <Text style={tw`text-white font-bold`}>
                {' '}
                {datename ? selectedDate.toDateString() : 'Filter By Date'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`h-12 w-38 ml-5 justify-center items-center rounded-lg`,
                { backgroundColor: '#F16767' },
              ]}
              onPress={() => toggleModal()}
            >
              <Text style={tw`text-white font-bold`}>
                {' '}
                {datename1 && datename2
                  ? selectedDate1.getDate() +
                    '/' +
                    selectedDate1.getMonth() +
                    ' TO ' +
                    selectedDate2.getDate() +
                    '/' +
                    selectedDate2.getMonth()
                  : 'Range Date Filter'}
              </Text>
            </TouchableOpacity>

            {/* {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )} */}
          </ScrollView>
        </View>

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
              tw`  h-40 mb-5 mr-2 ml-2 mt-5 self-center justify-evenly border border-gray-200 rounded-xl bg-white shadow-xl `,
            ]}
          >
            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.45 }, tw` flex-row items-center`]}
              >
                <View>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-5 font-semibold text-base`}
                  >
                    {Productdata?.max?.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-5 text-black font-semibold text-base`}
                  >
                    {'(Max Sale)'}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-6 font-semibold text-green-500 text-xs`}
                  >
                    {Productdata?.max?.total_sale}
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
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 font-semibold text-base`}
                  >
                    {Productdata?.min?.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 font-semibold text-base`}
                  >
                    {'(Min Sale)'}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 font-semibold text-green-500 text-xs`}
                  >
                    {Productdata?.min?.total_sale}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`border border-gray-300 w-75 self-center`} />

            <View style={tw`flex-row justify-between`}>
              <View
                style={[{ width: width * 0.3 }, tw` flex-row items-center`]}
              >
                <View>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-5 font-semibold text-base`}
                  >
                    {' '}
                    {Productdata?.top3[0]?.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-6 font-semibold text-green-500 text-xs`}
                  >
                    {Productdata?.top3[0]?.total_sale}
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
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 font-semibold text-base`}
                  >
                    {' '}
                    {Productdata?.top3[1]?.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-3 text-green-500 font-semibold text-xs`}
                  >
                    {Productdata?.top3[1]?.total_sale}
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
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 font-semibold text-base`}
                  >
                    {Productdata?.top3[2]?.product_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={tw`ml-2 text-green-500 font-semibold text-xs`}
                  >
                    {Productdata?.top3[2]?.total_sale}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={Productdata?.sales}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // ✅ 2 items per row
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 10,
            marginLeft: 18,
            marginRight: 18,
          }}
          renderItem={({ item }) => (
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
                  source={require('../../Images/barbecue.png')}
                />
              </View>

              <View
                style={[
                  { width: width * 0.4 },
                  tw` self-center justify-start border-l-2 border-orange-500  h-18  bg-white`,
                ]}
              >
                <Text style={tw`font-extrabold ml-2 text-orange-500 text-2xl`}>
                  {item.total_sale}
                </Text>
                <Text
                  numberOfLines={1}
                  style={tw`font-extrabold ml-2 text-black text-base`}
                >
                  {item.product_name}
                </Text>
              </View>
            </View>
          )}
        />

        <Modal
          style={tw`w-80 self-center `}
          onDismiss={toggleModal}
          animationIn={'bounceInUp'}
          isVisible={isModalVisible}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: darkMode ? 'black' : '#ffffff',
            }}
          >
            <View
              style={[
                {
                  height: 350,
                  backgroundColor: darkMode ? 'black' : '#ffffff',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  // setcompany('');
                  // setlabel2('');
                  // setValue2('');
                  // setImages([null]);
                  toggleModal();
                  // setcompany('');
                  // navigation.goBack()
                }}
              >
                <View style={tw`items-end self-center justify-end w-310px`}>
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={
                      darkMode
                        ? require('../../Images/closew.png')
                        : require('../../Images/close.png')
                    }
                  />
                </View>
              </TouchableOpacity>

              <View style={tw` flex-col  h-60 justify-around`}>
                <View style={tw`self-center`}>
                  <Text
                    style={[
                      tw`text-center font-normal text-lg`,
                      { color: darkMode ? '#ffffff' : '#000000' },
                    ]}
                  >
                    {'Select Dates'}
                  </Text>
                </View>

                <View
                  style={tw` flex-col w-80 mt-3 justify-between self-center items-center`}
                >
                  <TouchableOpacity
                    style={[
                      tw`h-12 w-50  justify-center items-center rounded-lg`,
                      { backgroundColor: '#F16767' },
                    ]}
                    onPress={() => setShowPicker1(true)}
                  >
                    <Text style={tw`text-white font-bold`}>
                      {' '}
                      {datename1 ? selectedDate1.toDateString() : 'From Date'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      tw`h-12 w-50 mt-5  justify-center items-center rounded-lg`,
                      { backgroundColor: '#F16767' },
                    ]}
                    onPress={() => setShowPicker2(true)}
                  >
                    <Text style={tw`text-white font-bold`}>
                      {' '}
                      {datename2 ? selectedDate2.toDateString() : 'To Date'}
                    </Text>
                  </TouchableOpacity>

                  <Dropdown
                    style={[
                      { width: width * 0.55, backgroundColor: '#F16767' },
                      tw`h-12 mt-3  border-${
                        darkMode ? 'white' : 'black'
                      }  self-center text-white  rounded-lg`,
                    ]}
                    placeholderStyle={tw`ml-3 text-${
                      darkMode ? 'white' : 'white'
                    }  text-base `}
                    selectedTextStyle={tw`ml-3 text-${
                      darkMode ? 'white' : 'white'
                    }  `}
                    containerStyle={tw`h-60 w-65 text-black  mt-7 bg-gray-100 rounded-md`}
                    data={Getdata}
                    search={true}
                    searchPlaceholder="Search Area"
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select Area'}
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

                  {showPicker1 && (
                    <DateTimePicker
                      value={selectedDate1}
                      mode="date"
                      display="default"
                      onChange={onChange1}
                    />
                  )}

                  {showPicker2 && (
                    <DateTimePicker
                      value={selectedDate2}
                      mode="date"
                      display="default"
                      onChange={onChange2}
                    />
                  )}
                </View>

                {/* {loading ? (
                  <ActivityIndicator
                    style={tw`mt-15`}
                    size="large"
                    color="#00BF62"
                  />
                ) : ( */}
                <View style={tw`mt-5`}>
                  <TouchableOpacity
                    onPress={() => {
                      generateSalesReportfromtodate(
                        datename1,
                        datename2,
                        label,
                      );
                    }}
                  >
                    <View
                      style={[
                        tw`rounded-full`,
                        {
                          marginTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 250,

                          backgroundColor: '#F16767',
                        },
                      ]}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {'Apply Filter'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* )} */}
              </View>
            </View>

            <Toast />
          </View>
        </Modal>

        <Modal
          style={tw`w-80 self-center `}
          onDismiss={toggleModal1}
          animationIn={'bounceInUp'}
          isVisible={isModalVisible1}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: darkMode ? 'black' : '#ffffff',
            }}
          >
            <View
              style={[
                {
                  height: 350,
                  backgroundColor: darkMode ? 'black' : '#ffffff',
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  // setcompany('');
                  // setlabel2('');
                  // setValue2('');
                  // setImages([null]);
                  toggleModal1();
                  // setcompany('');
                  // navigation.goBack()
                }}
              >
                <View style={tw`items-end self-center justify-end w-310px`}>
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={
                      darkMode
                        ? require('../../Images/closew.png')
                        : require('../../Images/close.png')
                    }
                  />
                </View>
              </TouchableOpacity>

              <View style={tw` flex-col  h-60 justify-around`}>
                <View style={tw`self-center`}>
                  <Text
                    style={[
                      tw`text-center font-normal text-lg`,
                      { color: darkMode ? '#ffffff' : '#000000' },
                    ]}
                  >
                    {'Select Dates'}
                  </Text>
                </View>

                <View
                  style={tw` flex-col w-80 mt-3 justify-between self-center items-center`}
                >
                  <TouchableOpacity
                    style={[
                      tw`h-12 w-50  justify-center items-center rounded-lg`,
                      { backgroundColor: '#F16767' },
                    ]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={tw`text-white font-bold`}>
                      {' '}
                      {datename ? selectedDate.toDateString() : 'From Date'}
                    </Text>
                  </TouchableOpacity>

                  <Dropdown
                    style={[
                      { width: width * 0.55, backgroundColor: '#F16767' },
                      tw`h-12 mt-3  border-${
                        darkMode ? 'white' : 'black'
                      }  self-center text-white  rounded-lg`,
                    ]}
                    placeholderStyle={tw`ml-3 text-${
                      darkMode ? 'white' : 'white'
                    }  text-base `}
                    selectedTextStyle={tw`ml-3 text-${
                      darkMode ? 'white' : 'white'
                    }  `}
                    containerStyle={tw`h-60 w-65 text-black  mt-7 bg-gray-100 rounded-md`}
                    data={Getdata}
                    search={true}
                    searchPlaceholder="Search Area"
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select Area'}
                    mode="modal"
                    value={value1}
                    onFocus={() => setIsFocus1(true)}
                    onBlur={() => setIsFocus1(false)}
                    onChange={item => {
                      console.log('time', item.label);
                      // fetchSubcategories(item.label);
                      setlabel1(item.label);
                      setValue1(item.value);
                      setIsFocus1(false);
                    }}
                  />

                  {showPicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>

                {/* {loading ? (
                  <ActivityIndicator
                    style={tw`mt-15`}
                    size="large"
                    color="#00BF62"
                  />
                ) : ( */}
                <View style={tw`mt-5`}>
                  <TouchableOpacity
                    onPress={() => {
                      generateSalesReportbyarea1(datename, label1);
                    }}
                  >
                    <View
                      style={[
                        tw`rounded-full`,
                        {
                          marginTop: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          height: 40,
                          width: 250,

                          backgroundColor: '#F16767',
                        },
                      ]}
                    >
                      <Text style={{ textAlign: 'center', color: 'white' }}>
                        {'Apply Filter'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* )} */}
              </View>
            </View>

            <Toast />
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default Byarea;
