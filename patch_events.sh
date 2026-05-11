#!/bin/bash
sed -i 's/export type EventItem = {/export type EventItem = {\n  imageUrl?: string;/' src/lib/data.ts
