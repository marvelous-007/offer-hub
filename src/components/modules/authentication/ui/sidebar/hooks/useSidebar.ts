"use client";

import { useState } from "react";

const useSidebar = () => {
  const [currentTab, setCurrentTab] = useState("profile");

  return {
    currentTab,
    setCurrentTab,
  };
};

export default useSidebar;
