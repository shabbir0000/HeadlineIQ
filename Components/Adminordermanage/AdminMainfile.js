import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import Screensheader from '../../Screens/Universal/Screensheader';
// import Userliveorder from './Userliveorder';
// import Usercompleteorder from './Usercompleteorder';
// import Userreturnedorder from './Userreturnedorder';
// import Customorders from './Customorders';
import Screensheader from '../Universal/Screensheader';
// import Userliveorder from './Adminliveorder';
// import Usercompleteorder from './Admincompleteorder';
// import Userreturnedorder from './Adminreturnedorder.';
// import Customorders from './Customorders';
import Adminliveorder from './Adminliveorder';
import Admincompleteorder from './Admincompleteorder';
import Adminreturnedorder from './Adminreturnedorder.';
import Dispatchorders from './Dispatchorders';
import Adminexpireorder from './Adminexpireorder';

const Tab = createMaterialTopTabNavigator();

const AdminMainfile = ({navigation}) => {
  return (
    <View style={[tw`flex-1`, {backgroundColor: '#FEF0F0'}]}>
      <Screensheader
        name={'Your Orders'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Live Orders"
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {backgroundColor: '#ffffff'},
          tabBarPressColor: 'transparent',
        }}>
        <Tab.Screen
          name="Live Orders"
          component={Adminliveorder}
          options={{tabBarLabel: 'Live Orders'}}
        />

         <Tab.Screen
          name="Expire Orders"
          component={Adminexpireorder}
          options={{tabBarLabel: 'Expire Orders'}}
        />

         <Tab.Screen
          name="Dispatch Order"
          component={Dispatchorders}
          options={{tabBarLabel: 'Dispatch Order'}}
        />

        <Tab.Screen
          name="Complete Order"
          component={Admincompleteorder}
          options={{tabBarLabel: 'Complete Order'}}
        />

        <Tab.Screen
          name="Reject Order"
          component={Adminreturnedorder}
          options={{tabBarLabel: 'Reject Order'}}
        />

        {/* <Tab.Screen
          name="Custom Orders"
          component={Customorders}
          options={{tabBarLabel: 'Techworker Booking'}}
        /> */}
      </Tab.Navigator>
    </View>
  );
};

export default AdminMainfile;
