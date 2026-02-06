import React, { useState } from "react";
import PageTitle from "../../hooks/PageTitle";
const EmailSettings = () => {
  PageTitle("Elevva | Settings-Email");
  const [smtp, setSmtp] = useState(false);
  const [gmailer, setGmailer] = useState(true);
  return (
    <>
      <div className="mt-6">
        <label className="font-semibold ">Email Protocol</label>
        <div className=" flex flex-col sm:flex-row items-center gap-10 mt-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={smtp}
              onChange={() => setSmtp(!smtp)}
            />
            <label>SMTP Email Protocol</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={gmailer}
              onChange={() => setGmailer(!gmailer)}
            />
            <label>Gmailer Email Protocol</label>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <label className=" font-semibold ">Email Engine</label>
      </div>
    </>
  );
};

export default EmailSettings;
