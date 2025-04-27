import { usePage, useForm } from "@inertiajs/react";

const ProfileForm = () => {
    const { auth } = usePage().props;

    const { data, setData, post, reset, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        password: '',
        password_confirmation: '',
        availabilityMo: auth.user.availability.mo,
        availabilityTu: auth.user.availability.tu,
        availabilityWe: auth.user.availability.we,
        availabilityTh: auth.user.availability.th,
        availabilityFr: auth.user.availability.fr,
    })

    function submit(e) {
        e.preventDefault();
        post('/updateprofile', {
            preserveScroll: true,
            onSuccess: () => {
                reset('password');
                reset('password_confirmation');
            },
        });
    }

    return (
        <div className="settingsScreen">
            <h2>Profile</h2>
            <form>
                <label htmlFor="nameInput">Username:</label>
                <input id="nameInput" type="text" value={data.name} onChange={(e) => { setData('name', e.target.value) }} />
                {errors.name && <p className="inputError">{errors.name}</p>}
                <label htmlFor="emailInput">Email:</label>
                <input id="emailInput" type="email" value={data.email} onChange={(e) => { setData('email', e.target.value) }} />
                {errors.email && <p className="inputError">{errors.email}</p>}
                <label htmlFor="passwordInput">New password:</label>
                <input id="passwordInput" type="password" value={data.password} onChange={(e) => { setData('password', e.target.value) }} />
                {errors.password && <p className="inputError">{errors.password}</p>}
                <label htmlFor="passwordConfirmationInput">Confirm new password:</label>
                <input id="passwordConfirmationInput" type="password" value={data.password_confirmation} onChange={(e) => { setData('password_confirmation', e.target.value) }} />
                {errors.password_confirmation && <p className="inputError">{errors.password_confirmation}</p>}

                <label>Availability:</label>
                <div className="checkBoxWrapper">
                    <input id="availabilityMo" type="checkbox" checked={data.availabilityMo} onChange={(e) => { setData('availabilityMo', e.target.checked) }} />
                    <label htmlFor="availabilityMo">Mo</label>
                    {errors.availabilityMo && <p className="inputError">{errors.availabilityMo}</p>}
                </div>
                <div className="checkBoxWrapper">
                    <input id="availabilityTu" type="checkbox" checked={data.availabilityTu} onChange={(e) => { setData('availabilityTu', e.target.checked) }} />
                    <label htmlFor="availabilityTu">Tu</label>
                    {errors.availabilityTu && <p className="inputError">{errors.availabilityTu}</p>}
                </div>
                <div className="checkBoxWrapper">
                    <input id="availabilityWe" type="checkbox" checked={data.availabilityWe} onChange={(e) => { setData('availabilityWe', e.target.checked) }} />
                    <label htmlFor="availabilityWe">We</label>
                    {errors.availabilityWe && <p className="inputError">{errors.availabilityWe}</p>}
                </div>
                <div className="checkBoxWrapper">
                    <input id="availabilityTh" type="checkbox" checked={data.availabilityTh} onChange={(e) => { setData('availabilityTh', e.target.checked) }} />
                    <label htmlFor="availabilityTh">Th</label>
                    {errors.availabilityTh && <p className="inputError">{errors.availabilityTh}</p>}
                </div>
                <div className="checkBoxWrapper">
                    <input id="availabilityFr" type="checkbox" checked={data.availabilityFr} onChange={(e) => { setData('availabilityFr', e.target.checked) }} />
                    <label htmlFor="availabilityFr">Fr</label>
                    {errors.availabilityFr && <p className="inputError">{errors.availabilityFr}</p>}
                </div>


                <button type="submit" onClick={submit} disabled={processing}>Update profile</button>
            </form>
        </div>
    )
}

export default ProfileForm