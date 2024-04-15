"use client"
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center" }}>
      <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
      <Typography>Thank you for playing. You can close this page.</Typography>
      <Button onClick={() => router.push("/")} variant="contained">Start New Session</Button>
      </Stack>
    </Box>
  );
}
