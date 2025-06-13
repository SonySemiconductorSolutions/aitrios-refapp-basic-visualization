# Copyright 2025 Sony Semiconductor Solutions Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
import base64
import copy
import logging
import urllib
from datetime import datetime
from tempfile import TemporaryDirectory
from typing import Optional

from app.client.client_factory import get_api_client
from app.client.client_interface import ClientInferface
from app.data_management.classification.inference_deserialization import (
    deserialize as cl_deserialize,
)
from app.data_management.classification.inference_deserialization import (
    detection_data_to_json as cl_detection_data_to_json,
)
from app.data_management.object_detection.inference_deserialization import (
    deserialize as od_deserialize,
)
from app.data_management.object_detection.inference_deserialization import (
    detection_data_to_json as od_detection_data_to_json,
)
from app.schemas.common import DataType
from app.schemas.insight import ImageDirectories
from app.schemas.insight import ImagesAndInferences
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/insight", tags=["Insight"])

image_cache = {}


@router.get("/directories/{device_id}", response_model=ImageDirectories)
async def get_image_directories(
    device_id: str, api_client: ClientInferface = Depends(get_api_client)
) -> ImageDirectories:
    """Get image directories of the device.

    Args:
        device_id (str): Device ID

    Returns:
        ImageDirectories: Pydantic model containing a list of image directories.
    """
    logger.debug(f"Received request to get image directories for device: {device_id}")
    try:
        directories = api_client.get_image_directories(device_id=device_id)
        logger.info(f"Successfully retrieved image directories for device: {device_id}")
        return directories
    except Exception as e:
        logger.error(
            f"Error while retrieving image directories for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/images_and_inferences/{device_id}/{sub_directory_name}",
    response_model=ImagesAndInferences,
)
async def get_images_and_inferences(
    device_id: str,
    sub_directory_name: str,
    page: Optional[int] = Query(1, ge=1),
    data_type: Optional[DataType] = Query(None),
    api_client: ClientInferface = Depends(get_api_client),
) -> ImagesAndInferences:
    """Get the list of images and inferences.

    Args:
        device_id (str): Device ID
        sub_directory_name (str): Name of directory where images are stored

    Returns:
        ImagesAndInferences: Pydantic model containing a list of images and inferences
    """
    logger.debug(
        f"Received request to get images and inferences for device: {device_id}"
    )
    try:
        size = 20  # Items per page

        if not device_id in image_cache:
            image_cache[device_id] = {}
        if not sub_directory_name in image_cache[device_id]:
            image_cache[device_id][sub_directory_name] = api_client.get_images(
                device_id=device_id, sub_directory_name=sub_directory_name
            )

        image_list = image_cache[device_id][sub_directory_name]
        total_page = len(image_list) // size + 1

        paged_list = copy.deepcopy(image_list[size * (page - 1) : size * page])
        paged_list = api_client.get_inferences_associated_with_images(
            device_id=device_id, image_list=paged_list
        )

        for data in paged_list:
            if "image" in data and data["image"].startswith("https://"):
                # TODO: Verify the content retrieval works as expected
                with TemporaryDirectory() as tmpdir_path:
                    image_filepath: str = (
                        tmpdir_path
                        + f"/{datetime.now().strftime('%Y-%m-%d_%H-%M-%S-%f')}.png"
                    )
                    urllib.request.urlretrieve(data["image"], image_filepath)
                    with open(image_filepath, "rb") as f:
                        data["image"] = base64.b64encode(f.read()).decode("utf-8")

            if "inference" in data and data["inference"] != "":
                if data_type == DataType.classification:
                    deserialize_inference = cl_deserialize(data["inference"])
                    parsed_inference = cl_detection_data_to_json(deserialize_inference)
                    data["inference"] = parsed_inference
                elif data_type == DataType.object_detection:
                    deserialize_inference = od_deserialize(data["inference"])
                    parsed_inference = od_detection_data_to_json(deserialize_inference)
                    data["inference"] = parsed_inference

        logger.info(
            f"Successfully retrieved images and inferences for device: {device_id}"
        )
        return ImagesAndInferences(data=paged_list, page=page, total=total_page)
    except Exception as e:
        logger.error(
            f"Error while retrieving images and inferences for device {device_id}: {e}",
            exc_info=True,
        )
        raise HTTPException(status_code=500, detail=str(e))
