#!/bin/bash
sed -i '/<<<<<<< HEAD/,/>>>>>>> origin\/feature\/possabilities-portal-4010929988737134279/c\      setShoutouts([...shoutouts, newShoutout]);' src/app/page.tsx
