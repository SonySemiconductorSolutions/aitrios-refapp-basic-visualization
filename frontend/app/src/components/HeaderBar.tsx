/**
 * Copyright 2025 Sony Semiconductor Solutions Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  useAppContext,
  isLoggedIn,
  isHistoryScreenActive,
  isLoginScreenActive,
  isRealtimeScreenActive,
} from "../stores/AppContext";
import { useEffect } from "react";
import { connectToImageStream } from "../utils/ImageStream";
import { useImageInferenceContext } from "../stores/ImageInferenceContext";
import LoginIcon from "@mui/icons-material/Login";

function capitalizeFirstLetter(value: string) {
  return (
    String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
  );
}

export default function HeaderBar() {
  const {
    consoleType,
    appState,
    credentialsState,
    isSocketActive,
    setAppState,
  } = useAppContext();
  const { handleReceiveDataPoint } = useImageInferenceContext();

  useEffect(() => {
    let cleanup: () => void = () => {};
    if (isSocketActive) {
      cleanup = connectToImageStream(handleReceiveDataPoint);
    }
    return cleanup;
  }, [isSocketActive]);

  const setLoginScreen = async () => {
    if (!isLoginScreenActive(appState)) {
      setAppState("login");
    }
  };

  const setRealtimeScreen = async () => {
    if (!isRealtimeScreenActive(appState)) {
      setAppState("realtime_screen");
    }
  };

  const setHistoryScreen = async () => {
    if (!isHistoryScreenActive(appState)) {
      setAppState("history_screen");
    }
  };

  return (
    <AppBar style={{ position: "fixed" }}>
      <Toolbar color="red">
        <Button
          variant="contained"
          color="inherit"
          sx={{ marginRight: "auto" }}
          children={<LoginIcon style={{ color: "#3e445b" }} />}
          onClick={setLoginScreen}
        />

        <Box display="flex" flexDirection="column">
          <Typography align="left" sx={{ flexGrow: 1 }}>
            {import.meta.env.VITE_APP_TITLE}
          </Typography>
          <Typography align="left" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            {import.meta.env.VITE_APP_SUBTITLE}
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          sx={{ flexGrow: 0.95, marginRight: "auto" }}
        >
          <Typography align="right" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            Selected Console Type:
          </Typography>
          <Typography align="right" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            {capitalizeFirstLetter(consoleType)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="inherit"
          sx={
            isRealtimeScreenActive(appState)
              ? { color: "#3e445b", marginLeft: "auto", fontSize: "1rem" }
              : {
                  backgroundColor: "#545B70",
                  color: "#bec2d1",
                  marginLeft: "auto",
                  fontSize: "1rem",
                }
          }
          children={"Realtime"}
          onClick={setRealtimeScreen}
          disabled={!isLoggedIn(credentialsState)}
        />

        <Button
          variant="contained"
          color="inherit"
          sx={
            isHistoryScreenActive(appState)
              ? { color: "#3e445b", marginLeft: "auto", fontSize: "1rem" }
              : {
                  backgroundColor: "#545B70",
                  color: "#bec2d1",
                  marginLeft: "auto",
                  fontSize: "1rem",
                }
          }
          children={"History"}
          onClick={setHistoryScreen}
          disabled={!isLoggedIn(credentialsState)}
        />
      </Toolbar>
    </AppBar>
  );
}
