"use client"
import { useUser } from "#/context/UserContext";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export const JoinPhase = () => {
  const [name, setName] = useState("");
  const [clientError, setClientError] = useState("")
  const [isJoining, setIsJoining] = useState(false);
  const { errors, joinSession } = useUser();

  const handleJoin = async () => {
    setClientError("");
    setIsJoining(true);
    joinSession(name);

    setTimeout(() => {
      setIsJoining(false);
      setClientError("Join timeout. Try again.");
    }, 5000);
  };

  useEffect(() => {
    if (errors.join) {
      setIsJoining(false);
    }
  }, [errors]);

  return (
    <>
      {errors.join && <Alert color="error">{errors.join}</Alert>}
      {!!clientError && <Alert color="error">{clientError}</Alert>}
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