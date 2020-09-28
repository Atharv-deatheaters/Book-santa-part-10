import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar}from 'react-native-elements'
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker'
export default class CustomSideBarMenu extends Component{
constructor(){
  super()
  state = {
    userId:firebase.auth().currentUser.email,
    image:"#",
    name:'',
    docId:"",
    
  }
}
uploadImage= async(uri, imageName) =>{
var response = await fetch(uri);
var blob = await response.blob();

var ref = await firebase.storage().ref().child("user_profiles/" +imageName);
return ref.put(blob).then((response) =>{
  this.fetchImage(imageName);
})
}

fetchImage = (imageName)=>{
  var ref = await firebase.storage().ref().child("user_profiles/" +imageName);
  storageRef.getDownloadURL().then((url)=>{
    this.setState({image :url})
  })
}
selectPicture= async() =>{
  const {cancelled, uri}= await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!cancelled) {
    this.setState({ image: uri });
  }
}
getUserProfile() {
  db.collection("users")
    .where("email_id", "==", this.state.userId)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.setState({
          name: doc.data().first_name + " " + doc.data().last_name,
          docId: doc.id,
          image: doc.data().image,
        });
      });
    });
}

componentDidMount() {
  this.fetchImage(this.state.userId);
  this.getUserProfile();
}


  render(){
    return(     
      <View style={{flex:1}}>
         <Avatar 
         rounded
         source = {{uri:this.state.image}}
         onPress= {()=> this.selectPicture()}
         showEditButton
         />
         <Text>{this.state.name}</Text> 
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
