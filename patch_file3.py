import re

with open("src/components/DataProvider.tsx", "r") as f:
    content = f.read()

# Replace in fetchNews
content = content.replace("imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,",
                          "imageUrl: item.image_url === 'placeholder' || item.image_url === null ? undefined : item.image_url,")

content = content.replace("imageUrls: item.image_urls || [],",
                          "imageUrls: item.image_urls || [],") # Already handled by ||

# EventItem
content = content.replace("imageUrl: item.image_url === 'placeholder' ? undefined : item.image_url,",
                          "imageUrl: item.image_url === 'placeholder' || item.image_url === null ? undefined : item.image_url,") # This one gets double replaced if not careful, actually the above replacement handles both since they are identical! Let's verify.


# EasyReadItem does not have image_url, it uses coverUrl and fileUrl which aren't mapped directly from properties with `=== 'placeholder'` check.

with open("src/components/DataProvider.tsx", "w") as f:
    f.write(content)
