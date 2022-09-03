import React, { useState } from 'react';

import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, PermissionsAndroid, Button, Platform } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

class Home extends React.Component {
// export default function Home() {
  constructor (props){
    super(props)
    this.state = {
      open: false,
      value: null,
      cars: [],
      getCarsCount: 0,
      latitude: '',
      longitude: '',
    }
    // this.setState = this.setState.bind(this);
  }

  // setOpen(open) {
  //   this.setState({
  //     open
  //   });
  // }

  // setValue(callback) {
  //   this.setState(state => ({
  //     value: callback(state.value)
  //   }));
  // }

  // setItems(callback) {
  //   this.setState(state => ({
  //     cars: callback(state.cars)
  //   }));
  // }

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);


  render() {

    // const setCurrentLocation = async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== 'granted') {
    //     setErrorMsg('Permission to access location was denied');
    //     return;
    //   }
    //   let location = await Location.getCurrentPositionAsync({});
    //   setLocation(location);
    //   console.log(location);
    // }; 

    const setOpen = (open) => {
      this.setState({
        open
      });
    }
  
    const setValue = (callback) => {
      this.setState(state => ({
        value: callback(state.value)
      }));
    }
  
    const setItems = (callback) => {
      this.setState(state => ({
        cars: callback(state.value)
      }));
    }

    const getCars = async () => {
      try{
        const cars = await AsyncStorage.getItem('@cars')
        const parsedCars = JSON.parse(cars)
        const currentCars = this.state.cars
        if (cars !== null && cars !== currentCars) {
          var tempCars = []
          for (var i = 0; i < parsedCars.length; i++) {
            const parsedCars = JSON.parse(cars)
            const tempCar = {label: parsedCars[i].make+' '+parsedCars[i].model, value: i}
            tempCars.push(tempCar)
            // console.log(tempCars);
          }
          this.setState({ cars: tempCars })
          // console.log('inside getcars: '+this.state.cars);
        }
        // else {
        //   return cars
        // }
      } catch (error) {
        console.log(error);
        Alert.alert (
          "Error getting cars",
          [{ text: "OK"}]
        )
      }
    }
    
    if (this.state.getCarsCount == 0) {
      getCars()
      this.setState({ getCarsCount: 1 })
      // console.log('outside getcars '+this.state.cars);
    }
    // console.log(this.state.cars);
    // console.log(this.state.cars);
    // getCars()

    const getLocation = () => {
      console.log('get location');
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.setState({
            latitude: JSON.stringify(position.coords.latitude),
            longitude: JSON.stringify(position.coords.longitude)
          })
        }
      )
    }

    const requestLocation = async () => {
      // console.log('pressed');
      if (Platform.OS === 'ios') {
        getLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Roadrunner needs to access your location",
              message:""
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission granted");
            getLocation();
            // Geolocation.getCurrentPosition((location) => {
            //   console.log(location);
            //   this.setState({location: location})})
          } else {
            console.log("Permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
      
    };

    // Geolocation.getCurrentPosition((location) => {
    //   console.log(location);
    //   this.setState({location: location})})


    return (

      <View style={styles.containter} title='Home'>
        <Text style={styles.bigText}>Select car</Text>
        <DropDownPicker
            open={this.state.open}
            value={this.state.value}
            items={this.state.cars}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={styles.dropDown}
            style={styles.dropDown}
          />
        {/* <MapView style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={{latitude: 37.78825,longitude: -122.4324}} 
            title='Start'
            description='Run 1'
            pinColor='green'>
          </Marker>
          <Polyline coordinates={[
            {latitude: 37.78825,longitude: -122.4324},
            {latitude: 37.79,longitude: -122.44},
            {latitude: 37.80,longitude: -122.43},
          ]}/>
          <Marker coordinate={{latitude: 37.80,longitude: -122.43}} 
            title='End'
            description='Run 1'
            pinColor='red' />
        </MapView> */}
        <Button title='Get location' onPress={requestLocation} style={styles.button}/>
        <Text style={styles.smallText}>Your latitude is {this.state.latitude}</Text>
        <Text style={styles.smallText}>Your longitude is {this.state.longitude}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containter: {
    // backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bigText: {
    fontSize: 20,
    padding: 10,
  },
  smallText: {
    fontSize: 15,
    padding: 10,
  },
  dropDown: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    zIndex: 1000,
    elevation: 1000,
  },
  button: {
    zIndex: 0,
    elevation: 0,
  }
});

export default Home;