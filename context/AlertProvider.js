// AlertProvider.js
import React, { createContext, useContext, useState } from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} AlertType
 *
 * @typedef {Object} Alert
 * @property {number} id - Unique identifier for the alert
 * @property {AlertType} type - Type of the alert
 * @property {string} message - Alert message content
 * @property {boolean} [dismissing] - Whether the alert is in dismissing state
 *
 * @typedef {Object} AlertContextValue
 * @property {function(Object): number} showAlert - Show an alert with options
 * @property {function(number): void} dismissAlert - Dismiss an alert by ID
 * @property {function(string, number=): number} showSuccess - Show a success alert
 * @property {function(string, number=): number} showError - Show an error alert
 * @property {function(string, number=): number} showInfo - Show an info alert
 * @property {function(string, number=): number} showWarning - Show a warning alert
 */

/** @type {React.Context<AlertContextValue>} */
const AlertContext = createContext({
  showAlert: () => 0,
  dismissAlert: () => {},
  showSuccess: () => 0,
  showError: () => 0,
  showInfo: () => 0,
  showWarning: () => 0,
});

/**
 * Custom hook to use the alert context
 * @returns {AlertContextValue} Alert context value
 */
export const useAlert = () => useContext(AlertContext);

// Simple custom icon components
const IconComponents = {
  // Success checkmark icon
  CheckCircle: ({ size = 20, color = '#fff' }) => (
    <View
      style={[
        styles.iconCircle,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <View style={[styles.checkmark, { borderColor: color }]} />
    </View>
  ),

  // Error X icon
  AlertCircle: ({ size = 20, color = '#fff' }) => (
    <View
      style={[
        styles.iconCircle,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <View
        style={[
          styles.xLine1,
          { backgroundColor: color, width: size / 2, height: size / 8 },
        ]}
      />
      <View
        style={[
          styles.xLine2,
          { backgroundColor: color, width: size / 2, height: size / 8 },
        ]}
      />
    </View>
  ),

  // Warning triangle icon
  AlertTriangle: ({ size = 20, color = '#fff' }) => (
    <View style={[styles.triangleContainer, { width: size, height: size }]}>
      <View style={[styles.triangle, { borderBottomColor: color }]} />
      <Text style={[styles.exclamation, { color: color }]}>!</Text>
    </View>
  ),

  // Info icon
  Info: ({ size = 20, color = '#fff' }) => (
    <View
      style={[
        styles.iconCircle,
        { width: size, height: size, borderColor: color },
      ]}
    >
      <Text style={[styles.infoText, { color: color }]}>i</Text>
    </View>
  ),

  // Close X icon
  CloseX: ({ size = 16, color = '#fff' }) => (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={[
          styles.closeXLine1,
          { backgroundColor: color, width: size, height: size / 6 },
        ]}
      />
      <View
        style={[
          styles.closeXLine2,
          { backgroundColor: color, width: size, height: size / 6 },
        ]}
      />
    </View>
  ),
};

/**
 * AlertProvider component to provide alert functionality throughout the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AlertProvider Component
 */
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [nextId, setNextId] = useState(1);

  /**
   * Show an alert with the specified options
   * @param {Object} options - Alert options
   * @param {AlertType} [options.type='info'] - Alert type
   * @param {string} options.message - Alert message
   * @param {number} [options.duration=3000] - Duration in ms before auto-dismissal (0 for no auto-dismiss)
   * @returns {number} Alert ID
   */
  const showAlert = ({ type = 'info', message, duration = 3000 }) => {
    const id = nextId;
    setNextId((prev) => prev + 1);

    const newAlert = {
      id,
      type,
      message,
    };

    setAlerts((prev) => [...prev, newAlert]);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissAlert(id);
      }, duration);
    }

    return id;
  };

  /**
   * Dismiss an alert by ID
   * @param {number} id - Alert ID to dismiss
   */
  const dismissAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, dismissing: true } : alert,
      ),
    );

    // Remove from state after animation completes
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 300); // Match animation duration
  };

  /**
   * Show a success alert
   * @param {string} message - Alert message
   * @param {number} [duration] - Duration in ms before auto-dismissal
   * @returns {number} Alert ID
   */
  const showSuccess = (message, duration) =>
    showAlert({ type: 'success', message, duration });

  /**
   * Show an error alert
   * @param {string} message - Alert message
   * @param {number} [duration] - Duration in ms before auto-dismissal
   * @returns {number} Alert ID
   */
  const showError = (message, duration) =>
    showAlert({ type: 'error', message, duration });

  /**
   * Show an info alert
   * @param {string} message - Alert message
   * @param {number} [duration] - Duration in ms before auto-dismissal
   * @returns {number} Alert ID
   */
  const showInfo = (message, duration) =>
    showAlert({ type: 'info', message, duration });

  /**
   * Show a warning alert
   * @param {string} message - Alert message
   * @param {number} [duration] - Duration in ms before auto-dismissal
   * @returns {number} Alert ID
   */
  const showWarning = (message, duration) =>
    showAlert({ type: 'warning', message, duration });

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        dismissAlert,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <AlertContainer alerts={alerts} dismissAlert={dismissAlert} />
    </AlertContext.Provider>
  );
};

/**
 * Container component for alerts
 * @param {Object} props - Component props
 * @param {Alert[]} props.alerts - Array of alerts
 * @param {function} props.dismissAlert - Function to dismiss an alert
 * @returns {JSX.Element|null} AlertContainer Component
 */
const AlertContainer = ({ alerts, dismissAlert }) => {
  if (alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={() => dismissAlert(alert.id)}
        />
      ))}
    </View>
  );
};

/**
 * Individual alert item component
 * @param {Object} props - Component props
 * @param {Alert} props.alert - Alert data
 * @param {function} props.onDismiss - Function to call when dismissing
 * @returns {JSX.Element} AlertItem Component
 */
const AlertItem = ({ alert, onDismiss }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    // Fade in animation
    if (!alert.dismissing) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // Fade out animation
    else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [alert.dismissing]);

  // Get styles based on alert type
  const getTypeStyles = () => {
    switch (alert.type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      default:
        return styles.info;
    }
  };

  // Render appropriate icon based on alert type
  const renderIcon = () => {
    const iconProps = { size: 18, color: '#fff' };

    switch (alert.type) {
      case 'success':
        return <IconComponents.CheckCircle {...iconProps} />;
      case 'error':
        return <IconComponents.AlertCircle {...iconProps} />;
      case 'warning':
        return <IconComponents.AlertTriangle {...iconProps} />;
      default:
        return <IconComponents.Info {...iconProps} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.alert,
        getTypeStyles(),
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text style={styles.alertText}>{alert.message}</Text>
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <IconComponents.CloseX size={16} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Adjust for status bar
    right: 20,
    maxWidth: '80%',
    zIndex: 999,
  },
  alert: {
    marginTop: 25,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 300,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  warning: {
    backgroundColor: '#FF9800',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  iconContainer: {
    marginRight: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Custom icon styles
  iconCircle: {
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 8,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  xLine1: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  triangleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  exclamation: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  closeXLine1: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ rotate: '45deg' }],
  },
  closeXLine2: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ rotate: '-45deg' }],
  },
});
