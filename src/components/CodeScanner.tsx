
import { useEffect, useState } from "react"
import { Button, View, Text, Vibration, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';

import { Camera, CameraView } from 'expo-camera';
import { useToast } from 'react-native-toast-notifications';
import Svg, { G, Path, Rect, Defs, Circle, Mask } from "react-native-svg";

import { addStudentId } from "../helpers/addStudentId";
import { clearTemporalStudentIds, selectSpreadsheetPage } from "../store/qr/qrSlice";
import { store, useAppDispatch, useAppSelector } from "../store/store";

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;


export const CodeScanner = () => {
    const { currentSpreadsheetPage, temporalStundetIds, online } = useAppSelector(state => state.qr);
    const dispatch = useAppDispatch();

    const toast = useToast();

    const temporalStudents = store.getState().qr.temporalStundetIds;
    const pendingExps = store.getState().qr.expedientesPormandar;
    const columnAData = store.getState().qr.columnAData;

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    const textDefault = 'Escanea para registrar';

    const [text, setText] = useState(textDefault);

    //Mask component position and height - Posición y tamaño del cuadrado blanco del scanner.
    const posx = `${WIDTH * .1}`;
    const posy = `${HEIGHT * .4}`;
    const width = `${WIDTH * .8}`;
    const height = `${HEIGHT * .4}`;

    const askForCamPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    }

    interface scanTypes {
        data: string,
        type: string,
    }

    const handleScan = ({ data, type }: scanTypes) => {
        const exp = store.getState().qr.columnAData;
        const exps = exp.map(item => String(item));
        setScanned(true);
        console.log(`Tipe: ${type}, Data: ${data}`);
        const validID = /^[1-9]+[0-9]{5}$/;
        if (!validID.test(data)||data.length>7){
            console.log('no valido');
            toast.show('Expediente No Valido', { type: 'warning', placement: 'bottom', style: { marginBottom: 40 }, duration: 2999 });
            setTimeout(() => {
                setText(
                    textDefault
                );
                setScanned(false);
            }, 3000);
            return;
        }
        if (temporalStundetIds.includes(data) || exps.includes(data)) {        
            toast.show('Ya se ha agregado este estudiante', { type: 'warning', placement: 'bottom', style: { marginBottom: 40 }, duration: 2999 });
            setTimeout(() => {
                setText(
                    textDefault
                );
                setScanned(false);
            }, 3000);
            return;
        }

        addStudentId(data, dispatch, currentSpreadsheetPage);
        toast.show('Se ha agregado un estudiante', { type: 'success', placement: 'bottom', style: { marginBottom: 40 }, duration: 2999 });
        Vibration.vibrate(600, false);
        setTimeout(() => {
            setText(
                textDefault
            );
            setScanned(false);
        }, 3000);
    }

    useEffect(() => {
        askForCamPermission();
    }, [])

    useEffect(() => {
        console.log(HEIGHT, WIDTH);
    }, [HEIGHT, WIDTH])

    if (hasPermission === null) {
        return (
            <Text>Pidiendo acceso a la camara ...</Text>
        )
    }

    if (hasPermission == false) {
        return (
            <>
                <Text>No hay permiso para la camara</Text>
                <Button title={'Dar Permiso'} onPress={askForCamPermission} />
            </>
        )
    }
    
    return (
        <>
            <SafeAreaView
                style={{flex: 1,}}
            />
            <CameraView
                style={styles.container}
                onBarcodeScanned={scanned ? undefined : handleScan}
            />
            <Svg width="100%" height="100%">
                    {/*Mascará del Scanner*/}
                    <Defs>
                        <Mask id="mask" x="0" y="0" width="100%" height="100%">
                            <Rect width="100%" height="100%" fill="#fff" />
                            <Rect x={posx} y={posy} width={width} height={height} fill="black" />
                        </Mask>
                    </Defs>
                    {/*Fin de la mascará*/}

                    <Rect width="100%" height="100%" fill="rgba(0,0,0,0.44)" mask="url(#mask)" />
                    
                    {/*Modifies the color inside and the border of the scanner - Modifica el color de fondo y linea del scanner*/}
                    {<Rect x={posx} y={posy} width={width} height={height} fill="transparent" stroke="white" strokeWidth="2" />}
                    <G>
                        <Rect x={posx} y={posy} width={width} height={height} fill="transparent" stroke="white" strokeWidth="2" />
                    </G>
                    {/*Fin cuadrito del scanner*/}
            </Svg>
            {/*Style view for the floating menu container.
               Will change the bottons size and position
               ------------------------------------------
               Vista de estilo del menú flotante que controla
               los botones y etiquetas del scanner*/}
            <View style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 20,

            }}>
                <View
                    style={styles.floatingMenuContainer}
                >
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={
                            () => {
                                dispatch(selectSpreadsheetPage(''));
                                dispatch(clearTemporalStudentIds());
                            }
                        }
                    >
                        <Image style={styles.backIcon} source={require('../../assets/back-white.png')} />
                    </TouchableOpacity>

                    <View style={styles.eventInfoContainer}>
                        <Text style={{ color: 'white' }}>Evento</Text>
                        <Text style={{ color: 'white', marginTop: HEIGHT*0.02, fontSize: WIDTH*0.049 }}>{currentSpreadsheetPage}</Text>
                    </View>

                    <View style={styles.onlineStatusContainer}>
                        <Image
                            style={styles.onlineStatusIcon}
                            source={online ? require('../../assets/wifi-white.png') : require('../../assets/offline.png')}
                        />
                    </View>
                </View>
                <View style={styles.textScan}>
                    <Text style={{ color: 'white', fontSize: WIDTH*0.05, textAlign: 'center'}}>{text}</Text>
                </View>
            
            </View>
        </>


    )
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        flex: 1,
        position: 'absolute',
    },
    floatingMenuContainer: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 10,
        marginTop: -30,
        padding: 0,
        paddingHorizontal: 24,
        top: '20%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        width: '10%',
        height: '28%',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    backIcon: {
        width: '50%',
        height: 16,
        resizeMode: 'contain'
    },
    eventInfoContainer: {
        width: '50%',
        height: 60,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    onlineStatusContainer: {
        width: '10%',
        height: '28%',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineStatusIcon: {
        width: '50%',
        height: 16,
        marginBottom: 4,
        resizeMode: 'contain'
    },

    textScan: {
        textAlign: 'center',
        top: '20%',
    },
    mainScan: {
        alignContent: 'center',
        justifyContent: 'space-around',
        // border: 1,
        //borderWidth: 5,
        borderColor: 'red',
    },
})