import React from 'react'

const Notification = ({ message, errorState }) => {
    if (message == null) {
        return null
    } else if (errorState === 'error') {
        return (
            <>
                <div className="error">{message}</div>
            </>
        )
    } else if (errorState === 'success') {
        return (
            <>
                <div className="success">{message}</div>
            </>
        )
    }
}

export default Notification