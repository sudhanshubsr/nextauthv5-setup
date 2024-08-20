import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { CardWrapper } from './card-wrapper';

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-red-600" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
