import './RegisterPage.css'
import { useState } from "react";


function RegisterPage() {
    const [formData, setFormData] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }
    )


    const handleChange = (propiedad, e) => {
        const element = e.target.value
        setFormData({...formData, [propiedad]: element})
    }    

    const handleRegister = (e) => {
        e.preventDefault()
        console.log("Register invoked")
    }
   
    return (
        <div className="environment">
            <div className="container-form">
                <form type="submit">
                    <h2>Register</h2>
                    <label for="firstName">FirstName</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your firstName"
                        onChange={(e) => handleChange("firstName", e)}
                        value={formData.firstName}
                    />
                    <label for="LastName">LastName</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last Name"
                        onChange={(e) => handleChange("lastName", e)}
                        value={formData.lastName}
                    />
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your Email"
                        onChange={(e) => handleChange("email", e)}
                        value={formData.email}
                    />
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="lastName"
                        placeholder="Enter your password"
                        onChange={(e) => handleChange("password", e)}
                        value={formData.password}
                    />
                    <button className="btn-primary btnForm" onSubmit={handleRegister}>Register</button>
                </form>
            </div>
        </div>    
    )
}


export default RegisterPage