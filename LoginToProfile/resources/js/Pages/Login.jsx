import { Head, useForm } from "@inertiajs/react"

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    })

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Login" />
            <div className="loginScreenWrapper">
                <div className="loginScreen">
                    <h1>Login</h1>
                    <form>
                        <label htmlFor="emailInput">Email:</label>
                        <input id="emailInput" type="email" value={data.email} onChange={(e) => {setData('email', e.target.value)}} />
                        {errors.email && <p className="inputError">{errors.email}</p>}
                        <label htmlFor="passwordInput">Password:</label>
                        <input id="passwordInput" type="password" value={data.password} onChange={(e) => {setData('password', e.target.value)}} />
                        {errors.password && <p className="inputError">{errors.password}</p>}
                        <button type="submit" onClick={submit} disabled={processing}>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login