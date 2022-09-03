import * as React from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

export default function Home(){
  const [pin, setPin] = React.useState({
    latitude: 13.406,
    longitude: 123.3753,
  });

  // React.useEffect(() => {
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

  return (
    <View>
      {/* <MapView style={styles.map}
        initialRegion={{
        latitude: 13.406,
        longitutde: 123.3753,
        latitudeDeta: 0.005,
        longitudeDelta: 0.005,
      }}>
        <Marker coordinate={{latitide: 13.406, longitude: 123.3753}}
        pinColor='gold'
        draggable={true}/>
      </MapView> */}
    </View>
  )

}

const styles = StyleSheet.create({
  containter: {
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  text: {
    fontSize: 20,
    paddingLeft: 10,
  }
})