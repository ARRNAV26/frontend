import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { wsService } from "../api/wsService"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { autocompleteService } from "../api/autocompleteService";
import { useDebounce } from "../hooks/useDebounce";
import Editor from "@monaco-editor/react";
import {
  Container,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { Code, Group } from "@mui/icons-material";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [code, setCode] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const debouncedCode = useDebounce(code, 600);

  // Connect WebSocket on mount
  useEffect(() => {
    if (!roomId) return;
    const ws = wsService.connectRoom(roomId);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS open");
    ws.onmessage = (ev: any) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === "init" || payload.type === "update_code") {
          setCode(payload.code);
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };
    ws.onerror = (ev: any) => console.error("WS error", ev);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, [roomId]);

  // Fetch autocomplete on debounced code change
  useEffect(() => {
    if (!debouncedCode) return;
    (async () => {
      try {
        const res = await autocompleteService.suggest(debouncedCode, debouncedCode.length, "python");
        setSuggestion(res.suggestion || null);
      } catch (e) {
        console.error("Autocomplete error", e);
      }
    })();
  }, [debouncedCode]);

  const sendUpdate = (newCode: string) => {
    setCode(newCode);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "update_code", code: newCode })
      );
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      bgcolor: 'grey.50',
      py: { xs: 2, sm: 4 },
      px: { xs: 1, sm: 2 },
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Container maxWidth={false} sx={{ flex: 1 }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
          >
            <Code sx={{ mr: 1, verticalAlign: "middle" }} />
            Room: {roomId?.slice(0, 12)}...
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Group />}
              label="Multi-user collaborative coding"
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 2, flexShrink: 0 }}
            />
            <Chip
              label="Python"
              variant="filled"
              color="secondary"
              sx={{ borderRadius: 2 }}
            />
            <Chip
              label="Real-time sync"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Stack>
        </Box>

        <Box sx={{
          height: { xs: "60vh", md: "70vh" },
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <Editor
            height="100%"
            language="python"
            value={code}
            onChange={(value) => {
              if (value !== undefined) {
                sendUpdate(value);
              }
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
            theme="light"
          />
        </Box>

        {suggestion && (
          <Alert
            severity="info"
            sx={{
              mt: 2,
              borderRadius: 2,
              '& .MuiAlert-icon': { color: 'info.main' }
            }}
          >
            <Typography variant="body2">
              💡 <strong>Suggestion:</strong> <code style={{ backgroundColor: '#e3f2fd', padding: '2px 4px', borderRadius: '3px' }}>{suggestion}</code>
            </Typography>
          </Alert>
        )}
      </Container>
    </Box>
  );
}
