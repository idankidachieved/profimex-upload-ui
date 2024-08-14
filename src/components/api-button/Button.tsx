import React from "react";
import { toast } from "react-toastify";
import "./Button.css";

export type ButtonProps = {
  title: string;
  body: object;
  color?: string;
  isDisabled?: boolean;
  onStart: () => void;
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { title, body, color, isDisabled, onStart } = props;

  /**
   * @description sending the compare
   */
  const sendApiRequest = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      //checking the status of the response
      if (response.ok) {
        onStart();
      } else toast.error(await response.text());
    } catch (error) {
      toast.error("Failed to run, try again later");
    }
  };

  return (
    <button
      disabled={isDisabled}
      onClick={() => {
        sendApiRequest();
      }}
      className={`CompareButton ${isDisabled ? "disabled" : ""}`}
    >
      {title}
    </button>
  );
};
