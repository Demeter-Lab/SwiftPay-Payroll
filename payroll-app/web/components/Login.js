import { useAuth } from "@/contexts/AuthContext";
import "../flow-interactions/config";

export default function Login() {
  // fetching "currentUser", "logOut", "logIn" from AuthContext (i.e. useAuth)
  // to get values for the currentUser
  const { currentUser, logOut, logIn } = useAuth();

  return (
    <button onClick={currentUser.addr ? logOut : logIn}>
      {currentUser.addr ? "Log Out" : "Login"}
    </button>
  );
}
