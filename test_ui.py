import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to http://localhost:3003...")
        await page.goto("http://localhost:3003", wait_until="networkidle")

        print("Taking screenshot...")
        await page.screenshot(path="screenshot_port_3003.png", full_page=True)

        await browser.close()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(run())
