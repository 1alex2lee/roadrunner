import React from 'react';

import { View, Text, StyleSheet, ScrollView, Button, PermissionsAndroid, Platform, Alert, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, Polyline } from 'react-native-maps';

var newWaypoints = []
var index = 0

class Record extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      isRecording: false,
      isAveraging: false,
      waypoints: [],
      index: 0,
      averageSpeed: 0,
      currentSpeed: 0,
      startTime: 0,
      latitude: '',
      longitude: '',
    }
  }

  // componentDidMount() {
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log(position);
  //         },
  //         (error) => {
  //           // See error code charts below.
  //           console.log(error.code, error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
  //   }
  // }

  render() {

    // var newWaypoints = []
    // var index = 0

    const startRecord = () => {
      this.setState({ 
        isRecording: true,
        waypoints: [],
        index: 0,
     })
     newWaypoints = []
     index = 0
    }

    const stopRecord = () => { setTimeout(() => {
      newWaypoints.shift()
      this.setState({ 
        isRecording: false,
        waypoints: newWaypoints,
      })
      // console.log('state');
      console.log(this.state.waypoints);
    }, 1000)
    }

    const startAvg = () => {
      let time = new Date()
      this.setState({ isAveraging: true, startTime: time.getSeconds() })
      console.log(time.getSeconds());
    }

    const stopAvg = () => {
      this.setState({ isAveraging: false })
    }

    const getLocation = () => {
      console.log('get location');
      Geolocation.getCurrentPosition(
        (position) => {
          // console.log(position);
          this.setState({
            latitude: JSON.stringify(position.coords.latitude),
            longitude: JSON.stringify(position.coords.longitude)
          })
        }
      )
    }

    const requestLocation = async () => {
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
            // console.log("Permission granted");
            getLocation();
            // Geolocation.getCurrentPosition((location) => {
            //   console.log(location);
            //   this.setState({location: location})})
          } else {
            // console.log("Permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const getSpeed = () => {
      console.log('get location');
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.setState({
            currentSpeed: JSON.stringify(position.coords.speed),
          })
        }
      )
    }

    const requestSpeed = async () => {
      if (Platform.OS === 'ios') {
        getSpeed();
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
            getSpeed();
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

    if (this.state.isRecording) {
      if (this.state.isAveraging){
        Alert.alert('Error', 'Already recording')
        this.setState({isAveraging: false})
      } else { setTimeout(() => {
        requestLocation()
        var waypoint = { latitude: this.state.latitude, longitude: this.state.longitude}
        // console.log(waypoint);
        // var oldWaypoints = this.state.waypoints
        // var oldWaypoints = newWaypoints
        // console.log('old waypoints');
        // console.log(waypoint)
        newWaypoints.push(waypoint)
        // console.log(newWaypoints);
        index = index + 1
        console.log('recorded waypoint '+index);
        // this.setState({ waypoints: newWaypoints, index: this.state.index+1})
        // console.log('waypoints state');
        // console.log(this.state.waypoints);
      }, 1000)
        // requestLocation()
      }
    }

    if (this.state.isAveraging) {
      if (this.state.isRecording){
        this.setState({isRecording: false})
        Alert.alert('Error', 'Already averaging')
      } else { setTimeout(() => 
        {
          let time = new Date()
          requestSpeed()
          this.setState({ averageSpeed: this.state.averageSpeed + ((this.state.currentSpeed)-this.state.averageSpeed)/(time.getSeconds()-this.state.startTime) })
        }, 1000)
        // let time = new Date()
        // requestSpeed()
        // this.setState({ averageSpeed: this.state.averageSpeed + ((this.state.currentSpeed)-this.state.averageSpeed)/(time.getSeconds()-this.state.startTime) })
        // this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
      }
    }
    
    // requestLocation()

    return (
      <ScrollView style={styles.containter} title='Create'>
        <Text style={styles.bigText}>Record New Route</Text>
        <Text>Your latitude is {this.state.latitude}</Text>
        <Text>Your longitude is {this.state.longitude}</Text>
        <MapView style={styles.map} showsUserLocation={true} 
          initialRegion={{latitude: this.state.latitde, longitude: this.state.longitude, latitudeDelta: 1, longitudeDelta: 1}}
          >
          <Polyline coordinates={this.state.waypoints}/>
        </MapView>
        <Button title='Start Recording' onPress={startRecord} disabled={this.state.isRecording || this.state.isAveraging}></Button>
        <Button title='Stop Recording' onPress={stopRecord} disabled={! this.state.isRecording}></Button>

        <Text style={styles.bigText}>Check Average Speed</Text>
        <Text style={styles.smallText}>Your average speed is:</Text>
        <Text style={styles.speedo}>{this.state.averageSpeed} m/s</Text>
        <Text style={styles.smallText}>Your current speed is:</Text>
        <Text style={styles.speedo}>{this.state.currentSpeed} m/s</Text>
        <Button title='Start Average Speed' onPress={startAvg} disabled={this.state.isAveraging || this.state.isRecording}></Button>
        <Button title='Stop Average Speed' onPress={stopAvg} disabled={! this.state.isAveraging}></Button>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  containter: {
  },
  bigText: {
    fontSize: 20,
    padding: 10,
  },
  smallText: {
    fontSize: 15,
    padding: 10,
  },
  speedo: {
    fontSize: 40,
    padding: 10,
    textAlign: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/4,
  },
});

export default Record;