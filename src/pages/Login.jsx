import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useFakeAuth } from "../contexts/fakeAuthContext";

export default function Login() {
  const { logIn, isAuthenticated } = useFakeAuth();
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const navigate = useNavigate();

  function handleLoginBtn(e) {
    e.preventDefault();
    if (!email || !password) return;
    logIn(email, password);
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate(`/app`, { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav></PageNav>
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary" onClick={handleLoginBtn}>
            Login
          </Button>
          {/* <Link to="/app" className="cta">
            Login
          </Link> */}
        </div>
      </form>
    </main>
  );
}
