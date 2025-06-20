import React from "react";
import { signIn, signOut, supabase } from "../supabase/Client";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./Auth.css";

const Auth = () => {
  const [user, setUser] = React.useState(null);
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
    return React.createElement(
      "div",
      { className: "auth-container" },
      React.createElement(FontAwesomeIcon, {
        icon: faSpinner,
        spin: true,
        className: "auth-spinner",
      })
    );
  }

  return React.createElement(
    "div",
    { className: "auth-container" },
    user
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement("span", null, user.user_metadata?.user_name || user.email || "User"),
          React.createElement(
            "button",
            { onClick: handleSignOut, disabled: loading },
            loading
              ? React.createElement(FontAwesomeIcon, { icon: faSpinner, spin: true })
              : "Sign Out"
          )
        )
      : React.createElement(
          "button",
          { onClick: handleSignIn, disabled: loading },
          loading
            ? React.createElement(FontAwesomeIcon, { icon: faSpinner, spin: true })
            : React.createElement(
                React.Fragment,
                null,
                "Sign in with GitHub ",
                React.createElement(FontAwesomeIcon, { icon: faGithub })
              )
        )
  );
};

export default Auth;
