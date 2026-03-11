import { useState } from "react";
import Popup from "@/components/EngagementCalculator";

function Popupage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="full-container">
        <div className="full-container black-bg" style={{width: "100vw", height: "90svh"}}>
            <button onClick={() => setOpen(true)}>Abrir popup</button>
            {open && <Popup onClose={() => setOpen(false)} />}
        </div>
        <div className="full-container bg-white" style={{width: "100vw", height: "90svh"}}>
            <h1 style={{color: "white"}}>Text</h1>
        </div>
    </div>
  );
}

export default Popupage;