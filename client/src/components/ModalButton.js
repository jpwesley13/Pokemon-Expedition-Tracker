import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material";

const StyledButton = styled(Button)({
    display: 'block',
    margin: '0rem 0',
    padding: '0.01rem 0.5rem',
    backgroundColor: 'rgb(42, 90, 50)',
    color: 'rgb(255, 255, 255)',
    border: 'none',
    borderRadius: '10px',
    width: 'fit-content',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'none',
    '&:disabled': {
      opacity: 0.35,
    },
  });

  const ModalButton = ({ children, ...props }) => {
    return <StyledButton {...props}>{children}</StyledButton>;
  };

  export default ModalButton;