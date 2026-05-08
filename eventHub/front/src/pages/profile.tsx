import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    async function deco() {
          localStorage.removeItem("token")
    navigate("/");
    }

  return (
    <>
    <button className="w-32 h-8 border-black border-2" onClick={deco}>deconexion </button>
    </>
  );
}
