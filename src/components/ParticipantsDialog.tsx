import React, { ReactNode, useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Profile } from 'types/profile';

interface Props {
  participants: Profile[];
  children: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => ReactNode;
}

export default function ParticipantsDialog({ participants, children }: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      {children({ open, setOpen })}
      <Dialog onClose={handleClose} open={open} scroll="body">
        <DialogTitle>Participants</DialogTitle>

        <List sx={{ pt: 0 }}>
          {participants.map(({ id, displayName, photoURL }) => (
            <ListItem key={id}>
              <ListItemAvatar>
                <Avatar src={photoURL} />
              </ListItemAvatar>
              <ListItemText primary={displayName} />
            </ListItem>
          ))}
        </List>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
