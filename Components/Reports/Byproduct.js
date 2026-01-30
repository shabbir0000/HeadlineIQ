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
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/FIrebase';
import tw from 'twrnc';
import { width } from '../Universal/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { AppContext } from '../../AppContext';
import Toast from 'react-native-toast-message';

const Byproduct = () => {
  const { darkMode } = useContext(AppContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  // picker 4
  const [showPicker4, setShowPicker4] = useState(false); // To show/hide the date picker
  const [datename4, setdatename4] = useState(''); // To store the selected date
  const [selectedDate4, setSelectedDate4] = useState(new Date()); // To store the selected date

  // picker 5
  const [showPicker5, setShowPicker5] = useState(false); // To show/hide the date picker
  const [datename5, setdatename5] = useState(''); // To store the selected date
  const [selectedDate5, setSelectedDate5] = useState(new Date()); // To store the selected date

  // picker 6
  const [showPicker6, setShowPicker6] = useState(false); // To show/hide the date picker
  const [datename6, setdatename6] = useState(''); // To store the selected date
  const [selectedDate6, setSelectedDate6] = useState(new Date()); // To store the selected date

  // picker 7
  const [showPicker7, setShowPicker7] = useState(false); // To show/hide the date picker
  const [datename7, setdatename7] = useState(''); // To store the selected date
  const [selectedDate7, setSelectedDate7] = useState(new Date()); // To store the selected date

  const [isModalVisible1, setModalVisible1] = useState(false);
  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  const onChange3 = (event, date) => {
    setShowPicker4(false); // Hide the picker when a date is selected
    if (date) setSelectedDate4(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    // const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    // const day = date.getDate().toString(); // Add leading zero if needed

    // const formattedDate = `${month}:${day}:${year}`;
    // console.log('formatted date', formattedDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const combinedDateTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // setdatename4(combinedDateTime);
    // new Date(year, date.getMonth(), date.getDate(), hours, minutes, seconds);
    // setFinalDateTime(combinedDateTime);

    console.log(
      '📅 Combined DateTime (24-hour):',
      `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    );
    setdatename4(combinedDateTime);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const onChange4 = (event, date) => {
    setShowPicker5(false); // Hide the picker when a date is selected
    if (date) setSelectedDate5(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const combinedDateTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setdatename5(combinedDateTime);
    // new Date(year, date.getMonth(), date.getDate(), hours, minutes, seconds);
    // setFinalDateTime(combinedDateTime);

    console.log(
      '📅 Combined DateTime (24-hour):',
      `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    );
    setdatename5(combinedDateTime);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const onChange5 = (event, date) => {
    setShowPicker6(false); // Hide the picker when a date is selected
    if (date) setSelectedDate6(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    const day = date.getDate().toString(); // Add leading zero if needed

    const formattedDate = `${year}-${month}-${day}`;
    console.log('formatted date yy:mm:dd', formattedDate);

    setdatename6(formattedDate);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

  const onChange6 = (event, date) => {
    setShowPicker7(false); // Hide the picker when a date is selected
    if (date) setSelectedDate7(date); // Update the state with the selected date
    // Format the date to 'YYYY-MM-DD' using local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString(); // Month is 0-based, so add 1
    const day = date.getDate().toString(); // Add leading zero if needed

    const formattedDate = `${year}-${month}-${day}`;
    console.log('formatted date yy:mm:dd', formattedDate);
    setdatename7(formattedDate);
    // generateSalesReport(formattedDate);
    // fetchstatusDatabydate(formattedDate);
  };

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

      generateSalesReport(formattedDate);
      // generateSalesReportfromtodateandtime()
      // generateSalesReportfromtodateandtime(
      //   new Date('2025-10-23T19:00:00'), // 🕖 From 22 Oct 2025, 7 PM
      //   new Date('2025-10-24T04:00:00'), // 🕓 To 23 Oct 2025, 4 AM
      // );

      // Optional cleanup (agar kuch cancel karna ho)
      return () => {
        console.log('🔙 Screen unfocused');
      };
    }, []),
  );

  // 📊 Function: Generate Sales Report by Date
  //   const generateSalesReport = async (selectedDate = null) => {
  //     try {
  //       // ✅ Step 1: Date formatting
  //       const today = new Date();
  //       const formattedDate = selectedDate
  //         ? selectedDate
  //         : `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`;

  //       console.log('📅 Generating report for date:', formattedDate);

  //       // ✅ Step 2: Get all products
  //       const productsSnap = await getDocs(collection(db, 'Products'));
  //       const productNames = productsSnap.docs.map(doc => doc.data().name);

  //       // ✅ Step 3: Get all orders
  //       const ordersSnap = await getDocs(collection(db, 'Orders'));

  //       let productSales = {};

  //       // ✅ Step 4: Filter orders by date and calculate sales
  //       ordersSnap.docs.forEach(orderDoc => {
  //         const data = orderDoc.data();

  //         if (data.date === formattedDate && Array.isArray(data.orders)) {
  //           data.orders.forEach(orderItem => {
  //             const productName = orderItem.name;
  //             const qty = parseInt(orderItem.quantity) || 0;

  //             if (productSales[productName]) {
  //               productSales[productName] += qty;
  //             } else {
  //               productSales[productName] = qty;
  //             }
  //           });
  //         }
  //       });

  //       console.log("product sale",productSales);

  //       // ✅ Step 5: Add zero for products that didn’t sell today
  //       productNames.forEach(name => {
  //         if (!productSales[name]) {
  //           productSales[name] = 0;
  //         }
  //       });

  //       // ✅ Step 6: Convert productSales into array of objects
  //       const salesArray = Object.entries(productSales).map(
  //         ([product, count]) => ({
  //           product_name: product,
  //           count: count,
  //         }),
  //       );

  //       // ✅ Step 7: Find max and min sold products
  //       let maxProduct = null;
  //       let minProduct = null;

  //       if (salesArray.length > 0) {
  //         const sorted = [...salesArray].sort((a, b) => b.count - a.count);
  //         maxProduct = sorted[0];
  //         minProduct = sorted[sorted.length - 1];
  //       }

  //       // ✅ Step 8: Final Report
  //       const report = {
  //         date: formattedDate,
  //         sales: salesArray, // [{ product_name, count }]
  //         max: maxProduct,
  //         min: minProduct,
  //       };

  //       console.log('✅ Final Report:', report);
  //       return report;
  //     } catch (error) {
  //       console.error('❌ Error generating report:', error);
  //     }
  //   };

  const generateSalesReportfromtodateandtime = async (
    fromDateTime = null,
    toDateTime = null,
  ) => {
    try {
      if (!datename4 || !datename5 || !datename6 || !datename7) {
        Alert.alert('Validation Error', 'Please Select Date And Time Range');
        return;
      }

      // ✅ Step 1: Set default date-time (agar kuch na diya ho)
      const now = new Date();
      const start = fromDateTime ? new Date(fromDateTime) : now;
      const end = toDateTime ? new Date(toDateTime) : now;

      console.log(`📅 Generating report from ${start} to ${end}`);

      // ✅ Step 2: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 3: Query sirf wo orders jinka timestamp range me ho
      const ordersRef = collection(db, 'Orders');
      const q = query(
        ordersRef,
        where('timestamp', '>=', start),
        where('timestamp', '<=', end),
        where('orderstatus', '==', 'completed'),
      );
      const ordersSnap = await getDocs(q);

      let productSales = {};

      // ✅ Step 4: Process each order
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        if (data.timestamp && Array.isArray(data.orders)) {
          data.orders.forEach(orderItem => {
            const productName = orderItem.name;
            const qty = parseInt(orderItem.quantity) || 0;

            if (productSales[productName]) {
              productSales[productName] += qty;
            } else {
              productSales[productName] = qty;
            }
          });
        }
      });

      // ✅ Step 5: Add zero count for products that didn’t sell
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 6: Convert to array for display
      const salesArray = Object.entries(productSales).map(
        ([product, count]) => ({
          product_name: product,
          count: count,
        }),
      );

      // ✅ Step 7: Sort descending
      const sorted = [...salesArray].sort((a, b) => b.count - a.count);

      // ✅ Step 8: Min, Max, Top3
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3);

      // ✅ Step 9: Final report object
      const report = {
        from: start.toLocaleString(),
        to: end.toLocaleString(),
        sales: salesArray,
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      toggleModal1();
      console.log('my time date report', report);

      // console.log('✅ Final Report:', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  const generateSalesReportfromtodate = async (
    fromDate = null,
    toDate = null,
  ) => {
    try {
      if (!datename1 || !datename2) {
        Alert.alert('Validation Error', 'Please Select Date Range');
        return;
      }

      // ✅ Step 1: Format current date [month:day:year]
      const today = new Date();
      const defaultDate = `${
        today.getMonth() + 1
      }:${today.getDate()}:${today.getFullYear()}`;

      const startDate = fromDate ? fromDate : defaultDate;
      const endDate = toDate ? toDate : defaultDate;

      console.log(`📅 Generating report from ${startDate} to ${endDate}`);

      // ✅ Step 2: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 3: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));
      let productSales = {};

      // ✅ Step 4: Parse date correctly for [month:day:year]
      const parseDate = str => {
        const [month, day, year] = str.split(':').map(Number);
        return new Date(year, month - 1, day);
      };

      const start = parseDate(startDate);
      const end = parseDate(endDate);

      // ✅ Step 5: Filter orders within date range + completed status
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        if (
          data.date &&
          data.orderstatus === 'completed' && // ✅ Only include completed orders
          Array.isArray(data.orders)
        ) {
          const orderDate = parseDate(data.date);
          if (orderDate >= start && orderDate <= end) {
            data.orders.forEach(orderItem => {
              const productName = orderItem.name;
              const qty = parseInt(orderItem.quantity) || 0;

              if (productSales[productName]) {
                productSales[productName] += qty;
              } else {
                productSales[productName] = qty;
              }
            });
          }
        }
      });

      console.log('🧾 Product Sales:', productSales);

      // ✅ Step 6: Add zero count for products that didn’t sell
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 7: Convert to array for FlatList
      const salesArray = Object.entries(productSales).map(
        ([product, count]) => ({
          product_name: product,
          count: count,
        }),
      );

      // ✅ Step 8: Sort descending
      const sorted = [...salesArray].sort((a, b) => b.count - a.count);

      // ✅ Step 9: Min, Max, Top3
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3);

      // ✅ Step 10: Final report
      const report = {
        from: startDate,
        to: endDate,
        sales: salesArray,
        top3: top3Products,
        max: maxProduct,
        min: minProduct,
      };

      setProductdata(report);
      toggleModal();

      console.log('✅ Final Report:', report);
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
        : `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`;

      console.log('📅 Generating report for date:', formattedDate);

      // ✅ Step 2: Get all products
      const productsSnap = await getDocs(collection(db, 'Products'));
      const productNames = productsSnap.docs.map(doc => doc.data().name);

      // ✅ Step 3: Get all orders
      const ordersSnap = await getDocs(collection(db, 'Orders'));

      let productSales = {};

      // ✅ Step 4: Filter orders by date + completed status and calculate sales
      ordersSnap.docs.forEach(orderDoc => {
        const data = orderDoc.data();

        if (
          data.date === formattedDate &&
          data.orderstatus === 'completed' &&
          Array.isArray(data.orders)
        ) {
          data.orders.forEach(orderItem => {
            const productName = orderItem.name;
            const qty = parseInt(orderItem.quantity) || 0;

            if (productSales[productName]) {
              productSales[productName] += qty;
            } else {
              productSales[productName] = qty;
            }
          });
        }
      });

      console.log('🧾 Product Sales:', productSales);

      // ✅ Step 5: Add zero for products that didn’t sell today
      productNames.forEach(name => {
        if (!productSales[name]) {
          productSales[name] = 0;
        }
      });

      // ✅ Step 6: Convert productSales into array of objects
      const salesArray = Object.entries(productSales).map(
        ([product, count]) => ({
          product_name: product,
          count: count,
        }),
      );

      // ✅ Step 7: Sort salesArray (descending order)
      const sorted = [...salesArray].sort((a, b) => b.count - a.count);

      // ✅ Step 8: Find max, min, and top 3 products
      const maxProduct = sorted[0] || null;
      const minProduct = sorted[sorted.length - 1] || null;
      const top3Products = sorted.slice(0, 3); // top 3 selling

      // ✅ Step 9: Final Report
      const report = {
        date: formattedDate,
        sales: salesArray, // [{ product_name, count }]
        top3: top3Products, // top 3 best-selling products
        max: maxProduct, // single max product
        min: minProduct, // single min product
      };

      setProductdata(report);

      console.log('✅ Final Report:', report);
      return report;
    } catch (error) {
      console.error('❌ Error generating report:', error);
    }
  };

  return (
    <View style={tw`bg-white`}>
      <ScrollView>
        <View
          style={tw` flex-row h-14 w-80 mt-3 justify-between self-center items-center`}
        >
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <TouchableOpacity
              onPress={() => {
                const today = new Date();
                const formattedDate = `${
                  today.getMonth() + 1
                }:${today.getDate()}:${today.getFullYear()}`;

                generateSalesReport(formattedDate);

                setdatename('');
                setdatename1('');
                setdatename2('');
                setdatename4('');
                setdatename5('');
                setdatename6('');
                setdatename7('');
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
              onPress={() => setShowPicker(true)}
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

            <TouchableOpacity
              style={[
                tw`h-12 w-38 ml-5 justify-center items-center rounded-lg`,
                { backgroundColor: '#F16767' },
              ]}
              onPress={() => toggleModal1()}
            >
              <Text style={tw`text-white font-bold`}>
                {' '}
                {datename4 && datename5
                  ? selectedDate4.getHours().toString().padStart(2, '0') +
                    ':' +
                    selectedDate4.getMinutes().toString().padStart(2, '0') +
                    ' TO ' +
                    selectedDate5.getHours().toString().padStart(2, '0') +
                    ':' +
                    selectedDate5.getMinutes().toString().padStart(2, '0')
                  : 'Range Time Filter'}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
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
                    {Productdata?.max?.count}
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
                    {Productdata?.min?.count}
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
                    {Productdata?.top3[0]?.count}
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
                    {Productdata?.top3[1]?.count}
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
                    {Productdata?.top3[2]?.count}
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
                <Text style={tw`font-extrabold ml-2 text-orange-500 text-3xl`}>
                  {item.count}
                </Text>
                <Text
                  numberOfLines={1}
                  style={tw`font-extrabold ml-2 text-black text-lg`}
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
                      generateSalesReportfromtodate(datename1, datename2);
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
                    {'Select Dates And Time'}
                  </Text>
                </View>

                <View
                  style={tw` flex-col w-80 mt-3 justify-between self-center items-center`}
                >
                  <View
                    style={tw`flex-row items-center justify-between w-70 h-14`}
                  >
                    <TouchableOpacity
                      style={[
                        tw`h-12 w-30  justify-center items-center rounded-lg`,
                        { backgroundColor: '#F16767' },
                      ]}
                      onPress={() => setShowPicker6(true)}
                    >
                      <Text style={tw`text-white font-bold`}>
                        {' '}
                        {datename6 ? selectedDate6.toDateString() : 'From Date'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        tw`h-12 w-30  justify-center items-center rounded-lg`,
                        { backgroundColor: '#F16767' },
                      ]}
                      onPress={() => setShowPicker4(true)}
                    >
                      <Text style={tw`text-white font-bold`}>
                        {' '}
                        {datename4
                          ? selectedDate4
                              .getHours()
                              .toString()
                              .padStart(2, '0') +
                            ':' +
                            selectedDate4
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')
                          : 'From Time'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={tw`flex-row mt-5 items-center justify-between  w-70 h-14`}
                  >
                    <TouchableOpacity
                      style={[
                        tw`h-12 w-30  justify-center items-center rounded-lg`,
                        { backgroundColor: '#F16767' },
                      ]}
                      onPress={() => setShowPicker7(true)}
                    >
                      <Text style={tw`text-white font-bold`}>
                        {' '}
                        {datename7 ? selectedDate7.toDateString() : 'To Date'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        tw`h-12 w-30   justify-center items-center rounded-lg`,
                        { backgroundColor: '#F16767' },
                      ]}
                      onPress={() => setShowPicker5(true)}
                    >
                      <Text style={tw`text-white font-bold`}>
                        {' '}
                        {datename5
                          ? selectedDate5
                              .getHours()
                              .toString()
                              .padStart(2, '0') +
                            ':' +
                            selectedDate5
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')
                          : 'From Time'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {showPicker4 && (
                    <DateTimePicker
                      value={selectedDate4}
                      mode="time"
                      display="default"
                      onChange={onChange3}
                    />
                  )}

                  {showPicker5 && (
                    <DateTimePicker
                      value={selectedDate5}
                      mode="time"
                      display="default"
                      onChange={onChange4}
                    />
                  )}

                  {showPicker6 && (
                    <DateTimePicker
                      value={selectedDate6}
                      mode="date"
                      display="default"
                      onChange={onChange5}
                    />
                  )}

                  {showPicker7 && (
                    <DateTimePicker
                      value={selectedDate7}
                      mode="date"
                      display="default"
                      onChange={onChange6}
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
                      const datetime1 = new Date(`${datename6}T${datename4}`);
                      const datetime2 = new Date(`${datename7}T${datename5}`);
                      generateSalesReportfromtodateandtime(
                        datetime1,
                        datetime2,
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
      </ScrollView>
    </View>
  );
};

export default Byproduct;
