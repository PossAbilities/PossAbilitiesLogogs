import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="/home/jules/verification/videos/", viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        await page.goto("http://localhost:3003/admin/manage-easy-reads")
        await page.wait_for_load_state("networkidle")

        await page.screenshot(path="/home/jules/verification/screenshots/admin_manage_easy_reads.png", full_page=True)

        await browser.close()

asyncio.run(verify())
