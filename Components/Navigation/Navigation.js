import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import Forget from '../Auth/Forget';
import Newpass from '../Auth/Newpass';
import Onboard from '../Welcome/Onboard';
import Verify from '../Auth/Verify';
import Tabbar from './Tabbar';
import Addplan from '../Adminmanage/Addplan';
import Addrider from '../Adminmanage/Addrider';
import Updateprofile from '../Mainscreens/Updateprofile';
import Productdetail from '../Mainscreens/Productdetail';
import Vieworder from '../Mainscreens/Vieworder';
import Viewuserorder from '../Mainscreens/Viewuserorder';
import Cart from '../Mainscreens/Cart';
import Allproduct from '../Mainscreens/Allproduct';
import Categoryproducts from '../Mainscreens/Categoryproducts';
import Viewadminorder from '../Adminordermanage/Viewadminorder';
import Findrider from '../Adminordermanage/Findrider';
import Rideradminorder from '../Ridermanage/Rideradminorder';
import ManageAddress from '../Mainscreens/ManageAddress';
import AddAddress from '../Mainscreens/AddAddress';
import ViewRiderReport from '../Reports/ViewRiderReport';
import ViewAdminorders from '../Mainscreens/ViewAdminorders';
import Viewriderorder from '../Mainscreens/Viewriderorder';
import MyRiderorders from '../Ridermanage/MyRiderorders';
import Customerdetail from '../Mainscreens/Customerdetail';
import ShowProductbystatus from '../Mainscreens/ShowProductbystatus';
import Home_Screen from '../Main_Screens/Home_Screen';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Tabbar" component={Tabbar} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="Addrider" component={Addrider} />
        <Stack.Screen name="Updateprofile" component={Updateprofile} />
        <Stack.Screen name="Productdetail" component={Productdetail} />
        <Stack.Screen name="Vieworder" component={Vieworder} />
        <Stack.Screen name="Viewuserorder" component={Viewuserorder} />
        <Stack.Screen name="cart" component={Cart} />
        <Stack.Screen name="Allproduct" component={Allproduct} />
        <Stack.Screen name="Categoryproducts" component={Categoryproducts} />
        <Stack.Screen name="ViewAdminorders" component={ViewAdminorders} />
        <Stack.Screen name="Viewriderorder" component={Viewriderorder} />
        <Stack.Screen name="MyRiderorders" component={MyRiderorders} />
        <Stack.Screen name="Customerdetail" component={Customerdetail} />
         <Stack.Screen name="ShowProductbystatus" component={ShowProductbystatus} />
        <Stack.Screen name="Viewadminorder" component={Viewadminorder} />
        <Stack.Screen name="Findrider" component={Findrider} />
        <Stack.Screen name="Rideradminorder" component={Rideradminorder} />
        <Stack.Screen name="ManageAddress" component={ManageAddress} />
        <Stack.Screen name="ViewRiderReport" component={ViewRiderReport} />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="Newpass" component={Newpass} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Addplan" component={Addplan} />
         <Stack.Screen name="Home_Screen" component={Home_Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
