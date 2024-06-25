// import PageNav from "../components/PageNav";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import styles from "./AppLayout.module.css";
import User from "../components/User";
import { useFakeAuth } from "../contexts/fakeAuthContext";

function AppLayout() {
  const { isAuthenticated } = useFakeAuth();

  return (
    <div className={styles.app}>
      <SideBar />
      <Map />
      {isAuthenticated ? <User /> : ""}
    </div>
  );
}

export default AppLayout;
