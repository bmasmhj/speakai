
import React, { useState, createContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showNotificationMessage = (message) => {
    setShowNotification(true);
    setNotificationMessage(message);
  };

  const hideNotification = () => {
    setShowNotification(false);
    setNotificationMessage('');
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        notificationMessage,
        showNotificationMessage,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const {
    showNotification,
    notificationMessage,
    showNotificationMessage,
    hideNotification,
  } = React.useContext(NotificationContext);

  return {
    showNotification,
    notificationMessage,
    showNotificationMessage,
    hideNotification,
  };
};