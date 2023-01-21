import {
  ActivityIndicator,
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
  ImageBackground
} from "react-native";
// import DatePicker from 'react-native-datepicker';
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  storage,
} from '../Firebase/config';


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import uploadImg from "../assets/addImage.jpeg";
// import { TouchableOpacity } from 'react-native-web';
// import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import Btn from "./Btn";
import Background from "./Background";
import { darkGreen } from "./Constants";

const { width } = Dimensions.get("window");

export default function AddIncome() {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  const [category, setCategory] = useState([]);

  const [datePicker, setDatePicker] = useState(false);
  const [isCatModalVisible, setVisibilityOfCatModal] = useState(false);
  const [isImgModalVisible, setVisibilityOfImgModal] = useState(false);
  const [date, setDate] = useState(new Date());

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [mounted,setMounted] = useState(false);
  // if(!mounted)
  // {
  //   const catList = [];
  //   try {
  //     const querySnapshot = getDocs(collection(db, "IncCategory"));
  //     querySnapshot.forEach((doc) => {
  //       //   console.log(doc.id, JSON.stringify(doc.data()));
  //       catName = doc.data();
  //       getcat = { label: catName.IncCatName, value: catName.IncCatName };
  //       console.log(getcat);
  //       catList.push(getcat);
  //     });

  //     //   console.log(catList)
  //     catList.push({ label: "other", value: "other" });
  //     setCategory(catList);
  //     console.log(category);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }

  //   // const querySnapshot = getDocs(collection(db, "IncCategory"));
  //   //   const catList = [];

  //   //   querySnapshot.forEach(documentSnapshot => {
  //   //     catList.push({
  //   //       ...documentSnapshot.data(),
  //   //       key: documentSnapshot.id,
  //   //     });
  //   //   });

  //   // console.log(catList);
  //   //   setUsers(users);
    
  // }

  // useEffect(() => {
  //     console.log("Inside use-effect")
    
  //     addCategory();
  //   }, []);

  // const addCategory = async () => {
  //     const catList = [];
  //     try {
  //         const querySnapshot = await getDocs(collection(db, "IncCategory"));
  //         querySnapshot.forEach((doc) => {
  //           console.log(doc.id, JSON.stringify(doc.data()));
  //         catName = doc.data();
  //         getcat = { label: catName.IncCatName, value: catName.IncCatName };
  //         console.log(getcat);
  //         catList.push(getcat);
  //         });
  
  //         console.log(catList)
  //         catList.push({ label: "other", value: "other" });
  //         setCategory(catList);
  //         console.log(category);
  //     } catch (e) {
  //         console.error("Error adding document: ", e);
  //     }
  // }

  useEffect(()=>{
    const loadData=async () => {
      const catList = [];
      try {
        const querySnapshot = await getDocs(collection(db, "IncCategory"));
        querySnapshot.forEach((doc) => {
          //   console.log(doc.id, JSON.stringify(doc.data()));
          catName = doc.data();
          getcat = { label: catName.IncCatName, value: catName.IncCatName };
          console.log(getcat);
          catList.push(getcat);
        });
  
          // console.log(catList)
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

  // useEffect( () => {

  //     addCategory();
  //     console.log("Use effect");
  // //  setMounted(true);
  // }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  function showDatePicker() {
    setDatePicker(true);
  }

  function showTimePicker() {
    setTimePicker(true);
  }

  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }

  function onTimeSelected(event, value) {
    setTime(value);
    setTimePicker(false);
  }

  const [selectedCategory, setSelectedCategory] = useState("");

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const [newCat, setNewCat] = useState("");

  //   { label: 'Salary', value: 'Salary' },
  //   { label: 'Rent', value: 'Rent' },
  //   { label: 'Bonus', value: 'Bonus' },
  //   { label: 'Allowance', value: 'Allowance' },
  //   { label: 'other', value: 'other' }

  const get_category_list = async () => {
    const catList = [];
    try {
      const querySnapshot = await getDocs(collection(db, "IncCategory"));
      querySnapshot.forEach((doc) => {
        //   console.log(doc.id, JSON.stringify(doc.data()));
        catName = doc.data();
        getcat = { label: catName.IncCatName, value: catName.IncCatName };
        //   console.log(catName.IncCatName)
        catList.push(getcat);
      });

      //   console.log(catList)
      catList.map((getcat) => setCategory([...category, getcat]));
      console.log(category);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return catList;
  };

  const addCategoryToFD = async (value) => {
    try {
      const docRef = await addDoc(collection(db, "IncCategory"), {
        IncCatName: value,
      });

      const querySnapshot = await getDocs(collection(db, "income"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, JSON.stringify(doc.data()));
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getCategory = (value) => {
    try {
      console.log("value=" + JSON.stringify(value));
      setSelectedCategory(value);
    } catch (e) {
      console.log("error");
    }
  };

  const [pickedImagePath, setPickedImagePath] = useState(
    Image.resolveAssetSource(uploadImg).uri
  );

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    // const permissionResult =
    //   await ImagePicker.requestMediaLibraryPermissionsAsync();

    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this appp to access your photos!");
    //   return;
    // }

  //   const result = await ImagePicker.launchImageLibraryAsync();

  //   // Explore the result
  //   console.log(result);

  //   if (!result.cancelled) {
  //     setPickedImagePath(result.uri);
  //     console.log(result.uri);
  //   }
 };

  // // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    // const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    // if (permissionResult.granted === false) {
    //   alert("You've refused to allow this appp to access your camera!");
    //   return;
    // }

  //   const result = await ImagePicker.launchCameraAsync();

  //   // Explore the result
  //   console.log(result);

  //   if (!result.cancelled) {
  //     setPickedImagePath(result.uri);
  //     console.log(result.uri);
  //   }
  };

  const saveIncome = async () => {
    // try {
    //   if (amount == 0) {
    //     // Add a Toast on screen.
    //     let toast = Toast.show("Please enter amount.", {
    //       duration: Toast.durations.LONG,
    //     });

    //     // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    //     setTimeout(function hideToast() {
    //       Toast.hide(toast);
    //     }, 800);
    //   }
    //   else if(selectedCategory==""){
    //      // Add a Toast on screen.
    //      let toast = Toast.show("Please select category.", {
    //       duration: Toast.durations.LONG,
    //     });

    //     // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
    //     setTimeout(function hideToast() {
    //       Toast.hide(toast);
    //     }, 800);
    //   }
    //   else
    //   {
    //     if (pickedImagePath != Image.resolveAssetSource(uploadImg).uri) {
    //     //concerting image to blob image
    //     const blobImage = await new Promise((resolve, reject) => {
    //       const xhr = new XMLHttpRequest();
    //       xhr.onload = function () {
    //         resolve(xhr.response);
    //       };
    //       xhr.onerror = function () {
    //         reject(new TypeError("Network request failed"));
    //       };
    //       xhr.responseType = "blob";
    //       xhr.open("GET", pickedImagePath, true);
    //       xhr.send(null);
    //     });

    //     //set metadata of image
    //     /**@type */
    //     const metadata = {
    //       contentType: "image/jpeg",
    //     };

    //     // Upload file and metadata to the object 'images/mountains.jpg'
    //     const storageRef = ref(storage, "IncImages/" + Date.now());
    //     const uploadTask = uploadBytesResumable(
    //       storageRef,
    //       blobImage,
    //       metadata
    //     );

    //     // Listen for state changes, errors, and completion of the upload.
    //     uploadTask.on(
    //       "state_changed",
    //       (snapshot) => {
    //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //         const progress =
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log("Upload is " + progress + "% done");
    //         switch (snapshot.state) {
    //           case "paused":
    //             console.log("Upload is paused");
    //             break;
    //           case "running":
    //             console.log("Upload is running");
    //             break;
    //         }
    //       },
    //       (error) => {
    //         // A full list of error codes is available at
    //         // https://firebase.google.com/docs/storage/web/handle-errors
    //         switch (error.code) {
    //           case "storage/unauthorized":
    //             // User doesn't have permission to access the object
    //             break;
    //           case "storage/canceled":
    //             // User canceled the upload
    //             break;

    //           // ...

    //           case "storage/unknown":
    //             // Unknown error occurred, inspect error.serverResponse
    //             break;
    //         }
    //       },
    //       () => {
    //         // Upload completed successfully, now we can get the download URL
    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //           console.log("File available at", downloadURL);
    //         });
    //       }
    //     );
    //   }

    //   console.log(selectedCategory);
    //   const docRef = await addDoc(collection(db, "income"), {
    //     incAmount: amount,
    //     incDate: date,
    //     incCategory: selectedCategory,
    //     incDescription: description,
    //     incImage: pickedImagePath,
    //   });
    //   console.log("Document written with ID: ", docRef.id);

    //   const querySnapshot = await getDocs(collection(db, "income"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, JSON.stringify(doc.data()));
    //   });
    //   }
      
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  };

  
  return (
    <Background> 
      <Text style={styles.Title}>Add Income</Text>
      <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.container1}>
        <View style={styles.amt}>
          <Text style={styles.head}>Amount: </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
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

      <View style={styles.date}>
          <Text style={styles.head}>Date: </Text>
          {!datePicker && (
            <View style={{ marginBottom:10}}>
              <Pressable style={styles.dateButton} onPress={showDatePicker}>
                <Text style={styles.dateText}>{date.toDateString()}</Text>
              </Pressable>
            </View>
          )}
       </View>
       </View>

       <View style={styles.container1}>
          <Text style={styles.head1}>Select Category</Text>
          {/* <FlatList
        style={[
          {
            flexDirection: "row",
            alignContent: "space-between",
          },
        ]}
          numColumns={3}
          keyExtractor={(item) => item.id}
          data={category}
          renderItem={({item}) => (
            <Text style={styles.catItem} onPress= {({item})=>{getCategory({item})}}>{item.name}</Text>
          )}
          /> */}

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
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )}
          />
          </View> 

          {/* <FontAwesomeIcon icon={solid('user-secret')} /> */}
          {/* <Modal            
          animationType = {"fade"}  
          transparent = {false}  
          visible = {isCatModalVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
          
              <View style = {styles.modal}>  
              <TextInput 
                style={styles.input}
                placeholder='Enter Category'
                onChangeText= {(text)=>{setSelectedCategory(text)}}/>
              <Button title="Add Category" onPress = {() => {  
                 setVisibilityOfCatModal(!isCatModalVisible)
                 setCategory([...category,{ label: selectedCategory, value: selectedCategory }])
                 }}/>  
          </View>  
        </Modal>   */}

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
        </View>
         
          {/* <Image source = {{uri :pickedImagePath}}
    style = {{width: '100%', height: 200}} onPress={()=>{setVisibili}}></Image> */}
          {/* <Modal            
          animationType = {"fade"}  
          transparent = {false}  
          visible = {isImgModalVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
              <View style = {styles.modal}>  
                <Button onPress={showImagePicker} title="Select an image" />
                <Button onPress={openCamera} title="Open camera" />
              <Button title="Close" onPress = {() => {  
                 setVisibilityOfImgModal(!isImgModalVisible)
                 }}/>  
          </View>  
        </Modal>   */}

        <View style={styles.container2}>
         <Text style={styles.head}>Add note</Text>
        <TextInput
          placeholder="Description"
          style={styles.input1}
          onChangeText={(value) => {
            setDescription(value);
          }}
        />
      <Text style={styles.head1}>Add Image</Text>

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
                style={{ width: 130, height: 90, alignSelf:'center', marginTop:5 }}
                onPress={() => {
                  console.log("image clicked");
                  setVisibilityOfImgModal(true);
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      

      <TouchableOpacity
      onPress={saveIncome}
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
    <Text style={{color: "white", fontSize: 20, fontWeight: 'bold'}}> Save </Text>
    </TouchableOpacity>
    </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 680,
    width: 410,
   backgroundColor: "#fff",
   marginTop: 5,
 },

  mainContainer: {
    padding: 20,
    flex: 2,
  },

  container1: {
    width:'98%',
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
    width:'87%',
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
    paddingLeft:20
  },

  Title: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf:"center"
  },

  amt: {
      flexDirection:"row",
      justifyContent:"space-around",
      padding:15      
    },

    head: {
     // marginTop:15,
      fontWeight:"bold",
      fontSize: 16 ,
      color: darkGreen,
    },

    input: {
      borderRadius: 5, 
      color: darkGreen, 
      paddingHorizontal: 5,
      width: '60%', 
      height:30,
      backgroundColor: 'rgb(220,220, 220)',
      justifyContent:'space-around'
    },

  input1: {
      borderWidth: 1,
      borderColor: '#777',
      padding:10,
      width: 250,
      height:80,
      marginTop:10,
      marginBottom:15,
      textAlignVertical : "top",
      textAlign : 'left'
    },

    date: {
      flexDirection:"row",
      justifyContent:"space-around"
    },

    head1: {
      marginTop:12,
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

  dateText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "black",
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
  
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgButtonContainer: {
    width: 400,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  imageContainer: {
    padding: 30,
  },
  
  image: {
    width: 200,
    height: 10,
    resizeMode: "cover",
  },

  buttonContainer: {
    backgroundColor:'#33adff',
    padding:5,
  
    alignItems:'center',
    borderRadius:10,
    width:"85%",
    alignSelf:'center',
    fontWeight:"bold",
    fontSize:50,
    paddingLeft:30,
  },
  
  backImg: {
    height: "100%"
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