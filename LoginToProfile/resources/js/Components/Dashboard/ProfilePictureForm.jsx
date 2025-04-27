import { usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";

const ProfilePictureForm = () => {
    const { auth } = usePage().props;

    const { data, setData, post, progress, errors } = useForm({
        profilePicture: null,
    })

    useEffect(() => {
        if (data.profilePicture !== null) post('/updateprofilepicture', {
            preserveScroll: true
        });
    }, [data])

    return (
        <div className="settingsScreen">
            <h2>Profile picture</h2>
            <form>
                <input id="profilepictureinput" type="file" onChange={e => {
                    setData('profilePicture', e.target.files[0]);
                }} accept="image/png, image/jpeg" />
                <label htmlFor="profilepictureinput">
                    Drag and drop your profile picture here to upload it.
                </label>
                {progress && (
                    <progress value={progress.percentage} max="100">
                        {progress.percentage}%
                    </progress>
                )}
            </form>
            {auth.user.profile_picture?.imgurl && <img src={"/storage/" + auth.user.profile_picture?.imgurl} className="profilePictureSetting" />}
        </div>
    )
}

export default ProfilePictureForm