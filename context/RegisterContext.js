import { createContext, useContext, useState } from 'react';

const RegisterContext = createContext();
export const useRegisterContext = () => useContext(RegisterContext);

const RegisterProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');

  const [loginStep, setLoginStep] = useState(1);
  const [forgottenDetails, setForgottenDetails] = useState('');
  const [forgottenCode, setForgottenCode] = useState(['', '', '', '']);
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  return (
    <RegisterContext.Provider
      value={{
        step,
        setStep,
        firstName,
        setFirstName,
        secondName,
        setSecondName,
        email,
        setEmail,
        phone,
        setPhone,
        postalCode,
        setPostalCode,
        isChecked,
        setChecked,
        code,
        setCode,
        password,
        setPassword,
        loginStep,
        setLoginStep,
        forgottenDetails,
        setForgottenDetails,
        forgottenCode,
        setForgottenCode,
        forgotNewPassword,
        setForgotNewPassword,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterProvider;
