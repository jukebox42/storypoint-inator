"use client"

import { Box, Button, Stack, Typography } from "@mui/material";
import { hostActions } from "./actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    const sessionId = await hostActions.create();
    setIsCreating(false);
    router.push(`/session/${sessionId}/host`);
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center" }}>
      <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
        <Typography variant="h1">Storypoint-inator</Typography>
        <Typography variant="body1" textAlign="center">Get started by creating a session or asking the host for your join url.</Typography>
        <Button variant="contained" onClick={handleCreate} disabled={isCreating}>Create Session</Button>
      </Stack>
    </Box>
  );
}
