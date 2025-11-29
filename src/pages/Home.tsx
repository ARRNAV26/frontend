import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Alert,
  Box,
} from "@mui/material";
import { Add, Code, Group } from "@mui/icons-material";

interface Room {
  id: string;
  code: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setRoomLoading(true);
      const res = await axios.get("http://localhost:8000/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setRoomLoading(false);
    }
  };

  const createRoom = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/rooms");
      const roomId = res.data.roomId || res.data.room_id || res.data.id;
      if (roomId) {
        navigate(`/room/${roomId}`);
        fetchRooms(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      // Could use Snackbar for better UX
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "grey.50",
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth={false} sx={{ flex: 1 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.8rem" },
          }}
        >
          <Code sx={{ mr: 1, verticalAlign: "middle" }} />
            TwinCode
          </Typography>

        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          sx={{ height: { xs: "auto", md: "calc(100% - 120px)" } }}
        >
          <Grid item xs={12} md={4} sx={{ height: { xs: "auto", md: "100%" } }}>
            <Card
              raised
              sx={{
                height: { xs: "auto", md: "100%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: "center" }}>
                <Add sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" } }}
                >
                  Create New Room
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Start a new collaborative coding session
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  onClick={createRoom}
                  disabled={loading}
                  fullWidth
                  sx={{
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" },
                    borderRadius: 3,
                    py: 2,
                  }}
                >
                  {loading ? "Creating..." : "Create Room"}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} sx={{ height: { xs: "auto", md: "100%" } }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
              }}
            >
              <CardContent sx={{ flex: 1, overflow: "auto" }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  <Group sx={{ mr: 1 }} />
                  Existing Rooms ({rooms.length})
                </Typography>
                {roomLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : rooms.length > 0 ? (
                  <Box
                    sx={{
                      mt: 2,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(auto-fill, minmax(280px, 1fr))",
                        sm: "repeat(auto-fill, minmax(320px, 1fr))",
                      },
                      gap: 2,
                      overflow: "auto",
                    }}
                  >
                    {rooms.map((room) => (
                      <Card
                        key={room.id}
                        variant="outlined"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 200,
                          borderRadius: 3,
                          "&:hover": { boxShadow: 4 },
                        }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 600 }}
                          >
                            Room: {room.id.slice(0, 12)}...
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              fontFamily: "monospace",
                              bgcolor: "grey.100",
                              p: 1,
                              borderRadius: 1,
                              wordBreak: "break-all",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {room.code || "(empty room)"}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {room.code ? (
                              <Chip
                                label="Has Code"
                                size="small"
                                color="primary"
                                sx={{ borderRadius: 2 }}
                              />
                            ) : (
                              <Chip
                                label="Empty"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                              />
                            )}
                          </Box>
                        </CardContent>
                        <CardActions sx={{ pt: 0 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/room/${room.id}`)}
                            fullWidth
                            sx={{ borderRadius: 2 }}
                          >
                            Enter Room
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Alert
                    severity="info"
                    sx={{
                      borderRadius: 2,
                      "& .MuiAlert-icon": { color: "info.main" },
                    }}
                  >
                    No rooms created yet. Create your first one!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
