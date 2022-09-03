import React from 'react';

import { View, Text, StyleSheet, ScrollView, Alert, Button, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dialog from 'react-native-dialog'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox'
import { color } from 'react-native-reanimated';

const Separator = () => (
  <View style={styles.separator} />
);

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddDialog: false,
      showDeleteDialog: false,
      username: 'not alex',
      cars: [],
      checked: 1,
    };
  }

  render() {

    const saveUsername = async (username) => {
      try{
        await AsyncStorage.setItem('@username', username)
        const currentUsername = this.state.username
        if (username !== currentUsername) {
          this.setState({username: username})
        }
      } catch (error) {
        console.log(error);
        Alert.alert (
          "Error saving username",
          [{ text: "OK"}]
        )
      }
    }

    const getUsername = async () => {
      try{
        const username = await AsyncStorage.getItem('@username')
        const currentUsername = this.state.username
        // console.log('current username is '+currentUsername);
        if (username !== null && username !== currentUsername) {
          // console.log('inside function: '+username)
          this.setState({ username: username })
          // return username
          // return
        }
        // else {
        //   return username
        // }
      } catch (error) {
        console.log(error);
        Alert.alert (
          "Error getting username",
          [{ text: "OK"}]
        )
      }
    }

    const saveCars = async (cars) => {
      try{
        await AsyncStorage.setItem('@cars', JSON.stringify(cars))
        const currentCars = JSON.stringify(this.state.cars)
        if (cars !== currentCars) {
          this.setState({cars: cars})
        }
      } catch (error) {
        console.log(error);
        Alert.alert (
          "Error saving cars",
          [{ text: "OK"}]
        )
      }
    }

    const getCars = async () => {
      try{
        const cars = await AsyncStorage.getItem('@cars')
        const currentCars = this.state.cars
        // console.log('current username is '+currentUsername);
        if (cars !== null && cars !== currentCars) {
          // console.log('inside function: '+username)
          this.setState({ cars: JSON.parse(cars) })
          // return username
          // return
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

    // const saveCars = async (cars) => {
    //   try{
    //     await AsyncStorage.setItem(
    //       'cars', cars
    //     )
    //   } catch (error) {
    //     console.log(error);
    //     Alert.alert (
    //       "Error saving cars",
    //       [{ text: "OK"}]
    //     )
    //   }
    // }

    // const getCars = async () => {
    //   try{
    //     const cars = await AsyncStorage.getItem('cars')
    //     if (cars !== null) {
    //       console.log(cars);
    //       return cars
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     Alert.alert (
    //       "Error getting cars",
    //       [{ text: "OK"}]
    //     )
    //   }
    // }

    // const changeUsername = (newUsername) => {
      
    //   // this.setState({username: newUsername})
    //   // this.setState({username: getUsername})
    //   saveUsername(newUsername)
    //   // Alert.alert(
    //   //   "Username Changed",
    //   //   "New username is "+this.state.username,
    //   //   [{ text: "OK"}]
    //   // );
    // }

    const promptAddCar = () => {
      this.setState({ showAddDialog: true })
    }

    const cancelAddCar = () => {
      this.setState({ 
        showAddDialog: false,
        newCarMake: '',
        newCarModel: ''})
    }

    const addCar = () => {
      const newCarMake = this.state.newCarMake
      const newCarModel = this.state.newCarModel
      // const cars = this.state.cars
      const newCar = {make: newCarMake, model: newCarModel}
      // this.setState({
      //   cars: this.state.cars.concat(newCar)
      // })
      saveCars(this.state.cars.concat(newCar))
      // console.log(this.state.cars)

      Alert.alert(
        'New Car',
        'New car is '+newCarMake+' '+newCarModel,
        [
          {text: 'OK'}
        ]
      )

      this.setState({ showAddDialog: false })
    }

    const promptDeleteCar = () => {
      this.setState({ showDeleteDialog: true })
    }

    const cancelDeleteCar = () => {
      this.setState({ showDeleteDialog: false })
    }

    const deleteCar = () => {

      Alert.alert(
        'Car Deleted',
        +newCarMake+' '+newCarModel+' deleted.',
        [
          {text: 'OK'}
        ]
      )

      this.setState({ showAddDialog: false })
    }

    // console.log('before save: '+this.state.username);
    // // saveUsername('alex')
    // console.log('after save: '+this.state.username);
    getUsername()
    // console.log('after get: '+this.state.username);
    // this.setState({ username: getUsername() })
    // const currentUsername = getUsername()

    // saveCars([{make: 'Hyundai', model: 'i30N'},
    //   {make: 'Mercedes-AMG', model: 'G63'}])
    getCars()
    // console.log(this.state.cars);
    
    return (
      <SafeAreaView style={styles.containter} title='Profile'>
        <Text style={styles.text}>Your Username</Text>
        <TextInput style={styles.input} defaultValue={this.state.username} onChangeText={entry => saveUsername(entry)} placeholder={'Enter username'}/>
        <Separator />
        <Text style={styles.text}>Your Cars</Text>
        <FlatList style={styles.list} data={this.state.cars} renderItem={({item}) => <Text>{item.make} {item.model}</Text>} />
        <Button title='Add car' onPress={promptAddCar}/>
        <Button title='Delete car' onPress={promptDeleteCar}/>

        <Dialog.Container visible={this.state.showAddDialog}>
          <Dialog.Title>Add car</Dialog.Title>
          <Dialog.Description>Enter new car details:</Dialog.Description>
          <Dialog.Input label='Make' onChangeText={newCarMake => this.setState({newCarMake})}></Dialog.Input>
          <Dialog.Input label='Model' onChangeText={newCarModel => this.setState({newCarModel})}></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={cancelAddCar} />
          <Dialog.Button label="Add" onPress={addCar}/>
        </Dialog.Container>

        <Dialog.Container visible={this.state.showDeleteDialog}>
          <Dialog.Title>Delete car</Dialog.Title>
          <Dialog.Description>Select cars to delete:</Dialog.Description>
          {this.state.cars.map((l, i) => (
            <CheckBox
              key={i}
              title={l}
              containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={this.state.checked === i + 1}
              onPress={() => this.setState({checked: (i + 1)})}
            />
          ))}
          <Dialog.Button label="Cancel" onPress={cancelDeleteCar} />
          <Dialog.Button label="Delete" onPress={deleteCar}/>
        </Dialog.Container>

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  containter: {
  },
  input: {
    // height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    // fontSize: 20,
  },
  text: {
    fontSize: 20,
    // paddingTop: 10,
    paddingLeft: 10,
  },
  button: {
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: {
    margin: 12,
    // borderWidth: 1,
    padding: 10,
  }
});

export default Profile;