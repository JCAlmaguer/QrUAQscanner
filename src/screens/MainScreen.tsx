import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Components
import { CodeScanner, SpreadsheetSelector, AddGoogleSheets } from '../components';
import { NavBar } from '../components/NavBar';
// Redux 
import { useAppSelector } from '../store/store';


// Hooks
import { useCheckNetwork } from '../hooks/useCheckNetwork';

// Components
import { Tittle } from '../components/Tittle';
import { useUploadStudents } from '../hooks/useUploadStudents';

export const MainScreen = () => {
    const [isSheetAdded, setIsSheetAdded] = useState(true);
    const {uploadStudents} = useUploadStudents();
    const handleUpload = () => {
        uploadStudents();
    };
    const {
        currentSpreadsheetPage,
    } = useAppSelector(state => state.qr);

    useCheckNetwork();

    return (
        <>
            {!isSheetAdded ? (
                <AddGoogleSheets onAdd={() => setIsSheetAdded(true)} />
            ) : (
                <>
                    {
                        (currentSpreadsheetPage !== '')
                            ? <>
                                <CodeScanner />
                            </>

                            : (<>
                                <SafeAreaView />
                                <Tittle />
                                <SpreadsheetSelector />
                                <NavBar onPress = {()=> setIsSheetAdded(false)} onPressAdd={handleUpload} onPressExit={BackHandler.exitApp}/>
                            </>)
                    }
                    <StatusBar style="auto" />
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    //Main Container - Contenedor Principal
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffff',
        alignItems: 'center',
        justifyContent: 'center',
        //border: 1,
        //borderWidth: 5,
        borderColor: 'red',
    },
    floatingStudentIdCounterContainer: {
        position: 'absolute',
        top: 0,
        right: 8,
        backgroundColor: 'red',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingStudentIdCounter: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        overflow: 'hidden',
        borderRadius: 10,
        position: 'relative',
        bottom: 0,
        left: 0,
        margin: 10,
    }
});
