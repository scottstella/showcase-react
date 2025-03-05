import React from "react";
import { signIn, signOut, supabase } from "../supabase/Client";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Auth.css";

const Auth: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get initial user
    const user = supabase.auth.user();
    setUser(user);
    setLoading(false);

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signIn();
    if (error) {
      toast.error(`Error signing in: ${error.message}`);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      toast.error(`Error signing out: ${error.message}`);
    } else {
      toast.success("Signed out successfully");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="auth-container">
        <FontAwesomeIcon icon={faSpinner} spin className="auth-spinner" />
      </div>
    );
  }

  return (
    <div className="auth-container">
      {user ? (
        <>
          <span>{user.user_metadata?.user_name || user.email || "User"}</span>
          <button onClick={handleSignOut} disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign Out"}
          </button>
        </>
      ) : (
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            "Sign in with GitHub"
          )}
        </button>
      )}
    </div>
  );
};

export default Auth;
