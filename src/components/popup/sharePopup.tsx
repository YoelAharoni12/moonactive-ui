import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const NotificationContainer = styled.div<{ type: 'success' | 'error' }>`
    position: fixed;
    top: 0.5%; 
    left: 40%;
    transform: translateX(-50%); 
    margin: 0;
    padding: 12px 20px;
    background-color: ${({ type }) => (type === 'success' ? '#4caf50' : '#f44336')};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    animation: ${slideIn} 0.5s forwards;
    z-index: 1000;
`;

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <NotificationContainer type={type} >
            {message}
        </NotificationContainer>
    );
};

export default Notification;
