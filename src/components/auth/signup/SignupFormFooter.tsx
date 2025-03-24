
import React from 'react';
import { Link } from 'react-router-dom';

export const SignupFormFooter: React.FC = () => {
  return (
    <div className="text-center text-sm text-irs-darkGray mt-2">
      Already have an account?{" "}
      <Link to="/login" className="text-irs-blue hover:text-irs-darkBlue font-medium">
        Sign in
      </Link>
    </div>
  );
};
