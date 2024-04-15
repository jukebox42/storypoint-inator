"use client"
import { PointCards } from "#/ui/PointCards";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { options, userActions } from "#/actions";
import { useUser } from "#/context/UserContext";
import { UserList } from "../UserList";
import { JoinLink } from "../JoinLink";

export const UserPhase = () => {
  const { sessionId, user, myVote, users, votes, isReview, errors } = useUser();

  const handleVote = (value: string) => {
    if (!user) {
      // impossible
      return;
    }
    userActions.vote(sessionId, user.id, value);
  }

  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid xs={12}>
        <JoinLink sessionId={sessionId} />
      </Grid>
      {errors.vote && (
        <Grid xs={12}>
          <Alert color="error">{errors.vote}</Alert>
        </Grid>
      )}
      <Grid xs={6} sm={8}>
        <PointCards options={options} activeOption={myVote} isDisabled={isReview} onClick={(value) => handleVote(value)} />
      </Grid>
      <Grid xs={6} sm={4}>
        <UserList users={users} votes={votes} isReview={isReview} />
      </Grid>
      <Grid xs={12} sx={{ display: "flex", alignItems: "center"}}>
        <Typography variant="body1" color="secondary" sx={{ flexGrow: 1}}>Session: {sessionId}</Typography>
        <Typography variant="body1" color="secondary">{user?.name}</Typography>
      </Grid>
    </Grid>
  );
}