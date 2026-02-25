import axios from "axios";

const API = "https://offline-payment-system-backend.onrender.com/api/auth";

export const register = async (data) => {
  return await axios.post(`${API}/register`, data);
};

export const login = async (data) => {
  return await axios.post(`${API}/login`, data);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getBalance = async (email) => {
  return await axios.get(
    `https://offline-payment-system-backend.onrender.com/api/wallet/balance?email=${email}`,
    getAuthHeaders()
  );
};

export const addMoney = async (email, amount) => {
  return await axios.post(
    `https://offline-payment-system-backend.onrender.com/api/wallet/add?email=${email}&amount=${amount}`,
    {},
    getAuthHeaders()
  );
};

export const withdrawMoney = async (email, amount) => {
  return await axios.post(
    `https://offline-payment-system-backend.onrender.com/api/wallet/withdraw?email=${email}&amount=${amount}`,
    {},
    getAuthHeaders()
  );
};

export const getTransactions = async () => {
  return await axios.get(
    `https://offline-payment-system-backend.onrender.com/api/transaction/history`,
    getAuthHeaders()
  );
};

export const savePublicKey = async (publicKey) => {
  return await axios.post(
    `${API}/public-key`,
    { publicKey },
    getAuthHeaders()
  );
};
