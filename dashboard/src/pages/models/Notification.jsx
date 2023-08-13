import React from 'react';
import { useNotification } from '../hook/useNotification';

const Notification = () => {
  const { showNotification, notificationMessage, hideNotification } = useNotification();
    setTimeout(() => {
        hideNotification();
    }, 2000);
  return (
    <>
      {showNotification && (
        <div className="bs-toast toast toast-placement-ex m-2 fade bg-success top-0 end-0 show" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
          <div className="toast-header">
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {notificationMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;