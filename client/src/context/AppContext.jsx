import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)

    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            if (data.success) {
                setUserData(data.userData)
            }

        } catch (error) {
            console.log(error.message)
        }
    }, [backendUrl])


    useEffect(() => {
        const getAuthState = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/auth/is-auth')

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                }

            } catch (error) {
                console.log(error.message)
            }
        }
        getAuthState();
    }, [backendUrl, getUserData])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    )
}