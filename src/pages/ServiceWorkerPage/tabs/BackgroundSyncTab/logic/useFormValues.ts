import { useState } from 'react';

export function useFormValues() {
  const [email, setEmail] = useState('talkohavy@gmail.com');
  const [password, setPassword] = useState('1234');
  const [name, setName] = useState('tal');
  const [age, setAge] = useState(29);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleAgeChange = (value: string) => {
    setAge(Number.parseInt(value, 10));
  };

  return {
    email,
    password,
    name,
    age,
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
    handleAgeChange,
  };
}
