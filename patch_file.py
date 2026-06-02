import re

with open("src/components/DataProvider.tsx", "r") as f:
    content = f.read()

new_interfaces = """
interface SupabaseNewsRow {
  id: string | number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  image_urls?: string[] | null;
}

interface SupabaseEventRow {
  id: string | number;
  title: string;
  description?: string | null;
  location?: string | null;
  event_date?: string | null;
  created_at: string;
  image_url?: string | null;
}

interface SupabasePdfRow {
  id: string | number;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  cover_path?: string | null;
  file_path?: string | null;
}

interface DataContextType {"""

new_content = content.replace("interface DataContextType {", new_interfaces, 1)

with open("src/components/DataProvider.tsx", "w") as f:
    f.write(new_content)
