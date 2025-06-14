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

import Button from "@mui/material/Button";
import { ReactElement } from "react";

interface OutlinedButtonProps {
  children: ReactElement;
  disabled: boolean;
  onClick: () => void;
}

export default function OutlinedButton({
  children,
  disabled = false,
  onClick,
}: OutlinedButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      style={{ fontSize: "10px" }}
      sx={{ width: "100%", height: "90%" }}
    >
      {children}
    </Button>
  );
}
