import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function HeaderStyle() {
    return (
        <LinearGradient style={styles.container} colors={['#8752a8', '#4c9bb3']} end={{x: 1.5, y: 3.5}}/>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: Constants.statusBarHeight + 56,
    },
});