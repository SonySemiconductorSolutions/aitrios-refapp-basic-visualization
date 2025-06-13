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

import { useEffect, useRef } from "react";
import { DataType } from "../../../types/types";

interface CanvasProps {
  height: number;
  width: number;
  imageSrc: string;
  inferenceData: any;
  dataType: DataType;
}

function Canvas({
  height,
  width,
  imageSrc,
  inferenceData,
  dataType,
}: CanvasProps) {
  const background = useRef<HTMLImageElement>(new Image()).current;
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const contextReference = useRef<CanvasRenderingContext2D | null>(null);

  function clearCanvas() {
    const canvas: HTMLCanvasElement = canvasReference.current!;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (imageSrc !== "") {
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
  }

  function drawBoundingBoxes(context: CanvasRenderingContext2D) {
    if (inferenceData?.perception?.object_detection_list) {
      inferenceData.perception.object_detection_list.forEach((data: any) => {
        const { left, top, right, bottom } = data.bounding_box;
        const C = data.class_id;
        const P = data.score;
        context.strokeStyle = "red";
        context.lineWidth = 3;
        context.strokeRect(left, top, right - left, bottom - top);

        // Draw Label
        const text = `[${C.toString()}] : ${P.toString()}`;
        context.font = "13px Arial";
        context.fillStyle = "red";
        context.fillRect(left, top, context.measureText(text).width, -16);
        context.textBaseline = "bottom";
        context.fillStyle = "white";
        context.fillText(text, left, top);
      });
    }
  }

  function drawClassLabel(context: CanvasRenderingContext2D) {
    if (inferenceData?.perception?.classification_list) {
      if (inferenceData.perception.classification_list.length > 0) {
        // Draw only the highest scoring results
        const C = inferenceData.perception.classification_list[0].class_id;
        const P = inferenceData.perception.classification_list[0].score;

        const classIdText = `classId: ${C.toString()}`;
        const scoreText = `score: ${P.toString()}`;
        context.font = "20px Arial medium";
        context.fillStyle = "white";
        context.textBaseline = "top";
        context.textAlign = "left";
        context.fillText(classIdText, 1, 1);
        context.fillText(scoreText, 1, 20);
      }

      // inferenceData.perception.classification_list.forEach((data: any) => {
      //   const C = data.class_id;
      //   const P = data.score;
      //   const text = `${C.toString()}: ${P.toString()}`;
      //   context.font = "20px Arial medium";
      //   context.fillStyle = "white";
      //   context.textBaseline = "top";
      //   context.textAlign = "left";
      //   context.fillText(text, 1, 1);
      // });
    }
  }

  function updateCanvas() {
    if (canvasReference == null || canvasReference.current == null) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasReference.current!;
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

    clearCanvas();

    if (imageSrc !== "") {
      background.src = imageSrc;
      background.onload = () => {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        if (dataType == "ObjectDetection") drawBoundingBoxes(context);
        else if (dataType == "Classification") drawClassLabel(context);
      };
    } else {
      if (dataType == "ObjectDetection") drawBoundingBoxes(context);
      else if (dataType == "Classification") drawClassLabel(context);
    }

    context.fillStyle = "rgba(255, 82, 0, 0.4)";
    contextReference.current = context;
  }

  useEffect(() => {
    updateCanvas();
  }, [imageSrc, inferenceData]);

  return <canvas height={height} width={width} ref={canvasReference} />;
}

export default Canvas;
