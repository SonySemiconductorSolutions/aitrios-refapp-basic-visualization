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

import { useState, useEffect, useRef, ChangeEvent } from "react";

import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { ImageGrid } from "./ImageGrid";

import { useDeviceDirectoryContext } from "../../../../stores/DeviceDirectoryContext";
import {
  VisualizeData,
  fetchHistoryData,
} from "../../../../utils/ImagesAndInferencesFromConsole";

export default function CheckDataPanel() {
  const { deviceId, imageDirectory, dataType } = useDeviceDirectoryContext();
  const [visualizeData, setVisualizeData] = useState<VisualizeData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const oldPage = useRef(page);
  const oldImageDirectory = useRef(imageDirectory);
  const oldDataType = useRef(dataType);

  const handlePagination = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (deviceId !== "" && imageDirectory !== "") {
      if (
        oldPage.current != page ||
        oldImageDirectory.current != imageDirectory ||
        oldDataType.current != dataType
      ) {
        setIsLoading(true);
        fetchHistoryData(deviceId, imageDirectory, dataType, page)
          .then((result) => {
            setVisualizeData(result[0] ? result[0] : []);
            setCount(result[1]);
          })
          .finally(() => {
            setIsLoading(false);
          });
        oldPage.current = page;
        oldImageDirectory.current = imageDirectory;
        oldDataType.current = dataType;
      }
    }
  }, [imageDirectory, dataType, page]);

  return (
    <>
      {isLoading && (
        <Backdrop sx={{ zIndex: 1 }} open={true}>
          <CircularProgress
            sx={{ color: "white", position: "fixed", top: "50%", left: "50%" }}
          />
        </Backdrop>
      )}
      <Card variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid size={12} sx={{ minHeight: "500px" }}>
            <ImageGrid visualizeData={visualizeData} dataType={dataType} />
          </Grid>
          <Grid
            size={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Pagination count={count} page={page} onChange={handlePagination} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
