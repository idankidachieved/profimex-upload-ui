import React, { useState } from "react";
import "./EmailItem.css";

export type EmailItemProps = {
  email: string;
  onSave: (oldEmail: string, newEmail: string) => void;
  onDelete: (email: string) => void;
};

export const EmailItem: React.FC<EmailItemProps> = (props: EmailItemProps) => {
  const { email, onSave, onDelete } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [isValidEmail, setIsValidEmail] = useState(true);

  /**
   * @description validating the mail
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    if (isValidEmail) {
      onSave(email, newEmail);
      setIsEditing(false);
    }
  };

  /**
   * @description handles canceling the editing
   */
  const handleCancel = () => {
    setIsEditing(false);
    setNewEmail(email);
    setIsValidEmail(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  return (
    <div className="email-item">
      {isEditing ? (
        // the edit email input
        <div className="email-edit-container">
          <input
            type="email"
            value={newEmail}
            onChange={handleEmailChange}
            className="email-edit-input"
          />
          {!isValidEmail && (
            <div className="error-message">Invalid email address</div>
          )}
          <div className="edit-actions">
            {/* saving the change button */}
            <button
              onClick={handleSave}
              className="save-button"
              disabled={!isValidEmail}
            >
              Save
            </button>
            {/* cancel editing button */}
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="email">{email}</div>
      )}

      {/* the action buttons for the email */}
      <div className="email-actions">
        {isEditing ? null : (
          <>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => onDelete(email)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};
