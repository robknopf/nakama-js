/**
 * Copyright 2020 The Nakama Authors
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
 */

import * as protobuf from 'protobufjs/minimal';
import Long from 'long';

// workaround for longs in timestamps https://github.com/stephenh/ts-proto/issues/78
// protobufjs requires the Long package to be explicitly assigned to it.
protobuf.util.Long = Long;
protobuf.configure();

import "Base64";
import "whatwg-fetch";

export * from "./client";
export * from "./session";
export * from "./web_socket_adapter";