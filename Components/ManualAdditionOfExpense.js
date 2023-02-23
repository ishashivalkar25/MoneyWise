import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Pressable,
  Dimensions,
  Modal,
  Image,
  TouchableOpacity,
  ImageBackground, 
  ScrollView
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  storage,
  doc,
  auth
} from '../Firebase/config';


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import uploadImg from "../assets/uploadReceiptIcon.png";
// import { TouchableOpacity } from 'react-native-web';
import * as ImagePicker from "react-native-image-picker";
import Toast from "react-native-root-toast";
import Btn from "./Btn";
import Background from "./Background";
import { darkGreen } from "./Constants";
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function ManualAdditionOfExpense(props) {

  const [category, setCategory] = useState([]);
  const [datePicker, setDatePicker] = useState(false);
  const [isCatModalVisible, setVisibilityOfCatModal] = useState(false);
  const [isImgModalVisible, setVisibilityOfImgModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [mounted,setMounted] = useState(false);
  

  useEffect(()=>{
    const loadData=async () => {
      const catList = [];
      try {
        const querySnapshot = await getDocs(collection(db, "ExpCategory"));
        querySnapshot.forEach((doc) => {
          //   console.log(doc.id, JSON.stringify(doc.data()));
          const catName = doc.data();
          getcat = { label: catName.ExpCatName, value: catName.ExpCatName };
          console.log(getcat);
          catList.push(getcat);
        });

        catList.push({ label: "other", value: "other" });
        setCategory(catList);
        // console.log(category);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
     setMounted(true);
    }

    loadData();
  }
    , []);

  
  function showDatePicker() {
    setDatePicker(true);
  }


  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }

  const [selectedCategory, setSelectedCategory] = useState("");

  const [pickedImagePath, setPickedImagePath] = useState(
    Image.resolveAssetSource(uploadImg).uri
  );

  // This function is triggered when the "Select an image" button pressed
const showImagePicker = async () => {


  const result = await ImagePicker.launchImageLibrary();
  console.log(result.assets[0].uri, "file");
  setPickedImagePath(result.assets[0].uri);
  
};

// // This function is triggered when the "Open camera" button pressed
const openCamera = async () => {
  // Ask the user for the permission to access the camera
  
  const result = await ImagePicker.launchCamera();
  console.log(result.assets[0].uri, "file");
  setPickedImagePath(result.assets[0].uri);

};

const saveExpense = async () => {
  try {
    if (amount == 0) {
      // Add a Toast on screen.
      let toast = Toast.show("Please enter amount.", {
        duration: Toast.durations.LONG,
      });

      // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 800);
    }
    else if(selectedCategory==""){
       // Add a Toast on screen.
       let toast = Toast.show("Please select category.", {
        duration: Toast.durations.LONG,
      });

      // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 800);
    }
    else
    {
      if (pickedImagePath != Image.resolveAssetSource(uploadImg).uri) {
      //concerting image to blob image
      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", pickedImagePath, true);
        xhr.send(null);
      });

      //set metadata of image
      /**@type */
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "ExpImages/" + Date.now());
      const uploadTask = uploadBytesResumable(
        storageRef,
        blobImage,
        metadata
      );

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }

    console.log(selectedCategory);
    if(pickedImagePath != Image.resolveAssetSource(uploadImg).uri)
      {
        const docRef = await addDoc(collection(doc(db,"User",auth.currentUser.uid), "Expense"), {
          expAmount: amount,
          expDate: date,
          expCategory: selectedCategory,
          expDescription: description,
          expImage: pickedImagePath,
        });
      }
      else{
        const docRef = await addDoc(collection(doc(db,"User",auth.currentUser.uid), "Expense"), {
          expAmount: amount,
          expDate: date,
          expCategory: selectedCategory,
          expDescription: description
        });
      }

    const querySnapshot = await getDocs(collection(db, "expense"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, JSON.stringify(doc.data()));
    });
    }

    alert("Record Added Successfully");
    props.navigation.replace("HomePage");
    
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};



  return (
    <ImageBackground
        source={require('../assets/background4.jpg')}
        style={{width: width, height: height, marginTop:insets.top}}
      >
      <Text style={styles.Title}>Add Expense</Text>
      <View style={styles.container}>

      <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.container1}>
        <View style={styles.inputPair}>
          <Text style={styles.head}>Amount:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.inputText}
            onChangeText={setAmount}
          />
          </View>

          {datePicker && (
            <DateTimePicker
              value={date}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={onDateSelected}
              style={styles.datePicker}
            />
          )}

      <View style={styles.inputPair}>
          <Text style={styles.head}>Date: </Text>
          {!datePicker && (
            <View style={styles.inputText}>
              <Pressable style={styles.dateButton} onPress={showDatePicker}>
                <Text>{date.getDate() + ' / '+ (date.getMonth()+1) + ' / ' +date.getFullYear()}</Text>
              </Pressable>
            </View>
          )}
       </View>
       </View>

       <View style={styles.container1}>
          <Text style={styles.headCenter}>Select Category</Text>

          <Dropdown

            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={category}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Category"
            searchPlaceholder="Search..."
            value={selectedCategory}
            onChange={(item) => {
              if (item.value != "other") setSelectedCategory(item.value);
              else {
                setVisibilityOfCatModal(true);
              }
            }}
            // renderLeftIcon={() => (
            //   <AntDesign
            //     style={styles.icon}
            //     color="black"
            //     name="Safety"
            //     size={20}
            //   />
            // )}
          />
          </View>

         
          <Modal
            animationType="slide"
            transparent
            visible={isCatModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={() => {
              setVisibilityOfCatModal(!isCatModalVisible);
            }}
          >
            <View style={styles.viewWrapper}>
              <View style={styles.modalView}>
                <TextInput
                  placeholder="Enter Category"
                  style={styles.textInput}
                  onChangeText={(value) => {
                    setSelectedCategory(value);
                  }}
                />

                {/** This button is responsible to close the modal */}
                <Button
                  title="Add Category"
                  onPress={() => {
                    setVisibilityOfCatModal(!isCatModalVisible);
                    setCategory([
                      ...category,
                      { label: selectedCategory, value: selectedCategory },
                    ]);
                    // addCategoryToFD(selectedCategory);
                  }}
                />
              </View>
            </View>
          </Modal>

        <View style={styles.container2}>
         <Text style={styles.head}>Add note</Text>
        <TextInput
          placeholder="Description"
          style={styles.input1}
          onChangeText={(value) => {
            setDescription(value);
          }}
        />
      <Text style={styles.headCenter}>Add Image</Text>

          <Modal
            animationType="slide"
            transparent
            visible={isImgModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={() => {
              setVisibilityOfCatModal(!isImgModalVisible);
            }}
          >
            <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
                <TouchableOpacity onPress={showImagePicker} style={styles.selImg}>
                   <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Upload image </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openCamera} style={styles.selImg}>
                   <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Take Photo </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setVisibilityOfImgModal(!isImgModalVisible); }}>
                   <Text style={{color: darkGreen, fontSize: 15, marginTop:30}}> Close </Text>
                </TouchableOpacity>
            </View>
          </View>
          </Modal>
          <TouchableOpacity
            onPress={() => {
              console.log("image clicked");
              setVisibilityOfImgModal(true);
            }}
          >
            {pickedImagePath !== "" && (
              <Image
                source={{ uri: pickedImagePath }}
                style={{ width: 50, height: 50, margin:15, alignSelf:'center'}}
                onPress={() => {
                  console.log("image clicked");
                  setVisibilityOfImgModal(true);
                }}
              />
            )}
          </TouchableOpacity>
        </View>


      <TouchableOpacity
      onPress={saveExpense}
      style={{
      backgroundColor: darkGreen,
      borderRadius: 200,
      alignItems: 'center',
      width: 250,
      paddingVertical: 5,
      marginVertical: 10,
      alignSelf:'center',
      //marginTop:30,

    }}>
    <Text style={{color: "white", fontSize: 20, fontWeight: 'bold', margin:0}}> Save </Text>
    </TouchableOpacity>
    </ScrollView>
    </View>
    </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: height*0.7,
    width: width,
   backgroundColor: "#fff",
   marginTop: 5,
 },

  mainContainer: {
    padding: 25,
    flex: 1,
    height:"100%",
    justifyContent: "space-between"
  },

  container1: {
    width:"100%",
    alignSelf: "center",
    borderRadius:15,
    shadowOpacity:0.5,
    shadowColor:"black",
    shadowOffset:{
      height:5,
      width:5
    },
    elevation:5,
    backgroundColor:"white",
    marginTop:20,
  },

  container2: {
    width:"100%",
    alignSelf: "center",
    borderRadius:15,
    shadowOpacity:0.5,
    shadowColor:"black",
    shadowOffset:{
   // height:5,
    //width:5
    },

    elevation:5,
    backgroundColor:"white",
    marginTop:30,
    paddingTop:5,
    paddingLeft:20,
    paddingRight:20,
  },
  container_btn_block:{
    flexDirection: 'row',
    paddingBottom : 10 ,
    paddingTop:10,
    justifyContent: "space-around",
  },
  container2_btn:{
    padding : 15,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis:100,
    borderRadius:10,
    backgroundColor:"#841584",
    color : "white",
    width : 150,
    margin: 5,
  },

  Title: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf:"center",
  },

  inputPair: {
      flexDirection:"row",
      justifyContent:"space-between",
      padding:10
    },

    head: {
     // marginTop:15,
      fontWeight:"bold",
      fontSize: 16 ,
      color: darkGreen,
    },

    inputText: {
      borderRadius: 5,
      color: darkGreen,
      paddingHorizontal: 5,
      width: '60%',
      height:35,
      backgroundColor: 'rgb(220,220, 220)',
    },

  input1: {
      borderWidth: 1,
      borderColor: '#777',
      borderRadius:10,
      padding:10,
      width: "100%",
      height:80,
      marginTop:10,
      marginBottom:15,
      textAlignVertical : "top",
      textAlign : 'left'
    },

    headCenter: {
      marginTop:10,
      fontWeight:"bold",
      alignSelf: "center",
      color: darkGreen,
      fontSize:16
    },

    dropDownStyle:{
      width:'85%',
      backgroundColor:'rgba(0,0,0,0.2)',
      padding:5,
      alignSelf: "center",
      borderRadius:6,
      justifyContent:'space-between',
      alignItems:'center'
    },

    dropDownIcon:{
      resizeMode: 'contain',
    },

  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 300,
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: 80,
    marginLeft: 40,
  },

  //cat modal styles
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },

  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },

  // text: {
  //   fontSize: 25,
  //   color: 'red',
  //   padding: 3,
  //   marginBottom: 10,
  //   textAlign: 'center'
  // },

  // Style for iOS ONLY...
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 50,
    display: "flex",
  },

  dateLabel: {
    marginTop: 15,
  },

  dateButton: {
padding:7,
alignSelf: "center",
borderRadius:5,
flexDirection:'row',
width:180,
alignItems:'center',
backgroundColor: 'rgb(220,220, 220)',
},

 
  catItem: {
    padding: 10,
    backgroundColor: "skyblue",
    fontSize: 14,
    marginHorizontal: 10,
    marginTop: 24,
  },

  dropdown: {
  margin: 10,
  width:'85%',
  backgroundColor:'rgba(0,0,0,0.2)',
  padding:5,
  alignSelf: "center",
  borderRadius:6,
  // flexDirection:'row',
  alignItems:'center'
},

  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  selImg :{
    backgroundColor: darkGreen,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
    paddingVertical: 5,
    marginVertical: 10,
    alignSelf:'center',
    marginTop:5,
  }
});