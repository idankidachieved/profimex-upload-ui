import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmailItem } from "../emailItem/EmailItem";
import "./EmailList.css";

export const EmailList: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState<string>(""); // State to store new email
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  //getting the emails
  useEffect(() => {
    if (!isModalOpen) return;
    const getEmails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/emails`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching emails");
        }

        const data = await response.json();
        setEmails(data);
        setError("");
      } catch (e) {
        console.error(e);
        setError("Error fetching emails");
      }
    };

    //getting the emails
    getEmails();
  }, [isModalOpen]);

  /**
   * @description updates the email
   * @param oldEmail
   * @param newEmail
   */
  const handleSaveEmail = async (oldEmail: string, newEmail: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/emails`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newEmail, oldEmail }),
        }
      );
      if (response.ok) {
        setEmails((prevEmails) =>
          prevEmails.map((email) => (email === oldEmail ? newEmail : email))
        );
        toast.success("Email updated.");
      } else {
        toast.error(await response.text());
      }
    } catch (error) {
      toast.error("Error updating email.");
    }
  };

  /***
   * @description deletes a email
   */
  const handleDeleteEmail = async (email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/emails`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        if (response.ok) {
          setEmails((prevEmails) => prevEmails.filter((e) => e !== email));
        } else {
          toast.error("Failed to delete email.");
        }
      } catch (error) {
        toast.error(`Error deleting email.`);
      }
    }
  };

  // Function to handle adding a new email
  const handleAddEmail = async () => {
    if (!newEmail) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/emails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newEmail }),
        }
      );

      if (response.ok) {
        setEmails((prevEmails) => [...prevEmails, newEmail]);
        setNewEmail("");
        toast.success("Email added.");
      } else {
        toast.error(await response.text());
      }
    } catch (error) {
      toast.error("Error adding email.");
    }
  };

  //handle the focus on the modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="email-button-container">
      <ToastContainer />
      <button
        onClick={() => setIsModalOpen(true)}
        className="open-modal-button"
      >
        Show Email List
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <h2>Emails</h2>
            <ul>
              {emails.map((email, index) => (
                <EmailItem
                  key={index} // Added key prop
                  email={email}
                  onSave={handleSaveEmail}
                  onDelete={handleDeleteEmail}
                />
              ))}
            </ul>
            {error ? (
              <p>{error}</p>
            ) : (
              <div className="add-email">
                <input
                  type="text"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
                <button onClick={handleAddEmail} className="add-email-button">
                  Add Email
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
