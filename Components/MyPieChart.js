import React from 'react'
import { StyleSheet, Text, View, Dimensions} from 'react-native'
import { PieChart } from 'react-native-chart-kit';

export default function MyPieChart(props) {

    const [data, setData] = React.useState([]);
    const [color, setColors] = React.useState([]);

    React.useEffect(()=>{
        var pieData = [];
        console.log(props.data, "*******************123456***************" );
        // while (colors.length <= props.data.length) {
        //     do {
        //         var color = Math.floor((Math.random()*1000000)+1);
        //     } while (colors.indexOf(color) >= 0);
        //     colors.push("#" + ("000000" + color.toString(16)).slice(-6));
           
        // }
        var colors = [];
        props.data.forEach((item)=>{
            do {
                var color = Math.floor((Math.random()*1000000)+1);
            } while (colors.indexOf(color) >= 0);

            const tempData = {
                name : item.name ,       
                amount: item.amount ,  
                color: "#" + ("000000" + color.toString(16)).slice(-6),
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
            }
            pieData.push(tempData);
        })

        setColors(colors);
        setData(pieData);
        console.log(pieData, "Data");     
    }, [props.data])

    return (
        <>
            <PieChart
                // data={[
                //     {
                        // category : 'Seoul',
                        // population: 21500000,
                        // color: 'rgba(131, 167, 234, 1)',
                        // legendFontColor: '#7F7F7F',
                        // legendFontSize: 15,
                //     },
                //     {
                //         category: 'Toronto',
                //         population: 2800000,
                //         color: '#F00',
                //         legendFontColor: '#7F7F7F',
                //         legendFontSize: 15,
                //     },
                //     {
                //         category: 'New York',
                //         population: 8538000,
                //         color: 'black',
                //         legendFontColor: '#7F7F7F',
                //         legendFontSize: 15,
                //     },
                //     {
                //         category: 'Moscow',
                //         population: 11920000,
                //         color: 'rgb(0, 0, 255)',
                //         legendFontColor: '#7F7F7F',
                //         legendFontSize: 15,
                //     },
                // ]}
                data={data}
                width={350}
                height={150}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 4,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                accessor="amount"
                backgroundColork="transparent"
                paddingLeft="2"
                absolute //for the absolute number remove if you want percentage
            />
        </>
    )
}

const styles = StyleSheet.create({})
