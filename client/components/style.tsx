import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 1080;

export const scale = (size:number) => (width / guidelineBaseWidth) * size;


export const Colors = {
    HoloPrimaryColor: '#1C4D63',
    HoloSecondaryColor: '#00B6E3',
    HoloAccentColor: '#428256',
    TheBusPrimaryColor: '#FFC107',
    TheBusSecondaryColor: '#000000',
    TheBusAccentColor: '#0D44B1',
};

export const textStyles = StyleSheet.create(
    {title: {
        fontFamily: "Nimbus Sans L"
    },
    h1:{
        fontFamily: "Nimbus Sans L",
        fontSize:scale(40)

    },
    h2:{
        fontFamily: "Nimbus Sans L",
        fontSize:scale(32)

    },
    h3:{
        fontFamily: "Nimbus Sans L",
        fontSize:scale(20)

    },
    p:{
        fontFamily:'Lato'
    },
    bold:{
        fontWeight: 'bold'
    }
})

// style={{width: '100%', height: '100%', padding: 10, background: 'white', boxShadow: '0px 4px 75px 3px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 25, justifyContent: 'flex-start', alignItems: 'center', gap: 30, display: 'inline-flex'}}

export const cardStyles = StyleSheet.create(
    {
        card:{
            padding:scale(10),
            flex: 1,
            borderRadius: scale(25),
            boxShadow: '0px 4px 75px 3px rgba(0, 0, 0, 0.25)',
            width:'100%',
            height:'100%',
            overflow:"hidden",
            
        }
}) 