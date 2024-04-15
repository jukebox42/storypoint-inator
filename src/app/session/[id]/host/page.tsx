"use client"
import { Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { SessionProvider } from "#/context/SessionContext";
import { useSession } from "#/context/SessionContext"
import { UserList } from "#/ui/UserList";
import { JoinLink } from "#/ui/JoinLink";


export const HostView = () => {
  const { sessionId, users, votes, stopVoting, resetVoting, endSession, isReview } = useSession();
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <JoinLink sessionId={sessionId} />
      </Grid>
      <Grid xs={12} sm={4}>
        <Typography variant="h3">Controls</Typography>
        <Divider />
        <Stack spacing={2} direction={{ sm: "column", xs: "row"}} sx={{ mt: 1 }}>
          <Button onClick={resetVoting} variant="contained" fullWidth disabled={!isReview}>Start Voting</Button>
          <Button onClick={stopVoting} variant="contained" fullWidth disabled={isReview}>End Voting</Button>
        </Stack>
      </Grid>
      <Grid xs={12} sm={8}>
        <UserList users={users} votes={votes} isReview={isReview} />
      </Grid>
      <Grid xs={12} sx={{ display: "flex", alignItems: "center"}}>
        <Typography variant="body1" color="secondary" sx={{ flexGrow: 1}}>Session: {sessionId}</Typography>
        <Button onClick={endSession} variant="contained" color="error">End Session</Button>
      </Grid>
    </Grid>
  );
}

export default function Page({ params: { id }}: { params: { id: string} }) {
  return (
    <SessionProvider sessionId={id}>
      <HostView />
    </SessionProvider>
  );
}