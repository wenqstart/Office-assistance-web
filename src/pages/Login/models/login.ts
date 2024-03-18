import { useState } from 'react';
export default function useLogin() {
  const [isLogin, setIsLogin] = useState(true);
  return {
    isLogin,
    setIsLogin,
  };
}
