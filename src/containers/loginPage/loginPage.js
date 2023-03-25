import axios from "axios";
import { useState } from "react";

export default function LoginPage(props) {

    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")

    const login = () => {
        let obj = {
            username: username,
            password: password,
        }
        var config2 = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/login`,
            // url: 'http://localhost:5000/login',
            data: obj
        };
        axios(config2)
            .then((res) => {
                if (res.data !== "Username or Password is incorrect") {
                    localStorage.setItem("user", JSON.stringify(res.data[0]))
                    // window.location.href = "http://192.168.18.228:3000/home/dashboard"
                    window.location.href = "https://admin.qualitybutlerservices.com/home/dashboard"
                } else {
                    alert(res.data)
                }
            })
    }

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="card p-5 w-50">
                <h3 className="text-center mb-5">Login</h3>
                <form>
                    <div className="form-outline mb-4">
                        <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" id="form2Example1" className="form-control" />
                        <label className="form-label" for="form2Example1">User Name</label>
                    </div>

                    <div className="form-outline mb-4">
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="form2Example2" className="form-control" />
                        <label className="form-label" for="form2Example2">Password</label>
                    </div>

                    <div className="row mb-4">
                        <div className="col-4 d-flex ">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                                <label className="form-check-label" for="form2Example31"> Remember me </label>
                            </div>
                        </div>

                        <div className="col">
                            <a href="#!">Forgot password?</a>
                        </div>
                    </div>

                    <button onClick={login} type="button" className="btn btn-primary btn-block mb-4">Sign in</button>

                </form>
            </div>
        </div>
    );
}