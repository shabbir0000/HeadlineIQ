import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import tw from 'twrnc';
import Screensheader from '../Universal/Screensheader';
// import Companycities from './Companycities';
// import Company from './Company';
// import Manageplans from '../../Components/Plans/Manageplans';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import Writers from './Writers';
// import HeadlineBar from '../Tabbar/HeadlineBar';
// import Others from './Others';
// import { t } from 'i18next';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
// import Companycities from './Companycities';
// import Manageplans from './Manageplans';
// import Manageriders from './Manageriders';
// import Managepromotion from './Managepromotion';
// import Areas from './Areas';
// import Othercharges from './Othercharges';
import Ridersreport from './Ridersreport';
import Byproduct from './Byproduct';
import Bysales from './Bysales';
import Byarea from './Byarea';
import Singledayreport from './Singledayreport';

const RMain = ({ navigation }) => {
  const Tab = createMaterialTopTabNavigator();
  const { darkMode } = useContext(AppContext);
  return (
    <View style={[{ backgroundColor: '#FEF0F0' }, tw`flex-1`]}>
      <Screensheader
        name={'ALL REPORTS'}
        left={5}
        onPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        initialRouteName="Riders Report"
        screenOptions={{
          tabBarScrollEnabled: true,
          swipeEnabled : false,
          tabBarActiveTintColor: 'grey',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarPressColor: 'transparent',
        }}
      >
        <Tab.Screen
          name="Riders Report"
          component={Ridersreport}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Riders Report' }}
        />

        <Tab.Screen
          name="By Products"
          component={Byproduct}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'By Product' }}
        />

        <Tab.Screen
          name="By Product Sale"
          component={Bysales}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'By Product Sale' }}
        />

        <Tab.Screen
          name="Sales Summery"
          component={Singledayreport}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Sales Summery' }}
        />

        {/* 
        

        <Tab.Screen
          name="Manage Writers"
          component={Writers}
          // initialParams={{email:email}}
          options={{tabBarLabel: 'Manage Writers'}}
        /> */}

        <Tab.Screen
          name="By Area Sale"
          component={Byarea}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'By Area Sale' }}
        />

        {/* <Tab.Screen
          name="Manage Riders"
          component={Manageriders}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Riders' }}
        />

        <Tab.Screen
          name="Manage Promotion"
          component={Managepromotion}
          // initialParams={{email:email}}
          options={{ tabBarLabel: 'Manage Promotion' }}
        /> */}
      </Tab.Navigator>
      {/* <HeadlineBar /> */}
    </View>
  );
};

export default RMain;
