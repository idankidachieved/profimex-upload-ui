import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./App.css";
import logo from "./assets/logo.jpeg";
import { Button } from "./components/api-button/Button";
import { EmailList } from "./components/emailList/EmailList";

const App = () => {
  const [includeProjects, setIncludeProjects] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [ids, setIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");

  // disabling the buttons
  useEffect(() => {
    if (hasStarted || error !== "") {
      setIsDisabled(true);
    }
    if (!hasStarted && error === "") {
      setIsDisabled(false);
    }
  }, [hasStarted, error]);

  /**
   * @description handles the ids change
   */
  const handleIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let idString = e.target.value?.trim() ?? "";
    idString = idString.replace(/,+$/, ""); // Remove any trailing commas

    // if there are no ids
    if (idString === "") {
      setError("");
      return setIds([]);
    }

    // getting the ids
    const ids = idString.split(",").map((id) => id.trim());

    // check if any id contains non-digit characters
    const invalidIds = ids.filter((id) => !/^\d+$/.test(id));
    if (invalidIds.length > 0) {
      setError("* ids must be numbers");
      return setIds([]); // Clear ids if there's an error
    }

    // convert ids to integers
    const parsedIds = ids.map((id) => parseInt(id, 10));
    setIds(parsedIds);
    setError("");
  };

  /**
   * @description handles the start of a run
   */
  const handleStart = () => {
    setHasStarted(true);

    // showing the toast
    toast.info("The process has started", {
      autoClose: 5000,
    });

    setTimeout(() => {
      setHasStarted(false);
    }, 5000);
  };

  return (
    <div className="main-container">
      <EmailList />
      <img src={logo} className="main-image" />

      {/* the options */}
      <div className="input-container">
        {/* the including projects and funds */}
        <div className="check-box-container">
          <input
            type="checkbox"
            checked={includeProjects}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIncludeProjects(e?.target?.checked)
            }
          />
          <label>include projects and funds</label>
        </div>

        {/* the ids input */}
        <div className="input-box-container">
          <label>ids: </label>
          <input
            type="text"
            placeholder="3, 4, 23....."
            onChange={handleIdsChange}
          />
          {/* <label>(leave empty for everybody)</label> */}
          <div className="ids-errors">{error}</div>
        </div>
      </div>

      {/* the buttons */}
      <div className="button-container">
        {/* the delta upload button */}
        <Button
          title="Upload Delta"
          body={{
            method: "upload",
            includeProjects: includeProjects,
            ids: ids ?? [],
            isDelta: true,
          }}
          isDisabled={isDisabled}
          onStart={handleStart}
        />

        {/* the compare button */}
        <Button
          title="Compare"
          body={{
            method: "compare",
            includeProjects: includeProjects,
            ids: ids ?? [],
          }}
          isDisabled={isDisabled}
          onStart={handleStart}
        />

        {/* the Bulk upload button */}
        <Button
          title="Upload Bulk"
          body={{
            method: "upload",
            includeProjects: includeProjects,
            ids: ids ?? [],
            isDelta: false,
          }}
          isDisabled={isDisabled}
          onStart={handleStart}
        />
      </div>
    </div>
  );
};

export default App;
