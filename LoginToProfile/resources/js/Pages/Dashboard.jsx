import { Head, Link, usePage } from "@inertiajs/react";
import ProfileForm from "../Components/Dashboard/ProfileForm";
import ProfilePictureForm from "../Components/Dashboard/ProfilePictureForm";

const Dashboard = () => {
  const { auth } = usePage().props;

  return (
    <>
      <Head title="Dashboard" />
      <nav className="navbar">
        {auth.user && <span><strong>{auth.user.name}</strong></span>}
        <Link href="/logout" className="nav-link">Log out</Link>
      </nav>
      <div className="contentWrapper">
        <h1 className="title">Dashboard</h1>
        <ProfileForm />
        <ProfilePictureForm />
      </div>
    </>
  )
}

export default Dashboard