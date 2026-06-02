import re

with open("src/components/DataProvider.tsx", "r") as f:
    content = f.read()

# Replace in fetchNews
content = re.sub(
    r"// eslint-disable-next-line @typescript-eslint/no-explicit-any\s*const mappedData: NewsItem\[\] = data\.map\(\(item: any\) => \(\{",
    r"const mappedData: NewsItem[] = data.map((item: SupabaseNewsRow) => ({",
    content
)

# Replace in fetchEvents
content = re.sub(
    r"// eslint-disable-next-line @typescript-eslint/no-explicit-any\s*const mappedData: EventItem\[\] = data\.map\(\(item: any\) => \(\{",
    r"const mappedData: EventItem[] = data.map((item: SupabaseEventRow) => ({",
    content
)

# Replace in fetchEasyReads
content = re.sub(
    r"// eslint-disable-next-line @typescript-eslint/no-explicit-any\s*const mappedData: EasyReadItem\[\] = data\.map\(\(item: any\) => \{",
    r"const mappedData: EasyReadItem[] = data.map((item: SupabasePdfRow) => {",
    content
)

with open("src/components/DataProvider.tsx", "w") as f:
    f.write(content)
