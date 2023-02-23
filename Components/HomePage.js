import * as React from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    FlatList,

} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth, db, collection, getDocs, doc } from "../Firebase/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/core';
import Background from './Background';
import MyPieChart from "./MyPieChart.js"
import { darkGreen } from "./Constants"

const Tab = createMaterialTopTabNavigator();
const { height, width } = Dimensions.get('window');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function Income(props) {

    const [recordsFilter, setRecordsFilter] = React.useState("Day");
    const [datePicker, setDatePicker] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [month, setMonth] = React.useState(new Date().getMonth());
    const [year, setYear] = React.useState(new Date().getFullYear());
    const [period, setPeriod] = React.useState("");
    const [totalIncome, setTotalIncome] = React.useState(0.0);
    const [incomeRecords, setIncomeRecords] = React.useState([]);
    const [incomeRecordsDateWise, setIncomeRecordsDateWise] = React.useState([]);
    const [incomeRecordsMonthWise, setIncomeRecordsMonthWise] = React.useState([]);
    const [incomeRecordsYearWise, setIncomeRecordsYearWise] = React.useState([]);
    const [categoryWiseInc, setCategoryWiseInc] = React.useState([]);

    function onDateSelected(event, value) {
        const tempDate = new Date();
        if (value.getTime() > tempDate.getTime()) {
            alert("Please select valid date!!")
            setDate(tempDate);
        }
        setDate(value);
        setDatePicker(false);
    }

    React.useEffect(() => {
        console.log("\n\nInside Record Filter\n\n", recordsFilter);
        if (recordsFilter == "Day") {
            console.log("\n\Date\n\n", incomeRecords);
            filterRecordsDateWise();
        }
        else if (recordsFilter == "Month") {
            console.log("\n\nMonth\n\n", incomeRecords)
            filterRecordsMonthWise();
        }
        else {
            console.log("\n\YYear\n\n")
            filterRecordsYearWise();
        }

    }, [recordsFilter, date, month, year, incomeRecords]);

    React.useEffect(() => {
        fetchRecords();
    }, []);

    React.useEffect(() => {
        filterRecordsCategotyWise();
    }, [incomeRecordsDateWise, incomeRecordsMonthWise, incomeRecordsYearWise]);

    const getDateFormat = (timestamp) => {
        const tempDate = new Date(timestamp * 1000);
        // console.log(tempDate, "Templ Date");
        return tempDate.getDate() + ' / ' + (tempDate.getMonth() + 1) + ' / ' + tempDate.getFullYear();
    }
    const fetchRecords = async () => {
        try {
            const tempRecords = [];
            const querySnapshot = await getDocs(collection(doc(db, "User", auth.currentUser.uid), "Income"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const record = {
                    "key": doc.id,
                    "incAmount": data.incAmount,
                    "incDescription": data.incDescription,
                    "incCategory": data.incCategory,
                    "incDate": data.incDate
                };
                tempRecords.push(record);
            });
            setIncomeRecords(tempRecords);
            filterRecordsDateWise();
            console.log(incomeRecords, "data");
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const filterRecordsDateWise = () => {
        const tempRecords = [];
        console.log(incomeRecords, "Datewise *-----------");
        incomeRecords.forEach((incomeRecord) => {
            const recordDate = getDateFormat(incomeRecord.incDate.seconds);
            const desiredDate = date.getDate() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear();
            if (recordDate == desiredDate) {
                tempRecords.push(incomeRecord);
                console.log(incomeRecord, "Datewise");
            }
        })
        setIncomeRecordsDateWise(tempRecords);
        console.log(incomeRecordsDateWise, "Filtered Records")
    }
    const filterRecordsMonthWise = () => {
        const tempRecords = [];
        incomeRecords.forEach((incomeRecord) => {
            const recordMonth = new Date(incomeRecord.incDate.seconds * 1000).getMonth();
            if (recordMonth == month) {
                tempRecords.push(incomeRecord);
                console.log(incomeRecord, "MonthWise");
            }
        })
        setIncomeRecordsMonthWise(tempRecords);
        console.log(incomeRecordsMonthWise, "Filtered Records")
    }
    const filterRecordsYearWise = () => {
        const tempRecords = [];

        incomeRecords.forEach((incomeRecord) => {
            const recordYear = new Date(incomeRecord.incDate.seconds * 1000).getFullYear();
            if (recordYear == year) {
                tempRecords.push(incomeRecord);
                console.log(incomeRecord, "YearWise");
            }
        })
        setIncomeRecordsYearWise(tempRecords);
        console.log(incomeRecordsYearWise, "Filtered Records")
    }

    const filterRecordsCategotyWise = () => {
        const categoryWiseAmt = [];
        const category = [];
        if (recordsFilter == "Day") {
            incomeRecordsDateWise.forEach((incomeRecord) => {
                console.log(incomeRecord.incCategory, "Category Income");
                // const recordYear = new Date(incomeRecord.incDate.seconds*1000).getMonth();
                if (!category.includes(incomeRecord.incCategory)) {
                    category.push(incomeRecord.incCategory);
                    const data = { "name": incomeRecord.incCategory, "amount": Number(incomeRecord.incAmount) };
                    categoryWiseAmt.push(data);
                    // console.log(incomeRecord, "YearWise");
                }
                else {
                    console.log("Amount***");
                    categoryWiseAmt.forEach((item) => {
                        if (item.name == incomeRecord.incCategory) {
                            item.amount += Number(incomeRecord.incAmount);
                        }
                        console.log((item.name == incomeRecord.incCategory), "Amount***");
                    })
                }
            })
        }
        else if (recordsFilter == "Month") {
            incomeRecordsMonthWise.forEach((incomeRecord) => {
                console.log(incomeRecord.incCategory, "Category Income");
                // const recordYear = new Date(incomeRecord.incDate.seconds*1000).getMonth();

                if (!category.includes(incomeRecord.incCategory)) {
                    category.push(incomeRecord.incCategory);
                    const data = { "name": incomeRecord.incCategory, "amount": Number(incomeRecord.incAmount) };
                    categoryWiseAmt.push(data);
                    // console.log(incomeRecord, "YearWise");
                }
                else {
                    categoryWiseAmt.forEach((item) => {
                        if (item.name == incomeRecord.incCategory) {
                            item.amount += Number(incomeRecord.incAmount);
                        }
                        console.log((item.name == incomeRecord.incCategory), "Amount***");
                    })
                }
            })
        }
        else {
            incomeRecordsYearWise.forEach((incomeRecord) => {
                console.log(incomeRecord.incCategory, "Category Income");

                if (!category.includes(incomeRecord.incCategory)) {
                    category.push(incomeRecord.incCategory);
                    const data = { "name": incomeRecord.incCategory, "amount": Number(incomeRecord.incAmount) };
                    categoryWiseAmt.push(data);
                }
                else {
                    categoryWiseAmt.forEach((item) => {
                        if (item.name == incomeRecord.incCategory) {
                            item.amount += Number(incomeRecord.incAmount);
                        }
                        console.log(item.name, incomeRecord.incCategory, "Amount***")
                    })
                }

            })
        }

        setCategoryWiseInc(categoryWiseAmt);
        console.log(category);
        console.log(categoryWiseAmt, "Category------------------------------**********************************");
    }

    return (
        <>
            <View style={{ width: "100%" }}>
                <ImageBackground
                    source={require("../assets/background4.jpg")}
                    style={{
                        height: "100%",
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.records_filter}>
                            <TouchableOpacity onPress={() => { setRecordsFilter("Day") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Day</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={() => { setRecordsFilter("Month") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Month</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRecordsFilter("Year") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Year</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                                <Text>Period</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ backgroundColor: "lightgreen", borderRadius:5}}>
                            {(recordsFilter == "Day") && (<View style={styles.choose_filter_date}>
                                <TouchableOpacity onPress={() => setDatePicker(true)}>
                                    <Text>{date.getDate() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()}</Text>
                                </TouchableOpacity>
                            </View>)}
                            {(recordsFilter == "Month") && (<View style={styles.choose_filter}>
                                <TouchableOpacity disabled={month == 0 ? true : false} onPress={() => { setMonth(month - 1) }}>
                                    <Image
                                        source={require("../assets/previous.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                                <Text>{months[month]}</Text>
                                <TouchableOpacity disabled={month == 11 ? true : false} onPress={() => { setMonth(month + 1) }}>
                                    <Image
                                        source={require("../assets/next.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                            </View>)}
                            {(recordsFilter == "Year") && (<View style={styles.choose_filter}>
                                <TouchableOpacity disabled={year == 1 ? true : false} onPress={() => { setYear(year - 1) }}>
                                    <Image
                                        source={require("../assets/previous.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                                <TextInput keyboardType="numeric" onChangeText={(text) => {
                                    const tempYear = new Date().getFullYear();
                                    if (Number(text) && Number(text) <= tempYear) {
                                        setYear(Number(text))
                                    }
                                    else {
                                        alert("Enter valid year!!");
                                        setYear(tempYear);
                                        console.log(year)
                                    }
                                }}>{year}</TextInput>

                                <TouchableOpacity disabled={year == (new Date().getFullYear()) ? true : false} onPress={() => { setYear(year + 1) }}>
                                    <Image
                                        source={require("../assets/next.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                            </View>)}

                            {datePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode={"date"}
                                    is24Hour={true}
                                    onChange={onDateSelected}
                                />
                            )}
                        </View>
                        {((incomeRecordsDateWise.length == 0 && recordsFilter=="Day") || (incomeRecordsMonthWise.length == 0 && recordsFilter=="Month") || (incomeRecordsYearWise.length == 0 && recordsFilter=="Year")) && (
                            <View style={styles.no_records}>
                                <Text style={{fontWeight:"bold", fontSize:18}}>No Transactions Found!</Text>
                            </View>
                        )}
                       <View style={styles.total_amt}>
                                <MyPieChart data={categoryWiseInc} />
                        </View>
                        

      
                        
                    </View>

           {recordsFilter=="Day" && (<View style={styles.record_container}>

                        {incomeRecordsDateWise.length > 0 && (<FlatList
                            data={incomeRecordsDateWise}
                            renderItem={({ item }) =>
                                    <View style={styles.record}>
                                <View >
                                    <Text style = {styles.cat}>{item.incCategory}</Text>
                                    <Text style = {styles.amt}>+{item.incAmount}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.dt}>{getDateFormat(item.incDate.seconds)}</Text>
                                </View>
                                {/* <View>
                                    <TouchableOpacity  style={styles.details}>                               
                                     <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                                    </TouchableOpacity>
                                </View> */}
                                </View>
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    {recordsFilter=="Month" && (<View style={styles.record_container}>
                        {incomeRecordsMonthWise.length > 0 && (<FlatList
                            data={incomeRecordsMonthWise}
                            renderItem={({ item }) =>
                            <View style={styles.record}>
                                <View >
                                    <Text style = {styles.cat}>{item.incCategory}</Text>
                                    <Text style = {styles.amt}>+{item.incAmount}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.dt}>{getDateFormat(item.incDate.seconds)}</Text>
                                </View>
                                {/* <View>
                                    <TouchableOpacity  style={styles.details}>                               
                                     <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>    
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    {recordsFilter=="Year" && (<View style={styles.record_container}>

                        {incomeRecordsYearWise.length > 0 && (<FlatList
                            data={incomeRecordsYearWise}
                            renderItem={({ item }) =>
                            <View style={styles.record}>
                            <View >
                            <Text style = {styles.cat}>{item.incCategory}</Text>
                            <Text style = {styles.amt}>+{item.incAmount}</Text>
                        </View>
                        <View>
                            <Text style = {styles.dt}>{getDateFormat(item.incDate.seconds)}</Text>
                        </View>
                        {/* <View>
                            <TouchableOpacity  style={styles.details}>                               
                             <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                            </TouchableOpacity>
                        </View> */}
                                </View>
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    <View
                        style={{
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            right: 20,
                            bottom: 20
                        }}
                    >
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: "#006A42",
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                            onStartShouldSetResponder={() => {
                                props.navigation.navigate("AddIncome");
                            }}
                        >
                            <Image
                                source={require("../assets/add.png")}
                                style={{ width: 30, height: 30 }}
                                onPress={() => console.log("image pressed")}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </>
    );
}

function Expense(props) {
    const [recordsFilter, setRecordsFilter] = React.useState("Day");
    const [datePicker, setDatePicker] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [month, setMonth] = React.useState(new Date().getMonth());
    const [year, setYear] = React.useState(new Date().getFullYear());
    const [period, setPeriod] = React.useState("");
    const [totalExpense, setTotalExpense] = React.useState(0.0);
    const [expenseRecords, setExpenseRecords] = React.useState([]);
    const [expenseRecordsDateWise, setExpenseRecordsDateWise] = React.useState([]);
    const [expenseRecordsMonthWise, setExpenseRecordsMonthWise] = React.useState([]);
    const [expenseRecordsYearWise, setExpenseRecordsYearWise] = React.useState([]);
    const [categoryWiseExp, setCategoryWiseExp] = React.useState([]);


    function onDateSelected(event, value) {
        const tempDate = new Date();
        if (value.getTime() > tempDate.getTime()) {
            alert("Please select valid date!!")
            setDate(tempDate);
        }
        setDate(value);
        setDatePicker(false);
    }

    React.useEffect(() => {
        console.log("\n\nInside Record Filter\n\n", recordsFilter);
        if (recordsFilter == "Day") 
        {
            console.log("\n\Date\n\n", expenseRecords);
            filterRecordsDateWise();
        }
        else if (recordsFilter == "Month") {
            console.log("\n\nMonth\n\n", expenseRecords)
            filterRecordsMonthWise();
        }
        else {
            console.log("\n\YYear\n\n")
            filterRecordsYearWise();
        }
        
    }, [recordsFilter,date, month, year, expenseRecords]); 

    React.useEffect(() => {
        fetchRecords();
    }, []);

    React.useEffect(() => {
        filterRecordsCategotyWise();
    }, [expenseRecordsDateWise, expenseRecordsMonthWise, expenseRecordsYearWise]);

    const getDateFormat = (timestamp) =>{
        const tempDate = new Date(timestamp*1000);
        // console.log(tempDate, "Templ Date");
        return tempDate.getDate() + ' / ' + (tempDate.getMonth() + 1) + ' / ' + tempDate.getFullYear();
    }
    const fetchRecords = async() => {
        try {
            const tempRecords = [];
            const querySnapshot = await getDocs(collection(doc(db,"User",auth.currentUser.uid), "Expense"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const record = { 
                    "key":doc.id,
                    "expAmount": data.expAmount, 
                    "expDescription": data.expDescription, 
                    "expCategory": data.expCategory, 
                    "expDate": data.expDate 
                };
                tempRecords.push(record); 
            });
            setExpenseRecords(tempRecords);
            filterRecordsDateWise();
            console.log(expenseRecords, "data");
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const filterRecordsDateWise = () => {
        const tempRecords = [];
        console.log(expenseRecords, "Datewise *-----------");
        expenseRecords.forEach((expenseRecord) => {
            const recordDate = getDateFormat(expenseRecord.expDate.seconds);
            const desiredDate = date.getDate() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear();
            if(recordDate==desiredDate)
            {
                tempRecords.push(expenseRecord);
                console.log(expenseRecord, "Datewise");
            }
        })
        setExpenseRecordsDateWise(tempRecords);
        console.log(expenseRecordsDateWise, "Filtered Records")
    }
    const filterRecordsMonthWise = () => {
        const tempRecords = [];
        expenseRecords.forEach((expenseRecord) => {
            const recordMonth = new Date(expenseRecord.expDate.seconds*1000).getMonth();
            if(recordMonth==month)
            {
                tempRecords.push(expenseRecord);
                console.log(expenseRecord, "MonthWise");
            }
        })
        setExpenseRecordsMonthWise(tempRecords);
        console.log(expenseRecordsMonthWise, "Filtered Records")
    }
    const filterRecordsYearWise = () => {
        const tempRecords = [];
        
        expenseRecords.forEach((expenseRecord) => {
            const recordYear = new Date(expenseRecord.expDate.seconds*1000).getFullYear();
            if(recordYear==year)
            {
                tempRecords.push(expenseRecord);
                console.log(expenseRecord, "YearWise");
            }
        })
        setExpenseRecordsYearWise(tempRecords);
        console.log(expenseRecordsYearWise, "Filtered Records")
    }

    const filterRecordsCategotyWise = () => {
        const categoryWiseAmt = [];
        const category = [];
        if (recordsFilter == "Day") 
        {
            expenseRecordsDateWise.forEach((expenseRecord) => {
                console.log(expenseRecord.expCategory, "Category Expense");
                // const recordYear = new Date(expomeRecord.expDate.seconds*1000).getMonth();
                if(!category.includes(expenseRecord.expCategory))
                {
                    category.push(expenseRecord.expCategory);
                    const data = { "name" : expenseRecord.expCategory , "amount" : Number(expenseRecord.expAmount) };
                    categoryWiseAmt.push(data);
                    // console.log(expomeRecord, "YearWise");
                }
                else
                {
                    console.log("Amount***");
                    categoryWiseAmt.forEach((item)=>{
                        if(item.name==expenseRecord.expCategory )
                        {
                            item.amount += Number(expenseRecord.expAmount);
                        }
                        console.log((item.name==expenseRecord.expCategory), "Amount***");
                    })
                }
            })
        }
        else if (recordsFilter == "Month") {
            expenseRecordsMonthWise.forEach((expenseRecord) => {
                console.log(expenseRecord.expCategory, "Category Expense");
                // const recordYear = new Date(expomeRecord.expDate.seconds*1000).getMonth();
              
                if(!category.includes(expenseRecord.expCategory))
                {
                    category.push(expenseRecord.expCategory);
                    const data = { "name" : expenseRecord.expCategory , "amount" : Number(expenseRecord.expAmount) };
                    categoryWiseAmt.push(data);
                    // console.log(expomeRecord, "YearWise");
                }
                else
                {
                    categoryWiseAmt.forEach((item)=>{
                        if(item.name==expenseRecord.expCategory )
                        {
                            item.amount += Number(expenseRecord.expAmount);
                        }
                        console.log((item.name==expenseRecord.expCategory), "Amount***");
                    })
                }
            })
        }
        else 
        {
            expenseRecordsYearWise.forEach((expenseRecord) => {
                console.log(expenseRecord.expCategory, "Category Expense");
                
                if(!category.includes(expenseRecord.expCategory))
                {
                    category.push(expenseRecord.expCategory);
                    const data = { "name" : expenseRecord.expCategory , "amount" : Number(expenseRecord.expAmount) };
                    categoryWiseAmt.push(data);
                }
                else
                {
                    categoryWiseAmt.forEach((item)=>{
                        if(item.name==expenseRecord.expCategory )
                        {
                            item.amount += Number(expenseRecord.expAmount);
                        }
                        console.log(item.name,expenseRecord.expCategory, "Amount***")
                    })
                }
                
            })
        }
        
        setCategoryWiseExp(categoryWiseAmt);
        console.log(category);
        console.log(categoryWiseAmt, "Category------------------------------**********************************");
    }
    return (
        <>
            <View  style={{ width: "100%" }}>
                <ImageBackground
                    source={require("../assets/background4.jpg")}
                    style={{
                        height: "100%",
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.records_filter}>
                            <TouchableOpacity onPress={() => { setRecordsFilter("Day") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Day</Text>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={() => { setRecordsFilter("Month") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Month</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setRecordsFilter("Year") }}>
                                <Text style={{fontSize :17, fontWeight:'bold', color:'white'}}>Year</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                                <Text>Period</Text>
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ backgroundColor: "lightgreen", borderRadius:5}}>
                            {(recordsFilter == "Day") && (<View style={styles.choose_filter_date}>
                                <TouchableOpacity onPress={() => setDatePicker(true)}>
                                    <Text>{date.getDate() + ' / ' + (date.getMonth() + 1) + ' / ' + date.getFullYear()}</Text>
                                </TouchableOpacity>
                            </View>)}
                            {(recordsFilter == "Month") && (<View style={styles.choose_filter}>
                                <TouchableOpacity disabled={month == 0 ? true : false} onPress={() => { setMonth(month - 1) }}>
                                    <Image
                                        source={require("../assets/previous.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                                <Text>{months[month]}</Text>
                                <TouchableOpacity disabled={month == 11 ? true : false} onPress={() => { setMonth(month + 1) }}>
                                    <Image
                                        source={require("../assets/next.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                            </View>)}
                            {(recordsFilter == "Year") && (<View style={styles.choose_filter}>
                                <TouchableOpacity disabled={year == 1 ? true : false} onPress={() => { setYear(year - 1) }}>
                                    <Image
                                        source={require("../assets/previous.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                                <TextInput keyboardType="numeric" onChangeText={(text) => {
                                    const tempYear = new Date().getFullYear();
                                    if (Number(text) && Number(text) <= tempYear) {
                                        setYear(Number(text))
                                    }
                                    else {
                                        alert("Enter valid year!!");
                                        setYear(tempYear);
                                        console.log(year)
                                    }
                                }}>{year}</TextInput>

                                <TouchableOpacity disabled={year == (new Date().getFullYear()) ? true : false} onPress={() => { setYear(year + 1) }}>
                                    <Image
                                        source={require("../assets/next.png")}
                                        style={{ width: 15, height: 15 }}
                                        onPress={() => console.log("image pressed")}
                                    />
                                </TouchableOpacity>
                            </View>)}

                            {datePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode={"date"}
                                    is24Hour={true}
                                    onChange={onDateSelected}
                                />
                            )}
                        </View>
                        {((expenseRecordsDateWise.length == 0 && recordsFilter=="Day") || (expenseRecordsMonthWise.length == 0 && recordsFilter=="Month") || (expenseRecordsYearWise.length == 0 && recordsFilter=="Year")) && (
                            <View style={styles.no_records}>
                                <Text style={{fontWeight:"bold", fontSize:18}}>No Transactions Found!</Text>
                            </View>
                        )}
                        <View style={styles.total_amt}>
                            <MyPieChart data={categoryWiseExp}/>
                        </View>
                    </View>

                    {recordsFilter=="Day" && (<View style={styles.record_container}>

                        {expenseRecordsDateWise.length > 0 && (<FlatList
                            data={expenseRecordsDateWise}
                            renderItem={({ item }) =>
                                <View style={styles.record}>
                                    <View >
                                    <Text style = {styles.cat}>{item.expCategory}</Text>
                                    <Text style = {styles.amt}>-{item.expAmount}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.dt}>{getDateFormat(item.expDate.seconds)}</Text>
                                </View>
                                {/* <View>
                                    <TouchableOpacity  style={styles.details}>                               
                                     <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                                    </TouchableOpacity>
                                </View> */}
                                </View>
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    {recordsFilter=="Month" && (<View style={styles.record_container}>

                        {expenseRecordsMonthWise.length > 0 && (<FlatList
                            data={expenseRecordsMonthWise}
                            renderItem={({ item }) =>
                                <View style={styles.record}>
                                    <View >
                                    <Text style = {styles.cat}>{item.expCategory}</Text>
                                    <Text style = {styles.amt}>+{item.expAmount}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.dt}>{getDateFormat(item.expDate.seconds)}</Text>
                                </View>
                                {/* <View>
                                    <TouchableOpacity  style={styles.details}>                               
                                     <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                                    </TouchableOpacity>
                                </View> */}
                                </View>
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    {recordsFilter=="Year" && (<View style={styles.record_container}>

                        {expenseRecordsYearWise.length > 0 && (<FlatList
                            data={expenseRecordsYearWise}
                            renderItem={({ item }) =>
                                <View style={styles.record}>
                                    <View >
                                    <Text style = {styles.cat}>{item.expCategory}</Text>
                                    <Text style = {styles.amt}>+{item.expAmount}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.dt}>{getDateFormat(item.expDate.seconds)}</Text>
                                </View>
                                {/* <View>
                                    <TouchableOpacity  style={styles.details}>                               
                                     <Text style={{color: "white", fontSize: 15, fontWeight: 'bold'}}> Details </Text>
                                    </TouchableOpacity>
                                </View> */}
                                </View>
                            }
                            enableEmptySections={true}
                        />)}
                    </View>)}
                    <View
                        style={{
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            right: 20,
                            bottom: 20
                        }}
                    >
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: "#006A42",
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                            onStartShouldSetResponder={() => {
                                props.navigation.navigate("AddExpense");
                            }}
                        >
                            <Image
                                source={require("../assets/add.png")}
                                style={{ width: 30, height: 30 }}
                                onPress={() => console.log("image pressed")}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </>
    );
}

function MyTabs({ navigation }) {

    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "grey",
                tabBarStyle: {
                    backgroundColor: "white",
                    color: "green",
                    marginTop: insets.top,
                    fontSize:20
                },
                height: 100
            }}
        >
            <Tab.Screen name="Income" component={Income} />

            <Tab.Screen
                name="Expense"
                component={Expense}
                options={{ tabBarLabel: "Expense" }}
            />
        </Tab.Navigator>
    );
}


export default function HompePage(props) {
    const navigation = useNavigation();
    React.useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View style={styles.header_right}>
                    <TouchableOpacity onPress={() => { navigation.navigate("Visualisation"); }}>
                        <Image
                            source={require("../assets/visualization.png")}
                            style={{ width: 25, height: 25, alignSelf: "center" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signOutFromAcc}>
                        <Image
                            source={require("../assets/log-out.png")}
                            style={{ width: 25, height: 25, alignSelf: "center" }}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [props.navigation]);

    const signOutFromAcc = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
                console.log("Sign out");
            })
            .catch((error) => alert("Cannot signout from the application!!"));
    };
    return (
        // <NavigationContainer independent={true}>
        <View style={{ flex: 1, flexDirection: "column" }}>
            <MyTabs navigation={props.navigation} />
            {/* <Background></Background> */}
        </View>
        // </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    header_right: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: 75,
    },
    container: {
        backgroundColor: "white",
        margin: 10,
        padding: 10,
        borderRadius: 20,
        height: "40%",
    },
    records_filter: {
        flexDirection: 'row',
        justifyContent: "space-around",
        textAlign: "center",
        height: "15%",
        padding: 5,
        color:"black",
        backgroundColor: darkGreen,
        borderRadius:5,

    },
    choose_filter: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    choose_filter_date: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    total_amt: {
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
        padding: 10,
    },
    no_records :{
        alignItems: "center",
        padding : 10,
        fontWeight:"bold"
    },
    amt_circle: {
        width: 150,
        height: 150,

        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: 100,
        backgroundColor: 'skyblue',
        shadowColor: 'black',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        elevation: 10,

    },
    amt_circle_text: {
        color: "green",
        fontWeight: "bold",
        fontSize: 20
    },
    amt_heading: {
        color: "green",
        fontWeight: "bold",
        fontSize: 23,
        width: 100,
        textAlign: "center"
    },
    record_container:{
        marginLeft: 10,
        marginRight: 10,
        padding: 0,
        borderRadius: 20,
        height:350,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    record:{
        flexDirection: 'row',
        justifyContent: "space-around",
        backgroundColor: 'white',
        height:75,
        borderRadius:15,
        marginBottom:10,
        padding:15
    },
    cat: {
        color:'grey',
        fontSize:18
       },
       amt : {
        fontSize :22,
        fontWeight:'bold'
       },
       dt :{
        fontSize :15,
        marginTop:10,
        fontWeight:'bold'
       }
});
