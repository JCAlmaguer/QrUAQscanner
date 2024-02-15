import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { selectSpreadsheetPage, setColumnAData, addTemporalSpreadSheet, removeColumnAData } from '../store/qr/qrSlice';
import { useAppDispatch, useAppSelector, store } from '../store/store';
import { Dimensions } from 'react-native';
import { useLoadColumnAData } from '../hooks/useLoadSheetColumnAData';
import  ColumnADataList  from './ColumnADataList';
import ColumnCheckList from './ColumnCheckList';
import { useUploadStudents } from '../hooks/useUploadStudents';
import { current } from '@reduxjs/toolkit';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const SpreadsheetSelector = () => {

    const [selectedId, setSelectedId] = useState<string>('Offline');

    const { spreadsheetPages, loading, columnAData, expedientesPormandar } = useAppSelector(state => state.qr);

    const dispatch = useAppDispatch();

    const { fetchColumnAData } = useLoadColumnAData(selectedId);

    const { uploadStudents } = useUploadStudents();

    useEffect(() => {
        if (selectedId) {
            fetchColumnAData();
            // console.log(fetchColumnAData);
        }
    }, [selectedId]);

    useEffect(() => {

    }, [spreadsheetPages])

    useEffect(() => {
        //console.log("Alumnos Temporales: " + expedientesPormandar);
    }, [expedientesPormandar])

    return (
        <View style={styles.container}>
            {
                (loading) ?
                    <Text>Loading...</Text> :
                    <View style={styles.container}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                style={styles.picker}
                                selectedValue={selectedId}
                                onValueChange={(itemValue) => {
                                    setSelectedId(itemValue);
                                    dispatch(addTemporalSpreadSheet(itemValue));
                                    dispatch(removeColumnAData);
                                    console.log('Hoja: ' + store.getState().qr.temporalSpreadSheetPage);
                                }}
                            >
                                <Picker.Item label="Expedientes Sin Enviar" value="Offline" />
                                {spreadsheetPages.map((item, index) => (
                                    <Picker.Item key={index} label={item} value={item} />
                                ))}
                            </Picker>
                        </View>
                        { (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#841584',
                                    padding: 10,
                                    borderRadius: 5,
                                    alignSelf: 'center',
                                    width: '95%'
                                }}
                                onPress={() => {
                                    dispatch(selectSpreadsheetPage(selectedId));
                                }}
                            >
                                <Text style={{color: 'white', textAlign: 'center'}}>Scannear</Text>
                            </TouchableOpacity>
                        )}
                        {selectedId && selectedId != "Offline" && expedientesPormandar.length>0 && <ColumnCheckList columnCheckList={expedientesPormandar}  />}
                        {selectedId && selectedId != "Offline" && <ColumnADataList columnAData={columnAData}  />}
                        {selectedId === "Offline" &&  <ColumnADataList columnAData={expedientesPormandar} />}
                        {selectedId && selectedId != "Offline" && <View style={styles.buttonContainer}><Button title="Enviar Expedientes Pendientes" onPress={uploadStudents} /></View>}
                    </View>
            }
        </View>
    )
}

//Contenedor principal para la lista de elementos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        //border: 1,
        //borderWidth: 5,
        borderColor: 'red',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'relative',
        width: '95%',
        margin: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 10,
        width: '95%',
        alignSelf: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#8A3CB0', // El color del texto en el Picker

    },
    picker_text: {
        fontSize: 20,
    },
    //Style para la lista de elementos
    lista: {
        //border: 1,
        //borderWidth: 5,
        borderColor: 'purple',
        alignItems: 'center',
    },

    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 0,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
    },

    button: {
        alignItems: "center",
        borderColor: '#CCCCCC',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginTop: '10%'
    },

    tinyLogo: {
        width: 25,
        height: 25,
        objectFit: 'cover',
    },

    listItem: {
        fontSize: windowWidth * 0.04, // 4% del ancho de la ventana
        color: '#841584',
        textAlign: 'center',
        marginBottom: windowHeight * 0.01, // 1% de la altura de la ventana
        backgroundColor: '#f8f8f8',
        padding: windowHeight * 0.01, // 1% de la altura de la ventana
        borderRadius: 5,
    },
});