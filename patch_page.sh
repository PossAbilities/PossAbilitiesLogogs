#!/bin/bash
sed -i 's/export default function Home() {/interface Shoutout {\n  id: number;\n  initial: string;\n  color: string;\n  message: string;\n  delay: string;\n  duration: string;\n  top?: string;\n  left?: string;\n  right?: string;\n  bottom?: string;\n}\n\nexport default function Home() {/' src/app/page.tsx
sed -i 's/const \[shoutouts, setShoutouts\] = useState(\[/const \[shoutouts, setShoutouts\] = useState<Shoutout[]>(\[/' src/app/page.tsx
sed -i 's/const newShoutout = {/const newShoutout: Shoutout = {/' src/app/page.tsx
sed -i 's/setShoutouts(\[...shoutouts, newShoutout as any\]);/setShoutouts(\[...shoutouts, newShoutout\]);/' src/app/page.tsx
