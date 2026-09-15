import  './LoginPage.css'
import { useState } from "react"

function LoginPage() {
    const [formLogin, setFormLogin] = useState(
        {
            email: "",
            password: ""
        }
    )


    const handleChange = (propiedad, e) => {
        const element = e.target.value
        setFormLogin({...formLogin, [propiedad]: element})
    }    

    const handleRegister = (e) => {
        e.preventDefault()
        console.log("Dentro de handleRegister")
    }
   
    return (
        <div className="environment">
            <div className="container-form">
                <form type="submit">
                    <h2>Login</h2>
                    
                    <label htmlFor="login-email">Email</label>
                    <input
                        type="email"
                        id="login-email"
                        name="email"
                        placeholder="Enter your Email"
                        onChange={(e) => handleChange("email", e)}
                        value={formLogin.email}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        name="lastName"
                        placeholder="Enter your password"
                        onChange={(e) => handleChange("password", e)}
                        value={formLogin.password}
                    />
                    <button className="btn-primary btnForm" onSubmit={handleRegister}>Register</button>
                    <p className="mt-4 text-center">
                        ¿Ya eres miembro? <a href="/app/login" className="text-primary">Iniciar sesión</a>
                    </p>
                </form>
            </div>
        </div>    
    )
}

export default LoginPage