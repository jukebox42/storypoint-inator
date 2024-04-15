"use client"
import { userActions } from "#/actions";
import { useUser } from "#/context/UserContext";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export const JoinPhase = () => {
  const [name, setName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { sessionId, errors } = useUser();

  const handleJoin = async () => {
    setIsJoining(true);
    userActions.join(sessionId, name);
  }

  useEffect(() => {
    if (errors.join) {
      setIsJoining(false);
    }
  }, [errors]);

  return (
    <>
      {errors.join && <Alert color="error">{errors.join}</Alert>}
      <Box sx={{ display: "flex", gap: 3, flexDirection: "row",}}>
        <TextField
          label="Name"
          value={name}
          fullWidth
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
        />
        <Button onClick={handleJoin} variant="contained" disabled={isJoining}>Join</Button>
      </Box>
    </>
  );
}