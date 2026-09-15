import  './LoginPage.css'
import { useState, useEffect } from "react"
import { urlConfig } from '../../config'
import { useAppContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'


function LoginPage() {
    const [formLogin, setFormLogin] = useState(
        {
            email: "",
            password: ""
        }
    )

    const [incorrect, setIncorrect] = useState('')
    const navigate = useNavigate()
    const {setIsLoggedIn} = useAppContext()
    const bearerToken = sessionStorage.getItem('bearer-token')

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app')
        }
        }, [navigate])

    const handleChange = (propiedad, e) => {
        const element = e.target.value
        setFormLogin({...formLogin, [propiedad]: element})
    }    

    const handleLogin = async (e) => {
        e.preventDefault()
	try{
		//first task
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
		    method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerToken ? `Bearer ${bearerToken}` : ''
                },
            body: JSON.stringify({    
                email: formLogin.email,
                password: formLogin.password,
                })

	        })
        const json = await response.json();
        console.log('Json',json);
        if (json.authtoken) {
		
          sessionStorage.setItem('auth-token', json.authtoken);
          sessionStorage.setItem('name', json.userName);
          sessionStorage.setItem('email', json.userEmail);
			
          setIsLoggedIn(true);
	
	      navigate('/app');
        } else {
			//Step 2: Task 5
          document.getElementById("email").value="";
          document.getElementById("password").value="";
          setIncorrect("Wrong password. Try again.");
          setTimeout(() => {
            setIncorrect("");
          }, 2000);
        }    
	  }catch (e) {
        console.log("Error fetching details: " + e.message);
    }
}
   
    return (
        <div className="environment">
            <div className="container-form">
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="btn-primary btnForm">Login</button>
                    <p className="mt-4 text-center">
                        ¿Ya eres miembro? <a href="/app/login" className="text-primary">Iniciar sesión</a>
                    </p>
                    <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>

                </form>
            </div>
        </div>    
    )
}

export default LoginPage