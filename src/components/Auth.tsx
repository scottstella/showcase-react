import React from "react";
import { signIn, signOut, supabase } from "../supabase/Client";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { User } from "@supabase/supabase-js";
import "./Auth.css";

const Auth = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getInitialUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signIn();
      if (error) {
        toast.error(`Error signing in: ${error.message}`);
        setLoading(false);
      }
      // Don't set loading to false on success as we'll be redirected
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error signing in: ${errorMessage}`);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) {
        toast.error(`Error signing out: ${error.message}`);
      } else {
        toast.info("Signed out successfully");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error signing out: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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
            <>
              Sign in with GitHub <FontAwesomeIcon icon={faGithub} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Auth;
