import React, { useEffect, useState } from "react";
import { useHIContext } from "../../context/hicontext";

function HIfinalVal() {
  const { HIfinal } = useHIContext();
  const [displayvalue, setValue] = useState("0.00");

  useEffect(() => {
    setValue(HIfinal.toFixed(2));
    console.log("Updated HIfinal in component:", displayvalue);
  }, [HIfinal]); // ✅ Ensure re-render when HIfinal updates

useEffect(()=>{
  console.log("RENDERED HI COMPONENT");
},[HIfinal])

  const interpretLevel = (value) => {
    if (value <= 0.33) return "highlight2";
    if (value <= 0.66) return "highlight1";
    if (value <= 1.0) return "highlight";
    return "";
  };

  return <span className={interpretLevel(Number(displayvalue))}>{displayvalue}</span>;
}

export default HIfinalVal;
