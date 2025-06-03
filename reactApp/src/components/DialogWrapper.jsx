import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

// Estilizando o diálogo para manter a consistência com o seu tema
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DialogWrapper = ({ triggerComponent, title, content, actions, ...dialogProps }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Clona o componente disparador e injeta o onClick para abrir o diálogo
  const Trigger = React.cloneElement(triggerComponent, {
    onClick: handleClickOpen,
  });

  return (
    <>
      {Trigger}
      <BootstrapDialog onClose={handleClose} open={open} {...dialogProps}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {content}
        </DialogContent>
        <DialogActions>
          {actions || <Button onClick={handleClose}>Fechar</Button>}
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default DialogWrapper;
