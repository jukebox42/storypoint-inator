"use client"
import { User, Votes, options } from "#/app/actions"
import { Box, Divider, Stack, Typography } from "@mui/material"
import SquareIcon from '@mui/icons-material/Square';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { BarChart } from '@mui/x-charts/BarChart';

type Props = {
  users: User[];
  votes: Votes;
  isReview: boolean;
}

export const UserList = ({ users, votes, isReview }: Props) => {
  const values = Object.keys(votes).map(v => votes[v]);
  const dataset = options.map(o => values.filter(v => v === o).length);

  return (
    <>
      <Typography variant="h3">Users</Typography>
      <Divider />
      <Stack direction="column" alignItems="stretch" spacing={1} sx={{ mt: 2 }}>
        {users.length === 0 && (
          <Box sx={{ p: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Waiting for users to join.
          </Box>
        )}
        {users.map(u => (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }} key={u.id}>
            <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>{u.name}</Typography>
            {!isReview && (votes[u.id] ? <CheckBoxIcon color="success" /> : <SquareIcon color="disabled" />)}
            {isReview && <Typography variant="body1" component="span">{votes[u.id] ?? "-"}</Typography>}
          </Box>
        ))}
      </Stack>
      <Typography variant="h3" sx={{ mt: 3 }}>Distribution</Typography>
      <Divider />
      {!isReview && (
        <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Waiting for voting to end.
        </Box>
      )}
      {isReview && (
        <BarChart
          height={300}
          yAxis={[{ label: "votes" }]}
          xAxis={[{ scaleType: "band", data: options, label: "Storypoints" }]}
          series={[{ data: dataset, type: "bar", color: "#8fa6cc" }]}
          layout="vertical"
          grid={{ horizontal: true }}
        />
      )}
    </>
  )
};