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

import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Canvas from "./Canvas";
import InferenceDataDisplay from "./InferenceDataDisplay";

import { formatTimestampToDateTime } from "../utils/dateTimeFormatters";
import { useScreenContext } from "../../../stores/ScreenContext";
import { DataType } from "../../../types/types";

interface ImageInferenceDisplayProps {
  imageSrc: string;
  inferenceData: any;
  inferenceTS: string;
  modelId: string;
  dataType: DataType;
}

export default function ImageInferenceDisplay({
  imageSrc,
  inferenceData,
  inferenceTS,
  modelId,
  dataType,
}: ImageInferenceDisplayProps) {
  const { canvasWidth, canvasHeight } = useScreenContext();

  const handleClickDownloadImage = () => {
    const fileName = inferenceTS + ".jpeg";
    const decodedFile = atob(imageSrc.replace(/^.*,/, ""));
    const buffer = new Uint8Array(decodedFile.length).map((_, x) =>
      decodedFile.charCodeAt(x),
    );
    const data = new Blob([buffer.buffer], { type: "image/jpeg" });
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute("download", fileName);
    link.click();
    document.body.removeChild(link);
  };

  const handleClickCopyInferenceData = async () => {
    if (inferenceData) {
      await navigator.clipboard.writeText(
        JSON.stringify(inferenceData, null, 2),
      );
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid container sx={{ margin: 1 }} size={12}>
        <Grid size={6}>
          <Typography align="left" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Timestamp
          </Typography>
          <Typography align="left" sx={{ flexGrow: 1 }}>
            {formatTimestampToDateTime(inferenceTS)}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography align="left" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Model ID
          </Typography>
          <Typography align="left" sx={{ flexGrow: 1 }}>
            {modelId}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        size={6}
        display="flex"
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Canvas
          width={canvasWidth}
          height={canvasHeight}
          imageSrc={imageSrc}
          inferenceData={inferenceData}
          dataType={dataType}
        />
      </Grid>
      <Grid size={6}>
        <InferenceDataDisplay inferenceData={inferenceData} />
      </Grid>

      <Grid size={6}>
        <Tooltip title="Download full image">
          <IconButton
            color="primary"
            onClick={handleClickDownloadImage}
            sx={{ float: "right" }}
          >
            <SystemUpdateAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid size={6}>
        <Tooltip title="Copy to Clipboard">
          <IconButton
            color="primary"
            onClick={handleClickCopyInferenceData}
            sx={{ float: "right" }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
