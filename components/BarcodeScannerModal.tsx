import { CameraView } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScannerModalProps {
    visible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
    hasPermission: boolean;
}

export default function BarcodeScannerModal({ visible, onClose, onScan, hasPermission }: ScannerModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.scannerOverlay}>
                <View style={styles.scannerHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.scannerCloseBtn}>
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.scannerTitle}>Scan Barcode</Text>
                    <View style={{ width: 40 }} />
                </View>
                {hasPermission ? (
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ["upc_a", "upc_e", "ean13", "ean8"] }}
                        onBarcodeScanned={({ data }) => onScan(data)}
                    />
                ) : (
                    <View style={styles.scannerCenter}>
                        <Text style={{ color: 'white' }}>No camera permission granted.</Text>
                    </View>
                )}
                <View style={styles.scannerFrameOutline} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    scannerOverlay: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    scannerCloseBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    scannerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scannerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerFrameOutline: {
        position: 'absolute',
        top: '30%',
        alignSelf: 'center',
        width: 250,
        height: 150,
        borderWidth: 2,
        borderColor: '#0EA5E9',
        borderRadius: 16,
        backgroundColor: 'transparent',
    }
});
