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

import { ObjectDetectionTop, ClassificationTop } from "../types/types";

export type VisualizeData = {
  image: string;
  inference: ObjectDetectionTop | ClassificationTop;
  timestamp: string;
  model_id: string;
};

/*
Calls backend to retrieve the list of image directories linked with device.
*/
export async function getImageDirectories(deviceId: string): Promise<string[]> {
  const url =
    import.meta.env.VITE_BACKEND_URL + "insight/directories/" + deviceId;
  console.log("deviceId: " + deviceId + ", url: " + url);
  const response = await fetch(url);
  let directories = [];
  if (deviceId) {
    try {
      const json = await response.json();
      directories = json["directories"];
    } catch {
      console.log("Error fetching device data");
    }
  } else {
    console.log("deviceId not set");
  }

  console.log("Device directories: ", directories);

  return directories;
}

export async function fetchHistoryData(
  deviceId: string,
  imageDirectory: string,
  dataType: string,
  page: number,
): Promise<[VisualizeData[], number]> {
  const pageQuery = `?page=${page}`;
  const dataTypeQuery = dataType !== "" ? `&data_type=${dataType}` : "";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL +
    `insight/images_and_inferences/${deviceId}/${imageDirectory}${pageQuery}${dataTypeQuery}`;
  console.log("API Call: ", backendUrl);
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const json = await response.json();
    const images_and_inferences = json["data"];
    const total_pages = json["total"];
    console.log("Images and Inferences: ", images_and_inferences);
    return [images_and_inferences, total_pages];
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}
