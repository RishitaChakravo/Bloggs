"use client"

import axios from "axios";
import Footer from "./components/footer/footer";
import HeroSec from "./components/heroSec/page";
import { NavBar } from "./components/navbar/page";
import UserIcon from "./components/userIcon/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    username: "",
    email: ""
  });

  // useEffect(() => {
  //   const userProfile = async () => {
  //     try {
  //       const response = await axios.get('/api/users/profile');
  //       const data = response.data;
  //       setUser({
  //         ...data,
  //         isLoggedIn: true
  //       });
  //     } catch (error) {
  //       console.log("failed to fetch user data");
  //     }
  //   };
  //   userProfile();
  // }, []);

  return (
    <div className="p-0 m-0">
      <HeroSec />
      {user.isLoggedIn && <UserIcon />}
      <NavBar />
      <Footer />
    </div>
  );
}
