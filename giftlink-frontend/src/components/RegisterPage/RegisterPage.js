import './RegisterPage.css'
import { useState } from "react";
import { urlConfig } from  '../../config'
import { useAppContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'



function RegisterPage() {
    const [formData, setFormData] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }
    )
    const navigate =  useNavigate()
    const { setIsLoggedIn } = useAppContext()
    const [error, setError] = useState("")
    const fetchConfig = { method: 'POST',
             headers: {'Content-Type': 'application/json'},  
             body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            })
            }


    const handleChange = (propiedad, e) => {
        const element = e.target.value
        setFormData({...formData, [propiedad]: element})
    }    

    const handleRegister = async(e) => {
        e.preventDefault()
        try {
            const response  = await fetch(`${urlConfig.backendUrl}/api/auth/register`, fetchConfig)
            
            const json = await response.json()
            console.log('json data:', json);
			console.log('er: ', json.error)

            if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', formData.firstName);
            sessionStorage.setItem('email', json.email);
			setIsLoggedIn(true)
			navigate('/app')
            }
            if (json.error) {
                setError(json.error)
            }



        } catch (error) {
            console.log("Fetch error: " + error)
        }
        
        

    }
   
    return (
        <div className="environment">
            <div className="container-form">
                <form onSubmit={handleRegister}>
                    <h2>Register</h2>
                    <label htmlFor="firstName">FirstName</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your firstName"
                        onChange={(e) => handleChange("firstName", e)}
                        value={formData.firstName}
                    />
                    <label htmlFor="LastName">LastName</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last Name"
                        onChange={(e) => handleChange("lastName", e)}
                        value={formData.lastName}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your Email"
                        onChange={(e) => handleChange("email", e)}
                        value={formData.email}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="lastName"
                        placeholder="Enter your password"
                        onChange={(e) => handleChange("password", e)}
                        value={formData.password}
                    />
                    <button type="submit" className="btn-primary btnForm">Register</button>
                </form>
               <div className="text-danger">{error}</div>
            </div>
        </div>    
    )
}


export default RegisterPage