import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AppBar>
      <Toolbar>
        <Container maxWidth="md" sx={{ display: "flex" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ flexGrow: 1}}
          >
            Storypoint-inator
          </Typography>
          <IconButton
            aria-label="Github"
            href="github.com"
            target="_blank"
            color="inherit"
            size="large"
          >
            <GitHubIcon />
          </IconButton>
        </Container>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Box sx={{ mt: 3, mb: 3 }}>
      {children}
    </Box>
    </>
  );
}